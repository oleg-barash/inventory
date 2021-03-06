﻿using Npgsql;
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
                Date = reader.GetDateTime(4),
                Name = reader.IsDBNull(5) ? "NoName" : reader.GetString(5)
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
                Login = reader.GetString(3),
                Password = reader.GetString(4),
                LastLoginAt = reader.IsDBNull(5) ? DateTime.MaxValue : reader.GetDateTime(5),
                CreatedAt = reader.GetDateTime(6),
                Level = (UserLevel)reader.GetInt32(7),
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

        public static ZoneModel ToZone(this NpgsqlDataReader reader)
        {
            ZoneModel result = new ZoneModel()
            {
                Id = reader.GetGuid(0),
                Name = reader.GetString(1)
            };
            if (!reader.IsDBNull(2))
            {
                result.Number = reader.GetInt32(2);
            }
            return result;
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
                ItemNumber = reader.IsDBNull(0) ? default(string) : reader.GetString(0),
                Code = reader.GetString(1),
                CompanyId = reader.GetGuid(2),
                Description = reader.IsDBNull(3) ? default(string) : reader.GetString(3),
                Id = reader.IsDBNull(4) ? default(int) : reader.GetInt32(4),
                Source = reader.IsDBNull(5) ? ItemSource.Undefined : (ItemSource)reader.GetInt32(5),
                Name = reader.GetString(6),
                CreatedAt = reader.IsDBNull(7) ? default(DateTime) : reader.GetDateTime(7)
            };
        }
        public static Rests ToRests(this NpgsqlDataReader reader)
        {
            return new Rests()
            {
                Code = reader.GetString(0),
                Count = reader.GetInt32(1),
                Price = reader.IsDBNull(2) ? default(decimal) : reader.GetDecimal(2),
                InventorizationId = reader.GetGuid(3)
            };
        }

    }
}