using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.ViewModels
{
    public class ZoneUsageIdentifierViewModel
    {
        public Guid InventorizationId { get; set; }
        public Guid ZoneId { get; set; }
        public ActionType Type { get; set; }
    }
}