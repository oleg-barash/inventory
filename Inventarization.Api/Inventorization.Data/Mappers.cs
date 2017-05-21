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
                Inventorization = reader.GetGuid(3),
                Quantity= reader.GetInt32(4),
                Type = (ActionType)reader.GetInt32(5),
                BarCode = reader.GetString(6),
                Zone = reader.GetGuid(7),
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
                Code = reader.GetString(2),
                
            };
        }

        public static ZoneState ToZoneState(this NpgsqlDataReader reader)
        {
            return new ZoneState()
            {
                ZoneId = reader.GetGuid(0),
                InventorizationId = reader.GetGuid(1),
                OpenedAt = reader.GetDateTime(2),
                OpenedBy = reader.GetGuid(3),
                ClosedBy = reader.IsDBNull(4) ? new Guid() : reader.GetGuid(4),
                ClosedAt = reader.IsDBNull(5) ? DateTime.MaxValue : reader.GetDateTime(5),
            };
        }

        public static Item ToItem(this NpgsqlDataReader reader)
        {
            return new Item()
            {
                //Id = reader.GetGuid(0),
                ItemNumber = reader.IsDBNull(0) ? default(string) : reader.GetString(0),
                Code = reader.GetString(1),
                CompanyId = reader.GetGuid(2),
                Description = reader.IsDBNull(3) ? default(string) : reader.GetString(3),
                Quantity = reader.IsDBNull(4) ? default(int) : reader.GetInt32(4),
                Id = reader.IsDBNull(5) ? default(int) : reader.GetInt32(5),
                Source = reader.IsDBNull(6) ? ItemSource.Undefined : (ItemSource)reader.GetInt32(6),
                Name = reader.GetString(7),
                CreatedAt = reader.IsDBNull(8) ? default(DateTime) : reader.GetDateTime(8),
                Price = reader.IsDBNull(9) ? default(decimal) : reader.GetDecimal(9)
            };
        }


    }
}