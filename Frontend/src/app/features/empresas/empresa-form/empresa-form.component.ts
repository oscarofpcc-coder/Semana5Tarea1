/**
 * COMPONENTE FORMULARIO DE EMPRESA (Crear y Editar)
 * ===================================================
 * Este componente se REUTILIZA para dos operaciones:
 * - CREAR una nueva empresa (URL: /empresas/crear)
 * - EDITAR una empresa existente (URL: /empresas/editar/:id)
 *
 * Como sabe si es crear o editar?
 * Revisa si hay un parametro 'id' en la URL:
 * - Si hay 'id' -> Modo edicion (carga los datos existentes)
 * - Si NO hay 'id' -> Modo creacion (formulario vacio)
 *
 * Reutilizar un mismo componente para crear y editar es un patron comun
 * en aplicaciones CRUD. Evita duplicar codigo.
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmpresaService } from '../../../core/services/empresa.service';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './empresa-form.component.html'
})
export class EmpresaFormComponent implements OnInit {
  private service = inject(EmpresaService);
  private route = inject(ActivatedRoute); // Para leer parametros de la URL
  private router = inject(Router);         // Para redirigir despues de guardar

  // Objeto empresa con valores por defecto (para el modo creacion)
  empresa: Empresa = { empresaId: 0, cedRuc: '', razonSocial: '' };
  isEdit = false; // Flag para saber si estamos editando o creando
  error = '';

  /**
   * Al iniciar el componente, verificamos si hay un 'id' en la URL.
   * Si existe, activamos modo edicion y cargamos los datos de esa empresa.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // null si estamos en /crear
    if (id) {
      this.isEdit = true;
      // +id convierte el string a numero (ej: "5" -> 5)
      this.service.getById(+id).subscribe(data => this.empresa = data);
    }
  }

  /**
   * Envia los datos del formulario al backend.
   * Dependiendo del modo (crear o editar), llama a un metodo diferente del servicio.
   *
   * En ambos casos, si la operacion es exitosa, redirige a la lista de empresas.
   * Si hay error, muestra el mensaje.
   */
  onSubmit(): void {
    this.error = '';
    if (this.isEdit) {
      // MODO EDICION: Actualizar empresa existente (HTTP PUT)
      this.service.update(this.empresa.empresaId, this.empresa).subscribe({
        next: () => this.router.navigate(['/empresas']),     // Exito -> ir a la lista
        error: err => this.error = err.error?.title || 'Error al actualizar.'
      });
    } else {
      // MODO CREACION: Crear nueva empresa (HTTP POST)
      this.service.create(this.empresa).subscribe({
        next: () => this.router.navigate(['/empresas']),     // Exito -> ir a la lista
        error: err => this.error = err.error?.title || 'Error al crear.'
      });
    }
  }
}
