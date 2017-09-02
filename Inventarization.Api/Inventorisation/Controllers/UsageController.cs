using Inventorization.Api.Models;
using Inventorization.Api.ViewModels;
using Inventorization.Business.Domains;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Inventorization.Data;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Inventorization.Api.ViewModels.Builders;
using Inventorization.Data.Repositories;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/usage")]
    [Authorize]
    public class UsageController : ApiController
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IUsageRepository _usageRepository;
        private readonly IZoneRepository _zoneRepository;
        private readonly IUsageBuilder _usageBuilder;
        private readonly IUserRepository _userRepository;
        private readonly InventorizationDomain _inventorizationDomain;
        public UsageController(IZoneRepository zoneRepository
            , IUsageRepository usageRepository
            , InventorizationDomain inventorizationDomain
            , IUserRepository userRepository
            , IUsageBuilder usageBuilder)
        {
            _zoneRepository = zoneRepository;
            _inventorizationDomain = inventorizationDomain;
            _usageRepository = usageRepository;
            _userRepository = userRepository;
            _usageBuilder = usageBuilder;
        }

        [HttpGet]
        [Route("list")]
        public HttpResponseMessage GetUsages([FromUri]Guid inventorizationId, [FromUri]Guid zoneId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _usageRepository.GetZoneUsages(inventorizationId, zoneId));
        }


        [HttpPost]
        [Route("open")]
        public HttpResponseMessage OpenZone([FromBody]UsageOpenViewModel model)
        {
            try
            {
                List<ZoneUsage> usages = _usageRepository.GetZoneUsages(model.InventorizationId, model.ZoneId);
                ClaimsPrincipal userClaims = Request.GetOwinContext().Authentication.User;
                Guid userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
                if (usages.Any(x => x.Type == model.Type))
                {
                    ZoneUsage usage = usages.First(x => x.Type == model.Type);
                    
                    if (usage.ClosedAt.HasValue && usage.ClosedAt.Value.ToUniversalTime() < DateTime.UtcNow)
                    {
                        return Request.CreateResponse(HttpStatusCode.Forbidden, "Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                    }

                    if (usage.AssignedAt.HasValue && usage.AssignedAt != userId)
                    {
                        Business.Model.User user = _userRepository.GetUser(usage.AssignedAt.Value);
                        return Request.CreateResponse(HttpStatusCode.Forbidden, $"Зона уже была назначена на пользователея: {user.Login}");
                    }

                }
                _usageRepository.OpenUsage(model.InventorizationId, model.ZoneId, model.Type, userId, model.AssignTo ?? userId);
                return Request.CreateResponse(HttpStatusCode.OK, new { model.ZoneId, model.InventorizationId });

            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Open zone error. Zone:{model.ZoneId}. InventorizationId: {model.InventorizationId}. Type: {model.Type}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("reopen")]
        public HttpResponseMessage ReopenZone([FromBody]UsageOpenViewModel model)
        {
            try
            {
                ClaimsPrincipal userClaims = Request.GetOwinContext().Authentication.User;
                Guid userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
                _usageRepository.ReopenUsage(model.InventorizationId, model.ZoneId, model.Type, userId);
                List<ZoneUsage> usages = _usageRepository.GetZoneUsages(model.InventorizationId, model.ZoneId);
                IEnumerable<ZoneUsageViewModel> viewModels = _usageBuilder.GetUsageViewModels(usages);
                return Request.CreateResponse(HttpStatusCode.OK, viewModels);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Open zone error. Zone:{Environment.NewLine} {JsonConvert.SerializeObject(model.ZoneId)}. InventorizationId: {model.InventorizationId}. Type: {model.Type}");
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("close")]
        public HttpResponseMessage CloseZone([FromBody]UsageViewModel model)
        {
            try
            {
                ZoneUsage state = _usageRepository.GetZoneUsage(model.InventorizationId, model.ZoneId, model.Type);
                if (state != null)
                {
                    var userClaims = Request.GetOwinContext().Authentication.User;
                    Guid userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
                    _usageRepository.CloseUsage(model.InventorizationId, model.ZoneId, model.Type, userId);
                    List<ZoneUsage> usages = _usageRepository.GetZoneUsages(model.InventorizationId, model.ZoneId);
                    IEnumerable<ZoneUsageViewModel> viewModels = _usageBuilder.GetUsageViewModels(usages);
                    return Request.CreateResponse(HttpStatusCode.OK, viewModels);
                }
                return Request.CreateResponse(HttpStatusCode.Forbidden, new { Result = "Error", Reason = "Зона не была открыта" });
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Close zone error. Zone:{Environment.NewLine} {JsonConvert.SerializeObject(model.ZoneId)}. InventorizationId: {model.InventorizationId}. Type: {model.Type}");
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new { Result = "Error", Reason = ex.Message });
            }
        }

        [HttpPost]
        [Route("clear")]
        public HttpResponseMessage ClearZone([FromBody]UsageViewModel model)
        {
            try
            {
                _inventorizationDomain.ClearZone(model.InventorizationId, model.ZoneId, model.Type);
                List<ZoneUsage> usages = _usageRepository.GetZoneUsages(model.InventorizationId, model.ZoneId);
                IEnumerable<ZoneUsageViewModel> viewModels = _usageBuilder.GetUsageViewModels(usages);
                return Request.CreateResponse(HttpStatusCode.OK, viewModels);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Zone clearing error. Zone: {model.ZoneId}. InventorizationId: {model.InventorizationId}");
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }


    }
}
