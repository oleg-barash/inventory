using Inventorization.Api.ViewModels;
using Microsoft.Owin;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;

namespace Inventorization.Api.Attributes
{
    public class AuthFilter : IAuthenticationFilter
    {
        public bool AllowMultiple
        {
            get
            {
                return true;
            }
        }

        public Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            IOwinContext requestContext = context.Request.GetOwinContext();
            string userCookieValue = requestContext.Request.Cookies["UserInfo"];
            if (string.IsNullOrWhiteSpace(userCookieValue))
            {
                return Task.FromResult(false);
            }
            UserInfo userInfo = JsonConvert.DeserializeObject<UserInfo>(userCookieValue);
            return Task.FromResult(true);
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}