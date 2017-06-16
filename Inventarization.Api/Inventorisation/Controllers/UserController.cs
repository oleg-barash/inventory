using Inventorization.Api.Models;
using Inventorization.Business.Model;
using Inventorization.Data;
using Inventorization.Data.Support;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Inventorization.Api.ViewModels;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Collections.Generic;
using Inventorization.Business.Interfaces;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Text;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {

        private ICompanyRepository _companyRepository;
        private UserRepository _userRepository;
        private IInventorizationRepository _inventorizationRepository;

        public UserController(ICompanyRepository companyRepository, IInventorizationRepository inventorizationRepository, UserRepository userRepository)
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
            if (string.IsNullOrWhiteSpace(loginInfo.Password) || string.IsNullOrWhiteSpace(loginInfo.Username))
            {
                info.Error = "Необходимо указать логин и пароль";
                return Request.CreateResponse(HttpStatusCode.OK, info);
            }
            try
            {
                Business.Model.User user = _userRepository.GetUserByLogin(loginInfo.Username);
                if (user.Password == loginInfo.Password)
                {
                    info.IsAuthorized = true;
                    info.FullName = $"{user.FirstName} {user.FamilyName}";
                    info.Username = user.Login;
                    info.Password = user.Password;
                    info.Token = "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(user.Login + ":" +user.Password));
                    info.Inventorizations = _inventorizationRepository.GetInventorizations();
                    info.DefaultInventorization = info.Inventorizations.First();

                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.Sid, user.Id.ToString()),
                        new Claim(ClaimTypes.Name,loginInfo.Username),
                        new Claim(ClaimTypes.Role, "admin")
                    };

                    Request.GetOwinContext().Authentication.SignIn(new ClaimsIdentity(claims, DefaultAuthenticationTypes.ApplicationCookie));
                    return Request.CreateResponse(HttpStatusCode.OK, info);
                }
                info.Error = "Неверно указан логин или пароль";
            }
            catch (UserLoadingException ex)
            {
                info.Error = $"Пользователь не найден. {ex.Message}";
            }
            catch (Exception ex)
            {
                info.Error = $"Произошла непредвиденная ошибка. {ex.Message}";
            }
            return Request.CreateResponse(HttpStatusCode.OK, info);
        }

        [Route("logout")]
        [HttpPost]
        public HttpResponseMessage Logout()
        {
            Request.GetOwinContext().Authentication.SignOut();
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("list"), HttpGet, Authorize]
        public HttpResponseMessage List()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _userRepository.GetUsers());
        }

    }
}
