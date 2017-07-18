using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Model
{
    public class Rests
    {
        public string Code { get; set; }
        public int Count { get; set; }
        public decimal? Price { get; set; }
        public Guid InventorizationId { get; set; }
    }
}
