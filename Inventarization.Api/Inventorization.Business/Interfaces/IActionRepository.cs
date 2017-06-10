using System;
using System.Collections.Generic;
using Inventorization.Business.Model;

namespace Inventorization.Business.Interfaces
{
    public interface IActionRepository
    {
        bool ActionExists(Guid id);
        void CreateAction(Business.Model.Action action);
        void DeleteAction(Guid id);
        Business.Model.Action GetAction(Guid id);
        List<Business.Model.Action> GetActionsByCode(Guid inventarisation, string code);
        List<Business.Model.Action> GetActionsByInventorization(Guid inventarisation);
        void UpdateAction(Business.Model.Action action);
        void UpdateAction(Guid actionId, Guid userId, int quantity);
    }
}