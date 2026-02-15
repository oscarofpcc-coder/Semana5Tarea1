namespace SisGestionCitasMedicas.DTOs.Api;

/// <summary>
/// Envoltorio generico para todas las respuestas de la API.
/// Estandariza el formato de respuesta: siempre incluye si fue exitoso, un mensaje y los datos.
/// Ejemplo de uso: ApiResponse&lt;AuthResponseDto&gt;.Ok(datos) o ApiResponse&lt;T&gt;.Fail("error")
/// </summary>
public class ApiResponse<T>
{
    // Indica si la operacion fue exitosa (true) o fallo (false)
    public bool Success { get; set; }

    // Mensaje descriptivo del resultado (ej: "Credenciales invalidas")
    public string Message { get; set; } = "";

    // Datos de la respuesta (generico: puede ser AuthResponseDto, Empresa, List<Empresa>, etc.)
    public T? Data { get; set; }

    // Lista de errores de validacion (ej: errores de Identity al registrar)
    public string[] Errors { get; set; } = [];

    // Metodo de ayuda para crear una respuesta exitosa con datos
    public static ApiResponse<T> Ok(T data, string message = "")
        => new() { Success = true, Data = data, Message = message };

    // Metodo de ayuda para crear una respuesta de error con mensaje y errores opcionales
    public static ApiResponse<T> Fail(string message, params string[] errors)
        => new() { Success = false, Message = message, Errors = errors };
}
