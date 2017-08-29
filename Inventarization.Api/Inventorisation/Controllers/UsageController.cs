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
        private readonly UserRepository _userRepository;
        private readonly InventorizationDomain _inventorizationDomain;
        public UsageController(IZoneRepository zoneRepository
            , IUsageRepository usageRepository
            , InventorizationDomain inventorizationDomain
            , UserRepository userRepository)
        {
            _zoneRepository = zoneRepository;
            _inventorizationDomain = inventorizationDomain;
            _usageRepository = usageRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        [Route("list")]
        public HttpResponseMessage GetUsages([FromUri]Guid inventorizationId, [FromUri]Guid zoneId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _usageRepository.GetZoneUsages(inventorizationId, zoneId));
        }


        [HttpPost]
        [Route("open")]
        public HttpResponseMessage OpenZone([FromBody]ZoneUsageIdentifierViewModel usageIdentifier)
        {
            try
            {
                List<ZoneUsage> usages = _usageRepository.GetZoneUsages(usageIdentifier.InventorizationId, usageIdentifier.ZoneId);
                ClaimsPrincipal userClaims = Request.GetOwinContext().Authentication.User;
                Guid userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
                if (usages.Any(x => x.Type == usageIdentifier.Type))
                {
                    ZoneUsage usage = usages.First(x => x.Type == usageIdentifier.Type);
                    
                    if (usage.ClosedAt.HasValue && usage.ClosedAt.Value.ToUniversalTime() < DateTime.UtcNow)
                    {
                        return Request.CreateResponse(HttpStatusCode.Forbidden, "Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                    }

                    if (usage.OpenedBy != userId)
                    {
                        Business.Model.User user = _userRepository.GetUser(usage.OpenedBy);
                        return Request.CreateResponse(HttpStatusCode.Forbidden, $"Зона уже была открыта пользователем: {user.Login}");
                    }

                }
                _usageRepository.OpenUsage(usageIdentifier.InventorizationId, usageIdentifier.ZoneId, usageIdentifier.Type, userId);
                return Request.CreateResponse(HttpStatusCode.OK, new { usageIdentifier.ZoneId, usageIdentifier.InventorizationId });

            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Open zone error. Zone:{usageIdentifier.ZoneId}. InventorizationId: {usageIdentifier.InventorizationId}. Type: {usageIdentifier.Type}");
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("reopen")]
        public HttpResponseMessage ReopenZone([FromBody]ZoneUsageIdentifierViewModel usageIdentifier)
        {
            try
            {
                List<ZoneUsage> usage = _usageRepository.GetZoneUsages(usageIdentifier.ZoneId);
                ClaimsPrincipal userClaims = Request.GetOwinContext().Authentication.User;
                Guid userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
                _usageRepository.OpenUsage(usageIdentifier.InventorizationId, usageIdentifier.ZoneId, usageIdentifier.Type, userId);
                return Request.CreateResponse(HttpStatusCode.OK, usage);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Open zone error. Zone:{Environment.NewLine} {JsonConvert.SerializeObject(usageIdentifier.ZoneId)}. InventorizationId: {usageIdentifier.InventorizationId}. Type: {usageIdentifier.Type}");
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("close")]
        public HttpResponseMessage CloseZone([FromBody]ZoneUsageIdentifierViewModel usageIdentifier)
        {
            try
            {
                ZoneUsage state = _usageRepository.GetZoneUsage(usageIdentifier.InventorizationId, usageIdentifier.ZoneId, usageIdentifier.Type);
                if (state != null)
                {
                    var userClaims = Request.GetOwinContext().Authentication.User;
                    Guid userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
                    _usageRepository.CloseUsage(usageIdentifier.InventorizationId, usageIdentifier.ZoneId, usageIdentifier.Type, userId);
                    return Request.CreateResponse(HttpStatusCode.OK, new { Result = "Ok" });
                }
                return Request.CreateResponse(HttpStatusCode.Forbidden, new { Result = "Error", Reason = "Зона не была открыта" });
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Close zone error. Zone:{Environment.NewLine} {JsonConvert.SerializeObject(usageIdentifier.ZoneId)}. InventorizationId: {usageIdentifier.InventorizationId}. Type: {usageIdentifier.Type}");
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Result = "Ok" });
        }

        [HttpPost]
        [Route("clear")]
        public HttpResponseMessage ClearZone([FromBody]ZoneUsageIdentifierViewModel usageIdentifier)
        {
            try
            {
                _inventorizationDomain.ClearZone(usageIdentifier.InventorizationId, usageIdentifier.ZoneId, usageIdentifier.Type);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Zone clearing error. Zone: {usageIdentifier.ZoneId}. InventorizationId: {usageIdentifier.InventorizationId}");
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Result = "Ok" });
        }


    }
}
