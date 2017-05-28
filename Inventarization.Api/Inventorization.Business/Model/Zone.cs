using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Business.Model
{
    public class ZoneModel
    {
        public Guid Id { get; set; }
        [JsonProperty(PropertyName = "Name", Order = 1)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "Code", Order = 2)]
        public string Code { get; set; }
    }
}