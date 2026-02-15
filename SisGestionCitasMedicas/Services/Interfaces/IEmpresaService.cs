using SisGestionCitasMedicas.Models;

namespace SisGestionCitasMedicas.Services.Interfaces
{
    /// <summary>
    /// CONTRATO DEL SERVICIO DE EMPRESAS
    /// ==================================
    /// Define las operaciones disponibles para gestionar empresas.
    ///
    /// ¿Por que usar una interfaz?
    /// - Permite inyeccion de dependencias (DI): el controlador depende de la interfaz,
    ///   NO de la implementacion concreta. Esto sigue el principio SOLID de
    ///   Inversion de Dependencias (la D de SOLID).
    /// - Facilita las pruebas unitarias: se puede crear un "mock" (simulacion)
    ///   de este servicio sin necesitar la base de datos real.
    /// - Permite cambiar la implementacion (ej: de SQL Server a PostgreSQL)
    ///   sin modificar los controladores.
    ///
    /// Todos los metodos son asincronos (Task) porque acceden a la base de datos,
    /// y las operaciones de I/O deben ser async para no bloquear el servidor.
    /// </summary>
    public interface IEmpresaService
    {
        /// <summary>
        /// Obtiene todas las empresas de la base de datos.
        /// Retorna una lista vacia si no hay registros.
        /// </summary>
        Task<List<Empresa>> GetAllAsync();

        /// <summary>
        /// Busca una empresa por su ID (clave primaria).
        /// Retorna null si no existe (por eso el tipo es Empresa? con el signo de pregunta).
        /// </summary>
        Task<Empresa?> GetByIdAsync(int id);

        /// <summary>
        /// Crea una nueva empresa en la base de datos.
        /// EF Core asigna automaticamente el EmpresaId despues de guardar.
        /// </summary>
        Task CreateAsync(Empresa empresa);

        /// <summary>
        /// Actualiza los datos de una empresa existente.
        /// EF Core detecta los campos que cambiaron y solo actualiza esos.
        /// </summary>
        Task UpdateAsync(Empresa empresa);

        /// <summary>
        /// Elimina una empresa por su ID.
        /// Retorna true si se elimino correctamente, false si no se encontro.
        /// </summary>
        Task<bool> DeleteAsync(int id);

        /// <summary>
        /// Verifica si existe una empresa con el ID dado.
        /// Util para validaciones antes de actualizar o eliminar.
        /// </summary>
        Task<bool> ExistsAsync(int id);
    }
}
