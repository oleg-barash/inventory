using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Domains
{
    public class InventorizationDomain
    {
        private readonly IActionRepository _actionRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IInventorizationRepository _inventorizationRepository;
        private IZoneRepository _zoneRepository;
        public InventorizationDomain(IActionRepository actionRepository
            , IInventorizationRepository inventorizationRepository
            , ICompanyRepository companyRepository
            , IZoneRepository zoneRepository)
        {
            _actionRepository = actionRepository;
            _inventorizationRepository = inventorizationRepository;
            _companyRepository = companyRepository;
            _zoneRepository = zoneRepository;
        }
        public void ClearZone(Guid inventorizationId, Guid zoneId, ActionType type)
        {
            List<Model.Action> actions = _actionRepository.GetActionsByInventorization(inventorizationId).Where(x => x.Zone == zoneId && x.Type == type).ToList();
            foreach (Model.Action action in actions)
            {
                _actionRepository.DeleteAction(action.Id);
            }

        }
        public List<Model.Action> GetActions(Guid inventorizationId)
        {
            return _actionRepository.GetActionsByInventorization(inventorizationId);
        }

        public List<Model.Inventorization> GetAll()
        {
            return _inventorizationRepository.GetInventorizations();
        }

        public List<Model.Action> GetActionsByCode(Guid inventorizationId, string code)
        {
            return _actionRepository.GetActionsByCode(inventorizationId, code);
        }
        public void UpdateRests(Guid inventorizationId, List<Rests> rests)
        {
            rests = rests.Where(x => !string.IsNullOrWhiteSpace(x.Code)).ToList();
            List<Rests> oldRests = _inventorizationRepository.GetRests(inventorizationId);
            List<Rests> existedRests = rests.Where(x => oldRests.Any(r => r.Code == x.Code)).ToList();
            List<Rests> newRests = rests.Except(existedRests).ToList();
            _inventorizationRepository.UpdateRests(inventorizationId, existedRests);
            _inventorizationRepository.AddRests(inventorizationId, newRests);
        }
        public IEnumerable<Rests> GetAllRests(Guid id)
        {
            return _inventorizationRepository.GetRests(id);
        }
        public Model.Rests GetRests(Guid id, string code)
        {
            return _inventorizationRepository.GetRests(id).FirstOrDefault(x => x.Code == code);
        }
        public Model.Item GetItem(int itemId)
        {
            Model.Item item = _companyRepository.GetItem(itemId);
            if (item == null)
            {
                throw new Exception("Товар не найден");
            }

            return item;
        }


    }
}
