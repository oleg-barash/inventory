using Inventorization.Api.Models;
using Inventorization.Data;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/action")]
    public class ActionController : ApiController
    {
        private ActionRepository _actionRepository;
        public ActionController(ActionRepository actionRepository)
        {
            _actionRepository = actionRepository;
        }

        [HttpGet]
        public HttpResponseMessage Get(Guid id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _actionRepository.GetActionsByInventorization(id));
        }

        [HttpPost]
        [Route("{id}")]
        public HttpResponseMessage Update(Guid id, [FromBody]Business.Model.Action action)
        {
            _actionRepository.UpdateAction(id, Guid.Parse("c2425014-157f-4a73-bd92-7c514c4d35d3"), action.Quantity);
            return Request.CreateResponse(HttpStatusCode.OK, action);
        }

        [HttpDelete]
        public HttpResponseMessage Delete([FromBody]DeleteModel model)
        {
            _actionRepository.DeleteAction(model.Id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

    }
}
