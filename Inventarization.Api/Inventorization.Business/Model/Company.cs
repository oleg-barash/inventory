using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Business.Model
{
    public class Company
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Customer { get; set; }
        public string Address { get; set; }
        public string Manager { get; set; }
    }
}