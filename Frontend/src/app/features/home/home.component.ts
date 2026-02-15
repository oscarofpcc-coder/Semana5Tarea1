/**
 * COMPONENTE HOME (Pagina de Inicio)
 * ====================================
 * Pagina principal de la aplicacion.
 * Muestra contenido diferente dependiendo de si el usuario esta autenticado o no:
 * - Autenticado: Muestra tarjetas con enlaces a los modulos (Empresas)
 * - No autenticado: Muestra botones para iniciar sesion o registrarse
 *
 * Nota: authService es PUBLIC porque se accede desde el HTML template.
 * Las propiedades privadas no son accesibles desde los templates en Angular.
 */

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // Publico para poder usar authService.isAuthenticated() en el HTML
  authService = inject(AuthService);
}
