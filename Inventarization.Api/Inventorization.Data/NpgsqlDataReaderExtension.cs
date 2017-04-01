using Inventorization.Business.Model;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Data
{
    public static class NpgsqlDataReaderExtension
    {
        public static ActionType GetActionType(this NpgsqlDataReader reader, int index)
        {
            return (ActionType)reader.GetInt32(index);
        }
    }
}