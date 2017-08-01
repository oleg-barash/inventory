using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.ViewModels
{
    public class ItemViewModel
    {
        public int Id { get; set; }
        public string BarCode { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
    }
}