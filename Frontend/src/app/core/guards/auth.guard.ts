/**
 * GUARD DE AUTENTICACION (Guardia de rutas)
 * ==========================================
 * Un "guard" es como un guardia de seguridad que protege ciertas paginas.
 * Antes de permitir que el usuario entre a una ruta protegida,
 * este guard verifica si el usuario esta autenticado (tiene sesion activa).
 *
 * Si esta autenticado -> Permite el acceso (retorna true)
 * Si NO esta autenticado -> Lo redirige al login (retorna una URL de redireccion)
 *
 * Se usa en app.routes.ts asi:
 *   canActivate: [authGuard]  // Protege la ruta con este guard
 */

// inject: Funcion para inyectar servicios en funciones (no en clases)
import { inject } from '@angular/core';
// CanActivateFn: Tipo de funcion que Angular espera para un guard de ruta
// Router: Servicio para navegar entre paginas de forma programatica
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard funcional: En Angular moderno se usan funciones en lugar de clases para los guards.
// Es mas simple y directo.
export const authGuard: CanActivateFn = () => {
  // Inyectamos los servicios que necesitamos
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos si el usuario tiene un token JWT valido y no expirado
  if (authService.isAuthenticated()) {
    return true; // Permite el acceso a la ruta
  }

  // Si no esta autenticado, creamos una URL de redireccion al login.
  // createUrlTree es la forma recomendada por Angular para redirigir desde un guard.
  return router.createUrlTree(['/auth/login']);
};
