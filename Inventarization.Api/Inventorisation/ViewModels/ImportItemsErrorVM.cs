using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventorization.Api.ViewModels
{
    public class ImportItemsResult
    {
        public List<KeyValuePair<ItemViewModel, string>> FailedItems { get; set; }
        public int TotalErrors { get; set; }

        public ImportItemsResult()
        {
            FailedItems = new List<KeyValuePair<ItemViewModel, string>>();
            TotalErrors = 0;
        }

        public void AddFailed(ItemViewModel item, string reason)
        {
            FailedItems.Add(new KeyValuePair<ItemViewModel, string>(item, reason));
            TotalErrors++;
        }

        public bool HasErrors()
        {
            return TotalErrors > 0;
        }

    }
}