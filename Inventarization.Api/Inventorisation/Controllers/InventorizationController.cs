using Inventorization.Api.ViewModels;
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
        private IUsageRepository _usageRepository;
        private ActionDomain actionDomain;
        private InventorizationDomain inventorizationDomain;
        private ZoneDomain zoneDomain;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public InventorizationController(IInventorizationRepository inventorizationRepository
            , IZoneRepository zoneRepository
            , ICompanyRepository companyRepository
            , IUsageRepository usageRepository
            , ActionDomain actionDomain
            , InventorizationDomain inventorizationDomain
            , ZoneDomain zoneDomain)
        {
            _inventorizationRepository = inventorizationRepository;
            _zoneRepository = zoneRepository;
            _companyRepository = companyRepository;
            _usageRepository = usageRepository;
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
                List<ZoneUsage> usages = _usageRepository.GetZoneUsages(inventorization).Where(x => x.ZoneId != Guid.Empty).ToList();
                List<ZoneModel> zones = _zoneRepository.GetAllZones().OrderBy(x => x.Name).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, zones.Select(x =>
                {
                    List<Business.Model.Action> actions = inventorizationDomain.GetActions(inventorization).Where(i => i.Zone == x.Id).ToList();
                    var currentZoneUsages = usages.Where(s => x.Id == s.ZoneId);
                    return new ZoneViewModel()
                    {
                        Id = x.Id,
                        Number = x.Number,
                        Usages = currentZoneUsages.Select(state => new ZoneUsageViewModel
                        {
                            Type = state.Type,
                            OpenedAt = state.OpenedAt,
                            OpenedBy = state.OpenedBy,
                            ClosedAt = state?.ClosedAt,
                            ClosedBy = state?.ClosedBy
                        }).ToArray(),
                        ZoneName = x.Name
                    };
                }).OrderBy(x => x.Number));
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Error getting zones. InventorizationId: {inventorization}");
            }
            return Request.CreateResponse(HttpStatusCode.NoContent);
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
            List<ZoneUsage> usages = _usageRepository.GetZoneUsages(inventorizationId).Where(x => x.ZoneId != Guid.Empty).ToList();
            var result = actions.Select(x =>
            {
                var foundItem = items.FirstOrDefault(i => i.Code == x.BarCode);
                var foundZone = zones.First(z => z.Id == x.Zone);
                var currentZoneUsages = usages.Where(z => z.ZoneId == foundZone.Id);

                var zoneVm = new ZoneViewModel()
                {
                    Id = foundZone.Id,
                    Number = foundZone.Number,
                    Usages = currentZoneUsages.Select(state => new ZoneUsageViewModel
                    {
                        Type = state.Type,
                        OpenedAt = state.OpenedAt,
                        OpenedBy = state.OpenedBy,
                        ClosedAt = state?.ClosedAt,
                        ClosedBy = state?.ClosedBy
                    }).ToArray(),
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
