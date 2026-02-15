/**
 * COMPONENTE NAVBAR (Barra de Navegacion)
 * =========================================
 * Barra de navegacion que aparece en la parte superior de TODAS las paginas.
 * Muestra opciones diferentes dependiendo de si el usuario esta logueado o no:
 *
 * - Logueado: Muestra enlaces a modulos (Empresas), email del usuario y boton "Cerrar Sesion"
 * - No logueado: Muestra enlaces a "Iniciar Sesion" y "Registrarse"
 *
 * Usa ng-bootstrap (NgbCollapseModule) para el menu hamburguesa
 * que aparece en pantallas pequenas (responsivo).
 */

import { Component, inject } from '@angular/core';
// RouterLink: Para crear enlaces de navegacion
// RouterLinkActive: Agrega la clase CSS 'active' al enlace que coincide con la ruta actual
import { RouterLink, RouterLinkActive } from '@angular/router';
// NgbCollapseModule: Modulo de ng-bootstrap para el efecto de colapsar/expandir el menu
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgbCollapseModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  // Publico porque se usa en el HTML para verificar autenticacion y mostrar email
  authService = inject(AuthService);

  // Controla si el menu esta colapsado (en pantallas pequenas)
  // true = colapsado (cerrado), false = expandido (abierto)
  isCollapsed = true;

  /** Cierra la sesion del usuario delegando al AuthService */
  logout(): void {
    this.authService.logout();
  }
}
