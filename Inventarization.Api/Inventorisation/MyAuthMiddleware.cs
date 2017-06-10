using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Owin;
using Microsoft.Owin.Security.Infrastructure;
using System.Security.Claims;
using System.Threading.Tasks;
using Thinktecture.IdentityModel.Owin;

namespace Inventorization.Api
{

        public class MyAuthMiddleware : AuthenticationMiddleware<BasicAuthenticationOptions>
        {
            public delegate Task<IEnumerable<Claim>> CredentialValidationFunction(string id, string secret);

            public MyAuthMiddleware(OwinMiddleware next, BasicAuthenticationOptions options)
                : base(next, options)
            { }

            protected override AuthenticationHandler<BasicAuthenticationOptions> CreateHandler()
            {
                return new MyAuthHandler(Options);
            }
        }
}