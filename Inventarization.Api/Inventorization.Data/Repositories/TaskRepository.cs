using Inventorization.Business.Model;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Data
{
    public class TaskRepository
    {

        private string _connectionString;

        public TaskRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void CreateTask(Guid id, Guid createdBy, Guid userId, Guid inventorizationId)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "INSERT INTO public.\"Tasks\"(\"CreatedAt\", \"CreatedBy\", \"Id\", \"Inventorization\", \"User\") VALUES(:CreatedAt, :CreatedBy, :Id, :Inventorization, :User)";
                    cmd.Parameters.Add(new NpgsqlParameter("CreatedBy", createdBy));
                    cmd.Parameters.Add(new NpgsqlParameter("CreatedAt", DateTime.UtcNow));
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.Parameters.Add(new NpgsqlParameter("Inventorization", inventorizationId));
                    cmd.Parameters.Add(new NpgsqlParameter("User", userId));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public Task GetTask(Guid id)
        {
            Task result = new Task();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Tasks\" WHERE \"Id\" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.ToTask();
                        }
                    }
                }
            }
            return result;
        }

        public Task AddZone(Guid id, Guid zoneId)
        {
            Task result = new Task();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "UPDATE public.\"Tasks\" SET \"Zones\" = array_append(\"Zones\", @Zone) WHERE \"Id\" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.Parameters.Add(new NpgsqlParameter("Zone", zoneId));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.ToTask();
                        }
                    }
                }
            }
            return result;
        }

        

        public List<Task> GetTasksByInventorization(Guid inventarisation)
        {
            List<Task> result = new List<Task>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Tasks\" WHERE \"Inventorization\" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", inventarisation));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToTask());
                        }
                    }
                }
            }
            return result;
        }

        public List<Task> GetTasksByUser(Guid user)
        {
            List<Task> result = new List<Task>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Tasks\" WHERE \"User\" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", user));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToTask());
                        }
                    }
                }
            }
            return result;
        }

        public List<Task> GetTasks(Guid user, Guid inventorization)
        {
            List<Task> result = new List<Task>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;

                    cmd.CommandText = "SELECT * FROM public.\"Tasks\" WHERE \"User\" = @Id AND \"Inventorization\" = @Inventorization";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", user));
                    cmd.Parameters.Add(new NpgsqlParameter("Inventorization", inventorization));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToTask());
                        }
                    }
                }
            }
            return result;
        }


        public void DeleteTask(Guid id)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "DELETE FROM public.\"Tasks\" WHERE \"Id\" = @Id;";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}