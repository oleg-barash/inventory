using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Model
{
    public class Item
    {
        //public Guid Id { get; set; }
        public string ItemNumber { get; set; }
        public string Code{ get; set; }
        public Guid CompanyId { get; set; }
        public string Description { get; set; }
    }
}
