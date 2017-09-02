using System;
using System.Collections.Generic;
using System.Linq;
using Inventorization.Business.Exceptions;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Action = Inventorization.Business.Model.Action;

namespace Inventorization.Business.Domains
{
    public class ActionDomain
    {
        private readonly IActionRepository _actionRepository;
        private readonly IUsageRepository _usageRepository;

        public ActionDomain(IActionRepository actionRepository, IUsageRepository usageRepository)
        {
            _actionRepository = actionRepository;
            _usageRepository = usageRepository;
        }

        public IEnumerable<Action> GetActionsByType(Guid inventorizationId, Guid zoneId, ActionType type)
        {
            return _actionRepository.GetActionsByInventorization(inventorizationId)
                .Where(x => x.Zone == zoneId && x.Type == type);
        }

        public Action InsertAction(Action action) {
            CheckZoneAccess(action);
            if (action.Id == Guid.Empty)
            {
                action.Id = Guid.NewGuid();
            }
            _actionRepository.CreateAction(action);
            return action;
        }

        private void CheckZoneAccess(Action action)
        {
            ZoneUsage zoneUsage = _usageRepository.GetZoneUsages(action.Inventorization, action.Zone).FirstOrDefault(x => x.Type == action.Type);
            if (zoneUsage == null)
            {
                throw new ZoneAccessException(action.Zone, $"Зона не была открыта. Сначала откройте зону.");
            }
            if (zoneUsage.ClosedAt.HasValue && zoneUsage.ClosedAt.Value.ToUniversalTime() < DateTime.Now)
            {
                throw new ZoneAccessException(action.Zone, $"Зона закрыта. Выберите другую зону.");
            }
        }

        public void UpdateAction(Action action) {
            CheckZoneAccess(action);
            _actionRepository.UpdateAction(action);
        }

        public Action UpsertAction(Action action)
        {
            bool actionExists = ActionExists(action.Id);
            if (actionExists)
            {
                UpdateAction(action);
                return action;
            }
            return InsertAction(action);
        }

        public bool ActionExists(Guid id) {
            return id != default(Guid) && _actionRepository.ActionExists(id);
        }


        public List<Action> GetUsersLastActions(Guid userId, int length)
        {
            return _actionRepository.GetUsersActions(userId, length);
        }

    }
}
