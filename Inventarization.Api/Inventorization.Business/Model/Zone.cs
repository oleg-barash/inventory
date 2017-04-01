using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Business.Model
{
    public class Zone
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid Inventorization { get; set; }
        public string Code { get; set; }
    }
}