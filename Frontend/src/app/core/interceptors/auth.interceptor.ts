/**
 * INTERCEPTOR DE AUTENTICACION (Middleware HTTP)
 * ================================================
 * Un interceptor es como un "filtro" que se ejecuta automaticamente
 * en CADA peticion HTTP que la aplicacion envia al backend.
 *
 * Este interceptor hace lo siguiente:
 * 1. Revisa si el usuario tiene un token JWT guardado
 * 2. Si tiene token, lo agrega al header "Authorization" de la peticion
 * 3. Si no tiene token, deja pasar la peticion sin modificarla
 *
 * Esto evita tener que agregar manualmente el token en cada llamada HTTP.
 * Sin este interceptor, tendrias que escribir:
 *   this.http.get(url, { headers: { Authorization: 'Bearer xxx' } })
 * en CADA peticion. El interceptor lo hace automaticamente.
 *
 * Flujo visual:
 *   Componente -> HttpClient.get() -> [INTERCEPTOR agrega token] -> Backend API
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Interceptor funcional: recibe la peticion (req) y la funcion next() para continuar
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // Obtenemos el token JWT del localStorage
  const token = authService.getToken();

  if (token) {
    // Si hay token, clonamos la peticion y le agregamos el header Authorization.
    // Nota: Las peticiones HTTP en Angular son INMUTABLES, por eso se clonan.
    // El formato "Bearer <token>" es el estandar para JWT.
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned); // Enviamos la peticion CON el token
  }

  // Si no hay token (usuario no logueado), enviamos la peticion sin modificar
  return next(req);
};
