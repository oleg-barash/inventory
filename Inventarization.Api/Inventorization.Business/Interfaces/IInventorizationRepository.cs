using System;
using System.Collections.Generic;
using Inventorization.Business.Model;

namespace Inventorization.Business.Interfaces
{
    public interface IInventorizationRepository
    {
        void CloseZone(ZoneState state, Guid userId);
        Model.Inventorization CreateInventorization(Guid companyId, DateTime? date);
        void DeleteInventorization(Guid id);
        Model.Inventorization GetInventorization(Guid id);
        List<Model.Inventorization> GetInventorizations();
        List<Model.Inventorization> GetInventorizationsForCompany(Guid companyId);
        ZoneState GetZoneState(Guid inventorizationId, int zoneNumber);
        ZoneState GetZoneState(Guid id, Guid zoneId);
        List<ZoneState> GetZoneStates(Guid id);
        void OpenZone(Guid id, Guid zoneId, Guid userId);
        void ReopenZone(Guid id, Guid zoneId);
        void UpdateInventorization(Model.Inventorization inventorization);
        List<Rests> GetRests(Guid id);
        void AddRest(Rests rest);
        void AddRests(IEnumerable<Rests> rests);
        void UpdateRests(IEnumerable<Rests> rests);
    }
}