using Inventorization.Api.Formatters;
using Inventorization.Api.Models;
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
        [Route("{inventorization}/zones")]
        public HttpResponseMessage Zones(Guid inventorization)
        {
            //var response = Request.CreateResponse(HttpStatusCode.Redirect);
            //response.Headers.Location = new Uri("http://www.google.com");
            //return response;
            try
            {
                List<ZoneState> states = _inventorizationRepository.GetZoneStates(inventorization).Where(x => x.ZoneId != Guid.Empty).ToList();
                List<Zone> zones = _zoneRepository.GetZones(states.Select(x => x.ZoneId).ToArray());
                return Request.CreateResponse(HttpStatusCode.OK, states.Select(x => {
                    var zone = zones.First(z => z.Id == x.ZoneId);
                    return new ZoneViewModel()
                    {
                        ZoneStatusId = x.ZoneId,
                        Code = zone.Code,
                        ClosedAt = x.ClosedAt < DateTime.MaxValue ? x.ClosedAt : null,
                        ClosedBy = x.ClosedBy,
                        OpenedAt = x.OpenedAt,
                        OpenedBy = x.OpenedBy,
                        ZoneName = zone.Name
                    };
                }));
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Error getting zones. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.NoContent);
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

        [HttpGet]
        [Route("{inventorization}/zone/reopen")]
        public HttpResponseMessage ReopenZone(Guid inventorization, [FromUri]string code)
        {
            try
            {
                Zone zone = _zoneRepository.GetZone(code);
                ZoneState state = _inventorizationRepository.GetZoneState(inventorization, code);
                if (state != null)
                {

                    _inventorizationRepository.ReopenZone(inventorization, zone.Id);
                    state = _inventorizationRepository.GetZoneState(inventorization, code);
                    return Request.CreateResponse(HttpStatusCode.OK, zone);
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Зона не была открыта");
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Open zone error. Zone code:{Environment.NewLine} {JsonConvert.SerializeObject(code)}. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("{inventorization}/zone/close")]
        public HttpResponseMessage CloseZone(Guid inventorization, [FromBody]string zoneCode)
        {
            try
            {
                ZoneState state = _inventorizationRepository.GetZoneState(inventorization, zoneCode);
                if (state.ClosedAt.HasValue && state.ClosedAt < DateTime.UtcNow)
                {
                    return Request.CreateResponse(HttpStatusCode.Forbidden, "Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                }
                _inventorizationRepository.CloseZone(state, Guid.Parse("c2425014-157f-4a73-bd92-7c514c4d35d3"));
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Open zone error. Zone code: {zoneCode}. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("{inventorization}/action")]
        public HttpResponseMessage AddAction(Guid inventorization, [FromBody]CreateActionVM actionVM)
        {
            try
            {
                Business.Model.Action action = new Business.Model.Action()
                {
                    BarCode = actionVM.BarCode,
                    DateTime = actionVM.DateTime ?? DateTime.UtcNow,
                    Id = actionVM.Id ?? Guid.NewGuid(),
                    Inventorization = inventorization,
                    Quantity = actionVM.Quantity,
                    Type = actionVM.Type,
                    Zone = actionVM.Zone.ZoneStatusId,
                    UserId = Guid.Parse("c2425014-157f-4a73-bd92-7c514c4d35d3")
                };

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
                _actionRepository.CreateAction(action);
                var inventarization = _inventorizationRepository.GetInventorization(inventorization);
                List<Business.Model.Item> items = _companyRepository.GetItems(inventarization.Company);
                Business.Model.Item foundItem = items.FirstOrDefault(x => x.Code == action.BarCode);
                if (foundItem != null) {
                    return Request.CreateResponse(HttpStatusCode.OK, foundItem);
                }
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            catch(Exception ex)
            {
                string message = $"Create action error. Action:{Environment.NewLine} {JsonConvert.SerializeObject(actionVM)}";
                _logger.Error(ex, message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("{inventorizationId}/actions")]
        public HttpResponseMessage GetActions(Guid inventorizationId)
        {
            var inventorization = _inventorizationRepository.GetInventorization(inventorizationId);
            var actions = _actionRepository.GetActionsByInventorization(inventorizationId);
            var zones = _zoneRepository.GetZones(actions.Select(x => x.Zone).ToArray());
            var items = _companyRepository.GetItems(inventorization.Company, actions.Select(x => x.BarCode).ToArray());
            var result = actions.Select(x => {
                var foundItem = items.FirstOrDefault(i => i.Code == x.BarCode);
                var res = new Models.Action()
                {
                    Id = x.Id,
                    DateTime = x.DateTime,
                    Quantity = x.Quantity,
                    Type = x.Type,
                    //User = "тестовый",
                    Zone = zones.FirstOrDefault(z => z.Id == x.Zone).Name,
                    BarCode = x.BarCode,
                    FoundInItems = foundItem != null,
                    Name = foundItem != null ? foundItem.Name : "Не найдена в номенклатуре"
                };
                return res;
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
                res.Description = x.Description;
                res.Number = x.ItemNumber;
                res.Name = x.Name;
                res.Id = x.Id;

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
