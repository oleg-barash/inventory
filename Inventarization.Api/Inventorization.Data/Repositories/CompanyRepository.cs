using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Npgsql;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Data
{
    public class CompanyRepository : ICompanyRepository
    {

        private string _connectionString;

        public CompanyRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public Company CreateCompany(string name)
        {
            Company result = new Company();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid id = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = "INSERT INTO public.\"Companies\"(\"Id\", \"Name\") VALUES(:Id, :Name)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.Parameters.Add(new NpgsqlParameter("Name", name));
                    cmd.ExecuteNonQuery();

                    cmd.CommandText = "SELECT * FROM public.\"Companies\" WHERE \"Id\" = @Id";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.ToCompany();
                        }
                    }

                }
            }
            return result;
        }

        public Company GetCompany(Guid id)
        {
            Company result = new Company();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Companies\" WHERE \"Id\" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.ToCompany();
                        }
                    }
                }
            }
            return result;
        }

        public List<Company> GetCompanies()
        {
            List<Company> result = new List<Company>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Companies\"";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToCompany());
                        }
                    }
                }
            }
            return result;
        }

        public void DeleteCompany(Guid id)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "DELETE FROM public.\"Companies\" WHERE \"Id\" = @Id;";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public List<Item> GetItems(Guid company, string[] codes)
        {
            List<Item> items = new List<Item>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT items.* FROM public.""Companies"" AS companies
                        JOIN public.""Item"" AS items ON items.""CompanyId"" = companies.""Id""
                        WHERE companies.""Id"" = @Id AND items.""Code"" = ANY (:Codes)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", company));
                    cmd.Parameters.Add(new NpgsqlParameter("Codes", codes));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(reader.ToItem());
                        }
                    }
                }
            }
            return items;
        }


        private ConcurrentDictionary<Guid, List<Item>> _itemsCache = new ConcurrentDictionary<Guid, List<Item>>();

        public List<Item> GetItems(Guid companyId)
        {
            List<Item> cacheItems = _itemsCache.GetOrAdd(companyId, (id) =>
            {
                List<Item> items = new List<Item>();
                using (var conn = new NpgsqlConnection(_connectionString))
                {
                    conn.Open();
                    using (var cmd = new NpgsqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandText = @"SELECT items.* FROM public.""Companies"" AS companies
                        JOIN public.""Item"" AS items ON items.""CompanyId"" = companies.""Id""
                        WHERE companies.""Id"" = @Id;";
                        cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                items.Add(reader.ToItem());
                            }
                        }
                    }
                }
                return items;
            });
            return cacheItems;
        }

        private ConcurrentDictionary<int, Item> _itemCache = new ConcurrentDictionary<int, Item>();
        public Item GetItem(int itemId)
        {
            Item cacheItem = _itemCache.GetOrAdd(itemId, (id) =>
            {
                using (var conn = new NpgsqlConnection(_connectionString))
                {
                    conn.Open();
                    using (var cmd = new NpgsqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandText = @"SELECT * FROM public.""Item""
                        WHERE ""Id"" = @ItemId";
                        cmd.Parameters.Add(new NpgsqlParameter("ItemId", id));
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                return reader.ToItem();
                            }
                        }
                    }
                }
                return null;
            });
            return cacheItem;
        }


        public void CreateItem(Guid companyId, Item item)
        {
            Business.Model.Inventorization result = new Business.Model.Inventorization();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid id = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = @"INSERT INTO public.""Item""(""CompanyId"", ""Code"", ""Description"", ""CreatedAt"", ""Name"", ""Source"") VALUES(:Company, :Code, :Description, :CreatedAt, :Name, :Source)";
                    cmd.Parameters.Add(new NpgsqlParameter("Company", companyId));
                    cmd.Parameters.Add(new NpgsqlParameter("Name", item.Name));
                    cmd.Parameters.Add(new NpgsqlParameter("Code", item.Code));
                    cmd.Parameters.Add(new NpgsqlParameter("Description", string.IsNullOrWhiteSpace(item.Description) ? string.Empty : item.Description));
                    cmd.Parameters.Add(new NpgsqlParameter("CreatedAt", item.CreatedAt));
                    cmd.Parameters.Add(new NpgsqlParameter("Source", (byte)item.Source));

                    cmd.ExecuteNonQuery();

                }
            }
            _itemsCache.Clear();
        }

        public void UpdateItem(Item item)
        {
            Business.Model.Inventorization result = new Business.Model.Inventorization();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid id = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""Item"" SET ""CompanyId""=@Company, ""Code""=@Code, ""Description""=@Description, ""Name""=@Name, ""ItemNumber"" = @ItemNumber WHERE ""Id"" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", item.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("Company", item.CompanyId));
                    cmd.Parameters.Add(new NpgsqlParameter("Code", item.Code));
                    cmd.Parameters.Add(new NpgsqlParameter("Description", string.IsNullOrWhiteSpace(item.Description) ? string.Empty : item.Description));
                    cmd.Parameters.Add(new NpgsqlParameter("Name", item.Name));
                    cmd.Parameters.Add(new NpgsqlParameter("ItemNumber", string.IsNullOrWhiteSpace(item.ItemNumber) ? string.Empty : item.ItemNumber));

                    cmd.ExecuteNonQuery();

                }
            }
            _itemsCache.Clear();
        }

        public void Update(Guid userId, Company company)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid id = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""Companies"" SET ""Name""=@Name, ""LastUpdatedAt""=@LastUpdatedAt, ""LastUpdatedBy""=@LastUpdatedBy WHERE ""Id"" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", company.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("Name", company.Name));
                    cmd.Parameters.Add(new NpgsqlParameter("LastUpdatedAt", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("LastUpdatedBy", userId));

                    cmd.ExecuteNonQuery();

                }
            }
        }

    }
}
