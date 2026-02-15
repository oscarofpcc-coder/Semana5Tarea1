/**
 * MODELO DE EMPRESA
 * ==================
 * Define la estructura de datos de una Empresa tal como viene del backend.
 * Los campos con '?' son opcionales (pueden no venir en la respuesta).
 *
 * Esta interfaz se usa en:
 * - EmpresaService: Para tipar las peticiones y respuestas HTTP
 * - Componentes de empresa: Para saber que campos mostrar en las vistas
 * - Formularios: Para crear el objeto con la forma correcta
 */
export interface Empresa {
  empresaId: number;              // ID unico de la empresa (clave primaria en la BD)
  cedRuc: string;                 // Cedula o RUC de la empresa (identificacion fiscal)
  razonSocial: string;            // Nombre legal/oficial de la empresa
  nombreComercial?: string;       // Nombre comercial (opcional, puede ser diferente al legal)
  obligadoContabilidad?: boolean; // Si la empresa esta obligada a llevar contabilidad
  fechaDoc?: string;              // Fecha del documento de registro
  estado?: string;                // Estado actual de la empresa (Activo, Inactivo, etc.)
}
