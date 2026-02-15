/**
 * COMPONENTE RAIZ DE LA APLICACION (App)
 * =======================================
 * Este es el componente principal que contiene toda la aplicacion.
 * Todos los demas componentes se renderizan DENTRO de este.
 *
 * Estructura visual:
 *   <app-root>           <-- Este componente
 *     <app-navbar>       <-- Barra de navegacion (siempre visible)
 *     <router-outlet>    <-- Aqui se muestran las paginas segun la URL
 *   </app-root>
 */

import { Component } from '@angular/core';
// RouterOutlet: Directiva que indica DONDE se renderizan las paginas segun la ruta
import { RouterOutlet } from '@angular/router';
// NavbarComponent: Barra de navegacion compartida en toda la app
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  // selector: El nombre de la etiqueta HTML que representa este componente.
  // En index.html veras <app-root></app-root>
  selector: 'app-root',

  // imports: Lista de componentes/modulos que este componente necesita.
  // En Angular 21 los componentes son "standalone" (independientes),
  // asi que cada componente declara sus propias dependencias aqui.
  imports: [RouterOutlet, NavbarComponent],

  // templateUrl: Ruta al archivo HTML que define la vista de este componente
  templateUrl: './app.html',

  // styleUrl: Ruta al archivo CSS con estilos exclusivos de este componente
  styleUrl: './app.css'
})
export class App {}
// Nota: Esta clase esta vacia porque el componente raiz solo sirve de "contenedor".
// No necesita logica propia, solo muestra el navbar y el contenido de las rutas.
