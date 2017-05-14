using Inventorization.Api.Models;
using Inventorization.Business.Model;
using Inventorization.Data;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/company")]
    public class CompanyController : ApiController
    {
        private CompanyRepository _companyRepository;
        private InventorizationRepository _inventorizationRepository;
        public CompanyController(CompanyRepository companyRepository, InventorizationRepository inventorizationRepository)
        {
            _companyRepository = companyRepository;
            _inventorizationRepository = inventorizationRepository;
        }

        [HttpGet]
        public HttpResponseMessage Get()
        {
            var companies = _companyRepository.GetCompanies();
            if (companies == null)
            {
                var notFoundResponse = new HttpResponseMessage(HttpStatusCode.NotFound);
                throw new HttpResponseException(notFoundResponse);
            }
            return Request.CreateResponse(HttpStatusCode.OK, companies);
        }

        [HttpGet]
        [Route("{id}")]
        public HttpResponseMessage Get(Guid id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _companyRepository.GetCompany(id));
        }

        [HttpPost]
        public HttpResponseMessage CreateCompany([FromBody]string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                var response = Request.CreateResponse(HttpStatusCode.BadRequest);
                response.ReasonPhrase = "Parameter 'name' is required!";
                return response;
            }
            return Request.CreateResponse(HttpStatusCode.Created, _companyRepository.CreateCompany(name));
        }

        [HttpDelete]
        [Route("{id}")]
        public HttpResponseMessage Delete(Guid id)
        {
            _companyRepository.DeleteCompany(id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }



        [HttpGet]
        [Route("{id}/inventorizations")]
        public HttpResponseMessage GetInventorizations(Guid id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _inventorizationRepository.GetInventorizationsForCompany(id));
        }

        [HttpGet]
        [Route("{id}/inventorization/{inventorizationId}")]

        public HttpResponseMessage GetInventorization(Guid id, Guid inventorizationId)
        {
            Business.Model.Inventorization inventorization = _inventorizationRepository.GetInventorization(inventorizationId);
            if (inventorization == null)
            {
                Request.CreateResponse(HttpStatusCode.NotFound);
            }
            if (inventorization.Company != id)
            {
                Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return Request.CreateResponse(HttpStatusCode.OK, inventorization);
        }

        [HttpPost]
        [Route("{id}/inventorization")]

        public HttpResponseMessage CreateInventorization(Guid id, [FromBody]DateTime? date)
        {
            return Request.CreateResponse(HttpStatusCode.Created, _inventorizationRepository.CreateInventorization(id, date ?? DateTime.UtcNow));
        }

        [HttpPost]
        [Route("{id}/item")]

        public HttpResponseMessage CreateItem(Guid id, [FromBody]CreateItemViewModel itemVM)
        {
            Business.Model.Item item = new Business.Model.Item();
            item.Code = itemVM.Code;
            item.Name = itemVM.Name;
            item.Description = itemVM.Description;
            item.Quantity = itemVM.Quantity ?? default(int);
            item.CompanyId = id;
            item.Source = ItemSource.Manual;
            _companyRepository.CreateItem(id, item);
            return Request.CreateResponse(HttpStatusCode.OK);
        }


    }
}
