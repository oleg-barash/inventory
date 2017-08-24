using Inventorization.Business.Model;
using System;
using System.Collections.Generic;

namespace Inventorization.Business.Interfaces
{
    public interface IUsageRepository
    {
        void CloseUsage(Guid inventorizationId, Guid zoneId, ActionType type, Guid userId);
        void OpenUsage(Guid inventorizationId, Guid zoneId, ActionType type, Guid userId);
        void ReopenUsage(Guid inventorizationId, Guid zoneId, ActionType type, Guid userId);

        ZoneUsage GetZoneUsage(Guid inventorizationId, Guid zoneId, ActionType type);
        List<ZoneUsage> GetZoneUsages(Guid inventorizationId, Guid zoneId);
        List<ZoneUsage> GetZoneUsages(Guid inventorizationId);
    }
}
