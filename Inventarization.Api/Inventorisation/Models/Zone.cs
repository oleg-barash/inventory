using System;

namespace Inventorization.Api.Models
{
    public class ZoneViewModel
    {
        public Guid ZoneStatusId { get; set; }
        public string Code { get; set; }
        public string ZoneName { get; set; }
        public DateTime OpenedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public Guid OpenedBy { get; set; }
        public Guid? ClosedBy { get; set; }
    }
}