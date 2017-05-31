using Inventorization.Api.Extensions;
using Inventorization.Business.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace Inventorization.Api.Formatters
{
    public class CsvMediaTypeFormatter : BufferedMediaTypeFormatter
    {
        public CsvMediaTypeFormatter()
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/csv"));
        }

        public override bool CanReadType(Type type)
        {
            return false;
        }

        public override bool CanWriteType(Type type)
        {
            if (type == null)
            {
                throw new ArgumentNullException("type");
            }

            // type must implement IEnumerable
            return typeof(IEnumerable).IsAssignableFrom(type);
        }

        public override void WriteToStream(
            Type type,
            object value,
            Stream writeStream,
            HttpContent content)
        {
            using (var writer = new StreamWriter(writeStream))
            {
                string csv = ((IEnumerable)value).ToCsv();
                writer.Write(csv);
            }
        }
    }
}