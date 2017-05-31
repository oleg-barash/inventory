using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Inventorization.Api.Controllers
{
    [Authorize(Roles = "admin")]
    public class TestController : ApiController
    {
        [HttpGet]
        [Route("Secured")]
        public IHttpActionResult Get()
        {
            return Json("Authenticated!");
        }
    }
}
