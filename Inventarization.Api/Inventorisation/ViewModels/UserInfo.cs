using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace Inventorization.Api.ViewModels
{
    public class UserInfo
    {
        public string Token;
        public string Error;
        public string FullName;
        public List<Business.Model.Inventorization> Inventorizations;
        public bool IsAuthorized;
        public string Username;
        public string Password;
        public Business.Model.Inventorization DefaultInventorization;
    }
}