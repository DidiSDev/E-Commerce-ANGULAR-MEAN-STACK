import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  private URL = 'http://localhost:3000/api/valoracion';

  constructor(private http: HttpClient) {}

  agregarValoracion(clienteId: string, productoId: string, comentario: string, estrellas: number): Observable<any> 
  {
    return this.http.post(`${this.URL}/agregar`, { clienteId, productoId, comentario, estrellas });
  }

  obtenerValoracionPromedio(productoId: string): Observable<any>
   {
    return this.http.get(`${this.URL}/promedio/${productoId}`);
  }

  obtenerValoracionesProducto(productoId: string): Observable<any[]> 
  {
    return this.http.get<any[]>(`${this.URL}/producto/${productoId}`);
  }
  obtenerTodasValoraciones(): Observable<any[]> 
  {
    return this.http.get<any[]>(`${this.URL}/todas`);
  }
}
