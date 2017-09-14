using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Inventorization.Business.Reports;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/report")]
    [Authorize]
    public class ReportController : ApiController
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IActionRepository _actionRepository;
        private readonly IInventorizationRepository _inventorizationRepository;

        public ReportController(ICompanyRepository companyRepository
            , IInventorizationRepository inventorizationRepository
            , IActionRepository actionRepository)
        {
            this._companyRepository = companyRepository;
            this._actionRepository = actionRepository;
            this._inventorizationRepository = inventorizationRepository;
        }

        [HttpGet]
        [Route("{inventorizationId}/inv3")]
        public IHttpActionResult INV3(Guid inventorizationId)
        {
            Report3Generator generator = new Report3Generator(AppDomain.CurrentDomain.BaseDirectory + @"\Templates\Report3.XLSX");
            Business.Model.Inventorization inventorization = _inventorizationRepository.GetInventorization(inventorizationId);
            if (inventorization == null)
            {
                return NotFound();
            }
            List<Rests> rests = _inventorizationRepository.GetRests(inventorizationId);
            List<Business.Model.Action> actions = _actionRepository.GetActionsByInventorization(inventorizationId);
            string[] codes = rests.Select(x => x.Code).Union(actions.Where(x => x.Type == ActionType.FirstScan).Select(x => x.BarCode)).Distinct().ToArray();
            IEnumerable<Item> items = _companyRepository.GetItems(inventorization.Company).Where(x => x.Source == ItemSource.Import && codes.Any(r => r == x.Code));

            using (MemoryStream stream = generator.Generate(items.ToList(), actions, rests))
            {
                var result = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(stream.ToArray())
                };
                result.Content.Headers.ContentDisposition =
                    new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = "Report3.xlsx"
                    };
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                return ResponseMessage(result);
            }
        }

        [HttpGet]
        [Route("{inventorizationId}/custom")]
        public IHttpActionResult CustomReport(Guid inventorizationId, [FromUri]string type)
        {
            Business.Model.Inventorization inventorization = _inventorizationRepository.GetInventorization(inventorizationId);
            if (inventorization == null)
            {
                return NotFound();
            }

            List<Business.Model.Action> actions = _actionRepository.GetActionsByInventorization(inventorizationId);
            string[] codes = actions.Where(x => x.Type == ActionType.FirstScan).Select(x => x.BarCode).Distinct().ToArray();
            IEnumerable<Item> items = _companyRepository.GetItems(inventorization.Company).Where(x => x.Source == ItemSource.Import && codes.Any(r => r == x.Code));
            var report = items.Select(x => string.Format($"{x.Code},{actions.Where(a => a.BarCode == x.Code).Sum(a => a.Quantity)}"));
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(string.Join(Environment.NewLine, report))
            };

            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "customeReport.csv"
                };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            return ResponseMessage(result);
        }

    }
}
