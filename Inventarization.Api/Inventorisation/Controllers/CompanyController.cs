using Inventorization.Api.Models;
using Inventorization.Api.ViewModels;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Inventorization.Data;
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
    [RoutePrefix("api/company")]
    [Authorize]
    public class CompanyController : ApiController
    {
        private ICompanyRepository _companyRepository;
        private IInventorizationRepository _inventorizationRepository;
        private IActionRepository _actionRepository;
        
        public CompanyController(ICompanyRepository companyRepository, IInventorizationRepository inventorizationRepository, IActionRepository actionRepository)
        {
            _companyRepository = companyRepository;
            _inventorizationRepository = inventorizationRepository;
            _actionRepository = actionRepository;
        }

        [HttpGet, Route("list")]
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

        [HttpPut]
        public HttpResponseMessage CreateCompany(Company company)
        {
            if (string.IsNullOrWhiteSpace(company.Name))
            {
                var response = Request.CreateResponse(HttpStatusCode.BadRequest);
                response.ReasonPhrase = "Parameter 'name' is required!";
                return response;
            }
            var userClaims = Request.GetOwinContext().Authentication.User;
            var userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
            var foundCompany = _companyRepository.GetCompany(company.Id);
            if (foundCompany != null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return Request.CreateResponse(HttpStatusCode.Created, _companyRepository.CreateCompany(company.Name));
        }

        [HttpPost, Route("save")]
        public HttpResponseMessage UpdateCompany(Company company)
        {
            if (company == null)
            {
                var response = Request.CreateResponse(HttpStatusCode.BadRequest);
                response.ReasonPhrase = "Parameter 'company' is required!";
                return response;
            }
            var userClaims = Request.GetOwinContext().Authentication.User;
            var userId = Guid.Parse(userClaims.Claims.Single(x => x.Type == ClaimTypes.Sid).Value);
            if (company.Id == Guid.Empty)
            {
                return Request.CreateResponse(HttpStatusCode.Created, _companyRepository.CreateCompany(company.Name));
            }
            else
            {
                _companyRepository.Update(userId, company);
                return Request.CreateResponse(HttpStatusCode.OK);
            }
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

        [HttpGet]
        [Route("{id}")]
        public HttpResponseMessage GetItem(Guid id, [FromUri]int itemid)
        {
            var item = _companyRepository.GetItem(itemid);
            ViewModels.ActiveItem res = new ViewModels.ActiveItem();
            res.BarCode = item.Code;
            res.Description = item.Description;
            res.Number = item.ItemNumber;
            res.Name = item.Name;
            res.Id = item.Id;
            res.CreatedAt = item.CreatedAt;
            res.Readonly = item.Source == ItemSource.Import;
            return Request.CreateResponse(HttpStatusCode.OK, res);
        }

        [HttpGet]
        [Route("{id}/items")]
        public HttpResponseMessage GetItems(Guid id)
        {
            var items = _companyRepository.GetItems(id);
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, items.OrderByDescending(x => x.CreatedAt));
            return response;
        }

        [HttpPost]
        [Route("{id}/item")]
        public HttpResponseMessage SaveItem(Guid id, [FromBody]ItemViewModel itemVM)
        {
            Business.Model.Item item = new Business.Model.Item();
            bool isNew = itemVM.Id == default(int);
            item.Code = itemVM.BarCode;
            item.Id = itemVM.Id;
            item.ItemNumber = itemVM.Number;
            item.Name = itemVM.Name;
            item.Description = itemVM.Description;
            //item.Quantity = itemVM.QuantityPlan ?? default(int);
            item.CompanyId = id;
            item.Source = ItemSource.Manual;
            item.CreatedAt = DateTime.UtcNow;
            if (isNew)
            {
                _companyRepository.CreateItem(id, item);
            }
            else
            {
                _companyRepository.UpdateItem(item);
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [Route("{companyId}/import")]
        public HttpResponseMessage Import(Guid companyId, [FromBody]List<ItemViewModel> items)
        {
            var foundItems =_companyRepository.GetItems(companyId, items.Select(x => x.BarCode).ToArray());
            ImportItemsResult result = new ImportItemsResult();
            foreach (var item in items)
            {
                try {
                    Business.Model.Item itemModel = new Business.Model.Item();
                    itemModel.Code = item.BarCode;
                    itemModel.ItemNumber = item.Number;
                    itemModel.Name = item.Name;
                    itemModel.Description = item.Description;
                    itemModel.CompanyId = companyId;
                    var foundItem = foundItems.FirstOrDefault(x => x.Code == item.BarCode);
                    if (foundItem == null)
                    {
                        itemModel.CreatedAt = DateTime.UtcNow;
                        itemModel.Source = ItemSource.Import;
                        _companyRepository.CreateItem(companyId, itemModel);
                    }
                    else
                    {
                        itemModel.Id = foundItem.Id;
                        _companyRepository.UpdateItem(itemModel);
                    }
                }
                catch(Exception ex)
                {
                    result.AddFailed(item, ex.Message);
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

    }
}
