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

        public List<Business.Model.Action> GetActionsByInventorization(Guid inventarisation)
        {
            List<Business.Model.Action> result = new List<Business.Model.Action>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = @"SELECT a.* FROM public.""Actions"" AS a
                                    JOIN public.""Zones"" AS z ON z.""Id"" = a.""Zone""
                                    WHERE z.""Inventorization"" =  @Id";
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
    }
}