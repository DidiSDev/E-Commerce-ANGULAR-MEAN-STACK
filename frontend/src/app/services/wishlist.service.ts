// src/app/services/wishlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private URL = 'http://localhost:3000/api/wishlist';

  constructor(private http: HttpClient) {}

  agregarDeseado(clienteId: string, productoId: string): Observable<any> 
  {
    return this.http.post(`${this.URL}/agregar`, { clienteId, productoId });
  }

  obtenerTopDeseados(): Observable<any[]> 
  {
    return this.http.get<any[]>(`${this.URL}/top`);
  }

  obtenerWishlistUsuario(clienteId: string): Observable<any[]> 
  {
    return this.http.get<any[]>(`${this.URL}/usuario/${clienteId}`);
  }

  eliminarDeseado(clienteId: string, productoId: string): Observable<any> 
  {
    return this.http.post(`${this.URL}/eliminar`, { clienteId, productoId });
  }
}
