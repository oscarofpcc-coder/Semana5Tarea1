/**
 * COMPONENTE DE LOGIN (Inicio de Sesion)
 * ========================================
 * Este componente maneja la logica del formulario de inicio de sesion.
 *
 * Flujo:
 * 1. El usuario llena email y password en el formulario HTML
 * 2. Al dar click en "Ingresar", se ejecuta onSubmit()
 * 3. onSubmit() llama al AuthService.login() que envia los datos al backend
 * 4. Si es exitoso -> redirige al home (/)
 * 5. Si falla -> muestra el mensaje de error
 */

import { Component, inject } from '@angular/core';
// FormsModule: Necesario para usar [(ngModel)] (two-way data binding) en el HTML
import { FormsModule } from '@angular/forms';
// Router: Para navegar programaticamente | RouterLink: Para crear enlaces en el HTML
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Componente independiente (no necesita un NgModule)
  imports: [FormsModule, RouterLink], // Dependencias que usa este componente
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // Inyeccion de dependencias usando la funcion inject() (forma moderna de Angular)
  private authService = inject(AuthService); // Servicio de autenticacion
  private router = inject(Router);           // Servicio de navegacion

  // Propiedades enlazadas al formulario HTML con [(ngModel)] (two-way binding)
  // Cuando el usuario escribe en el input, estas variables se actualizan automaticamente
  email = '';
  password = '';
  error = '';       // Mensaje de error a mostrar (vacio = sin error)
  loading = false;  // Indica si la peticion esta en proceso (para deshabilitar el boton)

  /**
   * Se ejecuta cuando el usuario envia el formulario (click en "Ingresar")
   *
   * .subscribe() es como addEventListener: "escucha" la respuesta del servidor.
   * - next: Se ejecuta cuando la peticion es exitosa (codigo HTTP 200)
   * - error: Se ejecuta cuando hay un error de red o el servidor retorna 4xx/5xx
   */
  onSubmit(): void {
    this.loading = true;  // Activamos el estado de carga
    this.error = '';       // Limpiamos errores anteriores

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      // Respuesta exitosa del servidor (puede ser login correcto o incorrecto)
      next: res => {
        if (res.success) {
          this.router.navigate(['/']); // Login correcto -> ir al home
        } else {
          this.error = res.message; // Login fallido -> mostrar mensaje del servidor
        }
        this.loading = false;
      },
      // Error de red o servidor (sin conexion, servidor caido, etc.)
      error: err => {
        // err.error?.message: Intenta obtener el mensaje del backend
        // Si no existe, muestra un mensaje por defecto
        this.error = err.error?.message || 'Error al iniciar sesion.';
        this.loading = false;
      }
    });
  }
}
