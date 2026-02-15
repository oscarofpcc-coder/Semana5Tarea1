/**
 * RUTAS DEL MODULO DE EMPRESAS
 * ==============================
 * Define las sub-rutas para el CRUD de empresas.
 * Todas estas rutas estan protegidas por authGuard (definido en app.routes.ts).
 *
 * Las URLs finales seran:
 *   /empresas              -> Lista de todas las empresas
 *   /empresas/crear        -> Formulario para crear nueva empresa
 *   /empresas/editar/:id   -> Formulario para editar empresa existente
 *   /empresas/detalle/:id  -> Vista de detalle de una empresa
 *
 * Nota: ':id' es un parametro de ruta dinamico. Angular lo reemplaza con el ID real.
 * Ejemplo: /empresas/editar/5 -> id = 5
 *
 * EmpresaFormComponent se reutiliza tanto para crear como para editar.
 * El componente detecta si hay un :id en la URL para saber en que modo operar.
 */

import { Routes } from '@angular/router';
import { EmpresaListComponent } from './empresa-list/empresa-list.component';
import { EmpresaFormComponent } from './empresa-form/empresa-form.component';
import { EmpresaDetailComponent } from './empresa-detail/empresa-detail.component';

export const EMPRESAS_ROUTES: Routes = [
  { path: '', component: EmpresaListComponent },             // /empresas (listado)
  { path: 'crear', component: EmpresaFormComponent },         // /empresas/crear
  { path: 'editar/:id', component: EmpresaFormComponent },    // /empresas/editar/5
  { path: 'detalle/:id', component: EmpresaDetailComponent }  // /empresas/detalle/5
];
