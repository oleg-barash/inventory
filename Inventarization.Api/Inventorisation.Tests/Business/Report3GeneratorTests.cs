using Inventorization.Business.Model;
using Inventorization.Business.Reports;
using NUnit.Framework;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.NUnit3;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorisation.Tests.Business
{
    [TestFixture]
    public class Report3GeneratorTests
    {
        [Test, AutoData]
        public void Report3Builds()
        {
            Report3Generator generator = new Report3Generator(AppDomain.CurrentDomain.BaseDirectory + @"\Templates\Report3.XLSX");
            Fixture itemsFixture = new Fixture();
            List<Item> data = itemsFixture.CreateMany<Item>(10000).ToList();
            List<Inventorization.Business.Model.Action> actions = data.SelectMany(x =>
            {
                var itemActions = itemsFixture.CreateMany<Inventorization.Business.Model.Action>(50).ToList();
                return itemActions.Select(i => { i.BarCode = x.Code; i.Quantity = 1; return i; });
            }).ToList();

            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            using (MemoryStream stream = generator.Generate(data, actions))
            {
                using (FileStream fs = File.Create(AppDomain.CurrentDomain.BaseDirectory + "\\" + Guid.NewGuid().ToString() + ".xlsx"))
                {
                    fs.Write(stream.ToArray(), 0, (int)stream.Length);
                    fs.Close();
                }
            }

            stopWatch.Stop();
            TimeSpan ts = stopWatch.Elapsed;

            string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}", ts.Hours, ts.Minutes, ts.Seconds, ts.Milliseconds / 10);
            Console.WriteLine("RunTime " + elapsedTime);

        }
    }
}
