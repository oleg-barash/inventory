using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Inventorization.Business.Model;

namespace Inventorization.Business.Interfaces
{
    public interface IUserRepository
    {
        User CreateUser(User user);
        void UpdateUserData(User user);
        User GetUser(Guid id);
        List<User> GetUsers();
        bool UserExists(string login);
        User GetUserByLogin(string login);
        void DeleteUser(Guid id);
        void Assign(Guid userId, Guid? inventorizationId);
        void Deassign(Guid userId);
    }
}
