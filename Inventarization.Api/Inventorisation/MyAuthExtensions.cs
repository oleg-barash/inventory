using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Thinktecture.IdentityModel.Owin;

namespace Inventorization.Api
{
    public static class MyAuthExtensions
    {
        public static IAppBuilder UseMyAuthentication(this IAppBuilder app, string realm, BasicAuthenticationMiddleware.CredentialValidationFunction validationFunction)
        {
            var options = new BasicAuthenticationOptions(realm, validationFunction);
            return app.UseBasicAuthentication(options);
        }

        public static IAppBuilder UseMyAuthentication(this IAppBuilder app, BasicAuthenticationOptions options)
        {
            return app.Use<MyAuthMiddleware>(options);
        }
    }
}