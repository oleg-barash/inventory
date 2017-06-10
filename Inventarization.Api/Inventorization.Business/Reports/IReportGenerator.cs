using ClosedXML.Excel;
using System.Collections.Generic;
using System.IO;
using Inventorization.Business.Model;

namespace Inventorization.Business.Reports
{
    public interface IReportGenerator
    {
        MemoryStream Generate(List<Item> items);
    }
}
