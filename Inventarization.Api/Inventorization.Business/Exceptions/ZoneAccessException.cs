using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Exceptions
{
    public class ZoneAccessException : Exception
    {
        public Guid ZoneId { get; set; }
        public ZoneAccessException(Guid zoneId, string message) : base(message)
        {
            ZoneId = zoneId;
        }
    }
}
