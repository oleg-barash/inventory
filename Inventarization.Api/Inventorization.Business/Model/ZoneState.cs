using System;

namespace Inventorization.Business.Model
{
    public class ZoneUsage
    {
        public Guid ZoneId { get; set; }
        public Guid InventorizationId { get; set; }
        public DateTime OpenedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public Guid OpenedBy { get; set; }
        public Guid? ClosedBy { get; set; }
        public ActionType Type { get; set; }
    }

    public enum ZoneStatus
    {
        Undefined,
        NotOpened,
        Opened,
        Closed
    }

}