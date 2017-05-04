﻿using Inventorization.Business.Model;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Data
{
    public class CompanyRepository
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

        public List<Item> GetItems(Guid companyId)
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
                    cmd.Parameters.Add(new NpgsqlParameter("Id", companyId));
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
                    cmd.CommandText = @"INSERT INTO public.""Item""(""CompanyId"", ""Code"", ""Description"", ""Quantity"") VALUES(:Company, :Code, :Description, :Quantity)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.Parameters.Add(new NpgsqlParameter("Code", item.Code));
                    cmd.Parameters.Add(new NpgsqlParameter("Company", companyId));
                    cmd.Parameters.Add(new NpgsqlParameter("Description", item.Description));
                    cmd.Parameters.Add(new NpgsqlParameter("Quantity", item.Quantity));
                    cmd.ExecuteNonQuery();

                }
            }
        }

    }
}