/**
 * CONFIGURACION DE RUTAS PRINCIPALES
 * ====================================
 * Aqui se definen las URLs de la aplicacion y que componente se muestra en cada una.
 * Angular usa estas rutas para saber que pagina mostrar segun la URL del navegador.
 *
 * Concepto clave - LAZY LOADING (carga perezosa):
 * Las rutas de 'auth' y 'empresas' usan loadChildren(), lo que significa que
 * Angular NO carga esos modulos al inicio. Solo los descarga cuando el usuario
 * navega a esa seccion. Esto mejora el rendimiento de la carga inicial.
 *
 * Mapa de rutas:
 *   /              -> HomeComponent (pagina de inicio)
 *   /auth/login    -> LoginComponent (cargado bajo demanda)
 *   /auth/register -> RegisterComponent (cargado bajo demanda)
 *   /empresas      -> EmpresaListComponent (protegido con authGuard)
 *   /empresas/crear   -> EmpresaFormComponent (protegido)
 *   /empresas/editar/:id -> EmpresaFormComponent (protegido)
 *   /**            -> Redirige a Home (cualquier ruta que no exista)
 */

import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta raiz: cuando la URL es solo '/', muestra la pagina de inicio
  { path: '', component: HomeComponent },

  // Rutas de autenticacion (login y registro)
  // loadChildren: Carga las rutas hijas de forma "perezosa" (lazy loading)
  // Solo se descarga el codigo cuando el usuario navega a /auth/...
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Rutas de empresas (CRUD completo)
  // canActivate: [authGuard] -> PROTEGE estas rutas. Si el usuario NO esta
  // autenticado, el guard lo redirige automaticamente al login.
  {
    path: 'empresas',
    canActivate: [authGuard],
    loadChildren: () => import('./features/empresas/empresas.routes').then(m => m.EMPRESAS_ROUTES)
  },

  // Ruta comodin (**): Cualquier URL que no coincida con las anteriores
  // redirige a la pagina de inicio. Esto evita paginas en blanco o errores 404.
  { path: '**', redirectTo: '' }
];
