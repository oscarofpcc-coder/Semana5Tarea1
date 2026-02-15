/**
 * COMPONENTE DE REGISTRO (Crear cuenta)
 * =======================================
 * Este componente maneja la logica del formulario de registro de usuarios.
 * Es muy similar al LoginComponent, pero con un campo adicional (confirmPassword)
 * y manejo de multiples errores de validacion.
 *
 * Flujo:
 * 1. El usuario llena email, password y confirmPassword
 * 2. Al enviar, se llama a AuthService.register()
 * 3. Si es exitoso -> el usuario queda logueado y se redirige al home
 * 4. Si falla -> se muestran los errores (ej: "La contrasena debe tener al menos 6 caracteres")
 */

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Propiedades del formulario (enlazadas con [(ngModel)] en el HTML)
  email = '';
  password = '';
  confirmPassword = '';
  error = '';            // Mensaje de error principal
  errors: string[] = []; // Lista de errores detallados (ej: validaciones del backend)
  loading = false;

  /**
   * Se ejecuta al enviar el formulario de registro.
   * La diferencia con el login es que puede recibir MULTIPLES errores
   * de validacion del backend (res.errors), como:
   * - "La contrasena debe tener al menos 6 caracteres"
   * - "El email ya esta registrado"
   */
  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.errors = [];

    this.authService.register({
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: res => {
        if (res.success) {
          this.router.navigate(['/']); // Registro exitoso -> ir al home
        } else {
          this.error = res.message;
          this.errors = res.errors || []; // Mostrar lista de errores de validacion
        }
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Error en el registro.';
        this.errors = err.error?.errors || [];
        this.loading = false;
      }
    });
  }
}
