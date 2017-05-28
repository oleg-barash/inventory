using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using Inventorization.Api.Formatters;
using System.Net.Http.Formatting;

[assembly: OwinStartup(typeof(Inventorization.Startup))]

namespace Inventorization
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
