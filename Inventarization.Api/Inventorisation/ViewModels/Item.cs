using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.ViewModels
{
    public class ActionZoneDetails
    {
        public string Zone { get; set; }
        public int Quantity { get; set; }
    }
    public class ItemDetails
    {
        public ActionType Type { get; set; }
        public List<ActionZoneDetails> ZoneDetails { get; set; }
    }
    public class Item
    {
        public string Description { get; set; }
        public string Number { get; set; }
        public string BarCode { get; set; }
        public int QuantityFact { get { return Actions.SelectMany(x => x.ZoneDetails).Sum(x => x.Quantity); } }
        public int? QuantityPlan { get; set; }
        public List<ItemDetails> Actions { get; set; }
        public string Name { get; set; }
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool Readonly { get; set; }
        public decimal Price { get; internal set; }
    }
}