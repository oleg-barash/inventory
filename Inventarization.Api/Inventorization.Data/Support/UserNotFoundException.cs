using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Data.Support
{
    public class UserLoadingException : Exception
    {
        public UserLoadingException(string userName, string reason)
        {
            UserName = userName;
            Reason = reason;
        }
        public string UserName { get; set; }
        public string Reason { get; set; }
    }
}