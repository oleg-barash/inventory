using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Business.Model
{
    public class ZoneState
    {
        public Guid ZoneId { get; set; }
        public Guid InventorizationId { get; set; }
        public DateTime OpenedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public Guid OpenedBy { get; set; }
        public Guid? ClosedBy { get; set; }
    }
}