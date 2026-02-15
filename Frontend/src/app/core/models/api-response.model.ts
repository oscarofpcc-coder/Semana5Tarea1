/**
 * MODELO DE RESPUESTA GENERICA DE LA API
 * ========================================
 * Esta interfaz define la estructura estandar que el backend retorna
 * para TODAS sus respuestas. Usar una estructura generica permite
 * manejar las respuestas de forma consistente en toda la aplicacion.
 *
 * El <T> es un "generico" (Generic). Significa que el tipo de 'data' puede variar:
 *   ApiResponse<AuthResponse>  -> data sera de tipo AuthResponse
 *   ApiResponse<Empresa[]>     -> data sera un arreglo de Empresa
 *   ApiResponse<string>        -> data sera un string
 *
 * Ejemplo de respuesta exitosa del backend:
 * {
 *   "success": true,
 *   "message": "Login exitoso",
 *   "data": { "token": "xxx", "email": "user@mail.com", "expiration": "..." },
 *   "errors": []
 * }
 *
 * Ejemplo de respuesta con error:
 * {
 *   "success": false,
 *   "message": "Credenciales invalidas",
 *   "data": null,
 *   "errors": ["Email no encontrado"]
 * }
 */
export interface ApiResponse<T> {
  success: boolean;    // Indica si la operacion fue exitosa o no
  message: string;     // Mensaje descriptivo del resultado
  data: T;             // Los datos de la respuesta (su tipo depende del generico T)
  errors: string[];    // Lista de errores (vacia si no hubo errores)
}
