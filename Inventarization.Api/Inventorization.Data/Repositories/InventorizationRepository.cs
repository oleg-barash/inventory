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
    public class InventorizationRepository : IInventorizationRepository
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

        public List<Business.Model.Inventorization> GetInventorizations()
        {
            List<Business.Model.Inventorization> result = new List<Business.Model.Inventorization>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Inventorizations\"";
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

        public ZoneState GetZoneState(Guid inventorizationId, string zone)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT * FROM public.""ZoneStates"" AS state
                        JOIN public.""Zones"" AS zone ON zone.""Code"" = @zone
                        WHERE state.""InventorizationId"" = @inventorizationId AND state.""ZoneId"" = zone.""Id""";
                    cmd.Parameters.Add(new NpgsqlParameter("inventorizationId", inventorizationId));
                    cmd.Parameters.Add(new NpgsqlParameter("zone", zone));
                    using (var reader = cmd.ExecuteReader())
                    {
                        return reader.Read() ? reader.ToZoneState() : null;
                    }
                }
            }
        }

        public List<ZoneState> GetZoneStates(Guid id)
        {
            List<ZoneState> result = new List<ZoneState>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT * FROM public.""ZoneStates"" AS state
                        WHERE state.""InventorizationId"" = @id";
                    cmd.Parameters.Add(new NpgsqlParameter("id", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToZoneState());
                        }
                    }
                }
            }
            return result;
        }

        public ZoneState GetZoneState(Guid id, Guid zoneId)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT * FROM public.""ZoneStates"" AS state
                        WHERE ""InventorizationId"" = @id AND ""ZoneId"" = @zoneId";
                    cmd.Parameters.Add(new NpgsqlParameter("zoneId", zoneId));
                    cmd.Parameters.Add(new NpgsqlParameter("id", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        return reader.Read() ? reader.ToZoneState() : null;
                    }
                }
            }
        }

        public void CloseZone(ZoneState state, Guid userId)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""ZoneStates"" 
                        SET ""ClosedAt"" = @date, ""ClosedBy"" = @user
                        WHERE ""InventorizationId"" = @id AND ""ZoneId"" = @zoneId";
                    cmd.Parameters.Add(new NpgsqlParameter("zoneId", state.ZoneId));
                    cmd.Parameters.Add(new NpgsqlParameter("id", state.InventorizationId));
                    cmd.Parameters.Add(new NpgsqlParameter("date", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("user", userId));
                    cmd.ExecuteNonQuery();
                }
            }
        }


        public void OpenZone(Guid id, Guid zoneId, Guid userId)
        {
            var zoneState = GetZoneState(id, zoneId);

            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    if (zoneState != null)
                    {
                        ReopenZone(id, zoneId);
                        return;
                    } 
                    Guid newId = Guid.NewGuid();
                    cmd.CommandText = @"INSERT INTO public.""ZoneStates""(""ZoneId"", ""InventorizationId"", ""OpenedAt"", ""OpenedBy"") VALUES(:ZoneId, :InventorizationId, :OpenedAt, :OpenedBy)";
                    cmd.Parameters.Add(new NpgsqlParameter("OpenedAt", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("OpenedBy", userId));
                    cmd.Parameters.Add(new NpgsqlParameter("ZoneId", zoneId));
                    cmd.Parameters.Add(new NpgsqlParameter("InventorizationId", id));
                    cmd.ExecuteNonQuery();

                }
            }
        }

        public void ReopenZone(Guid id, Guid zoneId)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid newId = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""ZoneStates"" SET ""ClosedAt""=null WHERE ""ZoneId"" = :ZoneId AND ""InventorizationId"" = :InventorizationId";
                    cmd.Parameters.Add(new NpgsqlParameter("ZoneId", zoneId));
                    cmd.Parameters.Add(new NpgsqlParameter("InventorizationId", id));
                    cmd.ExecuteNonQuery();

                }
            }
        }

        private ConcurrentDictionary<Guid, List<Rests>> _rests = new ConcurrentDictionary<Guid, List<Rests>>();
        public List<Rests> GetRests(Guid id)
        {
            return _rests.GetOrAdd(id, (key) =>
            {
                List<Rests> result = new List<Rests>();
                using (var conn = new NpgsqlConnection(_connectionString))
                {
                    conn.Open();
                    using (var cmd = new NpgsqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandText = @"SELECT * FROM public.""Rests"" AS rests WHERE rests.""InventorizationId"" = @id";
                        cmd.Parameters.Add(new NpgsqlParameter("id", key));
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.Add(reader.ToRests());
                            }
                        }
                    }
                }
                return result;
            });
        }

        public void AddRest(Rests rest)
        {
            Business.Model.Inventorization result = new Business.Model.Inventorization();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid id = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = @"INSERT INTO public.""Rests""(""Code"", ""Count"", ""Price"", ""InventorizationId"") VALUES(:Code, :Count, :Price, :InventorizationId)";
                    cmd.Parameters.Add(new NpgsqlParameter("Code", rest.Code));
                    cmd.Parameters.Add(new NpgsqlParameter("Count", rest.Code));
                    cmd.Parameters.Add(new NpgsqlParameter("Price", rest.Code));
                    cmd.Parameters.Add(new NpgsqlParameter("InventorizationId", rest.Code));
                    cmd.ExecuteNonQuery();
                }
            }
        }

    }
}