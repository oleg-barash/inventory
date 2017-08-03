using Inventorization.Api.ViewModels;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/action")]
    [Authorize]
    public class ActionController : ApiController
    {
        private IActionRepository _actionRepository;
        private IZoneRepository _zoneRepository;
        private ICompanyRepository _companyRepository;
        private IInventorizationRepository _inventorizationRepository;
        
        public ActionController(IActionRepository actionRepository, IZoneRepository zoneRepository, ICompanyRepository companyRepository, IInventorizationRepository inventorizationRepository)
        {
            _actionRepository = actionRepository;
            _zoneRepository = zoneRepository;
            _companyRepository = companyRepository;
            _inventorizationRepository = inventorizationRepository;
        }

        [HttpGet]
        [Route("{id}")]
        public HttpResponseMessage Get(Guid id)
        {
            var action = _actionRepository.GetAction(id);
            var zone = _zoneRepository.GetZone(action.Zone);
            var company = _inventorizationRepository.GetInventorization(action.Inventorization).Company;
            var items = _companyRepository.GetItems(company, new[] { action.BarCode });
            List<ZoneState> states = _inventorizationRepository.GetZoneStates(action.Inventorization).Where(x => x.ZoneId != Guid.Empty).ToList();
            var foundItem = items.FirstOrDefault(i => i.Code == action.BarCode);
            var foundState = states.FirstOrDefault(z => z.ZoneId == zone.Id);

            var zoneVm = new ZoneViewModel()
            {
                ZoneId = zone.Id,
                Number = zone.Number,
                ClosedAt = foundState?.ClosedAt,
                ClosedBy = foundState?.ClosedBy,
                OpenedAt = foundState?.OpenedAt,
                OpenedBy = foundState?.OpenedBy,
                ZoneName = zone.Name
            };
            var res = new ViewModels.Action()
            {
                Id = action.Id,
                DateTime = action.DateTime,
                Quantity = action.Quantity,
                Type = action.Type,
                User = action.UserId.ToString(),
                Zone = zoneVm,
                BarCode = action.BarCode,
                FoundInItems = foundItem != null,
                Name = foundItem != null ? foundItem.Name : "Не найдена в номенклатуре",
                Description = foundItem != null ? foundItem.Description : "Не найдена в номенклатуре",
            };
            return Request.CreateResponse(HttpStatusCode.OK, res);
        }


        [HttpPost]
        [Route("{id}")]
        public HttpResponseMessage Update(Guid id, [FromBody]Business.Model.Action action)
        {
            var userClaims = Request.GetOwinContext().Authentication.User;
            var userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
            _actionRepository.UpdateAction(id, userId, action.Quantity);
            return Request.CreateResponse(HttpStatusCode.OK, _actionRepository.GetAction(id));
        }

        [HttpDelete]
        [Route("{id}")]
        public HttpResponseMessage Delete(Guid id)
        {
            _actionRepository.DeleteAction(id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

    }
}

