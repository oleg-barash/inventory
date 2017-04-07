using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.Models
{
    public class Action
    {
        public Guid Id { get; set; }
        public DateTime DateTime { get; set; }
        public ActionType Type { get; set; }
        public string User { get; set; }
        public string BarCode { get; set; }
        public string Zone { get; set; }
        public int Quantity { get; set; }
    }

    public class DeleteModel
    {
        public Guid Id { get; set; }
    }

}