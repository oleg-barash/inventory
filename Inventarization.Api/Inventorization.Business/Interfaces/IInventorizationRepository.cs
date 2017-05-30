using System;
using System.Collections.Generic;
using Inventorization.Business.Model;

namespace Inventorization.Business.Interfaces
{
    public interface IInventorizationRepository
    {
        void CloseZone(ZoneState state, Guid userId);
        Business.Model.Inventorization CreateInventorization(Guid companyId, DateTime? date);
        void DeleteInventorization(Guid id);
        Business.Model.Inventorization GetInventorization(Guid id);
        List<Business.Model.Inventorization> GetInventorizations();
        List<Business.Model.Inventorization> GetInventorizationsForCompany(Guid companyId);
        ZoneState GetZoneState(Guid inventorizationId, string zone);
        ZoneState GetZoneState(Guid id, Guid zoneId);
        List<ZoneState> GetZoneStates(Guid id);
        void OpenZone(Guid id, Guid zoneId, Guid userId);
        void ReopenZone(Guid id, Guid zoneId);
        void UpdateInventorization(Business.Model.Inventorization inventorization);
    }
}