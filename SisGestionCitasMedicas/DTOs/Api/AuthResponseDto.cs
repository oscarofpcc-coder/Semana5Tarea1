namespace SisGestionCitasMedicas.DTOs.Api;

/// <summary>
/// DTO que se envia al frontend despues de un login o registro exitoso.
/// Contiene el token JWT que el frontend debe guardar y enviar en cada peticion.
/// </summary>
public class AuthResponseDto
{
    // Token JWT generado - el frontend lo guarda en localStorage
    public string Token { get; set; } = "";

    // Fecha/hora en que el token expira (UTC)
    public DateTime Expiration { get; set; }

    // Email del usuario autenticado
    public string Email { get; set; } = "";
}
