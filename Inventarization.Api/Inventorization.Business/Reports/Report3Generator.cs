using System;
using ClosedXML.Excel;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Inventorization.Business.Model;
namespace Inventorization.Business.Reports
{
    public class Report3Generator : ReportGenerator, IReportGenerator
    {
        private string pathToTemplate;
        private List<IXLRow> dataRows;
        private const int firstDataRowIndex = 5;
        public Report3Generator(string pathToTemplate) : base()
        {
            if (string.IsNullOrWhiteSpace(pathToTemplate))
            {
                throw new ArgumentNullException(nameof(pathToTemplate));
            }
            if (!File.Exists(pathToTemplate))
            {
                throw new FileNotFoundException("Template for Report3 wasn't found");
            }

            this.pathToTemplate = pathToTemplate;
            dataRows = new List<IXLRow>();
        }
        public override MemoryStream Generate(List<Item> items, List<Inventorization.Business.Model.Action> actions)
        {
            using (XLWorkbook book = new XLWorkbook(pathToTemplate))
            {
                IXLWorksheet worksheet = book.Worksheets.Skip(1).First();
                IEnumerable<IXLRow> dataRows = worksheet.Rows().Where(r => r.RowNumber() >= firstDataRowIndex);
                dataRows.ForEach(dr => dr.Delete());
                IXLRow currentDataRow = GetFirstDataRow(worksheet.Rows());
                currentDataRow.InsertRowsBelow(items.Count);

                int counter = 1;

                foreach (Item item in items)
                {
                    worksheet.Range(currentDataRow.Cell("A"), currentDataRow.Cell("B")).Merge();
                    worksheet.Range(currentDataRow.Cell("C"), currentDataRow.Cell("E")).Merge();
                    worksheet.Range(currentDataRow.Cell("G"), currentDataRow.Cell("H")).Merge();
                    worksheet.Range(currentDataRow.Cell("J"), currentDataRow.Cell("K")).Merge();
                    worksheet.Range(currentDataRow.Cell("L"), currentDataRow.Cell("M")).Merge();
                    worksheet.Range(currentDataRow.Cell("O"), currentDataRow.Cell("P")).Merge();
                    worksheet.Range(currentDataRow.Cell("R"), currentDataRow.Cell("S")).Merge();
                    worksheet.Range(currentDataRow.Cell("U"), currentDataRow.Cell("W")).Merge();
                    currentDataRow.Cell("A").Value = counter++;
                    currentDataRow.Cell("F").Value = item.Name;
                    currentDataRow.Cell("G").Value = item.Code;
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
            return rows.First(x => x.RowNumber() == firstDataRowIndex);
        }

        private void SetRowData(IXLRow row, Item item)
        {
        }

        private void SetSummaryRow(IXLRow row, List<Item> items)
        {
            row.Cell(1).Value = items.Sum(x => x.Price);
        }

    }
}
