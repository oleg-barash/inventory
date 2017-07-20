using Inventorization.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Domains
{
    public class InventorizationDomain
    {
        private IActionRepository actionRepository;
        private ICompanyRepository companyRepository;
        private IInventorizationRepository inventorizationRepository;
        private IZoneRepository zoneRepository;
        public InventorizationDomain(IActionRepository actionRepository
            , IInventorizationRepository inventorizationRepository
            , ICompanyRepository companyRepository
            , IZoneRepository zoneRepository)
        {
            this.actionRepository = actionRepository;
            this.inventorizationRepository = inventorizationRepository;
            this.companyRepository = companyRepository;
            this.zoneRepository = zoneRepository;
        }
        public void ClearZone(Guid inventorizationId, Guid zoneId)
        {
            List<Model.Action> actions = actionRepository.GetActionsByInventorization(inventorizationId).Where(x => x.Zone == zoneId).ToList();
            foreach (Model.Action action in actions)
            {
                actionRepository.DeleteAction(action.Id);
            }
        }

        public List<Model.Action> GetActions(Guid inventorizationId)
        {
            return actionRepository.GetActionsByInventorization(inventorizationId);
        }

        public List<Model.Action> GetActionsByCode(Guid inventorizationId, string code)
        {
            return actionRepository.GetActionsByCode(inventorizationId, code);
        }

        public IEnumerable<Model.Rests> GetAllRests(Guid id)
        {
            return inventorizationRepository.GetRests(id);
        }
        public Model.Rests GetRests(Guid id, string code)
        {
            return inventorizationRepository.GetRests(id).FirstOrDefault(x => x.Code == code);
        }
        public Model.Item GetItem(int itemId)
        {
            Model.Item item = companyRepository.GetItem(itemId);
            if (item == null)
            {
                throw new Exception("Товар не найден");
            }

            return item;
        }

    }
}
