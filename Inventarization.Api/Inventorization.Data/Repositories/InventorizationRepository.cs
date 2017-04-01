using Inventorization.Business.Model;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Data
{
    public class InventorizationRepository
    {

        private string _connectionString;

        public InventorizationRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public Business.Model.Inventorization CreateInventorization(Guid companyId, DateTime? date)
        {
            Business.Model.Inventorization result = new Business.Model.Inventorization();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid id = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = "INSERT INTO public.\"Inventorizations\"(\"Id\", \"Company\", \"CreatedAt\", \"Date\") VALUES(:Id, :Company, :CreatedAt, :Date)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.Parameters.Add(new NpgsqlParameter("Company", companyId));
                    cmd.Parameters.Add(new NpgsqlParameter("CreatedAt", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("Date", date ?? DateTime.UtcNow));
                    cmd.ExecuteNonQuery();

                    cmd.CommandText = "SELECT * FROM public.\"Inventorizations\" WHERE \"Id\" = @Id";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.ToInventorization();
                        }
                    }

                }
            }
            return result;
        }

        public Business.Model.Inventorization GetInventorization(Guid id)
        {
            Business.Model.Inventorization result = new Business.Model.Inventorization();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Inventorizations\" WHERE \"Id\" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.ToInventorization();
                        }
                    }
                }
            }
            return result;
        }

        public List<Business.Model.Inventorization> GetInventorizationsForCompany(Guid companyId)
        {
            List<Business.Model.Inventorization> result = new List<Business.Model.Inventorization>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Inventorizations\" WHERE \"Company\" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", companyId));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToInventorization());
                        }
                    }
                }
            }
            return result;
        }

        public void UpdateInventorization(Business.Model.Inventorization inventorization)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""Inventorizations"" 
                        SET ClosedAt = @closedAt,
                            Date = @date
                        WHERE ""Id"" = @id";
                    cmd.Parameters.Add(new NpgsqlParameter("id", inventorization.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("closedAt", inventorization.ClosedAt));
                    cmd.Parameters.Add(new NpgsqlParameter("date", inventorization.Date));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        

        public void DeleteInventorization(Guid id)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "DELETE FROM public.\"Inventorizations\" WHERE \"Id\" = @Id;";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}