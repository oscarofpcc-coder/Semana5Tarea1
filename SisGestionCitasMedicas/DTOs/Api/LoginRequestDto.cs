using System.ComponentModel.DataAnnotations;

namespace SisGestionCitasMedicas.DTOs.Api;

/// <summary>
/// DTO que recibe los datos de inicio de sesion desde el frontend.
/// Se usa en el endpoint POST /api/auth/login
/// </summary>
public class LoginRequestDto
{
    // Email del usuario - debe ser un email valido (validado por [EmailAddress])
    [Required, EmailAddress]
    public string Email { get; set; } = "";

    // Contraseña del usuario
    [Required]
    public string Password { get; set; } = "";
}
