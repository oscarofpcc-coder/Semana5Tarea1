namespace SisGestionCitasMedicas.Middleware
{
    /// <summary>
    /// Middleware global para manejo de excepciones.
    /// Captura cualquier error no controlado que ocurra en la aplicacion (en controladores, servicios, etc.)
    /// y lo registra en el log del servidor, evitando que el usuario vea una pantalla de error tecnico.
    ///
    /// Se registra en Program.cs con: app.UseMiddleware&lt;ExceptionHandlingMiddleware&gt;()
    /// Debe ir al inicio del pipeline para capturar errores de todos los middlewares que vienen despues.
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        // _next: referencia al siguiente middleware en el pipeline (ASP.NET los ejecuta en cadena)
        private readonly RequestDelegate _next;

        // Logger para registrar los errores en el log del servidor (consola, archivo, etc.)
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        // Constructor: ASP.NET Core inyecta automaticamente el next y el logger
        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// Metodo que se ejecuta en cada peticion HTTP.
        /// Envuelve toda la ejecucion en un try-catch para capturar excepciones no manejadas.
        /// </summary>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Pasa la peticion al siguiente middleware (controladores, autenticacion, etc.)
                // Si todo va bien, la respuesta se envia normalmente al cliente
                await _next(context);
            }
            catch (Exception ex)
            {
                // Si ocurre una excepcion no controlada, la registra en el log
                // con el metodo HTTP (GET, POST, etc.) y la ruta que causo el error
                _logger.LogError(ex, "Excepcion no controlada: {Method} {Path}",
                    context.Request.Method, context.Request.Path);

                // Verifica que la respuesta no haya empezado a enviarse al cliente
                // (si ya empezo, no se puede modificar el status code ni redirigir)
                if (!context.Response.HasStarted)
                {
                    // Establece el codigo de error 500 (Error Interno del Servidor)
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                    // Redirige al usuario a la pagina de error amigable
                    context.Response.Redirect("/Home/Error");
                }
            }
        }
    }
}
