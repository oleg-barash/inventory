﻿using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.Models
{
    public class ItemDetails
    {
        public string Zone { get; set; }
        public int Quantity { get; set; }
    }
    public class Item
    {
        public ActionType Type { get; set; }
        public string BarCode { get; set; }
        public int QuantityFact { get { return Actions.Sum(x => x.Quantity); } }
        public int? QuantityPlan { get; set; }
        public List<ItemDetails> Actions { get; set; }
    }
}