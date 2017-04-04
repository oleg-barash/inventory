using System;

namespace Inventorization.Business.Model
{
    public class Action
    {
        public Guid Id { get; set; }
        public DateTime DateTime { get; set; }
        public ActionType Type { get; set; }
        public Guid UserId { get; set; }
        public string BarCode { get; set; }
        public Guid Zone { get; set; }
        public Guid Inventorization { get; set; }
        public int Quantity { get; set; }
    }
}