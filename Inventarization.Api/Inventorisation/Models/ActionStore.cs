using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.Models
{
    public class ActionStore
    {
        public List<Business.Model.Action> ActionList { get; set; }

        public ActionStore()
        {
            ActionList = new List<Business.Model.Action>();
        }
    }
}