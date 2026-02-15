using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SisGestionCitasMedicas.Data;
using SisGestionCitasMedicas.Middleware;
using SisGestionCitasMedicas.Models;
using SisGestionCitasMedicas.Services;
using SisGestionCitasMedicas.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ========================
// CONFIGURACION DE SERVICIOS
// ========================

// Conexion a la base de datos SQL Server usando la cadena "cnn" de appsettings.json
var connectionString = builder.Configuration.GetConnectionString("cnn")
    ?? throw new InvalidOperationException("Connection string 'cnn' not found.");
builder.Services.AddDbContext<HospitalDbContext>(options =>
    options.UseSqlServer(connectionString));

// Filtro para mostrar errores de migraciones en modo desarrollo
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Configuracion de Identity para autenticacion de usuarios (login/register con cookies en MVC)
// Se desactivan requisitos estrictos de password para facilitar pruebas
builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;    // No requiere confirmar email
    options.Password.RequireNonAlphanumeric = false;   // No requiere caracteres especiales
    options.Password.RequireUppercase = false;          // No requiere mayusculas
})
.AddEntityFrameworkStores<HospitalDbContext>();

// Configuracion de JWT (JSON Web Token) para autenticacion de la API REST
// Coexiste con la autenticacion por cookies de Identity (MVC usa cookies, API usa JWT)
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key not configured.");
builder.Services.AddAuthentication()
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,              // Valida que el emisor del token sea correcto
            ValidateAudience = true,            // Valida que la audiencia del token sea correcta
            ValidateLifetime = true,            // Valida que el token no haya expirado
            ValidateIssuerSigningKey = true,     // Valida la firma del token
            ValidIssuer = builder.Configuration["Jwt:Issuer"],       // Emisor permitido (desde appsettings)
            ValidAudience = builder.Configuration["Jwt:Audience"],   // Audiencia permitida (desde appsettings)
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)) // Clave secreta para firmar
        };
    });

// Politica CORS: permite que el frontend Angular (puerto 4200) consuma la API
// Sin esto, el navegador bloquea las peticiones por ser de diferente origen
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularSPA", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()    // Permite cualquier header (Authorization, Content-Type, etc.)
              .AllowAnyMethod();   // Permite cualquier metodo HTTP (GET, POST, PUT, DELETE)
    });
});

// Inyeccion de dependencias: registra los servicios de negocio para que los controladores los usen
builder.Services.AddScoped<IEmpresaService, EmpresaService>();


// Configuracion de MVC y Razor Pages
// AddJsonOptions: evita errores de referencia circular al serializar entidades con navegaciones
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddRazorPages();

var app = builder.Build();

// ========================
// PIPELINE DE MIDDLEWARE
// (El orden importa: cada middleware procesa la peticion en secuencia)
// ========================

// Captura excepciones no manejadas y las registra en el log
app.UseMiddleware<ExceptionHandlingMiddleware>();

// En desarrollo, muestra pagina de ayuda para errores de migraciones de EF Core
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}

// Redirige peticiones HTTP a HTTPS por seguridad
app.UseHttpsRedirection();

// Permite servir archivos estaticos (CSS, JS, imagenes) desde wwwroot
app.UseStaticFiles();

// Habilita el sistema de rutas
app.UseRouting();

// Aplica la politica CORS (debe ir antes de Authentication/Authorization)
app.UseCors("AngularSPA");

// Middleware de autenticacion: verifica cookies (MVC) o tokens JWT (API)
app.UseAuthentication();

// Middleware de autorizacion: verifica que el usuario tenga permisos para acceder al recurso
app.UseAuthorization();

// Mapea las rutas MVC: {controller}/{action}/{id?} con Home/Index como ruta por defecto
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

// Mapea las paginas Razor (usadas por Identity UI para login/register)
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
