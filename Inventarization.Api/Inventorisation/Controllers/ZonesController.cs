using Inventorization.Api.Formatters;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Inventorization.Data;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Inventorization.Controllers
{
    [RoutePrefix("api/zone")]
    public class ZoneController : ApiController
    {

        private IZoneRepository _zoneRepository;
        private IActionRepository _actionRepository;
        private TaskRepository _taskRepository;
        public ZoneController(IZoneRepository zoneRepository, TaskRepository taskRepository, IActionRepository actionRepository)
        {
            _zoneRepository = zoneRepository;
            _taskRepository = taskRepository;
            _actionRepository = actionRepository;
        }


        [HttpGet]
        [Route("generate")]
        public HttpResponseMessage CreateZoneList([FromUri]int count)
        {
            List<ZoneModel> zones = new List<ZoneModel>();
            ZoneModel[] currentZones = _zoneRepository.GetZones().ToArray();
            for (int i = 1; i <= count; i++)
            {
                string code = i.ToString();
                ZoneModel zone = currentZones.FirstOrDefault(x => x.Code == code);
                if (zone == null)
                {
                    zone = new ZoneModel();
                    zone.Id = Guid.NewGuid();
                    zone.Name = "Зона " + i;
                    zone.Code = code;
                    _zoneRepository.Create(zone);
                }
                zones.Add(zone);
            }

            var negotiator = this.Configuration.Services.GetContentNegotiator();

            var result = negotiator.Negotiate(typeof(List<ZoneModel>),
                           this.Request,
                           this.Configuration.Formatters);

            // no formatter found
            if (result == null)
            {
                throw new HttpResponseException(
                      new HttpResponseMessage(HttpStatusCode.NotAcceptable));
            }

            var response = new HttpResponseMessage
            {
                Content = new ObjectContent<List<ZoneModel>>(
                    zones,  // data
                    result.Formatter, // media formatter
                    result.MediaType.MediaType // MIME type
                )
            };

            response.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "cars-download." + GetFileExt(result.Formatter)
                };

            return response;

        }

        private string GetFileExt(MediaTypeFormatter formatter)
        {
            if (formatter is JsonMediaTypeFormatter)
            {
                return "json";
            }

            if (formatter is CsvMediaTypeFormatter)
            {
                return "csv";
            }

            return "txt";
        }

        [HttpGet]
        [Route("{id}")]
        public HttpResponseMessage Get(Guid id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _zoneRepository.GetZone(id));
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
        public HttpResponseMessage Create([FromBody]ZoneModel zone)
        {
            zone.Name = "Зона " + zone.Code;
            zone.Id = Guid.NewGuid();
            _zoneRepository.Create(zone);
            return Request.CreateResponse(HttpStatusCode.OK, zone);
        }


    }
}
