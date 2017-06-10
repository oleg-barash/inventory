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
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Host.SystemWeb;
using Inventorization.Api;
using Inventorization.Data;

[assembly: OwinStartup(typeof(Inventorization.Startup))]

namespace Inventorization
{
    public partial class Startup
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }

        static Startup()
        {
            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();
        }

        public void Configuration(IAppBuilder app)
        {
            //app.Use(new Microsoft.Owin.Security.Cookies.CookieAuthenticationOptions()
            //{
            //    AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
            //    CookieName = "aeko_credentials",
            //    CookiePath = "/"
            //});
            app.UseMyAuthentication(new BasicAuthenticationOptions("SecureApi", async (username, password) => await Authenticate(username, password)));

            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();
            config.DependencyResolver = GlobalConfiguration.Configuration.DependencyResolver;
            config.EnableCors();
            app.UseWebApi(config);

        }
        private async Task<IEnumerable<Claim>> Authenticate(string username, string password)
        {
            Business.Model.User user = (GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(UserRepository)) as UserRepository).GetUserByLogin(username);
            if (user != null && user.Password == password)
            {
                return new List<Claim> {
                    new Claim(ClaimTypes.Sid, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Login),
                    new Claim(ClaimTypes.Role, "admin")
                };
            }

            return null;
        }
    }
}
