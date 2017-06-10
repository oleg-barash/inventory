using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.ViewModels
{
    public class UserInfo
    {
        public string Error { get; set; }
        public string FullName { get; set; }
        public bool IsAuthorized { get; set; }
        public List<Business.Model.Inventorization> Inventorizations { get; set; }
        public Guid Id { get; set; }
    }
}