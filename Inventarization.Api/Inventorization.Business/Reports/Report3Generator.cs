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

                var grouppedActions = actions.GroupBy(x => x.BarCode);

                int counter = 1;

                foreach (Item item in items)
                {
                    var numberCell = worksheet.Range(currentDataRow.Cell("A"), currentDataRow.Cell("B")).Merge(false);
                    numberCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                    var billCell = worksheet.Range(currentDataRow.Cell("C"), currentDataRow.Cell("E")).Merge(false);
                    billCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                    var nameCell = currentDataRow.Cell("F");
                    nameCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                    var itemNumberCell = worksheet.Range(currentDataRow.Cell("G"), currentDataRow.Cell("H")).Merge(false);
                    itemNumberCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                    currentDataRow.Cell("I").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    worksheet.Range(currentDataRow.Cell("J"), currentDataRow.Cell("K")).Merge(false).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                    var priceCell = worksheet.Range(currentDataRow.Cell("L"), currentDataRow.Cell("M")).Merge(false);
                    priceCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    priceCell.Style.NumberFormat.Format = "# ### ### ₽";
                    priceCell.DataType = XLCellValues.Number;

                    var inventNumberCell = currentDataRow.Cell("N");
                    inventNumberCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                    worksheet.Range(currentDataRow.Cell("O"), currentDataRow.Cell("P")).Merge(false).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                    var countFactCell = currentDataRow.Cell("Q");
                    countFactCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                    var sumFactCell = worksheet.Range(currentDataRow.Cell("R"), currentDataRow.Cell("S")).Merge(false);
                    sumFactCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    sumFactCell.Style.NumberFormat.Format = "# ### ### ₽";
                    sumFactCell.DataType = XLCellValues.Number;

                    var countPlanCell = currentDataRow.Cell("T");
                    countPlanCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    var sumPlanCell = worksheet.Range(currentDataRow.Cell("U"), currentDataRow.Cell("W")).Merge(false);
                    sumPlanCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    sumPlanCell.Style.NumberFormat.Format = "# ### ### ₽";
                    sumPlanCell.DataType = XLCellValues.Number;

                    int? fact = grouppedActions.FirstOrDefault(x => x.Key == item.Code)?.Sum(x => x.Quantity);
                    currentDataRow.Cell("A").Value = counter++;
                    currentDataRow.Cell("F").Value = item.Name;
                    currentDataRow.Cell("G").Value = item.ItemNumber;
                    currentDataRow.Cell("L").Value = item.Price;
                    currentDataRow.Cell("N").Value = item.Code;
                    if (fact.HasValue)
                    {
                        currentDataRow.Cell("Q").Value = fact.Value;
                        if (item.Price != default(decimal))
                        {
                            currentDataRow.Cell("R").Value = fact.Value * item.Price;
                        }
                    }
                    if (item.Quantity.HasValue)
                    {
                        currentDataRow.Cell("T").Value = item.Quantity.Value;
                        if (item.Price != default(decimal))
                        {
                            currentDataRow.Cell("U").Value = item.Quantity.Value * item.Price;
                        }
                    }

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
