using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Action = Inventorization.Business.Model.Action;

namespace Inventorization.Api.Models
{
    public class ActionsHub : Hub
    {

        public void AddAction(Action action)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<ActionsHub>();
            context.Clients.All.addAction(action);
        }
        public void Connect(string userName)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<ActionsHub>();
            var id = Context.ConnectionId;
        }
    }
}