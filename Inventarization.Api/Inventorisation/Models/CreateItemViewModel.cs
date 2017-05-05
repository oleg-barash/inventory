using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.Models
{
    public class CreateItemViewModel
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public int? Quantity { get; set; }
    }
}