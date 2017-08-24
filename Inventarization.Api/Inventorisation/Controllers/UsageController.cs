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

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/usage")]
    [Authorize]
    public class UsageController : ApiController
    {
        private static Logger _logger = LogManager.GetCurrentClassLogger();
        private ICompanyRepository _companyRepository;
        private IInventorizationRepository _inventorizationRepository;
        private IUsageRepository _usageRepository;
        private IActionRepository _actionRepository;
        private IZoneRepository _zoneRepository;
        private InventorizationDomain _inventorizationDomain;
        public UsageController(ICompanyRepository companyRepository
            , IInventorizationRepository inventorizationRepository
            , IActionRepository actionRepository
            , IZoneRepository zoneRepository
            , IUsageRepository usageRepository
            , InventorizationDomain inventorizationDomain)
        {
            _companyRepository = companyRepository;
            _inventorizationRepository = inventorizationRepository;
            _actionRepository = actionRepository;
            _zoneRepository = zoneRepository;
            _inventorizationDomain = inventorizationDomain;
            _usageRepository = usageRepository;
        }

        [HttpGet]
        [Route("list")]
        public HttpResponseMessage GetUsages([FromBody]ZoneUsageIdentifierViewModel usageIdentifier)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _usageRepository.GetZoneUsages(usageIdentifier.InventorizationId, usageIdentifier.ZoneId));
        }


        [HttpPost]
        [Route("open")]
        public HttpResponseMessage OpenZone([FromBody]ZoneUsageIdentifierViewModel usageIdentifier)
        {
            try
            {
                ZoneModel zone = _zoneRepository.GetZone(usageIdentifier.ZoneId);
                List<ZoneUsage> usages = _usageRepository.GetZoneUsages(usageIdentifier.InventorizationId, usageIdentifier.ZoneId);
                if (usages.Any(x => x.Type == usageIdentifier.Type))
                {
                    ZoneUsage usage = usages.FirstOrDefault(x => x.Type == usageIdentifier.Type);
                    if (usage == null)
                    {
                        ClaimsPrincipal userClaims = Request.GetOwinContext().Authentication.User;
                        Guid userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
                        if (usage == null)
                        {
                            _usageRepository.OpenUsage(usageIdentifier.InventorizationId, usageIdentifier.ZoneId, usageIdentifier.Type, userId);
                            return Request.CreateResponse(HttpStatusCode.OK, zone);
                        }
                    }
                    if (usage.ClosedAt.HasValue && usage.ClosedAt.Value.ToUniversalTime() < DateTime.UtcNow)
                    {
                        return Request.CreateResponse(HttpStatusCode.Forbidden, "Зона уже была закрыта. Для повторного открытия обратитесь к менеджеру.");
                    }
                }
                
            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"Open zone error. Zone:{usageIdentifier.ZoneId}. InventorizationId: {usageIdentifier.InventorizationId}. Type: {usageIdentifier.Type}");
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
                _logger.Error(ex, $"Open zone error. Zone:{Environment.NewLine} {JsonConvert.SerializeObject(usageIdentifier.ZoneId)}. InventorizationId: {usageIdentifier.InventorizationId}. Type: {usageIdentifier.Type}");
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
                _logger.Error(ex, $"Close zone error. Zone:{Environment.NewLine} {JsonConvert.SerializeObject(usageIdentifier.ZoneId)}. InventorizationId: {usageIdentifier.InventorizationId}. Type: {usageIdentifier.Type}");
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
                _logger.Error(ex, $"Zone clearing error. Zone: {usageIdentifier.ZoneId}. InventorizationId: {usageIdentifier.InventorizationId}");
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Result = "Ok" });
        }


    }
}
