using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Action = Inventorization.Business.Model.Action;

namespace Inventorization.Api.Models
{
    public class ActionManager
    {
        public List<Action> ActionList { get; set; }
        public ActionManager()
        {
            ActionList = new List<Action>();
        }

        public void AddAction(Action action)
        {
            ActionList.Add(action);
        }
    }
}