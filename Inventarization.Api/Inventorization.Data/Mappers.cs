using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inventorization.Business.Model;

namespace Inventorization.Data
{
    public static class Mappers
    {
        public static Business.Model.Action ToAction(this NpgsqlDataReader reader)
        {
            return new Business.Model.Action()
            {
                Id = reader.GetGuid(0),
                DateTime = reader.GetDateTime(1),
                UserId = reader.GetGuid(2),
                Zone = reader.GetGuid(3),
                Quantity= reader.GetInt32(4),
                Type = (ActionType)reader.GetInt32(5),
                BarCode = reader.GetString(6)
            };
        }

        public static Business.Model.Inventorization ToInventorization(this NpgsqlDataReader reader)
        {
            return new Business.Model.Inventorization()
            {
                Id = reader.GetGuid(0),
                Company = reader.GetGuid(1),
                CreatedAt = reader.GetDateTime(2),
                ClosedAt = reader.IsDBNull(3) ? DateTime.MaxValue : reader.GetDateTime(3),
                Date = reader.GetDateTime(4)
            };
        }

        public static Company ToCompany(this NpgsqlDataReader reader)
        {
            return new Company()
            {
                Id = reader.GetGuid(0),
                Name = reader.GetString(1)
            };
        }

        public static User ToUser(this NpgsqlDataReader reader)
        {
            return new User()
            {
                Id = reader.GetGuid(0),
                FirstName = reader.GetString(1),
                FamilyName = reader.GetString(2),
                MiddleName = reader.GetString(3),
                Login = reader.GetString(4),
                Password = reader.GetString(5),
                LastLoginAt = reader.IsDBNull(6) ? DateTime.MaxValue : reader.GetDateTime(6),
                CreatedAt = reader.GetDateTime(7),
                Level = (UserLevel)reader.GetInt32(8),
            };
        }

        public static Task ToTask(this NpgsqlDataReader reader)
        {
            return new Task()
            {
                Id = reader.GetGuid(0),
                InventorizationId = reader.GetGuid(1),
                ZoneIds = reader.IsDBNull(2) ? new Guid[0] : (Guid[]) reader.GetValue(2),
                CreatedAt = reader.GetDateTime(3),
                UserId = reader.GetGuid(4),
                ClosedAt = reader.IsDBNull(5) ? DateTime.MaxValue : reader.GetDateTime(5),
                ClosedBy = reader.IsDBNull(6) ? new Guid() : reader.GetGuid(6),
                CreatedBy = reader.GetGuid(7)
            };
        }

        public static Zone ToZone(this NpgsqlDataReader reader)
        {
            return new Zone()
            {
                Id = reader.GetGuid(0),
                Name = reader.GetString(1),
                Inventorization = reader.GetGuid(2),
                Code = reader.GetString(3)
            };
        }

        

    }
}