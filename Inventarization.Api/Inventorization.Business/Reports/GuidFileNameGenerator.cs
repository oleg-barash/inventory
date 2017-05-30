using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventorization.Business.Reports
{
    public class GuidFileNameGenerator : IFileNameGenerator
    {
        public string GenerateName()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
