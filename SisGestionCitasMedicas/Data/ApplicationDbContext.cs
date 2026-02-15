using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SisGestionCitasMedicas.Models;

namespace SisGestionCitasMedicas.Data
{
    /// <summary>
    /// CONTEXTO DE BASE DE DATOS - ENTITY FRAMEWORK CORE
    /// ====================================================
    /// Esta clase es el PUENTE entre la aplicacion C# y la base de datos SQL Server.
    /// Entity Framework Core (EF Core) es un ORM (Object-Relational Mapper) que permite
    /// trabajar con tablas de la BD como si fueran objetos de C#, sin escribir SQL manualmente.
    ///
    /// Herencia: IdentityDbContext<ApplicationUser>
    /// - Hereda de IdentityDbContext en lugar de DbContext normal para el inicio de sesión .
    /// - IdentityDbContext agrega automaticamente las tablas que ASP.NET Identity necesita:
    ///   AspNetUsers, AspNetRoles, AspNetUserRoles, AspNetUserClaims, etc.
    /// - El tipo generico <ApplicationUser> indica que nuestra tabla de usuarios
    ///   usa el modelo ApplicationUser (que extiende IdentityUser con campos personalizados).
    ///
    /// Registro en Program.cs:
    ///   builder.Services.AddDbContext<HospitalDbContext>(options =>
    ///       options.UseSqlServer(connectionString));
    /// Esto permite inyectar HospitalDbContext en cualquier servicio o controlador.
    ///
    /// Base de datos: cob_hospital (configurada en appsettings.json)
    /// </summary>
    public class HospitalDbContext : IdentityDbContext<ApplicationUser>
    {
        /// <summary>
        /// Constructor - Recibe las opciones de configuracion del DbContext.
        /// ASP.NET Core inyecta automaticamente estas opciones, que incluyen:
        /// - La cadena de conexion a SQL Server (definida en appsettings.json)
        /// - El proveedor de base de datos (SQL Server en este caso)
        ///
        /// ": base(options)" pasa las opciones al constructor padre (IdentityDbContext)
        /// para que EF Core configure la conexion correctamente.
        /// </summary>
        /// <param name="options">Opciones con la cadena de conexion y configuracion del proveedor</param>
        public HospitalDbContext(DbContextOptions<HospitalDbContext> options) : base(options) { }

        /// <summary>
        /// TABLA EMPRESAS
        /// DbSet<Empresa> representa la tabla "Empresas" en SQL Server.
        /// Cada propiedad DbSet corresponde a una tabla en la base de datos.
        ///
        /// "=> Set<Empresa>()" es una forma abreviada de inicializar el DbSet.
        /// Equivale a: public DbSet<Empresa> Empresas { get; set; }
        ///
        /// Uso en servicios:
        ///   _context.Empresas.ToListAsync()    → SELECT * FROM Empresas
        ///   _context.Empresas.FindAsync(id)    → SELECT * FROM Empresas WHERE EmpresaId = @id
        ///   _context.Empresas.Add(empresa)     → INSERT INTO Empresas (...)
        ///   _context.Empresas.Update(empresa)  → UPDATE Empresas SET ... WHERE EmpresaId = @id
        ///   _context.Empresas.Remove(empresa)  → DELETE FROM Empresas WHERE EmpresaId = @id
        /// </summary>
        public DbSet<Empresa> Empresas => Set<Empresa>();

        /// <summary>
        /// CONFIGURACION DEL MODELO (Fluent API)
        /// =======================================
        /// Este metodo se ejecuta UNA VEZ cuando EF Core crea el modelo en memoria.
        /// Permite configurar relaciones, restricciones, indices y nombres de tablas
        /// usando la Fluent API (alternativa a las DataAnnotations como [Required], [MaxLength]).
        ///
        /// base.OnModelCreating(modelBuilder):
        /// - OBLIGATORIO llamar al metodo base cuando se hereda de IdentityDbContext.
        /// - Configura las tablas de Identity (AspNetUsers, AspNetRoles, etc.)
        ///   con sus claves primarias, indices y relaciones.
        /// - Si no se llama a base, Identity no funcionara correctamente.
        ///
        /// Aqui se pueden agregar configuraciones adicionales como:
        ///   modelBuilder.Entity<Empresa>().HasIndex(e => e.CedRuc).IsUnique();
        ///   modelBuilder.Entity<Empresa>().Property(e => e.RazonSocial).HasMaxLength(200);
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configura las tablas de ASP.NET Identity (usuarios, roles, claims, etc.)
            base.OnModelCreating(modelBuilder);

            // Aqui se pueden agregar configuraciones adicionales con Fluent API
        }
    }
}
