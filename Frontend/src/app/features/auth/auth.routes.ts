/**
 * RUTAS DEL MODULO DE AUTENTICACION
 * ===================================
 * Define las sub-rutas para la seccion de autenticacion.
 * Estas rutas se cargan bajo demanda (lazy loading) desde app.routes.ts.
 *
 * Las URLs finales seran:
 *   /auth/login    -> Muestra el formulario de inicio de sesion
 *   /auth/register -> Muestra el formulario de registro
 *
 * Nota: El prefijo 'auth' ya esta definido en app.routes.ts,
 * por eso aqui solo se define 'login' y 'register' (sin el prefijo).
 */

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },      // /auth/login
  { path: 'register', component: RegisterComponent }  // /auth/register
];
