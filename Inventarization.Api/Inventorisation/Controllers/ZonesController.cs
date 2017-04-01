using Inventorization.Business.Model;
using Inventorization.Data;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Inventorization.Controllers
{
    [RoutePrefix("api/zone")]
    public class ZoneController : ApiController
    {

        private ZoneRepository _zoneRepository;
        private ActionRepository _actionRepository;
        private TaskRepository _taskRepository;
        public ZoneController(ZoneRepository zoneRepository, TaskRepository taskRepository, ActionRepository actionRepository)
        {
            _zoneRepository = zoneRepository;
            _taskRepository = taskRepository;
            _actionRepository = actionRepository;
        }

        [HttpGet]
        public HttpResponseMessage Get(Guid id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _zoneRepository.GetZones(new Guid[] { id }));
        }

        [HttpGet]
        public HttpResponseMessage Get(string code)
        {
            var zone = _zoneRepository.GetZone(code);
            if (zone == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return Request.CreateResponse(HttpStatusCode.OK, zone);
        }

        [HttpDelete]
        public HttpResponseMessage Delete(Guid id)
        {
            _zoneRepository.DeleteZone(id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        public HttpResponseMessage Update([FromBody]Zone zone)
        {
            _zoneRepository.Update(zone);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("{zoneId}/action")]
        public HttpResponseMessage AddAction(Guid zoneId, [FromBody]Business.Model.Action action)
        {
            action.Zone = zoneId;
            _actionRepository.CreateAction(action);
            return Request.CreateResponse(HttpStatusCode.OK);
        }


    }
}
