using Inventorization.Api.ViewModels;
using Inventorization.Business.Domains;
using Inventorization.Business.Interfaces;
using Inventorization.Data;
using Inventorization.Data.Support;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using Inventorization.Business.Model;
using Inventorization.Data.Repositories;

namespace Inventorization.Api.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        private static readonly ILogger Logger = LogManager.GetCurrentClassLogger();
        private readonly ICompanyRepository _companyRepository;
        private readonly IUserRepository _userRepository;
        private readonly ActionDomain _actionDomain;
        private readonly IInventorizationRepository _inventorizationRepository;

        public UserController(ICompanyRepository companyRepository, IInventorizationRepository inventorizationRepository, IUserRepository userRepository, ActionDomain actionDomain)
        {
            _companyRepository = companyRepository;
            _inventorizationRepository = inventorizationRepository;
            _userRepository = userRepository;
            this._actionDomain = actionDomain;
        }


        [Route("login")]
        [HttpPost]
        public IHttpActionResult Login([FromBody] LoginModel loginInfo)
        {
            UserInfo info = new UserInfo();
            if (string.IsNullOrWhiteSpace(loginInfo.Password) || string.IsNullOrWhiteSpace(loginInfo.Username))
            {
                info.Error = "Необходимо указать логин и пароль";
                return Ok(info);
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
                    info.Companies = _companyRepository.GetCompanies();
                    if (user.Inventorization.HasValue)
                    {
                        info.DefaultInventorization =
                            _inventorizationRepository.GetInventorization(user.Inventorization.Value);
                    }
                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.Sid, user.Id.ToString()),
                        new Claim(ClaimTypes.Name,loginInfo.Username),
                        new Claim(ClaimTypes.Role, "admin")
                    };

                    Request.GetOwinContext().Authentication.SignIn(new ClaimsIdentity(claims, DefaultAuthenticationTypes.ApplicationCookie));
                    return Ok(info);
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
            return Ok(info);
        }

        [Route("logout")]
        [HttpPost]
        public IHttpActionResult Logout()
        {
            Request.GetOwinContext().Authentication.SignOut();
            return Ok();
        }

        [Route("list"), HttpGet, Authorize]
        public IHttpActionResult List()
        {
            return Ok(_userRepository.GetUsers());
        }

        [Route("info"), HttpGet, Authorize]
        public IHttpActionResult GetUser([FromUri]Guid id)
        {
            return Ok(_userRepository.GetUser(id));
        }

        [Route("info"), HttpPost, Authorize]
        public IHttpActionResult SaveUser([FromBody]User user)
        {
            try
            {
                if (user.Id == default(Guid))
                {
                    if (_userRepository.UserExists(user.Login))
                    {
                        return Ok(new { status = "validation_error", fields = new { LoginError = "Пользователь с таким логином уже существует" } });
                    }
                    var createdUser = _userRepository.CreateUser(user);
                    return Ok(new { status = "success", user = createdUser });
                }
                else
                {
                    _userRepository.UpdateUserData(user);
                    return Ok(new { status = "success", user });
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Saving user info failed");
                return Ok(new { status = "failed", message = "Произошла ошибка при сохранении инфомации о пользователе" });
            }
        }

        [Route("assign"), HttpPost, Authorize]
        public IHttpActionResult AssignUser([FromBody]User user)
        {
            try
            {
                _userRepository.Assign(user.Id, user.Inventorization);
                return Ok(new { status = "success", user = _userRepository.GetUser(user.Id) });
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Saving user info failed");
                return Ok(new { status = "failed", message = "Произошла ошибка при сохранении инфомации о пользователе" });
            }
        }

        [Route("deassign"), HttpPost, Authorize]
        public IHttpActionResult DessignUser([FromBody]User user)
        {
            try
            {
                User foundUser = _userRepository.GetUser(user.Id);
                if (foundUser == null)
                {
                    return Ok(new
                    {
                        status = "validation_error",
                        fields = new {LoginError = "Пользователь не существует"}
                    });
                }
                _userRepository.Deassign(foundUser.Id);
                return Ok(new { status = "success", user = foundUser });
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Saving user info failed");
                return Ok(new { status = "failed", message = "Произошла ошибка при сохранении инфомации о пользователе" });
            }
        }

        [Route("lastActions"), HttpGet, Authorize]
        public IHttpActionResult LastActions()
        {
            IOwinContext ctx = Request.GetOwinContext();
            ClaimsPrincipal user = ctx.Authentication.User;
            IEnumerable<Claim> claims = user.Claims;
            Guid userId = Guid.Parse(claims.Single(x => x.Type == ClaimTypes.Sid).Value);
            List<Business.Model.Action> userActions = _actionDomain.GetUsersLastActions(userId, 6);
            return Ok(userActions);
        }

        [Route("delete"), HttpPost, Authorize]
        public IHttpActionResult DeleteUser([FromBody]Business.Model.User user)
        {
            try
            {
                _userRepository.DeleteUser(user.Id);
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Deleting user failed");
                return Ok(new { status = "failed", message = "Произошла ошибка при удалении пользователя" });
            }
        }

    }
}
