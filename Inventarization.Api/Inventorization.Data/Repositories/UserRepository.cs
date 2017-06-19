using Inventorization.Business.Model;
using Inventorization.Data.Support;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Data
{
    public class UserRepository
    {

        private string _connectionString;

        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public User CreateUser(User user)
        {
            User result = new User();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    Guid id = Guid.NewGuid();
                    cmd.Connection = conn;
                    cmd.CommandText = "INSERT INTO public.\"Users\"(\"Id\", \"FirstName\", \"FamilyName\", \"MiddleName\", \"Login\", \"Password\", \"CreatedAt\", \"Level\") VALUES(:Id, :FirstName, :FamilyName, :MiddleName, :Login, :Password, :CreatedAt, :Level)";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.Parameters.Add(new NpgsqlParameter("FirstName", user.FirstName));
                    cmd.Parameters.Add(new NpgsqlParameter("FamilyName", user.FamilyName));
                    cmd.Parameters.Add(new NpgsqlParameter("MiddleName", user.MiddleName));
                    cmd.Parameters.Add(new NpgsqlParameter("Login", user.Login));
                    cmd.Parameters.Add(new NpgsqlParameter("Password", user.Password));
                    cmd.Parameters.Add(new NpgsqlParameter("CreatedAt", user.CreatedAt));
                    cmd.Parameters.Add(new NpgsqlParameter("Level", (int)user.Level));
                    cmd.ExecuteNonQuery();

                    cmd.CommandText = "SELECT * FROM public.\"Users\" WHERE \"Id\" = @Id";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.ToUser();
                        }
                    }

                }
            }
            return result;
        }

        public void UpdateUserData(User user)
        {
            User result = new User();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE public.""Users"" SET ""Id"" = @id,
                        ""FirstName"" = @FirstName, 
                        ""FamilyName"" =  @FamilyName, 
                        ""MiddleName"" = @MiddleName, 
                        ""Login"" = @Login,
                        ""Password"" = @Password,
                        ""CreatedAt"" = @CreatedAt,
                        ""Level"" = @Level
                        WHERE ""Id"" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", user.Id));
                    cmd.Parameters.Add(new NpgsqlParameter("FirstName", user.FirstName));
                    cmd.Parameters.Add(new NpgsqlParameter("FamilyName", user.FamilyName));
                    cmd.Parameters.Add(new NpgsqlParameter("MiddleName", user.MiddleName));
                    cmd.Parameters.Add(new NpgsqlParameter("Login", user.Login));
                    cmd.Parameters.Add(new NpgsqlParameter("Password", user.Password));
                    cmd.Parameters.Add(new NpgsqlParameter("CreatedAt", user.CreatedAt));
                    cmd.Parameters.Add(new NpgsqlParameter("Level", (int)user.Level));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public User GetUser(Guid id)
        {
            User result = new User();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Users\" WHERE \"Id\" = @Id";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.ToUser();
                        }
                    }
                }
            }
            return result;
        }

        public List<User> GetUsers()
        {
            List<User> result = new List<User>();
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Users\"";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(reader.ToUser());
                        }
                    }
                }
            }
            return result;
        }

        public User GetUserByLogin(string login)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "SELECT * FROM public.\"Users\" WHERE \"Login\" = @Login";
                    cmd.Parameters.Add(new NpgsqlParameter("Login", login));
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (!reader.HasRows)
                        {
                            throw new UserLoadingException(login, "Пользователь не найден");
                        }

                        reader.Read();
                        return reader.ToUser();

                    }
                }
            }
        }

        public void DeleteUser(Guid id)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "DELETE FROM public.\"Users\" WHERE \"Id\" = @Id;";
                    cmd.Parameters.Add(new NpgsqlParameter("Id", id));
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}