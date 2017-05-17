using Inventorization.Business.Model;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Data
{
    public class ActionRepository
    {

        private string _connectionString;

        public ActionRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void CreateAction(Business.Model.Action action)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "INSERT INTO public.\"Actions\"(\"Id\", \"DateTime\", \"Action\", \"UserId\", \"BarCode\", \"Zone\", \"Inventorization\", \"Quantity\") VALUES(:Id, :DateTime, :Action, :UserId, :BarCode, :Zone, :Inventorization, :Quantity)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", action.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("DateTime", action.DateTime));
                    cmd.Parameters.Add(new NpgsqlParameter("Action", (int)action.Type));
                    cmd.Parameters.Add(new NpgsqlParameter("UserId", action.UserId));
                    cmd.Parameters.Add(new NpgsqlParameter("BarCode", action.BarCode));
                    cmd.Parameters.Add(new NpgsqlParameter("Zone", action.Zone));
                    cmd.Parameters.Add(new NpgsqlParameter("Inventorization", action.Inventorization));
                    cmd.Parameters.Add(new NpgsqlParameter("Quantity", action.Quantity));
                    cmd.ExecuteNonQuery();

                }
            }
        }

        public Business.Model.Action GetAction(Guid id)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = @"SELECT * FROM public.""Actions""
                                    WHERE ""Id"" =  @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            return reader.ToAction();
                        }
                    }
                }
            }
            return null;
        }

        public List<Business.Model.Action> GetActionsByInventorization(Guid inventarisation)
        {
            List<Business.Model.Action> result = new List<Business.Model.Action>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = @"SELECT * FROM public.""Actions""
                                    WHERE ""Inventorization"" =  @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", inventarisation));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToAction());
                        }
                    }
                }
            }
            return result;
        }

        public List<Business.Model.Action> GetActionsByCode(Guid inventarisation, string code)
        {
            List<Business.Model.Action> result = new List<Business.Model.Action>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = @"SELECT * FROM public.""Actions""
                                    WHERE ""Inventorization"" =  @Id AND ""BarCode"" = @Code";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", inventarisation));
                    cmd.Parameters.Add(new NpgsqlParameter("Code", code));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToAction());
                        }
                    }
                }
            }
            return result;
        }

        public void DeleteAction(Guid id)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "DELETE FROM public.\"Actions\" WHERE \"Id\" = @Id;";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void UpdateAction(Guid actionId, Guid userId, int quantity)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""Actions""
                            SET ""DateTime""=@dateTime, ""UserId""=@userId, ""Quantity""=@quantity
                        WHERE ""Id"" = @id";
                    cmd.Parameters.Add(new NpgsqlParameter("id", actionId));
                    cmd.Parameters.Add(new NpgsqlParameter("dateTime", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("userId", userId));
                    cmd.Parameters.Add(new NpgsqlParameter("quantity", quantity));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void UpdateAction(Business.Model.Action action)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""Actions""
                            SET ""DateTime""=@dateTime, ""UserId""=@userId, ""Quantity""=@quantity, ""BarCode""=@barCode, ""Zone""=@zone, ""Action""=@action
                        WHERE ""Id"" = @id";
                    cmd.Parameters.Add(new NpgsqlParameter("id", action.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("dateTime", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("userId", action.UserId));
                    cmd.Parameters.Add(new NpgsqlParameter("quantity", action.Quantity));
                    cmd.Parameters.Add(new NpgsqlParameter("barCode", action.BarCode));
                    cmd.Parameters.Add(new NpgsqlParameter("action", (int)action.Type));
                    cmd.Parameters.Add(new NpgsqlParameter("zone", action.Zone));
                    cmd.ExecuteNonQuery();
                }
            }
        }


    }
}
