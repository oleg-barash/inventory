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

    public static class ZoneStateExtensions
    {
        public static ZoneStatus GetStatus(this ZoneState state)
        {
            if (state == null)
            {
                return ZoneStatus.Undefined;
            }
            if (state.ClosedAt.HasValue && state.ClosedAt < DateTime.MaxValue) {
                return ZoneStatus.Closed;
            }
            return ZoneStatus.Opened;
        }
    }

    public enum ZoneStatus
    {
        Undefined,
        Opened,
        Closed
    }

}