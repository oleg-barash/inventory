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
        public Guid Inventorization { get; set; }
        public string User { get; set; }
        public string BarCode { get; set; }
        public ZoneViewModel Zone { get; set; }
        public int Quantity { get; set; }
        public bool FoundInItems { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        
    }

    public class SaveActionVM
    {
        public Guid? Id { get; set; }
        public DateTime? DateTime { get; set; }
        public ActionType Type { get; set; }
        public string BarCode { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public Guid Zone { get; set; }
    }

    public class DeleteModel
    {
        public Guid Id { get; set; }
    }

}