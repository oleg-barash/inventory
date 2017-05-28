using Inventorization.Api.Models;
using Inventorization.Api.ViewModels;
using Inventorization.Business.Model;
using Inventorization.Data;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
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
        private ActionRepository _actionRepository;
        
        public CompanyController(CompanyRepository companyRepository, InventorizationRepository inventorizationRepository, ActionRepository actionRepository)
        {
            _companyRepository = companyRepository;
            _inventorizationRepository = inventorizationRepository;
            _actionRepository = actionRepository;
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
        public HttpResponseMessage SaveItem(Guid id, [FromBody]ItemViewModel itemVM)
        {
            Business.Model.Item item = new Business.Model.Item();
            bool isNew = itemVM.Id == default(int);
            item.Code = itemVM.BarCode;
            item.Id = itemVM.Id;
            item.ItemNumber = itemVM.Number;
            item.Name = itemVM.Name;
            item.Description = itemVM.Description;
            item.Quantity = itemVM.QuantityPlan ?? default(int);
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
                    itemModel.Quantity = item.QuantityPlan ?? default(int);
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
