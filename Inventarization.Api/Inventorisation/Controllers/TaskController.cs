using Inventorization.Data;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Inventorization.Api.Controllers
{
    public class TaskController : ApiController
    {
        private TaskRepository _taskRepository;
        public TaskController(TaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public List<Business.Model.Task> GetTasks(Guid inventorizationId)
        {
            return _taskRepository.GetTasksByInventorization(inventorizationId);
        }
    }
}
