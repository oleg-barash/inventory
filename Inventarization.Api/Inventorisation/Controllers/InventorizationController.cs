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
    [RoutePrefix("api/inventorization")]
    public class InventorizationController : ApiController
    {
        private InventorizationRepository _inventorizationRepository;
        private ZoneRepository _zoneRepository;
        private ActionRepository _actionRepository;

        public InventorizationController(InventorizationRepository inventorizationRepository, ZoneRepository zoneRepository, ActionRepository actionRepository)
        {
            _inventorizationRepository = inventorizationRepository;
            _zoneRepository = zoneRepository;
            _actionRepository = actionRepository;
        }

        [HttpGet]
        public HttpResponseMessage Get(string id)
        {
            Guid _id;
            if (Guid.TryParse(id, out _id))
            {
                return Request.CreateResponse(HttpStatusCode.OK, _inventorizationRepository.GetInventorization(_id));
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [HttpPost]
        public HttpResponseMessage Save([FromBody]Business.Model.Inventorization inventorization)
        {
            _inventorizationRepository.UpdateInventorization(inventorization);
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [HttpDelete]
        public HttpResponseMessage Delete([FromBody]string id)
        {
            Guid _id;
            if (!Guid.TryParse(id, out _id))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            _inventorizationRepository.DeleteInventorization(_id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }


        [HttpPost]
        [Route("{inventorization}/zone")]
        public HttpResponseMessage CreateZone(Guid inventorization, [FromBody]Zone zone)
        {
            zone.Inventorization = inventorization;
            _zoneRepository.Create(zone);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpGet]
        [Route("{inventorization}/action")]
        public HttpResponseMessage GetActions(Guid inventorization)
        {
            var actions = _actionRepository.GetActionsByInventorization(inventorization);
            var zones = _zoneRepository.GetZones(actions.Select(x => x.Zone).ToArray());

            var result = actions.Select(x => new Models.Action()
                {
                    Id = x.Id,
                    DateTime = x.DateTime,
                    Quantity = x.Quantity,
                    Type = x.Type,
                    User = "тестовый",
                    Zone = zones.FirstOrDefault(z => z.Id == x.Zone).Name,
                    BarCode = x.BarCode
                });
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }


    }
}
