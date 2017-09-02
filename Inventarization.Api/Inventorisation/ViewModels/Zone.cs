using Inventorization.Business.Model;
using System;

namespace Inventorization.Api.ViewModels
{
    public class ZoneViewModel
    {
        public Guid Id { get; set; }
        public int? Number { get; set; }
        public string ZoneName { get; set; }
        public ZoneUsageViewModel[] Usages { get; set; }
    }

    public class ZoneUsageViewModel
    {
        public DateTime? OpenedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public Guid? OpenedBy { get; set; }
        public Guid? ClosedBy { get; set; }
        public Guid ZoneId{ get; set; }
        public Guid InventorizationId { get; set; }
        public ActionType Type { get; set; }
        public string AssignedAt { get; set; }
    }

}