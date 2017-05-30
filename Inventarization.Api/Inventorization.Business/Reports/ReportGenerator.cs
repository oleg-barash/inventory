using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClosedXML.Excel;
using System.IO;
using Inventorization.Business.Model;

namespace Inventorization.Business.Reports
{
    public abstract class ReportGenerator : IReportGenerator
    {
        public ReportGenerator()
        {
        }

        public abstract MemoryStream Generate(List<Item> items);
    }
}
