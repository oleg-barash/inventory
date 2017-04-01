using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Business.Model
{
    public class Task
    {
        public Guid Id { get; set; }
        public Guid InventorizationId { get; set; }
        public Guid[] ZoneIds { get; set; }
        public Guid UserId{ get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? ClosedAt { get; set; }
        public Guid? ClosedBy { get; set; }
    }
}