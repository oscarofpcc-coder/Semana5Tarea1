/**
 * SERVICIO DE AUTENTICACION (AuthService)
 * ========================================
 * Este servicio centraliza TODA la logica de autenticacion de la aplicacion:
 * - Login (iniciar sesion)
 * - Register (registrar nuevo usuario)
 * - Logout (cerrar sesion)
 * - Verificar si el usuario esta autenticado
 * - Obtener el token JWT y email del usuario
 *
 * Usa localStorage del navegador para guardar el token JWT de forma persistente
 * (sobrevive al cerrar el navegador).
 *
 * El decorador @Injectable({ providedIn: 'root' }) hace que Angular cree
 * UNA SOLA instancia de este servicio para toda la app (patron Singleton).
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// Observable y tap son de RxJS, la libreria de programacion reactiva que usa Angular
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, } from '../models/api-response.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // inject() es la forma moderna de inyectar dependencias en Angular (alternativa al constructor)
  private http = inject(HttpClient);   // Cliente HTTP para hacer peticiones al backend
  private router = inject(Router);      // Router para navegar entre paginas

  // URL base del endpoint de autenticacion (ej: http://localhost:5270/api/auth)
  private url = `${environment.apiUrl}/auth`;

  // Claves para guardar datos en localStorage del navegador
  private tokenKey = 'jwt_token';           // Clave para el token JWT
  private emailKey = 'user_email';          // Clave para el email del usuario
  private expirationKey = 'token_expiration'; // Clave para la fecha de expiracion

  /**
   * INICIAR SESION
   * Envia un POST a /api/auth/login con email y password.
   * Si la respuesta es exitosa, guarda el token en localStorage usando tap().
   *
   * tap() es un operador RxJS que ejecuta una accion "secundaria" sin modificar
   * el flujo de datos. Es como "espiar" la respuesta antes de entregarla al componente.
   *
   * @param request - Objeto con email y password
   * @returns Observable con la respuesta del servidor
   */
  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.url}/login`, request).pipe(
      tap(res => {
        if (res.success) this.saveToken(res.data);
      })
    );
  }

  /**
   * REGISTRAR NUEVO USUARIO
   * Similar al login, pero envia los datos a /api/auth/register.
   * Si el registro es exitoso, guarda el token (el usuario queda logueado automaticamente).
   */
  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.url}/register`, request).pipe(
      tap(res => {
        if (res.success) this.saveToken(res.data);
      })
    );
  }

  /**
   * CERRAR SESION
   * Elimina todos los datos de sesion del localStorage y redirige al login.
   * No necesita llamar al backend porque JWT es "stateless" (sin estado en el servidor).
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.expirationKey);
    this.router.navigate(['/auth/login']);
  }

  /**
   * VERIFICAR SI EL USUARIO ESTA AUTENTICADO
   * Verifica dos cosas:
   * 1. Que exista un token en localStorage
   * 2. Que el token NO haya expirado (comparando la fecha de expiracion con la fecha actual)
   *
   * @returns true si el usuario tiene un token valido y no expirado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false; // No hay token -> no autenticado
    const expiration = localStorage.getItem(this.expirationKey);
    if (!expiration) return false; // No hay fecha de expiracion -> no autenticado
    // Compara la fecha de expiracion con la fecha actual
    return new Date(expiration) > new Date();
  }

  /** Obtiene el token JWT del localStorage (o null si no existe) */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Obtiene el email del usuario logueado del localStorage */
  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  /**
   * GUARDAR DATOS DE SESION (metodo privado)
   * Almacena el token, email y fecha de expiracion en localStorage.
   * Es privado porque solo debe ser llamado internamente por login() y register().
   */
  private saveToken(auth: AuthResponse): void {
    localStorage.setItem(this.tokenKey, auth.token);
    localStorage.setItem(this.emailKey, auth.email);
    localStorage.setItem(this.expirationKey, auth.expiration);
  }
}
