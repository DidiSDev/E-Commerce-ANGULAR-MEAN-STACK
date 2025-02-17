import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { Producto } from '../models/producto.model';
import { ClienteService } from './cliente.service';
import { CarritoItem } from '../models/carrito-item.model'; //IMPORTAMOS INTERFACE
import { HttpClient } from '@angular/common/http';

/**COSAS A TENER EN CUENTA */
//1- IMPORTAR "Injectable" PARA QUE ESTA CLASE FUNCIONE COMO UN SERVICIO
//2- rxjs es una librería para flujo de datos y eventos asíncronos
//3- BehaviorSubject es un observable que almacena el VALOR ACTUAL y emite automáticamente ese valor a cualquiera que se suscriba.
/**
 *4- Observable es un "canal" de datos que emite valores y al q nos podemos suscribir*/
//AL PASARLO AL BACKEND YA NO NECESITAMOS OnDestroy

@Injectable({
  providedIn: 'root' //ESTA LINEA INDICA Q SE PROVEE ESTE SERVICIO A NIVEL GLOBAL EN LA APLICACIÓN
})
export class CarritoService {
  
  //DEFINIMOS URL
  private URL= 'http://localhost:3000/api/carrito';

  private carritoSubject = new BehaviorSubject<any[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  //DEFINIMOS HTTP "HttpClient"
  constructor (private http:HttpClient){}

  obtenerCarrito(idUsuario:string):Observable<any> {
    return this.http.get(`${this.URL}/${idUsuario}`).pipe(
      tap((carrito:any)=>{
          this.carritoSubject.next(carrito.items || []);
      })
    );
  }

  obtenerTodosLosCarritos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/toditos`).pipe(
        tap((carritos) => console.log('respuesta backend', carritos))
    );
}



agregarCarrito(idUsuario: string, productoId: string, cantidad: number = 1): Observable<any> {
  return this.http.post(`${this.URL}/agregar`, { idUsuario, productoId, cantidad }).pipe(
    tap((carrito: any) => {
      // Validar que cada producto tenga datos completos
      const items = carrito.items.map((item: any) => {
        if (!item.producto || typeof item.producto.precio !== 'number') {
          console.warn(`El producto con ID ${item.producto?._id} no tiene precio.`);
        }
        return item;
      });

      this.carritoSubject.next(items); // Emitir los datos al BehaviorSubject
    })
  );
}



  decrementarProducto (idUsuario:string, productoId:string):Observable<any>{
    return this.http.post(`${this.URL}/decrementar`, {idUsuario, productoId}).pipe(
      tap((carrito:any)=>{
        this.carritoSubject.next(carrito.items || []);
      })
    );  
  }

  vaciarCarrito (idUsuario:string):Observable<any>{
    return this.http.post(`${this.URL}/vaciar`, {idUsuario}).pipe(
      tap((carrito:any) => {
        this.carritoSubject.next(carrito.items || []);
      })
    );
  }

 
}