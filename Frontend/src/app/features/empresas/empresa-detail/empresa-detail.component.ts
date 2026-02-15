/**
 * COMPONENTE DETALLE DE EMPRESA
 * ===============================
 * Muestra la informacion completa de una empresa especifica.
 * Obtiene el ID de la empresa desde la URL (parametro de ruta :id)
 * y consulta los datos al backend.
 *
 * Ejemplo: Si la URL es /empresas/detalle/3
 *   -> Se obtiene id = 3 de la URL
 *   -> Se llama a EmpresaService.getById(3)
 *   -> Se muestra la informacion de la empresa con ID 3
 */

import { Component, inject, OnInit } from '@angular/core';
// ActivatedRoute: Servicio que contiene informacion sobre la ruta actual (parametros, query, etc.)
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmpresaService } from '../../../core/services/empresa.service';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-empresa-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empresa-detail.component.html'
})
export class EmpresaDetailComponent implements OnInit {
  private service = inject(EmpresaService);
  private route = inject(ActivatedRoute); // Para obtener parametros de la URL

  // La empresa puede ser undefined si aun no se ha cargado del backend
  empresa?: Empresa;

  ngOnInit(): void {
    // Obtener el parametro 'id' de la URL actual
    // this.route.snapshot.paramMap.get('id') -> retorna el valor como string (ej: "3")
    // +  (operador unario): Convierte el string a numero (ej: "3" -> 3)
    // !  (non-null assertion): Le dice a TypeScript "confio en que no sera null"
    const id = +this.route.snapshot.paramMap.get('id')!;

    // Consultamos la empresa al backend y la guardamos en la propiedad
    this.service.getById(id).subscribe(data => this.empresa = data);
  }
}
