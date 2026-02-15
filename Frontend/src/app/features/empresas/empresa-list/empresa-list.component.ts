/**
 * COMPONENTE LISTA DE EMPRESAS
 * ==============================
 * Muestra una tabla con todas las empresas registradas en el sistema.
 * Permite ver detalle, editar y eliminar empresas.
 *
 * Implementa OnInit: Interfaz de Angular que define el metodo ngOnInit().
 * ngOnInit() se ejecuta automaticamente cuando el componente se crea.
 * Es el lugar ideal para cargar datos iniciales (como la lista de empresas).
 */

import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
// NgbModal: Servicio de ng-bootstrap para abrir ventanas modales
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaService } from '../../../core/services/empresa.service';
import { Empresa } from '../../../core/models/empresa.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-empresa-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empresa-list.component.html'
})
export class EmpresaListComponent implements OnInit {
  private service = inject(EmpresaService); // Servicio para operaciones CRUD
  private modal = inject(NgbModal);         // Servicio para abrir modales (ventanas emergentes)

  // Arreglo que almacena la lista de empresas cargadas del backend
  empresas: Empresa[] = [];

  /**
   * ngOnInit: Ciclo de vida de Angular.
   * Se ejecuta UNA VEZ cuando el componente se inicializa.
   * Aqui cargamos la lista de empresas al entrar a la pagina.
   */
  ngOnInit(): void {
    this.load();
  }

  /**
   * Carga todas las empresas desde el backend.
   * Se llama al inicio y despues de eliminar una empresa (para actualizar la lista).
   */
  load(): void {
    this.service.getAll().subscribe(data => this.empresas = data);
  }

  /**
   * Abre un dialogo de confirmacion antes de eliminar una empresa.
   * Esto evita eliminaciones accidentales.
   *
   * Flujo:
   * 1. Se abre un modal (ConfirmDialogComponent) con un mensaje personalizado
   * 2. Si el usuario confirma -> se llama a service.delete() y se recarga la lista
   * 3. Si el usuario cancela -> no pasa nada (.catch vacio)
   *
   * ref.result es una Promise:
   * - Se resuelve (.then) si el usuario da click en "Eliminar"
   * - Se rechaza (.catch) si el usuario da click en "Cancelar" o cierra el modal
   */
  confirmDelete(empresa: Empresa): void {
    const ref = this.modal.open(ConfirmDialogComponent);
    // Pasamos datos al modal usando componentInstance (las propiedades @Input)
    ref.componentInstance.title = 'Eliminar Empresa';
    ref.componentInstance.message = `Esta seguro de eliminar la empresa "${empresa.razonSocial}"?`;
    ref.result.then(() => {
      // Usuario confirmo -> eliminar y recargar
      this.service.delete(empresa.empresaId).subscribe(() => this.load());
    }).catch(() => {}); // Usuario cancelo -> no hacer nada
  }
}
