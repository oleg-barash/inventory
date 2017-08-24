using Inventorization.Business.Interfaces;
using Inventorization.Business.Model;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Inventorization.Data
{
    public class UsageRepository : IUsageRepository
    {

        private string _connectionString;

        public UsageRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public List<ZoneUsage> GetZoneUsages(Guid inventorizationId, Guid zoneId)
        {
            List<ZoneUsage> result = new List<ZoneUsage>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT * FROM public.""ZoneUsages"" AS state
                        JOIN public.""Zones"" AS zone ON zone.""Id"" = @zone
                        WHERE state.""InventorizationId"" = @inventorizationId AND state.""ZoneId"" = zone.""Id""";
                    cmd.Parameters.Add(new NpgsqlParameter("inventorizationId", inventorizationId));
                    cmd.Parameters.Add(new NpgsqlParameter("zone", zoneId));
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

        public ZoneUsage GetZoneUsage(Guid inventorizationId, Guid zoneId, ActionType type)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT * FROM public.""ZoneUsages"" AS usage
                        JOIN public.""Zones"" AS zone ON zone.""Id"" = @zone
                        WHERE usage.""InventorizationId"" = @inventorizationId AND usage.""ZoneId"" = zone.""Id"" AND usage.""Type"" = @type";
                    cmd.Parameters.Add(new NpgsqlParameter("inventorizationId", inventorizationId));
                    cmd.Parameters.Add(new NpgsqlParameter("zone", zoneId));
                    cmd.Parameters.Add(new NpgsqlParameter("type", Enum.GetName(typeof(ActionType), type)));
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();
                            return reader.ToZoneState();
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
            }
        }

        public List<ZoneUsage> GetZoneUsages(Guid inventorizationId)
        {
            List<ZoneUsage> result = new List<ZoneUsage>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT * FROM public.""ZoneUsages"" AS state
                        WHERE state.""InventorizationId"" = @id";
                    cmd.Parameters.Add(new NpgsqlParameter("id", inventorizationId));
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

        public void CloseUsage(Guid inventorizationId, Guid zoneId, ActionType type, Guid userId)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""ZoneUsages"" 
                        SET ""ClosedAt"" = @date, ""ClosedBy"" = @user
                        WHERE ""InventorizationId"" = @id AND ""ZoneId"" = @zoneId";
                    cmd.Parameters.Add(new NpgsqlParameter("zoneId", zoneId));
                    cmd.Parameters.Add(new NpgsqlParameter("id", inventorizationId));
                    cmd.Parameters.Add(new NpgsqlParameter("date", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("user", userId));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void OpenUsage(Guid inventorizationId, Guid zoneId, ActionType type, Guid userId)
        {
            var zoneUsage = GetZoneUsages(inventorizationId, zoneId);

            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    if (zoneUsage != null)
                    {
                        ReopenUsage(inventorizationId, zoneId, type, userId);
                        return;
                    }
                    Guid newId = Guid.NewGuid();
                    cmd.CommandText = @"INSERT INTO public.""ZoneUsages""(""ZoneId"", ""InventorizationId"", ""OpenedAt"", ""OpenedBy"", ""Type"") VALUES(:ZoneId, :InventorizationId, :OpenedAt, :OpenedBy, :Type)";
                    cmd.Parameters.Add(new NpgsqlParameter("OpenedAt", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("OpenedBy", userId));
                    cmd.Parameters.Add(new NpgsqlParameter("ZoneId", zoneId));
                    cmd.Parameters.Add(new NpgsqlParameter("InventorizationId", inventorizationId));
                    cmd.Parameters.Add(new NpgsqlParameter("Type", Enum.GetName(typeof(ActionType), type)));
                    cmd.ExecuteNonQuery();

                }
            }
        }
        public void ReopenUsage(Guid inventorizationId, Guid zoneId, ActionType type, Guid userId)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid newId = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""ZoneUsages"" SET ""ClosedAt""=null, ""OpenedAt"" = :OpenedAt, ""OpenedBy"" = :OpenedBy WHERE ""ZoneId"" = :ZoneId AND ""InventorizationId"" = :InventorizationId AND ""Type"" = :Type";
                    cmd.Parameters.Add(new NpgsqlParameter("ZoneId", zoneId));
                    cmd.Parameters.Add(new NpgsqlParameter("OpenedAt", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("OpenedBy", userId));
                    cmd.Parameters.Add(new NpgsqlParameter("InventorizationId", inventorizationId));
                    cmd.Parameters.Add(new NpgsqlParameter("Type", Enum.GetName(typeof(ActionType), type)));
                    cmd.ExecuteNonQuery();

                }
            }
        }

    }
}