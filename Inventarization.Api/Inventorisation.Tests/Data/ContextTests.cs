using Inventorization.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Inventorization.Business.Model;

namespace Inventorization.Tests.Data
{
    [TestClass]
    public class ContextTests
    {

        private static string connectionString = "User ID=postgres;Password=anatole123;Host=localhost;Port=5432;Database=postgres;";
        UserRepository userRepositoriy = new UserRepository(connectionString);
        CompanyRepository companyRepositoriy = new CompanyRepository(connectionString);
        InventorizationRepository inventorizationRepositoriy = new InventorizationRepository(connectionString);
        ActionRepository actionRepository = new ActionRepository(connectionString);
        ZoneRepository zoneRepository = new ZoneRepository(connectionString);
        TaskRepository taskRepository = new TaskRepository(connectionString);

        [TestMethod]
        public void ActionsByInventarizationsWorks()
        {
//            DELETE FROM public."Tasks";
//DELETE FROM public."Users";
//DELETE FROM public."Actions";
//DELETE FROM public."Zones";
//DELETE FROM public."Inventorizations";
//DELETE FROM public."Companies"

            User user = userRepositoriy.CreateUser(new User() { FirstName = "test_name", FamilyName = "test_family", MiddleName = "test_middlename", Level = UserLevel.Scaner, CreatedAt = DateTime.UtcNow, Login = "test", Password = "test" });
            Company company = companyRepositoriy.CreateCompany("Тест1");
            Business.Model.Inventorization inventarisation = inventorizationRepositoriy.CreateInventorization(company.Id, DateTime.UtcNow);
            Guid firstActionId = Guid.NewGuid();
            Guid secondActionId = Guid.NewGuid();

            Business.Model.Action firstAction = new Business.Model.Action()
            {
                Id = firstActionId,
                DateTime = DateTime.UtcNow,
                Type = ActionType.FirstScan,
                UserId = user.Id,
                Inventorization = inventarisation.Id,
                BarCode = "1",
                Quantity = 1,
            };

            Business.Model.Action secondAction = new Business.Model.Action()
            {
                Id = firstActionId,
                DateTime = DateTime.UtcNow,
                Type = ActionType.FirstScan,
                UserId = user.Id,
                Zone = inventarisation.Id,
                BarCode = "1",
                Quantity = 1,
            };

            actionRepository.CreateAction(firstAction);
            actionRepository.CreateAction(secondAction);
            List<Business.Model.Action> actions = actionRepository.GetActionsByInventorization(inventarisation.Id);

            Assert.IsNotNull(actions);
            Assert.AreEqual(2, actions.Count());

            actionRepository.DeleteAction(firstActionId);
            actionRepository.DeleteAction(secondActionId);
            inventorizationRepositoriy.DeleteInventorization(inventarisation.Id);
            companyRepositoriy.DeleteCompany(company.Id);
            userRepositoriy.DeleteUser(user.Id);

        }


        [TestMethod]
        public void ZoneCreatingWorks()
        {
            Company company = companyRepositoriy.CreateCompany("Тест1");
            Business.Model.Inventorization inventarisation = inventorizationRepositoriy.CreateInventorization(company.Id, DateTime.UtcNow);
            Guid firstZoneId = Guid.NewGuid();
            Zone firstZone = new Zone()
            {
                Id = firstZoneId,
                Name = "тестовая зона 1"
            };
            zoneRepository.Create(firstZone);
            List<Zone> zones = zoneRepository.GetZones(new Guid[] { firstZoneId });

            Assert.IsNotNull(zones);
            Assert.AreEqual(1, zones.Count());

            zoneRepository.DeleteZone(firstZoneId);
            inventorizationRepositoriy.DeleteInventorization(inventarisation.Id);
            companyRepositoriy.DeleteCompany(company.Id);

        }

        [TestMethod]
        public void TaskCreatingWorks()
        {
            Guid userGuid = Guid.NewGuid();
            Guid managerGuid = Guid.NewGuid();
            User user = userRepositoriy.CreateUser(new User() { Id = userGuid, FirstName = "test_name", FamilyName = "test_family", MiddleName = "test_middlename", Level = UserLevel.Scaner, CreatedAt = DateTime.UtcNow, Login = "test", Password = "test" });
            User manager = userRepositoriy.CreateUser(new User() { Id = userGuid, FirstName = "test_manager_name", FamilyName = "test_manager_family", MiddleName = "test_manager_middlename", Level = UserLevel.Scaner, CreatedAt = DateTime.UtcNow, Login = "manager_test", Password = "test" });

            Company company = companyRepositoriy.CreateCompany("Тест1");
            Business.Model.Inventorization inventarisation = inventorizationRepositoriy.CreateInventorization(company.Id, DateTime.UtcNow);
            Guid firstTaskId = Guid.NewGuid();
            taskRepository.CreateTask(firstTaskId, managerGuid, userGuid, inventarisation.Id);

            List<Business.Model.Task> tasks = taskRepository.GetTasks(userGuid, inventarisation.Id);

            Assert.IsNotNull(tasks);
            Assert.AreEqual(1, tasks.Count());

            taskRepository.DeleteTask(firstTaskId);
            inventorizationRepositoriy.DeleteInventorization(inventarisation.Id);
            companyRepositoriy.DeleteCompany(company.Id);

        }

        [TestMethod]
        public void TaskZoneAssigningWorks()
        {
            User user = userRepositoriy.CreateUser(new User() { FirstName = "test_name", FamilyName = "test_family", MiddleName = "test_middlename", Level = UserLevel.Scaner, CreatedAt = DateTime.UtcNow, Login = "test", Password = "test" });
            User manager = userRepositoriy.CreateUser(new User() { FirstName = "test_manager_name", FamilyName = "test_manager_family", MiddleName = "test_manager_middlename", Level = UserLevel.Scaner, CreatedAt = DateTime.UtcNow, Login = "manager_test", Password = "test" });

            Company company = companyRepositoriy.CreateCompany("Тест1");
            Business.Model.Inventorization inventarisation = inventorizationRepositoriy.CreateInventorization(company.Id, DateTime.UtcNow);
            Guid firstZoneId = Guid.NewGuid();
            Zone firstZone = new Zone()
            {
                Id = firstZoneId,
                Name = "тестовая зона 1"
            };
            zoneRepository.Create(firstZone);
            Guid firstTaskId = Guid.NewGuid();
            taskRepository.CreateTask(firstTaskId, manager.Id, user.Id, inventarisation.Id);

            Business.Model.Task task = taskRepository.GetTask(firstTaskId);
            Assert.AreEqual(0, task.ZoneIds.Length);

            taskRepository.AddZone(firstTaskId, firstZoneId);

            task = taskRepository.GetTask(firstTaskId);

            Assert.IsNotNull(task);
            Assert.AreEqual(1, task.ZoneIds.Count());

            taskRepository.DeleteTask(firstTaskId);
            zoneRepository.DeleteZone(firstZoneId);
            inventorizationRepositoriy.DeleteInventorization(inventarisation.Id);
            companyRepositoriy.DeleteCompany(company.Id);
        }


    }
}
