/**
 * PUNTO DE ENTRADA DE LA APLICACION ANGULAR
 * ==========================================
 * Este es el primer archivo que se ejecuta cuando la aplicacion arranca.
 * Su funcion es "inicializar" (bootstrap) la aplicacion Angular.
 *
 * Analogia: Es como encender el motor de un carro. Sin este archivo,
 * la aplicacion no arranca.
 */

// bootstrapApplication: Funcion de Angular que arranca la aplicacion
import { bootstrapApplication } from '@angular/platform-browser';
// appConfig: Contiene la configuracion global (rutas, interceptores, etc.)
import { appConfig } from './app/app.config';
// App: Es el componente raiz, el "padre" de toda la aplicacion
import { App } from './app/app';

// Arrancamos la aplicacion pasando el componente raiz y su configuracion.
// .catch() captura cualquier error que ocurra al iniciar y lo muestra en consola.
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
