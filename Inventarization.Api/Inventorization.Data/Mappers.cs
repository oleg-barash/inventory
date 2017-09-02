using Npgsql;
using System;
using Inventorization.Business.Model;

namespace Inventorization.Data
{
    public static class Mappers
    {
        public static Business.Model.Action ToAction(this NpgsqlDataReader reader)
        {
            Business.Model.Action action = new Business.Model.Action()
            {
                Id = reader.GetGuid(0),
                DateTime = reader.GetDateTime(1),
                UserId = reader.GetGuid(2),
                Inventorization = reader.GetGuid(3),
                Quantity = reader.GetInt32(4),
                Type = (ActionType)reader.GetInt32(5),
                BarCode = reader.GetString(6),
                Zone = reader.GetGuid(7),
            };
            return action;
        }

        public static Business.Model.Inventorization ToInventorization(this NpgsqlDataReader reader)
        {
            Business.Model.Inventorization inventorization = new Business.Model.Inventorization()
            {
                Id = reader.GetGuid(0),
                Company = reader.GetGuid(1),
                CreatedAt = reader.GetDateTime(2),
                Date = reader.GetDateTime(4),
                Name = reader.IsDBNull(5) ? "NoName" : reader.GetString(5)
            };

            if (!reader.IsDBNull(3))
            {
                inventorization.ClosedAt = reader.GetDateTime(3);
            }

            return inventorization;
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
            User user = new User
            {
                Id = reader.GetGuid(0),
                FirstName = reader.GetString(1),
                FamilyName = reader.GetString(2),
                Login = reader.GetString(3),
                Password = reader.GetString(4),
                CreatedAt = reader.GetDateTime(6),
                Level = (UserLevel)reader.GetInt32(7)
                
            };
            if (!reader.IsDBNull(5))
            {
                user.LastLoginAt = reader.GetDateTime(5);
            }

            if (!reader.IsDBNull(8))
            {
                user.Inventorization = reader.GetGuid(8);
            }

            return user;
        }

        public static Task ToTask(this NpgsqlDataReader reader)
        {
            Task task = new Task
            {
                Id = reader.GetGuid(0),
                InventorizationId = reader.GetGuid(1),
                CreatedAt = reader.GetDateTime(3),
                UserId = reader.GetGuid(4),
                CreatedBy = reader.GetGuid(7)
            };
            if (!reader.IsDBNull(2))
            {
                task.ZoneIds = (Guid[]) reader.GetValue(2);
            }
            if (!reader.IsDBNull(5))
            {
                task.ClosedAt = reader.GetDateTime(5);
            }
            if (!reader.IsDBNull(6))
            {
                task.ClosedBy = reader.GetGuid(6);
            }
            return task;
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

        public static ZoneUsage ToZoneState(this NpgsqlDataReader reader)
        {
            ZoneUsage usage = new ZoneUsage
            {
                ZoneId = reader.GetGuid(0),
                InventorizationId = reader.GetGuid(1),
                OpenedAt = reader.GetDateTime(2),
                OpenedBy = reader.GetGuid(3),
                Type = (ActionType) Enum.Parse(typeof(ActionType), reader.GetString(6))
            };
            if (!reader.IsDBNull(4))
            {
                usage.ClosedBy = reader.GetGuid(4);
            }
            if (!reader.IsDBNull(5))
            {
                usage.ClosedAt = reader.GetDateTime(5);
            }
            if (!reader.IsDBNull(7))
            {
                usage.AssignedAt = reader.GetGuid(7);
            }
            return usage;
        }

        public static Item ToItem(this NpgsqlDataReader reader)
        {
            Item item = new Item()
            {
                Code = reader.GetString(1),
                CompanyId = reader.GetGuid(2),
                Name = reader.GetString(6)
            };
            if (!reader.IsDBNull(0))
            {
                item.ItemNumber = reader.GetString(0);
            }
            if (!reader.IsDBNull(0))
            {
                item.Description = reader.IsDBNull(3) ? default(string) : reader.GetString(3);
            }
            if (!reader.IsDBNull(4))
            {
                item.Id = reader.GetInt32(4);
            }
            if (!reader.IsDBNull(5))
            {
                item.Source = (ItemSource) reader.GetInt32(5);
            }
            if (!reader.IsDBNull(7))
            {
                item.CreatedAt = reader.GetDateTime(7);
            }

            return item;
        }
        public static Rests ToRests(this NpgsqlDataReader reader)
        {
            Rests rests = new Rests()
            {
                Code = reader.GetString(0),
                Count = reader.GetInt32(1),
                InventorizationId = reader.GetGuid(3)
            };

            if (!reader.IsDBNull(2))
            {
                rests.Price = reader.GetDecimal(2);
            }

            return rests;
        }

    }
}