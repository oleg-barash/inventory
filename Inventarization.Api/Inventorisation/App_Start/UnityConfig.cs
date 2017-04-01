using Inventorization.Data;
using Microsoft.Practices.Unity;
using System.Web.Http;
using Unity.WebApi;

namespace Inventorization.Api
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();
            
            // register all your components with the container here
            // it is NOT necessary to register your controllers
            
            string connectionString = "User ID=postgres;Password=anatole123;Host=localhost;Port=5432;Database=postgres;";

            container.RegisterInstance<ActionRepository>(new ActionRepository(connectionString));
            container.RegisterInstance<CompanyRepository>(new CompanyRepository(connectionString));
            container.RegisterInstance<InventorizationRepository>(new InventorizationRepository(connectionString));
            container.RegisterInstance<TaskRepository>(new TaskRepository(connectionString));
            container.RegisterInstance<ZoneRepository>(new ZoneRepository(connectionString));


            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}