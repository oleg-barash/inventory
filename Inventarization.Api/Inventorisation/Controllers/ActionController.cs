using Inventorization.Api.Models;
using Inventorization.Api.ViewModels;
using Inventorization.Business.Model;
using Inventorization.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/action")]
    public class ActionController : ApiController
    {
        private ActionRepository _actionRepository;
        private ZoneRepository _zoneRepository;
        private CompanyRepository _companyRepository;
        private InventorizationRepository _inventorizationRepository;
        
        public ActionController(ActionRepository actionRepository, ZoneRepository zoneRepository, CompanyRepository companyRepository, InventorizationRepository inventorizationRepository)
        {
            _actionRepository = actionRepository;
            _zoneRepository = zoneRepository;
            _companyRepository = companyRepository;
            _inventorizationRepository = inventorizationRepository;
        }

        [HttpGet]
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
                ZoneStatusId = zone.Id,
                Code = zone.Code,
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
                //User = "тестовый",
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
            _actionRepository.UpdateAction(id, Guid.Parse("c2425014-157f-4a73-bd92-7c514c4d35d3"), action.Quantity);
            return Request.CreateResponse(HttpStatusCode.OK, action);
        }

        [HttpDelete]
        public HttpResponseMessage Delete([FromBody]DeleteModel model)
        {
            _actionRepository.DeleteAction(model.Id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

    }
}

