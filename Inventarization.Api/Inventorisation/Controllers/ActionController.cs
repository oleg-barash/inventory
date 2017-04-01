using Inventorization.Data;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Inventorization.Api.Controllers
{
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

    }
}
