﻿using Inventorization.Api.ViewModels;
using Inventorization.Business.Domains;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Microsoft.Owin;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using Inventorization.Api.Models;
using Inventorization.Api.ViewModels.Builders;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/inventorization")]
    [Authorize]
    public class InventorizationController : ApiController
    {
        private readonly IInventorizationRepository _inventorizationRepository;
        private readonly IZoneRepository _zoneRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IUsageRepository _usageRepository;
        private readonly IUsageBuilder _usageBuilder;
        private readonly ActionDomain _actionDomain;
        private readonly InventorizationDomain _inventorizationDomain;
        private readonly ZoneDomain _zoneDomain;
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private static readonly bool UndefinedItemAllowed = false;
        private readonly ActionsHub _actionHub;
        static InventorizationController()
        {
            UndefinedItemAllowed = Boolean.Parse(ConfigurationManager.AppSettings["UndefinedItemAllowed"]);
        }

        public InventorizationController(IInventorizationRepository inventorizationRepository
            , IZoneRepository zoneRepository
            , ICompanyRepository companyRepository
            , IUsageRepository usageRepository
            , IUsageBuilder usageBuilder
            , ActionDomain actionDomain
            , InventorizationDomain inventorizationDomain
            , ZoneDomain zoneDomain
            , ActionsHub actionHub)
        {
            _inventorizationRepository = inventorizationRepository;
            _zoneRepository = zoneRepository;
            _companyRepository = companyRepository;
            _usageRepository = usageRepository;
            _actionDomain = actionDomain;
            _inventorizationDomain = inventorizationDomain;
            _zoneDomain = zoneDomain;
            _usageBuilder = usageBuilder;
            _actionHub = actionHub;
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

        [HttpGet]
        [Route("list")]
        public HttpResponseMessage List()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _inventorizationDomain.GetAll());
        }

        [HttpPost]
        [Route("save")]
        public HttpResponseMessage Save([FromBody]Business.Model.Inventorization inventorization)
        {
            if (inventorization.Id == Guid.Empty)
            {
                var created = _inventorizationRepository.CreateInventorization(inventorization.Company,
                    inventorization.Name, inventorization.Date);
                inventorization.Id = created.Id;
            }
            else
            {
                _inventorizationRepository.UpdateInventorization(inventorization);
            }
            return Request.CreateResponse(HttpStatusCode.OK, inventorization);
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
                Logger.Error(ex, $"Error. Zone code:{Environment.NewLine} {JsonConvert.SerializeObject(code)}. InventorizationId: {inventorization}");
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
                List<ZoneUsage> usages = _usageRepository.GetZoneUsages(inventorization).Where(x => x.ZoneId != Guid.Empty).ToList();
                List<ZoneModel> zones = _zoneRepository.GetAllZones().OrderBy(x => x.Name).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, zones.Select(x =>
                {
                    var currentZoneUsages = usages.Where(s => x.Id == s.ZoneId);
                    return new ZoneViewModel
                    {
                        Id = x.Id,
                        Number = x.Number,
                        Usages = _usageBuilder.GetUsageViewModels(currentZoneUsages.ToList()).ToArray(),
                        ZoneName = x.Name
                    };
                }).OrderBy(x => x.Number));
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Error getting zones. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [HttpPost]
        //[Authorize(Roles="admin")]
        [Route("{inventorization}/action")]
        public HttpResponseMessage SaveAction(Guid inventorization, [FromBody]SaveActionVM actionVm)
        {
            try
            {
                
                var userClaims = Request.GetOwinContext().Authentication.User;

                Business.Model.Action action = new Business.Model.Action()
                {
                    Id = actionVm.Id.GetValueOrDefault(),
                    BarCode = actionVm.BarCode ?? string.Empty,
                    DateTime = actionVm.DateTime.GetValueOrDefault(DateTime.UtcNow),
                    Inventorization = inventorization,
                    Quantity = actionVm.Quantity,
                    Type = actionVm.Type,
                    Zone = actionVm.Zone,
                    UserId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value)
                };

                if (actionVm.Type == ActionType.BlindScan)
                {
                    List<Business.Model.Action> foundActions = _actionDomain.GetActionsByType(inventorization, actionVm.Zone, actionVm.Type).ToList();
                    if (foundActions.Any())
                    {
                        Business.Model.Action foundAction = foundActions.Single();
                        action.Id = foundAction.Id;
                    }
                    Business.Model.Action updatedAction = _actionDomain.UpsertAction(action);
                    return Request.CreateResponse(HttpStatusCode.OK, new { ok = true, action = updatedAction });
                }

                var inventarization = _inventorizationRepository.GetInventorization(inventorization);
                List<Item> items = _companyRepository.GetItems(inventarization.Company);
                Item foundItem = items.FirstOrDefault(x => x.Code == actionVm.BarCode);

                if (foundItem != null || UndefinedItemAllowed)
                {

                    Business.Model.Action updatedAction = _actionDomain.UpsertAction(action);
                    _actionHub.AddAction(updatedAction);
                    
                    return Request.CreateResponse(HttpStatusCode.OK, new {foundItem, action = updatedAction});

                }
                return Request.CreateResponse(HttpStatusCode.Forbidden, "Товар не был найден в справочнике. Действие не зафиксировано.");
            }
            catch (Exception ex)
            {
                string message = $"Create action error. Action:{Environment.NewLine} {JsonConvert.SerializeObject(actionVm)}";
                Logger.Error(ex, message);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("{inventorizationId}/actions")]
        public HttpResponseMessage GetActions(Guid inventorizationId)
        {
            var inventorization = _inventorizationRepository.GetInventorization(inventorizationId);
            var actions = _inventorizationDomain.GetActions(inventorizationId);
            var zones = _zoneRepository.GetZones(actions.Select(x => x.Zone).ToArray());
            var items = _companyRepository.GetItems(inventorization.Company, actions.Select(x => x.BarCode).ToArray());
            List<ZoneUsage> usages = _usageRepository.GetZoneUsages(inventorizationId).Where(x => x.ZoneId != Guid.Empty).ToList();
            var result = actions.Select(x =>
            {
                var foundZone = zones.First(z => z.Id == x.Zone);
                var currentZoneUsages = usages.Where(z => z.ZoneId == foundZone.Id);

                var zoneVm = new ZoneViewModel()
                {
                    Id = foundZone.Id,
                    Number = foundZone.Number,
                    Usages = _usageBuilder.GetUsageViewModels(currentZoneUsages.ToList()).ToArray(),
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
                    BarCode = x.BarCode
                };

                if (x.Type != ActionType.BlindScan && !string.IsNullOrWhiteSpace(x.BarCode))
                {
                    var foundItem = items.FirstOrDefault(i => i.Code == x.BarCode);
                    if (foundItem != null)
                    {
                        res.FoundInItems = true;
                        res.Name = foundItem.Name;
                        res.Description = foundItem.Description;
                    }
                    else
                    {
                        res.Name = "Не найдена в номенклатуре";
                        res.Description = "Не найдена в номенклатуре";
                    }
                }
                return res;
            });
            return Request.CreateResponse(HttpStatusCode.OK, result.OrderByDescending(x => x.DateTime));
        }

        [HttpGet]
        [Route("{inventorizationId}/item")]
        public HttpResponseMessage GetItem(Guid inventorizationId, [FromUri]int id)
        {
            var item = _inventorizationDomain.GetItem(id);
            ViewModels.ActiveItem res = new ViewModels.ActiveItem();
            res.BarCode = item.Code;
            res.Description = item.Description;
            res.Number = item.ItemNumber;
            res.Name = item.Name;
            res.Id = item.Id;
            res.CreatedAt = item.CreatedAt;
            res.Readonly = item.Source == ItemSource.Import;

            var rests = _inventorizationDomain.GetRests(inventorizationId, item.Code);
            res.QuantityPlan = rests?.Count;


            var actions = _inventorizationDomain.GetActionsByCode(inventorizationId, item.Code);
            var zones = _zoneDomain.GetZones(actions.Select(x => x.Zone).ToArray());
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
                        Zone = zones.FirstOrDefault(z => z.Id == x.Zone)?.Name
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

            var rests = _inventorizationDomain.GetAllRests(inventorizationId);

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
            _inventorizationDomain.UpdateRests(inventorizationId, rests);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
