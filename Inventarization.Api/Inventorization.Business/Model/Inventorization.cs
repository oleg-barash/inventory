using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Business.Model
{
    public class Inventorization
    {
        public Guid Id { get; set; }
        public Guid Company { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ClosedAt { get; set; }
        public DateTime Date { get; set; }
    }
}