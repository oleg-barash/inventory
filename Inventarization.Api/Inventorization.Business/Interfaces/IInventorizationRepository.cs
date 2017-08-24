using System;
using System.Collections.Generic;
using Inventorization.Business.Model;

namespace Inventorization.Business.Interfaces
{
    public interface IInventorizationRepository
    {
        Model.Inventorization CreateInventorization(Guid companyId, DateTime? date);
        void DeleteInventorization(Guid id);
        Model.Inventorization GetInventorization(Guid id);
        List<Model.Inventorization> GetInventorizations();
        List<Model.Inventorization> GetInventorizationsForCompany(Guid companyId);
        void UpdateInventorization(Model.Inventorization inventorization);
        List<Rests> GetRests(Guid id);
        void AddRest(Guid inventorizationId, Rests rest);
        void AddRests(Guid inventorizationId, IEnumerable<Rests> rests);
        void UpdateRests(Guid inventorizationId, IEnumerable<Rests> rests);
    }
}