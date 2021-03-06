﻿using Inventorization.Api.ViewModels;
using Inventorization.Business.Domains;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Microsoft.Owin;
using Newtonsoft.Json;
using NLog;
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
    [RoutePrefix("api/inventorization")]
    [Authorize]
    public class InventorizationController : ApiController
    {
        private IInventorizationRepository _inventorizationRepository;
        private IZoneRepository _zoneRepository;
        private ICompanyRepository _companyRepository;
        private ActionDomain actionDomain;
        private InventorizationDomain inventorizationDomain;
        private ZoneDomain zoneDomain;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public InventorizationController(IInventorizationRepository inventorizationRepository
            , IZoneRepository zoneRepository
            , ICompanyRepository companyRepository
            , ActionDomain actionDomain
            , InventorizationDomain inventorizationDomain
            , ZoneDomain zoneDomain)
        {
            _inventorizationRepository = inventorizationRepository;
            _zoneRepository = zoneRepository;
            _companyRepository = companyRepository;
            this.actionDomain = actionDomain;
            this.inventorizationDomain = inventorizationDomain;
            this.zoneDomain = zoneDomain;
        }

        [HttpGet]
        [Route("{id}")]
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
        [Route("save")]
        public HttpResponseMessage Save([FromBody]Business.Model.Inventorization inventorization)
        {
            _inventorizationRepository.UpdateInventorization(inventorization);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpDelete]
        [Route("{id}")]
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
        public HttpResponseMessage SearchZone(Guid inventorization, [FromUri]int code)
        {
            try
            {
                ZoneModel zone = _zoneRepository.GetZone(code);
                if (zone == null)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
                return Request.CreateResponse(HttpStatusCode.OK, zone);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Error. Zone code:{Environment.NewLine} {JsonConvert.SerializeObject(code)}. InventorizationId: {inventorization}");
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
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
                IOwinContext ctx = Request.GetOwinContext();
                ClaimsPrincipal user = ctx.Authentication.User;
                IEnumerable<Claim> claims = user.Claims;
                List<ZoneState> states = _inventorizationRepository.GetZoneStates(inventorization).Where(x => x.ZoneId != Guid.Empty).ToList();
                List<ZoneModel> zones = _zoneRepository.GetAllZones().OrderBy(x => x.Name).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, zones.Select(x =>
                {
                    List<Business.Model.Action> actions = inventorizationDomain.GetActions(inventorization).Where(i => i.Zone == x.Id).ToList();
                    var state = states.FirstOrDefault(s => x.Id == s.ZoneId);
                    return new ZoneViewModel()
                    {
                        ZoneId = x.Id,
                        Number = x.Number,
                        ClosedAt = state != null && state.ClosedAt != null && state.ClosedAt < DateTime.MaxValue ? state.ClosedAt : null,
                        ClosedBy = state?.ClosedBy,
                        OpenedAt = state?.OpenedAt,
                        OpenedBy = state?.OpenedBy,
                        ZoneName = x.Name,
                        Status = state.GetStatus(),
                        TotalItems = actions.Sum(a => a.Quantity)
                    };
                }).OrderBy(x => x.Number));
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Error getting zones. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [HttpGet]
        [Route("{inventorization}/zone/open")]
        public HttpResponseMessage OpenZone(Guid inventorization, [FromUri]int code)
        {
            try
            {
                ZoneModel zone = _zoneRepository.GetZone(code);
                ZoneState state = _inventorizationRepository.GetZoneState(inventorization, code);
                if (state == null)
                {
                    if (zone == null)
                    {
                        zone = new ZoneModel();
                        zone.Id = Guid.NewGuid();
                        zone.Name = "Зона " + code;
                        zone.Number = code;
                        _zoneRepository.Create(zone);
                    }
                    var userClaims = Request.GetOwinContext().Authentication.User;
                    _inventorizationRepository.OpenZone(inventorization, zone.Id, Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value));
                    state = _inventorizationRepository.GetZoneState(inventorization, zone.Id);
                }
                if (state.ClosedAt.HasValue && state.ClosedAt.Value.ToUniversalTime() < DateTime.UtcNow)
                {
                    return Request.CreateResponse(HttpStatusCode.Forbidden, "Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                }
                return Request.CreateResponse(HttpStatusCode.OK, zone);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Open zone error. Zone code:{code}. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpGet]
        [Route("{inventorization}/zone/reopen")]
        public HttpResponseMessage ReopenZone(Guid inventorization, [FromUri]int number)
        {
            try
            {
                ZoneModel zone = _zoneRepository.GetZone(number);
                ZoneState state = _inventorizationRepository.GetZoneState(inventorization, number);
                var userClaims = Request.GetOwinContext().Authentication.User;
                _inventorizationRepository.OpenZone(inventorization, zone.Id, Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value));
                state = _inventorizationRepository.GetZoneState(inventorization, number);
                return Request.CreateResponse(HttpStatusCode.OK, zone);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Open zone error. Zone code:{Environment.NewLine} {JsonConvert.SerializeObject(number)}. InventorizationId: {inventorization}");
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("{inventorization}/zone/close")]
        public HttpResponseMessage CloseZone(Guid inventorization, [FromBody]ZoneVM zone)
        {
            try
            {
                ZoneState state = _inventorizationRepository.GetZoneState(inventorization, zone.ZoneId);
                if (state != null)
                {
                    var userClaims = Request.GetOwinContext().Authentication.User;
                    _inventorizationRepository.CloseZone(state, Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value));
                    return Request.CreateResponse(HttpStatusCode.OK, new { Result = "Ok" });
                }
                return Request.CreateResponse(HttpStatusCode.Forbidden, new { Result = "Error", Reason = "Зона не была открыта" });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Open zone error. Zone: {zone.ZoneId}. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Result = "Ok" });
        }

        [HttpPost]
        [Route("{inventorization}/zone/clear")]
        public HttpResponseMessage ClearZone(Guid inventorization, [FromBody]ZoneVM zone)
        {
            try
            {
                inventorizationDomain.ClearZone(inventorization, zone.ZoneId);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Zone clearing error. Zone: {zone.ZoneId}. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Result = "Ok" });
        }

        [HttpPost]
        //[Authorize(Roles="admin")]
        [Route("{inventorization}/action")]
        public HttpResponseMessage SaveAction(Guid inventorization, [FromBody]SaveActionVM actionVM)
        {
            try
            {
                var userClaims = Request.GetOwinContext().Authentication.User;

                Business.Model.Action action = new Business.Model.Action()
                {
                    Id = actionVM.Id.GetValueOrDefault(),
                    BarCode = actionVM.BarCode == null ? string.Empty : actionVM.BarCode,
                    DateTime = actionVM.DateTime.GetValueOrDefault(DateTime.UtcNow),
                    Inventorization = inventorization,
                    Quantity = actionVM.Quantity,
                    Type = actionVM.Type,
                    Zone = actionVM.Zone,
                    UserId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value)
                };
                Business.Model.Action updatedAction = actionDomain.UpsertAction(action);

                if (actionVM.Type != ActionType.BlindScan)
                {
                    var inventarization = _inventorizationRepository.GetInventorization(inventorization);
                    List<Item> items = _companyRepository.GetItems(inventarization.Company);
                    Item foundItem = items.FirstOrDefault(x => x.Code == action.BarCode);
                    return Request.CreateResponse(HttpStatusCode.OK, new { foundItem, action = updatedAction });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { ok = true, action = updatedAction });
                }
            }
            catch (Exception ex)
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
            var claims = Request.GetOwinContext().Authentication.User;
            var inventorization = _inventorizationRepository.GetInventorization(inventorizationId);
            var actions = inventorizationDomain.GetActions(inventorizationId);
            var zones = _zoneRepository.GetZones(actions.Select(x => x.Zone).ToArray());
            var items = _companyRepository.GetItems(inventorization.Company, actions.Select(x => x.BarCode).ToArray());
            List<ZoneState> states = _inventorizationRepository.GetZoneStates(inventorizationId).Where(x => x.ZoneId != Guid.Empty).ToList();
            var result = actions.Select(x =>
            {
                var foundItem = items.FirstOrDefault(i => i.Code == x.BarCode);
                var foundZone = zones.First(z => z.Id == x.Zone);
                var foundState = states.FirstOrDefault(z => z.ZoneId == foundZone.Id);

                var zoneVm = new ZoneViewModel()
                {
                    ZoneId = foundZone.Id,
                    Number = foundZone.Number,
                    ClosedAt = foundState?.ClosedAt,
                    ClosedBy = foundState?.ClosedBy,
                    OpenedAt = foundState?.OpenedAt,
                    OpenedBy = foundState?.OpenedBy,
                    ZoneName = foundZone.Name
                };
                var res = new ViewModels.Action()
                {
                    Id = x.Id,
                    DateTime = x.DateTime,
                    Quantity = x.Quantity,
                    Type = x.Type,
                    User = x.UserId.ToString(),
                    Inventorization = x.Inventorization,
                    Zone = zoneVm,
                    BarCode = x.BarCode,
                    FoundInItems = foundItem != null,
                    Name = foundItem != null ? foundItem.Name : "Не найдена в номенклатуре",
                    Description = foundItem != null ? foundItem.Description : "Не найдена в номенклатуре",
                };
                return res;
            });
            return Request.CreateResponse(HttpStatusCode.OK, result.OrderByDescending(x => x.DateTime));
        }

        [HttpGet]
        [Route("{inventorizationId}/item")]
        public HttpResponseMessage GetItem(Guid inventorizationId, [FromUri]int id)
        {
            var item = inventorizationDomain.GetItem(id);
            ViewModels.ActiveItem res = new ViewModels.ActiveItem();
            res.BarCode = item.Code;
            res.Description = item.Description;
            res.Number = item.ItemNumber;
            res.Name = item.Name;
            res.Id = item.Id;
            res.CreatedAt = item.CreatedAt;
            res.Readonly = item.Source == ItemSource.Import;

            var rests = inventorizationDomain.GetRests(inventorizationId, item.Code);
            res.QuantityPlan = rests?.Count;


            var actions = inventorizationDomain.GetActionsByCode(inventorizationId, item.Code);
            var zones = zoneDomain.GetZones(actions.Select(x => x.Zone).ToArray());
            var actionsByType = actions.Where(a => a.BarCode == item.Code).GroupBy(a => a.Type);
            res.Actions = new List<ItemDetails>();
            foreach (var action in actionsByType)
            {
                res.Actions.Add(new ItemDetails()
                {
                    Type = action.Key,
                    ZoneDetails = action.Select(x => new ActionZoneDetails()
                    {
                        Quantity = x.Quantity,
                        Zone = zones.FirstOrDefault(z => z.Id == x.Zone).Name
                    }).ToList()

                });
            }
            return Request.CreateResponse(HttpStatusCode.OK, res);
        }

        [HttpGet]
        [Route("{inventorizationId}/rests")]
        public HttpResponseMessage GetRests(Guid inventorizationId, [FromUri]ActionType type = ActionType.FirstScan)
        {
            //string code = Convert.ToBase64String(Encoding.Unicode.GetBytes(items.GetHashCode().ToString()));
            //var requestedETag = Request.Headers.IfNoneMatch.ToString();
            //if (requestedETag == code)
            //    return Request.CreateResponse(HttpStatusCode.NotModified);

            var rests = inventorizationDomain.GetAllRests(inventorizationId);

            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, rests);
            //response.Headers.ETag = new EntityTagHeaderValue(string.Format($"\"${code}\""));
            //response.Headers.CacheControl = new CacheControlHeaderValue() { MaxAge = new TimeSpan(10, 0, 0) };
            //response.Headers. Vary = new HttpHeaderValueCollection<string>("origin");
            return response;
        }

        [HttpPost]
        [Route("{inventorizationId}/rests")]
        public HttpResponseMessage UploadRests(Guid inventorizationId, [FromBody]List<Rests> rests)
        {
            var inventorization = _inventorizationRepository.GetInventorization(inventorizationId);
            inventorizationDomain.UpdateRests(inventorizationId, rests);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
