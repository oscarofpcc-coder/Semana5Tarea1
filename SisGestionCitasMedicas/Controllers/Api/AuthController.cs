using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SisGestionCitasMedicas.DTOs.Api;
using SisGestionCitasMedicas.Models;

namespace SisGestionCitasMedicas.Controllers.Api;

/// <summary>
/// Controlador API para autenticacion (login y registro).
/// Genera tokens JWT que el frontend Angular usa para acceder a los endpoints protegidos.
/// Ruta base: /api/auth
/// </summary>
[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    // UserManager de Identity: permite buscar usuarios, verificar contraseñas y crear cuentas
    private readonly UserManager<ApplicationUser> _userManager;

    // IConfiguration: accede a la configuracion de appsettings.json (claves JWT, etc.)
    private readonly IConfiguration _configuration;

    // Logger para registrar eventos de autenticacion en el log del servidor
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// POST /api/auth/login
    /// Recibe email y password, valida las credenciales y devuelve un token JWT si son correctas.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login(LoginRequestDto dto)
    {
        // Busca el usuario por email en la base de datos
        var user = await _userManager.FindByEmailAsync(dto.Email);

        // Si no existe o la contraseña es incorrecta, retorna 401 Unauthorized
        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            _logger.LogWarning("Login fallido para {Email}", dto.Email);
            return Unauthorized(ApiResponse<AuthResponseDto>.Fail("Credenciales inválidas."));
        }

        // Credenciales validas: genera el token JWT y lo retorna al frontend
        var token = GenerateJwtToken(user);
        _logger.LogInformation("Login exitoso para {Email}", dto.Email);

        return Ok(ApiResponse<AuthResponseDto>.Ok(new AuthResponseDto
        {
            Token = token.Token,
            Expiration = token.Expiration,
            Email = user.Email!
        }));
    }

    /// <summary>
    /// POST /api/auth/register
    /// Recibe email, password y confirmPassword. Crea un nuevo usuario en la BD
    /// y devuelve un token JWT para que quede autenticado automaticamente.
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register(RegisterRequestDto dto)
    {
        // Crea la entidad de usuario con el email como nombre de usuario
        var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };

        // Intenta crear el usuario en la BD (Identity se encarga de hashear la contraseña)
        var result = await _userManager.CreateAsync(user, dto.Password);

        // Si falla (ej: email duplicado, contraseña muy corta), retorna los errores
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToArray();
            _logger.LogWarning("Registro fallido para {Email}: {Errors}", dto.Email, string.Join(", ", errors));
            return BadRequest(ApiResponse<AuthResponseDto>.Fail("Error en el registro.", errors));
        }

        // Registro exitoso: genera token JWT y lo retorna (el usuario queda logueado)
        var token = GenerateJwtToken(user);
        _logger.LogInformation("Registro exitoso para {Email}", dto.Email);

        return Ok(ApiResponse<AuthResponseDto>.Ok(new AuthResponseDto
        {
            Token = token.Token,
            Expiration = token.Expiration,
            Email = user.Email!
        }));
    }

    /// <summary>
    /// Genera un token JWT firmado con la clave secreta de appsettings.json.
    /// El token contiene el ID del usuario, su email y un identificador unico (JTI).
    /// El frontend debe enviar este token en el header "Authorization: Bearer {token}" en cada peticion.
    /// </summary>
    private (string Token, DateTime Expiration) GenerateJwtToken(ApplicationUser user)
    {
        // Claims: datos que se incluyen dentro del token (el frontend puede leerlos)
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),           // ID del usuario
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),     // Email del usuario
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID unico del token
        };

        // Crea la clave de firma usando la clave secreta de appsettings.json
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Lee el tiempo de expiracion desde appsettings.json (por defecto 60 minutos)
        var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"] ?? "60");
        var expiration = DateTime.UtcNow.AddMinutes(expireMinutes);

        // Construye el token con todos los parametros
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],        // Quien emite el token
            audience: _configuration["Jwt:Audience"],    // Para quien es el token
            claims: claims,                               // Datos dentro del token
            expires: expiration,                          // Cuando expira
            signingCredentials: creds);                   // Firma digital

        // Serializa el token a string y retorna junto con la fecha de expiracion
        return (new JwtSecurityTokenHandler().WriteToken(token), expiration);
    }
}
