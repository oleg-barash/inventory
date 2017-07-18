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
        private const int firstDataRowIndex = 4;
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
        public override MemoryStream Generate(List<Item> items, List<Model.Action> actions, List<Rests> rests)
        {
            using (XLWorkbook book = new XLWorkbook(pathToTemplate))
            {
                IXLWorksheet worksheet = book.Worksheets.Skip(1).First();
                IEnumerable<IXLRow> dataRows = worksheet.Rows().Where(r => r.RowNumber() >= firstDataRowIndex);
                dataRows.ForEach(dr => dr.Delete());
                IXLRow currentDataRow = GetFirstDataRow(worksheet.Rows());
                currentDataRow.InsertRowsBelow(items.Count);
                IEnumerable<IGrouping<string, Model.Action>> grouppedActions = actions.GroupBy(x => x.BarCode);

                int counter = 1;
                var bunches = BuildBunches(items);
                var lastBunch = bunches.Last();
                foreach (var bunch in bunches)
                {
                    var firstRowInBunch = currentDataRow;
                    foreach (Item item in bunch)
                    {
                        long? quantity = grouppedActions.FirstOrDefault(x => x.Key == item.Code)?.Sum(x => x.Quantity);
                        Rests itemRests = rests.FirstOrDefault(x => x.Code == item.Code);
                        SetRowData(worksheet, currentDataRow, item, itemRests, quantity, counter++);
                        currentDataRow = currentDataRow.RowBelow();
                    }
                    var restsInBunch = rests.Where(x => bunch.Any(b => b.Code == x.Code));
                    currentDataRow = SetSummary(worksheet, currentDataRow, bunch, restsInBunch, grouppedActions);
                    if (bunch != lastBunch) {
                        currentDataRow.AddHorizontalPageBreak();
                        currentDataRow = currentDataRow.RowBelow();
                    }
                    worksheet.PageSetup.PrintAreas.Add(firstRowInBunch.Cell("A").Address, currentDataRow.Cell("X").Address);
                }
                currentDataRow = SetSummary(worksheet, currentDataRow, items, rests, grouppedActions);
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

        public IEnumerable<IEnumerable<Item>> BuildBunches(List<Item> items)
        {
            var firstPageSize = 30;
            var pageSize = 35;
            yield return items.Take(firstPageSize);
            if (items.Count() > firstPageSize)
            {
                var rest = items.Skip(firstPageSize);
                for (int i = 0; i < rest.Count() / pageSize; i++)
                {
                    yield return rest.Skip(i * pageSize).Take(pageSize);
                }
            }
        }

        private void SetRowData(IXLWorksheet worksheet, IXLRow row, Item item, Rests rests, long? quantity, int index)
        {
            var numberCell = worksheet.Range(row.Cell("A"), row.Cell("B")).Merge(false);
            numberCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var billCell = worksheet.Range(row.Cell("C"), row.Cell("E")).Merge(false);
            billCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var nameCell = row.Cell("F");
            nameCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var itemNumberCell = worksheet.Range(row.Cell("G"), row.Cell("H")).Merge(false);
            itemNumberCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            row.Cell("I").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            worksheet.Range(row.Cell("J"), row.Cell("K")).Merge(false).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var priceCell = worksheet.Range(row.Cell("L"), row.Cell("M")).Merge(false);
            priceCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            priceCell.DataType = XLCellValues.Number;

            var inventNumberCell = row.Cell("N");
            inventNumberCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            worksheet.Range(row.Cell("O"), row.Cell("P")).Merge(false).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var countFactCell = row.Cell("Q");
            countFactCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var sumFactCell = worksheet.Range(row.Cell("R"), row.Cell("S")).Merge(false);
            sumFactCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            sumFactCell.Style.NumberFormat.Format = "# ### ### ₽";
            sumFactCell.DataType = XLCellValues.Number;

            var countPlanCell = row.Cell("T");
            countPlanCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            var sumPlanCell = worksheet.Range(row.Cell("U"), row.Cell("W")).Merge(false);
            sumPlanCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            sumPlanCell.Style.NumberFormat.Format = "# ### ### ₽";
            sumPlanCell.DataType = XLCellValues.Number;

            long? fact = quantity;
            numberCell.Value = index++;
            nameCell.Value = item.Name;
            itemNumberCell.Value = item.ItemNumber;
            if (item.Price > default(decimal))
            {
                priceCell.Style.NumberFormat.Format = "# ### ### ₽";
                priceCell.Value = item.Price;
            }
            inventNumberCell.Value = item.Code;
            if (fact.HasValue)
            {
                countFactCell.Value = fact.Value;
                if (item.Price != default(decimal))
                {
                    sumFactCell.FormulaA1 = $"=Q{countFactCell.Address.RowNumber} * L{countFactCell.Address.RowNumber}";
                }
            }
            countPlanCell.Value = rests?.Count;
            if (rests.Price != default(decimal))
            {
                sumPlanCell.FormulaA1 = $"=T{countPlanCell.Address.RowNumber} * L{countPlanCell.Address.RowNumber}";
            }
        }

        private IXLRow SetSummary(IXLWorksheet worksheet, IXLRow row, IEnumerable<Item> items, IEnumerable<Rests> rests, IEnumerable<IGrouping<string, Model.Action>> actions)
        {

            var currentActions = actions.Where(x => items.Any(i => i.Code == x.Key)).SelectMany(x => x);

            var totalLabelCell = row.Cell("O");
            totalLabelCell.Value = "Итого";

            var factNumberCell = row.Cell("Q");
            factNumberCell.FormulaA1 = $"=SUM(Q{row.Cell("Q").Address.RowNumber - items.Count()}:Q{row.Cell("Q").Address.RowNumber - 1 })";
            factNumberCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var factSumCell = worksheet.Range(row.Cell("R"), row.Cell("S")).Merge(false);
            factSumCell.FormulaA1 = $"=SUM(R{row.Cell("R").Address.RowNumber - items.Count()}:R{row.Cell("R").Address.RowNumber - 1 })";
            factSumCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var planNumberCell = row.Cell("T");
            planNumberCell.Value = rests.Sum(x => x.Count);
            planNumberCell.FormulaA1 = $"=SUM(T{row.Cell("T").Address.RowNumber - items.Count()}:T{row.Cell("T").Address.RowNumber - 1 })";
            planNumberCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            var planSumCell = worksheet.Range(row.Cell("U"), row.Cell("W")).Merge(false);
            planSumCell.FormulaA1 = $"=SUM(U{row.Cell("U").Address.RowNumber - items.Count()}:U{row.Cell("U").Address.RowNumber - 1 })";
            planSumCell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

            return row.RowBelow(2);
        }

    }
}
