using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using Inventorization.Api.Formatters;
using System.Net.Http.Formatting;
using Thinktecture.IdentityModel.Owin;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNet.Identity;

[assembly: OwinStartup(typeof(Inventorization.Startup))]

namespace Inventorization
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCookieAuthentication(new Microsoft.Owin.Security.Cookies.CookieAuthenticationOptions()
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                CookieName = "aeko_credentials",
                CookiePath = "/"

            });

        }
    }
}
