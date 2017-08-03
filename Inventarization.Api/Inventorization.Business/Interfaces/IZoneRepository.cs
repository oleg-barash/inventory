using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Interfaces
{
    public interface IZoneRepository
    {
        void Create(ZoneModel zone);
        void Update(ZoneModel zone);
        List<ZoneModel> GetZones();
        List<ZoneModel> GetZones(Guid[] ids);
        List<ZoneModel> GetAllZones();
        ZoneModel GetZone(Guid id);
        ZoneModel GetZone(int number);
        void DeleteZone(Guid id);
    }
}
