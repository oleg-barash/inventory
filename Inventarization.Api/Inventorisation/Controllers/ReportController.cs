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
        private ICompanyRepository companyRepository;
        private IActionRepository actionRepository;
        private IInventorizationRepository inventorizationRepository;

        public ReportController(ICompanyRepository companyRepository
            , IInventorizationRepository inventorizationRepository
            , IActionRepository actionRepository)
        {
            this.companyRepository = companyRepository;
            this.actionRepository = actionRepository;
            this.inventorizationRepository = inventorizationRepository;
        }

        [HttpGet]
        [Route("{inventorizationId}/inv3")]
        public IHttpActionResult INV3(Guid inventorizationId)
        {
            Report3Generator generator = new Report3Generator(AppDomain.CurrentDomain.BaseDirectory + @"\Templates\Report3.XLSX");
            Business.Model.Inventorization inventorization = inventorizationRepository.GetInventorization(inventorizationId);
            if (inventorization == null)
            {
                return NotFound();
            }
            List<Rests> rests = inventorizationRepository.GetRests(inventorizationId);
            List<Business.Model.Action> actions = actionRepository.GetActionsByInventorization(inventorizationId);
            string[] codes = rests.Select(x => x.Code).Union(actions.Select(x => x.BarCode)).Distinct().ToArray();
            IEnumerable<Item> items = companyRepository.GetItems(inventorization.Company).Where(x => codes.Any(r => r == x.Code));

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

    }
}
