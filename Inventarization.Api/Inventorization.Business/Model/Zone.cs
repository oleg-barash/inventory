using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Business.Model
{
    public class Zone
    {
        public Guid Id { get; set; }
        [JsonProperty(PropertyName = "name", Order = 1)]
        public string Name { get; set; }
        public Guid Inventorization { get; set; }
        [JsonProperty(PropertyName = "code", Order = 2)]
        public string Code { get; set; }
    }
}