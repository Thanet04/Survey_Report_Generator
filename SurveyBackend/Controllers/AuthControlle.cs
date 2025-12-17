using Microsoft.AspNetCore.Mvc;
using SurveyBackend.Models;
using SurveyBackend.Repositories;

namespace SurveyBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;

        public AuthController(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try
            {
                var id = await _userRepo.CreateUser(user);
                return Ok(new { UserId = id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var existing = await _userRepo.GetByUsername(user.Username);
            
            if (existing == null)
                return Unauthorized(new { message = "ไม่พบ Username นี้ในระบบ" });

            if (existing.Password != user.Password)
                return Unauthorized(new { message = "Password ไม่ถูกต้อง" });

            return Ok(new { message = "Login successful", userId  = existing.Id,role = existing.Role });
        }
    }
}
