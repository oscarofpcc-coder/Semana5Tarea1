using Microsoft.EntityFrameworkCore;
using SisGestionCitasMedicas.Data;
using SisGestionCitasMedicas.Models;
using SisGestionCitasMedicas.Services.Interfaces;

namespace SisGestionCitasMedicas.Services
{
    /// <summary>
    /// SERVICIO DE EMPRESAS - CAPA DE LOGICA DE NEGOCIO
    /// ==================================================
    /// Implementa las operaciones CRUD para la entidad Empresa.
    ///
    /// Arquitectura en capas:
    ///   Controlador (recibe peticion HTTP)
    ///       ↓ llama a
    ///   Servicio (logica de negocio) ← ESTAMOS AQUI
    ///       ↓ usa
    ///   DbContext (acceso a base de datos)
    ///
    /// ¿Por que separar en servicio?
    /// - El controlador NO debe acceder directamente a la base de datos.
    /// - Si mañana hay reglas de negocio (ej: "no permitir empresas duplicadas"),
    ///   se agregan aqui sin tocar el controlador.
    /// - Tanto el controlador MVC (EmpresasController) como el API
    ///   (EmpresasApiController) pueden reutilizar este mismo servicio.
    ///
    /// Inyeccion de dependencias:
    /// - HospitalDbContext: acceso a la base de datos via Entity Framework Core.
    /// - ILogger: registra eventos importantes (crear, actualizar, eliminar).
    ///   Los logs ayudan a diagnosticar problemas en produccion.
    /// </summary>
    public class EmpresaService : IEmpresaService
    {
        // _context: Conexion a la base de datos (Entity Framework Core)
        // readonly: solo se puede asignar en el constructor, no se puede cambiar despues
        private readonly HospitalDbContext _context;

        // _logger: Registra mensajes en consola/archivo para monitoreo y depuracion
        private readonly ILogger<EmpresaService> _logger;

        /// <summary>
        /// Constructor - ASP.NET Core inyecta automaticamente las dependencias.
        /// Esto se configura en Program.cs con:
        ///   builder.Services.AddScoped(IEmpresaService, EmpresaService)
        /// </summary>
        /// <param name="context">DbContext para acceder a la tabla Empresas</param>
        /// <param name="logger">Logger para registrar eventos del servicio</param>
        public EmpresaService(HospitalDbContext context, ILogger<EmpresaService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// OBTENER TODAS LAS EMPRESAS
        /// Ejecuta: SELECT * FROM Empresas
        /// ToListAsync() convierte el resultado de la consulta en una lista en memoria.
        /// Es async porque espera la respuesta de SQL Server sin bloquear el hilo.
        /// </summary>
        public async Task<List<Empresa>> GetAllAsync()
        {
            return await _context.Empresas.ToListAsync();
        }

        /// <summary>
        /// OBTENER UNA EMPRESA POR ID
        /// Ejecuta: SELECT TOP 1 * FROM Empresas WHERE EmpresaId = @id
        /// FirstOrDefaultAsync: retorna el primer registro que coincida,
        /// o null si no encuentra ninguno (por eso el tipo de retorno es Empresa?).
        /// La expresion lambda "e => e.EmpresaId == id" es el filtro WHERE.
        /// </summary>
        public async Task<Empresa?> GetByIdAsync(int id)
        {
            return await _context.Empresas.FirstOrDefaultAsync(e => e.EmpresaId == id);
        }

        /// <summary>
        /// CREAR UNA NUEVA EMPRESA
        /// 1. Add(): marca la entidad como "nueva" en el rastreador de cambios de EF Core
        ///    (aun NO la guarda en la base de datos).
        /// 2. SaveChangesAsync(): ejecuta el INSERT INTO en SQL Server y confirma la transaccion.
        ///    Despues de guardar, EF Core asigna automaticamente el EmpresaId generado por la BD.
        /// 3. LogInformation(): registra un mensaje estructurado con el ID y nombre de la empresa creada.
        ///    Los placeholders {EmpresaId} y {RazonSocial} permiten buscar y filtrar logs facilmente.
        /// </summary>
        public async Task CreateAsync(Empresa empresa)
        {
            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Empresa creada con ID {EmpresaId}: {RazonSocial}", empresa.EmpresaId, empresa.RazonSocial);
        }

        /// <summary>
        /// ACTUALIZAR UNA EMPRESA EXISTENTE
        /// 1. Update(): marca TODOS los campos de la entidad como "modificados".
        ///    EF Core generara un UPDATE SET para cada columna.
        /// 2. SaveChangesAsync(): ejecuta el UPDATE en SQL Server.
        /// 3. Registra en el log que la empresa fue actualizada.
        ///
        /// Nota: El controlador debe verificar que la empresa existe antes de llamar a este metodo.
        /// </summary>
        public async Task UpdateAsync(Empresa empresa)
        {
            _context.Empresas.Update(empresa);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Empresa actualizada con ID {EmpresaId}", empresa.EmpresaId);
        }

        /// <summary>
        /// ELIMINAR UNA EMPRESA POR ID
        /// 1. FindAsync(): busca la empresa por su clave primaria (mas eficiente que FirstOrDefault
        ///    porque primero revisa la cache del DbContext antes de ir a la BD).
        /// 2. Si no existe, retorna false (el controlador respondera 404 Not Found).
        /// 3. Remove(): marca la entidad para eliminacion.
        /// 4. SaveChangesAsync(): ejecuta DELETE FROM Empresas WHERE EmpresaId = @id.
        /// 5. Retorna true indicando que la eliminacion fue exitosa.
        /// </summary>
        public async Task<bool> DeleteAsync(int id)
        {
            // FindAsync busca primero en la cache local del DbContext, luego en la BD
            Empresa? empresa = await _context.Empresas.FindAsync(id);

            // Si no se encontro la empresa, retorna false (no se puede eliminar algo que no existe)
            if (empresa == null) return false;

            // Marca la entidad para eliminacion y ejecuta el DELETE en la BD
            _context.Empresas.Remove(empresa);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Empresa eliminada con ID {EmpresaId}", id);
            return true;
        }

        /// <summary>
        /// VERIFICAR SI UNA EMPRESA EXISTE
        /// Ejecuta: SELECT CASE WHEN EXISTS(SELECT 1 FROM Empresas WHERE EmpresaId = @id) THEN 1 ELSE 0 END
        /// AnyAsync() es mas eficiente que GetByIdAsync() cuando solo necesitas saber SI existe,
        /// porque no trae todos los campos de la fila, solo verifica su existencia.
        /// Se usa en los controladores para validar antes de actualizar o para manejar errores de concurrencia.
        /// </summary>
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Empresas.AnyAsync(e => e.EmpresaId == id);
        }
    }
}
