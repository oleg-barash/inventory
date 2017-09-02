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
        public bool IsAuthorized;
        public string Username;
        public string Password;
        public List<Business.Model.Company> Companies;
        public Business.Model.Company Company;
        public Business.Model.Inventorization DefaultInventorization;
    }
}