using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SisGestionCitasMedicas.Models;
using SisGestionCitasMedicas.Services.Interfaces;

namespace SisGestionCitasMedicas.Controllers
{
    /// <summary>
    /// Controlador MVC para el CRUD de Empresas (usado por las vistas Razor).
    /// [Authorize] protege todos los endpoints: solo usuarios logueados con cookie de Identity pueden acceder.
    ///
    /// Flujo MVC: el usuario navega a una URL -> el controlador procesa la peticion
    /// -> retorna una vista (.cshtml) que se renderiza en el navegador.
    ///
    /// Rutas que maneja (por convencion MVC):
    ///   GET  /Empresas           -> Index()     -> lista todas las empresas
    ///   GET  /Empresas/Details/5 -> Details(5)  -> muestra detalle de una empresa
    ///   GET  /Empresas/Create    -> Create()    -> muestra formulario vacio para crear
    ///   POST /Empresas/Create    -> Create(emp) -> recibe el formulario y guarda en BD
    ///   GET  /Empresas/Edit/5    -> Edit(5)     -> muestra formulario con datos para editar
    ///   POST /Empresas/Edit/5    -> Edit(5,emp) -> recibe el formulario editado y actualiza en BD
    ///   GET  /Empresas/Delete/5  -> Delete(5)   -> muestra confirmacion antes de eliminar
    ///   POST /Empresas/Delete/5  -> DeleteConfirmed(5) -> elimina de la BD
    /// </summary>
    [Authorize]
    public class EmpresasController : Controller
    {
        // Servicio de negocio inyectado por DI - contiene la logica de acceso a datos
        private readonly IEmpresaService _empresaService;

        // Logger para registrar eventos en el log del servidor
        private readonly ILogger<EmpresasController> _logger;

        // Constructor: ASP.NET Core inyecta automaticamente el servicio y el logger
        public EmpresasController(IEmpresaService empresaService, ILogger<EmpresasController> logger)
        {
            _empresaService = empresaService;
            _logger = logger;
        }

        // GET /Empresas - Obtiene todas las empresas y las pasa a la vista Index.cshtml para mostrar la tabla
        public async Task<IActionResult> Index()
        {
            return View(await _empresaService.GetAllAsync());
        }

        // GET /Empresas/Details/5 - Busca una empresa por ID y la muestra en la vista Details.cshtml
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound(); // Si no se pasa ID, retorna 404

            Empresa? empresa = await _empresaService.GetByIdAsync(id.Value);
            if (empresa == null) return NotFound(); // Si no existe en BD, retorna 404

            return View(empresa);
        }

        // GET /Empresas/Create - Muestra el formulario vacio para crear una nueva empresa
        public IActionResult Create()
        {
            return View();
        }

        // POST /Empresas/Create - Recibe los datos del formulario y crea la empresa en la BD
        // [ValidateAntiForgeryToken] protege contra ataques CSRF (Cross-Site Request Forgery)
        // [Bind] limita los campos que se aceptan del formulario para evitar sobreasignacion
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EmpresaId,CedRuc,RazonSocial,NombreComercial,ObligadoContabilidad,FechaDoc,Estado")] Empresa empresa)
        {
            // Valida que los campos cumplan las DataAnnotations del modelo (Required, StringLength, etc.)
            if (ModelState.IsValid)
            {
                await _empresaService.CreateAsync(empresa);
                return RedirectToAction(nameof(Index)); // Redirige a la lista despues de crear
            }
            // Si hay errores de validacion, vuelve a mostrar el formulario con los errores
            return View(empresa);
        }

        // GET /Empresas/Edit/5 - Busca la empresa y muestra el formulario con sus datos para editar
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            Empresa? empresa = await _empresaService.GetByIdAsync(id.Value);
            if (empresa == null) return NotFound();

            return View(empresa);
        }

        // POST /Empresas/Edit/5 - Recibe los datos editados del formulario y actualiza en la BD
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("EmpresaId,CedRuc,RazonSocial,NombreComercial,ObligadoContabilidad,FechaDoc,Estado")] Empresa empresa)
        {
            // Verifica que el ID de la URL coincida con el del formulario (seguridad)
            if (id != empresa.EmpresaId) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    await _empresaService.UpdateAsync(empresa);
                    return RedirectToAction(nameof(Index)); // Redirige a la lista despues de editar
                }
                catch (DbUpdateConcurrencyException)
                {
                    // Si otro usuario elimino la empresa mientras se editaba, verifica si aun existe
                    if (!await _empresaService.ExistsAsync(empresa.EmpresaId))
                        return NotFound();
                    throw; // Si existe pero fallo por otra razon, relanza la excepcion
                }
            }
            // Si hay errores de validacion, vuelve a mostrar el formulario
            return View(empresa);
        }

        // GET /Empresas/Delete/5 - Muestra la pagina de confirmacion antes de eliminar
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            Empresa? empresa = await _empresaService.GetByIdAsync(id.Value);
            if (empresa == null) return NotFound();

            return View(empresa);
        }

        // POST /Empresas/Delete/5 - Elimina la empresa de la BD despues de confirmar
        // [ActionName("Delete")] hace que la URL sea /Delete pero el metodo se llama DeleteConfirmed
        // (necesario porque no puede haber dos metodos Delete con la misma firma en C#)
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _empresaService.DeleteAsync(id);
            return RedirectToAction(nameof(Index)); // Redirige a la lista despues de eliminar
        }
    }
}
