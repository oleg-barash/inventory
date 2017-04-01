using System.Net;
using System.Net.Sockets;
using System.ServiceProcess;

namespace Inventorization.Listener
{
    public partial class ListenerService : ServiceBase
    {
        TcpListener _listener;
        public ListenerService()
        {
            _listener = new TcpListener(new IPEndPoint(0,65847));
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            
        }

        protected override void OnStop()
        {
        }
    }
}
