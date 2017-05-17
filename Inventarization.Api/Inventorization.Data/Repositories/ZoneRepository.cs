using Inventorization.Business.Model;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Inventorization.Data
{
    public class ZoneRepository
    {

        private string _connectionString;

        public ZoneRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void Create(Zone zone)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"INSERT INTO public.""Zones""(""Id"", ""Name"", ""Code"") VALUES(:Id, :Name, :Code)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", zone.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("Name", zone.Name));
                    cmd.Parameters.Add(new NpgsqlParameter("Code", zone.Code));
                    
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Update(Zone zone)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""Zones""
                        SET ""Name"" = @Name 
                        WHERE ""Id"" == @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", zone.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("Name", zone.Name));
                    cmd.ExecuteNonQuery();
                }
            }
        }


        public List<Zone> GetZones()
        {
            List<Zone> result = new List<Zone>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Zones\"";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToZone());
                        }
                    }
                }
            }
            return result;
        }

        public List<Zone> GetZones(Guid[] ids)
        {
            List<Zone> result = new List<Zone>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Zones\" WHERE \"Id\" = ANY (:Id)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", NpgsqlDbType.Array | NpgsqlDbType.Uuid)
                    {
                        Value = ids
                    });
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToZone());
                        }
                    }
                }
            }
            return result;
        }

        public List<Zone> GetAllZones()
        {
            List<Zone> result = new List<Zone>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Zones\"";

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToZone());
                        }
                    }
                }
            }
            return result;
        }


        public Zone GetZone(Guid id)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Zones\" WHERE \"Id\" = :Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        reader.Read();
                        return reader.ToZone();
                    }
                }
            }
        }

        public Zone GetZone(string code)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Zones\" WHERE \"Code\" = @code";
                    cmd.Parameters.Add(new NpgsqlParameter("code", code));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            return reader.ToZone();
                        }
                    }
                }
            }
            return null;
        }

        public void DeleteZone(Guid id)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "DELETE FROM public.\"Zones\" WHERE \"Id\" = @Id;";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}