using System;
using ClosedXML.Excel;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Inventorization.Business.Model;
namespace Inventorization.Business.Reports
{
    public class Report17Generator : ReportGenerator, IReportGenerator
    {
        private string pathToTemplate;
        private List<IXLRow> dataRows;
        public Report17Generator(string pathToTemplate) : base()
        {
            if (string.IsNullOrWhiteSpace(pathToTemplate))
            {
                throw new ArgumentNullException(nameof(pathToTemplate));
            }
            if (!File.Exists(pathToTemplate))
            {
                throw new FileNotFoundException("Template for Report17 wasn't found");
            }

            this.pathToTemplate = pathToTemplate;
            dataRows = new List<IXLRow>();
        }
        public override MemoryStream Generate(List<Item> items, List<Model.Action> actions, List<Rests> rests)
        {
            using (XLWorkbook book = new XLWorkbook(pathToTemplate))
            {
                IXLWorksheet worksheet = book.Worksheets.First();
                IEnumerable<IXLRow> dataRows = worksheet.Rows().Where(r => r.RowNumber() > 29);
                dataRows.ForEach(dr => dr.Delete());
                IXLRow currentDataRow = GetFirstDataRow(worksheet.Rows());
                currentDataRow.InsertRowsBelow(items.Count);
                foreach (Item item in items)
                {
                    SetRowData(currentDataRow, item);
                    currentDataRow = currentDataRow.RowBelow();
                }

                SetSummaryRow(currentDataRow, items);
                MemoryStream result = new MemoryStream();
                book.SaveAs(result);
                result.Position = 0;
                return result;
            }
        }

        private IXLRow GetFirstDataRow(IEnumerable<IXLRow> rows)
        {
            return rows.First(x => x.RowNumber() == 29);
        }

        private void SetRowData(IXLRow row, Item item)
        {
            row.Cell(1).Value = item.Code;
            row.Cell(2).Value = item.Name;
        }

        private void SetSummaryRow(IXLRow row, List<Item> items)
        {
            row.Cell(1).Value = items.Sum(x => x.Price);
        }

    }
}
