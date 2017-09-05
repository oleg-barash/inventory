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
        private readonly IHubContext _context;
        public ActionsHub()
        {
            _context = GlobalHost.ConnectionManager.GetHubContext<ActionsHub>();
        }

        public void AddAction(Action action)
        {
            _context.Clients.All.addAction(action);
        }
    }
}