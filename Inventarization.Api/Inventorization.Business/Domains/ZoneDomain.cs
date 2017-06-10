using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Domains
{
    public class ZoneDomain
    {
        private IZoneRepository zoneRepository;
        public ZoneDomain(IZoneRepository zoneRepository)
        {
            this.zoneRepository = zoneRepository;
        }

        public List<ZoneModel> GetZones(Guid[] ids)
        {
            return zoneRepository.GetZones(ids);
        }

    }
}
