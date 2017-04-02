using Inventorization.Api.Formatters;
using Inventorization.Business.Model;
using Inventorization.Data;
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

        public InventorizationController(InventorizationRepository inventorizationRepository, ZoneRepository zoneRepository, ActionRepository actionRepository)
        {
            _inventorizationRepository = inventorizationRepository;
            _zoneRepository = zoneRepository;
            _actionRepository = actionRepository;
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


        [HttpPost]
        [Route("{inventorization}/zone")]
        public HttpResponseMessage CreateZone(Guid inventorization, [FromBody]Zone zone)
        {
            zone.Inventorization = inventorization;
            _zoneRepository.Create(zone);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpGet]
        [Route("{inventorization}/zone/generate")]
        public HttpResponseMessage CreateZoneList(Guid inventorization, [FromUri]int count)
        {
            List<Zone> zones = new List<Zone>();
            Zone[] currentZones = _zoneRepository.GetZonesByInventorization(inventorization).ToArray();
            for (int i = 1; i <= count; i++)
            {
                string code = i.ToString("0000");
                Zone zone = currentZones.FirstOrDefault(x => x.Code == code);
                if (zone == null)
                {
                    zone = new Zone();
                    zone.Id = Guid.NewGuid();
                    zone.Inventorization = inventorization;
                    zone.Name = "Зона " + i;
                    zone.Code = code;
                    _zoneRepository.Create(zone);
                }
                zones.Add(zone);
            }

            var negotiator = this.Configuration.Services.GetContentNegotiator();

            var result = negotiator.Negotiate(typeof(List<Zone>),
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
                Content = new ObjectContent<List<Zone>>(
                    zones,  // data
                    result.Formatter, // media formatter
                    result.MediaType.MediaType // MIME type
                )
            };

            // add the `content-disposition` response header
            // to display the "File Download" dialog box 
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

            // default to text
            return "txt";
        }


        [HttpGet]
        [Route("{inventorization}/action")]
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
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }


    }
}
