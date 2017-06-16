using Inventorization.Business.Model;
using Inventorization.Business.Reports;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorisation.Tests.Business
{
    [TestClass]
    public class Report3GeneratorTests
    {
        [TestMethod]
        public void Report3Builds()
        {
            Report3Generator generator = new Report3Generator(Directory.GetCurrentDirectory() + @"\Templates\Report3.XLSX");
            List<Item> data = new List<Item>() { new Item() {
                Code = "5515138483153",
                Name = "Телефон",
                Price = 50.5m,
                ItemNumber = "ИНВ 2017000000012",
                Quantity = 50
            } };

            List<Inventorization.Business.Model.Action> actions = new List<Inventorization.Business.Model.Action>()
            {
                new Inventorization.Business.Model.Action()
                {
                    Type = ActionType.FirstScan,
                    BarCode = "5515138483153",
                    Quantity = 20,
                },
                new Inventorization.Business.Model.Action()
                {
                    Type = ActionType.SecondScan,
                    BarCode = "5515138483153",
                    Quantity = 20,
                }

            };

            using (MemoryStream stream = generator.Generate(data, actions))
            {
                using (FileStream fs = File.Create(Guid.NewGuid().ToString() + ".xlsx"))
                {
                    fs.Write(stream.ToArray(), 0, (int)stream.Length);
                    fs.Close();
                }
            }
        }
    }
}
