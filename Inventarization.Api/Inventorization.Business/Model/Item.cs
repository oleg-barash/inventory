using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Model
{

    public enum ItemSource
    {
        Undefined,
        Import,
        Manual
    }

    public class Item
    {
        //public Guid Id { get; set; }
        public string ItemNumber { get; set; }
        public string Code{ get; set; }
        public Guid CompanyId { get; set; }
        public string Description { get; set; }
        public int? Quantity { get; set; }
        public ItemSource Source { get; set; }
        public string Name { get; set; }
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
