// src/app/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cliente.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  /**EN ORIGEN TENEMOS
   * isLoggedInSubject = new BehaviorSubject<boolean>(false) que indica que NO TENEMOS NADIE CONECTADO, con .next(true) en login le daremos el true
   * lo mismo con clienteSubject, será null en inicio porque no hay ndaie conectado...
   * 
   * en el constructor traemos httpp que cargara al cliente storedCliente = localStorage.getItem('cliente');
   * y si existe, lo parseamos a json y lo establecemos
   */
  private apiUrl = 'http://localhost:3000/api/cliente'; // Asegúrate de que esta URL es correcta
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private clienteSubject = new BehaviorSubject<Cliente | null>(null);
  public cliente$ = this.clienteSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar cliente desde localStorage si existe, localStorage es una API nativa de los navegadores, almacena datos clave-valor
    //ofrece metodos par aescribir leer y eliminar datos .getItem, .setItem
    /**2. ¿Qué Hace .getItem('cliente')?
    .1. Significado
    typescript
    Copiar código
    const storedCliente = localStorage.getItem('cliente');
    localStorage.getItem('cliente') busca en el almacenamiento del navegador una clave llamada 'cliente'.
    Si encuentra esa clave, devuelve el valor asociado.
    Si no encuentra la clave, devuelve null. */
    const storedCliente = localStorage.getItem('cliente');
    if (storedCliente) {
      const cliente: Cliente = JSON.parse(storedCliente);
      this.clienteSubject.next(cliente);
      this.isLoggedInSubject.next(true);
    }
  }

  /**
   * 8- registrar recoge el cliente que traemos instanciado de register.component.ts con los datos recogidos del formulario de register.component.html
   * esta función de cliente.service.ts es un :Observable<any> que va a devolver la respuesta http del post que contacta con
   * clienteRoutes.js que a su vez con clienteController.js, aqui simplemente mostramos la respuesta
   * 
   * Es decir, this.http.post<any>(`${this.apiUrl}/register`, cliente).pipe(tap(res => { this.setCliente(res.cliente)}))
   * envía  un POST al endpoint /register con los datos del cliente en el cuerpo de la solicitud,
   * devuelve un observable con la respuesta del backend para que el componente pueda manejarla
   * 
   * 9- NOS VAMOS AL clienteRoutes.js
   * 
   */
  registrar(cliente: Cliente): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, cliente).pipe(
      tap(response => {
        if (response && response.cliente) {
          this.setCliente(response.cliente);
          alert(response.mensaje || 'Registro exitoso');
        }
      })
    );
  }

  // Método login que envía { usuario, password: pass } al backend
  /**AHORA LLEGAMOS AQUI DESDE EL .TS DEL LOGIN TRAS PULSAR EN SUBMIT, HEMOS TRAIDO USUARIO Y PASS Y ESTA FUNCION DEL SERVICIO ES
   * UN OBSERVABLE, QUE ESPERA CUALQUIER DATO...
   * HAY QUE RETORNAR ALGO .. this.http.post<any>(`${this.apiUrl}/login, {usuario, password:pass}).pipe(tap(response =>{if (response && response.cliente){
   * this.setCliente(response.cliente);}}))`)
   * que activa la funcion de debajo, recibe un cliente y enviamos el subject para el Behavior, informamos que ahora hay login, con .next(true) y sujeot con.next(este cliente)
   * Finalmente accedemos a localStorage con .setItem y le pasamos este clienet, parseado a JSON.stringify, localStorage es una función propia de los navegadores
   * y por tanto, la función .setItem tambien
   * 
   * EL ROL DEL SERVICIO ES CONSTRUIR EL CUERPO DE LA SOLICITUD HTTP.POST:
   *  {
        "usuario": "nombre_usuario",
        "password": "password_usuario"
      }

   * pero el POST va a llamar a clienteController.js, vamos allí
   */
  login(usuario: string, pass: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { usuario, password: pass }).pipe(
      tap(response => {
        if (response && response.cliente) {
          this.setCliente(response.cliente);
          alert(response.mensaje || 'Inicio de sesión exitoso');
        }
      })
    );
  }

  // Método setCliente para actualizar el estado del cliente
  setCliente(cliente: Cliente): void {
    this.clienteSubject.next(cliente);
    this.isLoggedInSubject.next(true);
    localStorage.setItem('cliente', JSON.stringify(cliente));
  }

  logout(): void {
    this.clienteSubject.next(null);
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('cliente');
  }

  getCliente(): Cliente | null {
    return this.clienteSubject.value;
  }

  getClientes(): Observable<any>
  {
    return this.http.get(`${this.apiUrl}/getClientes`);
  }
  //RECIBE ARRAY DE CLIENTES
  eliminarClientes(clientes:string[]):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/eliminarlos`, {clientes});
  }

  eliminarUno(_id:string):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/eliminarUno`, {_id});
  }



}
