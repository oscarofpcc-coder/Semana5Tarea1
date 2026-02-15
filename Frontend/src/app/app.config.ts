/**
 * CONFIGURACION GLOBAL DE LA APLICACION
 * ======================================
 * Aqui se registran los "providers" (proveedores) que Angular necesita
 * para funcionar. Los providers son servicios globales disponibles
 * en toda la aplicacion.
 *
 * Piensa en esto como el "panel de control" donde conectas:
 * - El sistema de rutas (navegacion entre paginas)
 * - El cliente HTTP (para hacer peticiones al backend/API)
 * - Los interceptores (middleware que modifica las peticiones HTTP)
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Registra listeners globales para capturar errores del navegador
    provideBrowserGlobalErrorListeners(),

    // provideRouter: Activa el sistema de rutas con las rutas definidas en app.routes.ts
    // Esto permite navegar entre paginas (login, empresas, home, etc.)
    provideRouter(routes),

    // provideHttpClient: Activa el servicio HttpClient para hacer peticiones HTTP (GET, POST, PUT, DELETE)
    // withInterceptors: Registra el interceptor de autenticacion que automaticamente
    // agrega el token JWT a cada peticion HTTP que se haga al backend
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
