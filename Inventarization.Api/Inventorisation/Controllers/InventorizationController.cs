using Inventorization.Api.Formatters;
using Inventorization.Business.Model;
using Inventorization.Data;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
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
        private CompanyRepository _companyRepository;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public InventorizationController(InventorizationRepository inventorizationRepository, ZoneRepository zoneRepository, ActionRepository actionRepository, CompanyRepository companyRepository)
        {
            _inventorizationRepository = inventorizationRepository;
            _zoneRepository = zoneRepository;
            _actionRepository = actionRepository;
            _companyRepository = companyRepository;
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

        [HttpGet]
        [Route("{inventorization}/zone")]
        public HttpResponseMessage SearchZone(Guid inventorization, [FromUri]string code)
        {
            try
            {
                Zone zone = _zoneRepository.GetZone(code);
                if (zone == null)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
                return Request.CreateResponse(HttpStatusCode.OK, zone);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Error. Zone code:{Environment.NewLine} {JsonConvert.SerializeObject(code)}. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpGet]
        [Route("{inventorization}/zone/open")]
        public HttpResponseMessage OpenZone(Guid inventorization, [FromUri]string code)
        {
            try
            {
                Zone zone = _zoneRepository.GetZone(code);
                ZoneState state = _inventorizationRepository.GetZoneState(inventorization, code);
                if (state == null)
                {
                    if (zone == null)
                    {
                        zone = new Zone();
                        zone.Id = Guid.NewGuid();
                        zone.Name = "Зона " + code;
                        zone.Code = code;
                        _zoneRepository.Create(zone);
                    }

                    _inventorizationRepository.OpenZone(inventorization, zone.Id, Guid.Parse("c2425014-157f-4a73-bd92-7c514c4d35d3"));
                    state = _inventorizationRepository.GetZoneState(inventorization, code);
                }
                if (state.ClosedAt.HasValue && state.ClosedAt.Value < DateTime.UtcNow)
                {
                    return Request.CreateResponse(HttpStatusCode.Forbidden, "Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                }
                return Request.CreateResponse(HttpStatusCode.OK, zone);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Open zone error. Zone code:{Environment.NewLine} {JsonConvert.SerializeObject(code)}. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("{inventorization}/zone/{zoneId}/close")]
        public HttpResponseMessage CloseZone(Guid inventorization, Guid zoneId)
        {
            try
            {
                ZoneState state = _inventorizationRepository.GetZoneState(inventorization, zoneId);
                if (state.ClosedAt.HasValue && state.ClosedAt < DateTime.UtcNow)
                {
                    return Request.CreateResponse(HttpStatusCode.Forbidden, "Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                }
                _inventorizationRepository.CloseZone(state, Guid.Parse("c2425014-157f-4a73-bd92-7c514c4d35d3"));
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Open zone error. Zone code:{Environment.NewLine} {JsonConvert.SerializeObject(zoneId)}. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("{inventorization}/action")]
        public HttpResponseMessage AddAction(Guid inventorization, [FromBody]Business.Model.Action action)
        {
            try
            {
                ZoneState zoneState = _inventorizationRepository.GetZoneState(inventorization, action.Zone);
                if (zoneState == null)
                {
                    _inventorizationRepository.OpenZone(inventorization, action.Zone, Guid.Parse("c2425014-157f-4a73-bd92-7c514c4d35d3"));
                    zoneState = _inventorizationRepository.GetZoneState(inventorization, action.Zone);
                }
                if (zoneState.ClosedAt.HasValue && zoneState.ClosedAt < DateTime.UtcNow)
                {
                    return Request.CreateResponse(HttpStatusCode.Forbidden, $"Зона закрыта. Выберите другую зону.");
                }
                action.Inventorization = inventorization;
                _actionRepository.CreateAction(action);
                var inventarization = _inventorizationRepository.GetInventorization(inventorization);
                List<Item> items = _companyRepository.GetItems(inventarization.Company);
                Item foundItem = items.FirstOrDefault(x => x.Code == action.BarCode);
                if (foundItem != null) {
                    return Request.CreateResponse(HttpStatusCode.OK, foundItem);
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            catch(Exception ex)
            {
                _logger.Error(ex, $"Create action error. Action:{Environment.NewLine} {JsonConvert.SerializeObject(action)}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpGet]
        [Route("{inventorization}/actions")]
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
            return Request.CreateResponse(HttpStatusCode.OK, result.OrderByDescending(x => x.DateTime));
        }

        [HttpGet]
        [Route("{inventorizationId}/items")]
        public HttpResponseMessage GetItems(Guid inventorizationId, [FromUri]ActionType type = ActionType.FirstScan)
        {
            var inventorization = _inventorizationRepository.GetInventorization(inventorizationId);
            var items = _companyRepository.GetItems(inventorization.Company);
            var actions = _actionRepository.GetActionsByInventorization(inventorizationId);
            var zones = _zoneRepository.GetZones(actions.Select(x => x.Zone).ToArray());

            var result = items.Select(x =>
            {
                Models.Item res = new Models.Item();
                res.QuantityPlan = x.Quantity;
                res.Type = type;
                res.BarCode = x.Code;
                
                var itemActions = actions.Where(a => a.BarCode == x.Code && a.Type == type).GroupBy(a => a.Zone);
                res.Actions = new List<Models.ItemDetails>(); 
                foreach (var zone in itemActions)
                {
                    res.Actions.Add(new Models.ItemDetails()
                    {
                        Quantity = zone.Sum(z => z.Quantity),
                        Zone = zones.FirstOrDefault(z => z.Id == zone.Key).Name
                    });
                }
                return res;
            });
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }


    }
}
