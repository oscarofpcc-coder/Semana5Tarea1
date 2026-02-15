using System.ComponentModel.DataAnnotations;

namespace SisGestionCitasMedicas.DTOs.Api;

/// <summary>
/// DTO que recibe los datos de registro de un nuevo usuario desde el frontend.
/// Se usa en el endpoint POST /api/auth/register
/// </summary>
public class RegisterRequestDto
{
    // Email del nuevo usuario - debe ser un email valido
    [Required, EmailAddress]
    public string Email { get; set; } = "";

    // Contraseña - minimo 6 caracteres
    [Required, MinLength(6)]
    public string Password { get; set; } = "";

    // Confirmacion de contraseña - debe coincidir con Password (validado por [Compare])
    [Required, Compare("Password")]
    public string ConfirmPassword { get; set; } = "";
}
