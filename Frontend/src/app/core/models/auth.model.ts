/**
 * MODELOS DE AUTENTICACION
 * =========================
 * Estas interfaces definen la forma (shape) de los datos que se envian
 * y reciben durante el proceso de autenticacion (login y registro).
 *
 * Las interfaces en TypeScript NO generan codigo JavaScript,
 * solo sirven para validar tipos en tiempo de desarrollo.
 * Ayudan a prevenir errores como enviar un campo con nombre incorrecto.
 */

/**
 * Datos que se envian al backend para iniciar sesion.
 * El backend espera exactamente estos campos en el body del POST.
 */
export interface LoginRequest {
  email: string;       // Correo electronico del usuario
  password: string;    // Contrasena del usuario
}

/**
 * Datos que se envian al backend para registrar un nuevo usuario.
 * Incluye confirmPassword para validar que el usuario escribio bien su contrasena.
 */
export interface RegisterRequest {
  email: string;            // Correo electronico del nuevo usuario
  password: string;         // Contrasena elegida
  confirmPassword: string;  // Repetir contrasena (debe coincidir con password)
}

/**
 * Datos que el backend retorna despues de un login o registro exitoso.
 * Contiene el token JWT que se usara para autenticar las siguientes peticiones.
 */
export interface AuthResponse {
  token: string;       // Token JWT para autenticacion (se guarda en localStorage)
  expiration: string;  // Fecha/hora en que el token expira (formato ISO)
  email: string;       // Email del usuario autenticado
}
