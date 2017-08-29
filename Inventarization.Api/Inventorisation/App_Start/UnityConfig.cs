using Inventorization.Business.Interfaces;
using Inventorization.Data;
using Microsoft.Practices.Unity;
using NLog;
using System.Configuration;
using System.Web.Http;
using Inventorization.Data.Repositories;
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
            
            string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

            container.RegisterInstance<IActionRepository>(new ActionRepository(connectionString));
            container.RegisterInstance<ICompanyRepository>(new CompanyRepository(connectionString));
            container.RegisterInstance<IInventorizationRepository>(new InventorizationRepository(connectionString));
            container.RegisterInstance<TaskRepository>(new TaskRepository(connectionString));
            container.RegisterInstance<IZoneRepository>(new ZoneRepository(connectionString));
            container.RegisterInstance<IUsageRepository>(new UsageRepository(connectionString));
            container.RegisterInstance<UserRepository>(new UserRepository(connectionString));
            


            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}