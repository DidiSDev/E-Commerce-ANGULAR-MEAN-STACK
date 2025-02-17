import { Injectable } from '@angular/core'; //IMPORTAMOS INJECTABLE PARA DEFINIR UN SERVICIO, ES DECIR, Q PUEDA SER INJECTADO EN OTROS COMPONENTES O SERVICIOS
import { HttpClient } from '@angular/common/http'; //PARA HACER PETICIONES HTTP
import { Observable } from 'rxjs'; // MANEJAMOS RESPUESTAS ASÍNCRONAS CON Observable (ES COMO UNA SUSCRIPCION, QUE ESPERA A Q OCURRA ALGO)
import { Producto } from '../models/producto.model'; //IMPORTAMOS LA INTERFAZ DEL PRODUCTO, no la clase

import { BehaviorSubject } from 'rxjs';

//AUTOMÁTICAMENTE SE CREA CON 
@Injectable({
  providedIn: 'root'
})

/**
 * ¿Por qué Usar un Servicio?
Centralización: Toda la lógica de comunicación con la API está en un solo lugar...
 */
export class ProductService {
 
  //AQUI HAY QUE CONECTAR CON API
  readonly URL = 'http://localhost:3000/api/productos';    //Esta va a ser la URL base de la API de productos...

  productoSeleccionado: Producto = {
    _id: '',
    nombre: '',
    descr: '',
    stock: 0,
    precio: 0,
    imagen: '',
    categoria: 'League of Legends'
  };
   //ESTE ES EL PRODUCTO QUE EL USER HA SELECCIONADO

  //AL CONSTRUCTOR LE PASAMOS HTTP COMO PARÁMETRO EN EL SERVICIO
  //ES DECIR, "INJECTAMOS" EL SERVICIO HttpClient PARA PODER USARLO IEN LOS MÉTODOS DEL SERVICIO
  constructor(private http: HttpClient) {
    //VACIO
  }
 /**
  * 
  * Angular usa Observables para manejar las peticiones HTTP
  *  de forma asíncrona. Esto significa que, en lugar de devolver el dato inmediatamente, 
  * devolvemos un Observable que "emitirá" los datos cuando estén disponibles.
  * 
  * Esto significa q cuando queremos obtener datos de un producto específico metemos Observable<Producto>
  * En caso de que solamente deseemos saber si la operacion se ha hecho o no:
  * Observable<any> porque solo nos interesa si la operación se realizó correctamente. No necesitamos un dato específico, solo saber si se eliminó o no o si se creó o no...
  */

  //TODOS LOS PRODUCTOS LOS RECOGEMOS PARA MOSTRAR
  mostrarProductos():Observable<Producto[]>
  {
    return this.http.get<Producto[]>(this.URL); //RETORNAMOS, DEL ARRAY DE TODOS LOS PRODUCTOS,M JUSTAMENTE ESTE
  }
  //CREAR NUEVO PRODUCTO
  //9- DESDE FORMULARIO-ALTA LLAMAMOS A ESTE crearProducto y traemos el objeto recogido del formulario, el observable acepta y retorna la respuesta HTTP
  // this.http.post(this.URL, producto); Y YA, no hace falta gestionar nada más...
  crearProducto(producto:Producto ):Observable<any>
  {
    return this.http.post(this.URL, producto); //Lo posteamos
  }
  //OBTENER UN PRODUCTO POR ID PARA MOSTRARLO
  mostrarProducto(id:string):Observable<Producto>
  {
    return this.http.get<Producto>(`${this.URL}/${id}`);
  }
 //ACTUALIZAR PRODUCTO POR ID. PRODUCTO EN CONCRETO QUE VAMOS A MODIFICAR
  actualizarProducto(id:string, producto:Producto):Observable<any>
  {
    return this.http.put(`${this.URL}/${id}`, producto);
  }
  eliminarProducto(id:string):Observable<any>
  {
      return this.http.delete(`${this.URL}/${id}`);
  }



  /**
   * 
   * Observable<Producto[]> define el TIPO de datos que este método devuelve: es decir, un observable que emite un array dwe productos
   * RxJS maneja observables. Operaciones asíncronas http
   * this.http.get ->  realiza una solicitud HTTP GET
   * this.URL es la definida ARRIBA que es /api/productos conectada con lo de ahora que es /categoria/League of legends (por ejemplo)
   * 
   * LA URL /categoria/"X" debe coincidir con la de productosRoutes.js
   * que en este caso es:  "router.get('/categoria/:categoria', listarPorCategoria);"
   * 
   * :categoria indica el nombre verdadero de la categoria (Valorant o League of legends)
   * 
   * Recordamos que $ escrito al final es para indicar que UNA VARIABLE ES UN OBSERVABLE
   * y BehaviorSubject ES UN TIPO DE OBSERVABLE que se queda con el último valor EMITIDO, asObservable() convierte BehaviorSubject en un
   * observable "normal"
   * 
   * @param categoria 
   * @returns  NADA, está conectado con el productos.component.ts
   * 
   */
  obtenerProductosPorCategoria(categoria:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.URL}/categoria/${categoria}`);
  }
// sleectCategorySubject elieg TODAS las categorias para luego filtrarlo por la categoria recibida en parametros
private selectedCategorySubject = new BehaviorSubject<string>('Todos');
selectedCategory$ = this.selectedCategorySubject.asObservable();


seleccionarCategoria(categoria: string) {
  this.selectedCategorySubject.next(categoria);
}


}
