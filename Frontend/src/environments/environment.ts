/**
 * CONFIGURACION DE ENTORNO - DESARROLLO
 * ========================================
 * Este archivo contiene las variables de configuracion para el entorno de DESARROLLO.
 * Angular automaticamente usa este archivo cuando ejecutas 'ng serve' (modo desarrollo).
 *
 * apiUrl: URL base del backend API. En desarrollo apunta a localhost
 * porque el backend corre en tu maquina local.
 *
 * Nota: El archivo environment.prod.ts tiene los valores para produccion.
 * Angular reemplaza automaticamente este archivo por el de produccion
 * cuando compilas con 'ng build' (esto se configura en angular.json).
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5270/api'
};
