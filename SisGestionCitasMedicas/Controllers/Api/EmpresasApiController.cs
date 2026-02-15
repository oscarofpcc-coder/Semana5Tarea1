using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SisGestionCitasMedicas.Models;
using SisGestionCitasMedicas.Services.Interfaces;

namespace SisGestionCitasMedicas.Controllers.Api;

/// <summary>
/// Controlador API REST para el CRUD de Empresas.
/// Todos los endpoints requieren autenticacion JWT (el frontend debe enviar el token en el header).
/// Ruta base: /api/empresas
///
/// Endpoints disponibles:
///   GET    /api/empresas       -> Lista todas las empresas
///   GET    /api/empresas/{id}  -> Obtiene una empresa por su ID
///   POST   /api/empresas       -> Crea una nueva empresa
///   PUT    /api/empresas/{id}  -> Actualiza una empresa existente
///   DELETE /api/empresas/{id}  -> Elimina una empresa
/// </summary>
[Route("api/empresas")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] // Solo usuarios con JWT valido
public class EmpresasApiController : ControllerBase
{
    // Servicio de negocio inyectado - contiene la logica de acceso a datos
    private readonly IEmpresaService _service;

    // Logger para registrar operaciones en el log del servidor
    private readonly ILogger<EmpresasApiController> _logger;

    // Constructor: ASP.NET Core inyecta automaticamente el servicio y el logger
    public EmpresasApiController(IEmpresaService service, ILogger<EmpresasApiController> logger)
    {
        _service = service;
        _logger = logger;
    }

    // GET /api/empresas - Retorna la lista completa de empresas
    [HttpGet]
    public async Task<ActionResult<List<Empresa>>> GetAll()
    {
        _logger.LogInformation("API: Obteniendo todas las empresas");
        var items = await _service.GetAllAsync();
        return Ok(items); // Retorna 200 con la lista en formato JSON
    }

    // GET /api/empresas/5 - Retorna una empresa especifica por su ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Empresa>> GetById(int id)
    {
        var item = await _service.GetByIdAsync(id);
        if (item == null) return NotFound(); // 404 si no existe
        return Ok(item); // 200 con la empresa en JSON
    }

    // POST /api/empresas - Crea una nueva empresa con los datos del body JSON
    [HttpPost]
    public async Task<ActionResult<Empresa>> Create(Empresa empresa)
    {
        await _service.CreateAsync(empresa);
        _logger.LogInformation("API: Empresa creada con Id {Id}", empresa.EmpresaId);
        // 201 Created con la ubicacion del nuevo recurso en el header Location
        return CreatedAtAction(nameof(GetById), new { id = empresa.EmpresaId }, empresa);
    }

    // PUT /api/empresas/5 - Actualiza una empresa existente
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Empresa empresa)
    {
        // Valida que el ID de la URL coincida con el ID del body
        if (id != empresa.EmpresaId) return BadRequest();

        // Verifica que la empresa exista antes de actualizar
        if (!await _service.ExistsAsync(id)) return NotFound();

        await _service.UpdateAsync(empresa);
        _logger.LogInformation("API: Empresa actualizada Id {Id}", id);
        return NoContent(); // 204 sin contenido (actualizacion exitosa)
    }

    // DELETE /api/empresas/5 - Elimina una empresa por su ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(); // 404 si no existe

        _logger.LogInformation("API: Empresa eliminada Id {Id}", id);
        return NoContent(); // 204 sin contenido (eliminacion exitosa)
    }
}
