import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Compra } from '../models/compra.model';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private apiUrl = 'http://localhost:3000/api/compras'; 

  constructor(private http: HttpClient) { }

  realizarCompra(compra: Compra): Observable<any> {
    return this.http.post(`${this.apiUrl}/realizar`, compra);
  }

  obtenerComprasCliente(clienteId: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  eliminarProductosGlobal(productos: Array<{productoId:string; cantidad:number}>):Observable<any>{
    return this.http.post(`${this.apiUrl}/eliminar/global`, {productos});
  } 

  eliminarProductosUsuario(clienteId: string, productos: Array<{productoId:string, cantidad:number}>):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/eliminar/usuario`, {clienteId, productos});
  }

  getCompras():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/TAnuevo`);
  }

  getTodasLasCompras():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/todasLasCompras`);
  }

  getNumeroClientes(productoId:string):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/numeroClientes`, {productoId});
  }
  vecesComprado(nombreProducto:string):Observable<any>{
    return this.http.post(`${this.apiUrl}/ochentaycuatro`, {nombreProducto});
  }

}
