using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Inventorization.Data
{
    public class ZoneRepository : IZoneRepository
    {

        private readonly string _connectionString;

        public ZoneRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void Create(ZoneModel zone)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"INSERT INTO public.""Zones""(""Id"", ""Name"", ""Number"") VALUES(:Id, :Name, :Number)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", zone.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("Name", zone.Name));
                    cmd.Parameters.Add(new NpgsqlParameter("Number", zone.Number));
                    
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public void Update(ZoneModel zone)
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
        public List<ZoneModel> GetZones()
        {
            List<ZoneModel> result = new List<ZoneModel>();
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
        public List<ZoneModel> GetZones(Guid[] ids)
        {
            List<ZoneModel> result = new List<ZoneModel>();
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
        public List<ZoneModel> GetAllZones()
        {
            List<ZoneModel> result = new List<ZoneModel>();
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
        public ZoneModel GetZone(Guid id)
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
        public ZoneModel GetZone(int number)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Zones\" WHERE \"Number\" = @number";
                    cmd.Parameters.Add(new NpgsqlParameter("number", number));
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