using Inventorization.Business.Exceptions;
using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Domains
{
    public class ActionDomain
    {
        private IZoneRepository zoneRepository;
        private IActionRepository actionRepository;
        private IInventorizationRepository inventorizationRepository;
        public ActionDomain(IZoneRepository zoneRepository, IActionRepository actionRepository, IInventorizationRepository inventorizationRepository)
        {
            this.zoneRepository = zoneRepository;
            this.actionRepository = actionRepository;
            this.inventorizationRepository = inventorizationRepository;
        }

        public void InsertAction(Model.Action action) {
            CheckZoneAccess(action);
            if (action.Id == null || action.Id == Guid.Empty)
            {
                action.Id = Guid.NewGuid();
            }
            actionRepository.CreateAction(action);
        }

        private void CheckZoneAccess(Model.Action action)
        {
            ZoneState zoneState = inventorizationRepository.GetZoneState(action.Inventorization, action.Zone);
            if (zoneState == null)
            {
                throw new ZoneAccessException(action.Zone, $"Зона не была открыта. Сначала откройте зону.");
            }
            if (zoneState.ClosedAt.HasValue && zoneState.ClosedAt.Value.ToUniversalTime() < DateTime.Now)
            {
                throw new ZoneAccessException(action.Zone, $"Зона закрыта. Выберите другую зону.");
            }
        }

        public void UpdateAction(Model.Action action) {
            CheckZoneAccess(action);
            actionRepository.UpdateAction(action);
        }

        public void UpsertAction(Model.Action action)
        {
            bool actionExists = ActionExists(action.Id);
            if (actionExists)
            {
                UpdateAction(action);
            }
            else
            {
                InsertAction(action);
            }
        }

        public bool ActionExists(Guid id) {
            return id != default(Guid) && actionRepository.ActionExists(id);
        }


        public List<Model.Action> GetUsersLastActions(Guid userId, int length)
        {
            return actionRepository.GetUsersActions(userId, length);
        }

    }
}
