/**
 * COMPONENTE DIALOGO DE CONFIRMACION (Modal reutilizable)
 * =========================================================
 * Ventana modal (emergente) que pide confirmacion antes de realizar
 * acciones destructivas como eliminar un registro.
 *
 * Es un componente REUTILIZABLE: se puede usar en cualquier parte de la app
 * cambiando el titulo y mensaje a traves de las propiedades @Input.
 *
 * Se abre programaticamente usando NgbModal.open() desde otros componentes.
 * Ejemplo de uso (en EmpresaListComponent):
 *   const ref = this.modal.open(ConfirmDialogComponent);
 *   ref.componentInstance.title = 'Eliminar';
 *   ref.componentInstance.message = 'Esta seguro?';
 *
 * NgbActiveModal: Referencia al modal activo. Permite cerrarlo o cancelarlo
 * desde dentro del componente.
 *   modal.close(valor) -> Confirma (resuelve la Promise)
 *   modal.dismiss()     -> Cancela (rechaza la Promise)
 */

import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  // @Input(): Propiedades que se pueden configurar desde el componente padre.
  // Tienen valores por defecto que se usan si no se proporcionan.
  @Input() title = 'Confirmar';
  @Input() message = 'Esta seguro de realizar esta accion?';

  // NgbActiveModal se inyecta por constructor (forma clasica de inyeccion de dependencias).
  // Es 'public' porque se usa en el HTML template (modal.close() y modal.dismiss()).
  constructor(public modal: NgbActiveModal) {}
}
