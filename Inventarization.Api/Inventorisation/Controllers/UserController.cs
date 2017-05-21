using Inventorization.Api.Models;
using Inventorization.Business.Model;
using Inventorization.Data;
using Inventorization.Data.Support;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {

        private CompanyRepository _companyRepository;
        private UserRepository _userRepository;
        private InventorizationRepository _inventorizationRepository;

        public UserController(CompanyRepository companyRepository, InventorizationRepository inventorizationRepository, UserRepository userRepository)
        {
            _companyRepository = companyRepository;
            _inventorizationRepository = inventorizationRepository;
            _userRepository = userRepository;
        }


        [Route("login")]
        [HttpPost]
        public HttpResponseMessage Login([FromBody] LoginModel loginInfo)
        {
            UserInfo info = new UserInfo();
            info.IsAuthorized = false;
            if (string.IsNullOrWhiteSpace(loginInfo.Password) 
                || string.IsNullOrWhiteSpace(loginInfo.Username))
            {
                info.Error = "Необходимо указать логин и пароль";
                return Request.CreateResponse(HttpStatusCode.OK, info);
            }
            try
            {
                User user = _userRepository.GetUserByLogin(loginInfo.Username);
                if (user.Password == loginInfo.Password)
                {
                    info.IsAuthorized = true;
                    info.FullName = $"{user.FirstName} {user.FamilyName}";
                    info.Inventorizations = _inventorizationRepository.GetInventorizations();
                    return Request.CreateResponse(HttpStatusCode.OK, info);
                }
                info.Error = "Неверно указан логин или пароль";
            }
            catch (UserLoadingException ex)
            {
                info.Error = "Неверно указан логин или пароль";
            }
            catch (Exception ex)
            {
                info.Error = $"Произошла непредвиденная ошибка";
            }
            return Request.CreateResponse(HttpStatusCode.OK, info);
        }
    }
}
