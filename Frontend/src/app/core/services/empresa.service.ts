/**
 * SERVICIO DE EMPRESAS (EmpresaService)
 * =======================================
 * Este servicio contiene los metodos para realizar operaciones CRUD
 * (Create, Read, Update, Delete) sobre la entidad Empresa.
 *
 * Cada metodo corresponde a un verbo HTTP y una operacion del backend:
 *   getAll()    -> GET    /api/empresas          (Listar todas)
 *   getById()   -> GET    /api/empresas/{id}     (Obtener una por ID)
 *   create()    -> POST   /api/empresas          (Crear nueva)
 *   update()    -> PUT    /api/empresas/{id}     (Actualizar existente)
 *   delete()    -> DELETE /api/empresas/{id}     (Eliminar)
 *
 * Nota: El token JWT se agrega automaticamente a cada peticion
 * gracias al authInterceptor (no necesitamos hacerlo manualmente aqui).
 *
 * Todos los metodos retornan un Observable (de RxJS). Los Observables
 * son como "promesas mejoradas" - no se ejecutan hasta que alguien
 * se "suscribe" a ellos con .subscribe().
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empresa } from '../models/empresa.model';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private http = inject(HttpClient); // Cliente HTTP inyectado
  // URL base del endpoint de empresas (ej: http://localhost:5270/api/empresas)
  private url = `${environment.apiUrl}/empresas`;

  /** Obtiene la lista completa de empresas desde el backend */
  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.url);
  }

  /** Obtiene una empresa especifica por su ID */
  getById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.url}/${id}`);
  }

  /** Crea una nueva empresa enviando los datos al backend */
  create(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.url, empresa);
  }

  /** Actualiza una empresa existente. Retorna void porque no devuelve datos */
  update(id: number, empresa: Empresa): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, empresa);
  }

  /** Elimina una empresa por su ID. Retorna void porque no devuelve datos */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
