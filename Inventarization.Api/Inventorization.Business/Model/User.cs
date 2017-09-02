using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Business.Model
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string FamilyName { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserLevel Level { get; set; }
        public Guid? Inventorization { get; set; }
        public string GetFullName()
        {
            return $"{FamilyName} {FirstName} ({Login})";
        }

    }
}