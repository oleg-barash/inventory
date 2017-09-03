using System;
using System.Collections.Generic;
using Inventorization.Business.Model;

namespace Inventorization.Business.Interfaces
{
    public interface ICompanyRepository
    {
        Company CreateCompany(Company company);
        void CreateItem(Guid companyId, Item item);
        void DeleteCompany(Guid id);
        List<Company> GetCompanies();
        Company GetCompany(Guid id);
        Item GetItem(int itemId);
        List<Item> GetItems(Guid companyId);
        List<Item> GetItems(Guid company, string[] codes);
        void UpdateItem(Item item);
        void Update(Guid userId, Company company);
        void ClearItems(Guid id);
    }
}