/**
 * CONFIGURACION DE ENTORNO - PRODUCCION
 * ========================================
 * Variables de configuracion para cuando la app esta en produccion (servidor real).
 *
 * apiUrl: '/api' es una URL relativa, lo que significa que las peticiones
 * se hacen al MISMO servidor donde esta alojado el frontend.
 * Ejemplo: Si el frontend esta en https://miapp.com, las peticiones
 * iran a https://miapp.com/api/...
 *
 * En produccion no se usa localhost porque el backend y frontend
 * usualmente estan en el mismo servidor o detras de un proxy.
 */
export const environment = {
  production: true,
  apiUrl: '/api'
};
