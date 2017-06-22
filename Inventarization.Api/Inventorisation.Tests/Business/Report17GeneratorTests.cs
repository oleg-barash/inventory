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
    public class Report17GeneratorTests
    {
        [TestMethod]
        public void Report17Builds()
        {
            Report17Generator generator = new Report17Generator(@"C:\Users\BaranovO\Downloads\LAW27261_19_20170426_141522.XLSX");
            List<Item> data = new List<Item>() { new Item() {
                Code = "TEST_CODE",
                Name = "TEST_NAME"
            } };
            using (MemoryStream stream = generator.Generate(data, Enumerable.Empty<Inventorization.Business.Model.Action>().ToList()))
            {
                using (FileStream fs = File.Create(Guid.NewGuid().ToString()))
                {
                    fs.Write(stream.ToArray(), 0, (int)stream.Length);
                    fs.Close();
                }
            }
        }
    }
}
