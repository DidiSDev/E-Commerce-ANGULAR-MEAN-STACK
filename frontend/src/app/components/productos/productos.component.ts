// productos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';
import { ProductoComponent } from '../producto/producto.component';
import { CarritoService } from '../../services/carrito.service';
import { ClienteService } from '../../services/cliente.service';
import { FormularioAltaComponent } from "../formulario-alta/formulario-alta.component";
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ComprasService } from '../../services/compras.service';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ProductoComponent, FormularioAltaComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy{


  /**QUÉ DEBEMOS SABER?
   * Desde lo básico, los import* component, OnInit y OnDestroy para definir el componente y manejar su ciclo de vida
   * - ProductService importado para interactuar con la API de productos
   * - CarritoService para agregar productos al carrito
   * - ClienteService para manejar información del cliente y autenticación
   * 
   * Producto Define la estructura de datos de un producto
   * -FormularioAltaComponent es un componente REUTILIZABLE para agregar/editar productos
   * -Subscription maneja suscripciones (RxJS) para eventos REACTIVOS, es lo que nos explicó Ángel de la programación reactiva
   * 
   */
  productos: Producto[] = [];
  productosFiltrados :any;
  interruptor: boolean = false;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private categoriaSuscrita!: Subscription;

  /**Aqui simplemente tenemos los productos TRAIDOS desde el backend
   * el interruptor que activa o desactiva agregar/editar/eliminar productos
   * isLoggedIn otro interruptor de si el user está autenticado
   * isAdmin de si es admin o no
   * categoriaSuscrita es una Suscripción reactiva al cambio de categoría
   */

  constructor(
    public productosService: ProductService,
    private carritoService: CarritoService,
    private clienteService: ClienteService,
    private compraService: ComprasService
  ) { }
  /**En el constructor INJECTAMOS TODOS LOS SERVICIOS, que son los 3 necesarios (producto, carrito y cliente) */


  ngOnDestroy(): void {
    if (this.categoriaSuscrita){
    
      this.categoriaSuscrita.unsubscribe();
    }
  }

  //1- CICLO DE VIDA ES 1.1 OBTENER TODA LA LISTA DE PRODUCTOS AL INICIAR
  //2- SUSCRIBIR A CAMBIOS DE AUTENTICACION (isLoggedIn)
  //3- MANEJAR SELECCION DE CATEGORIAS PARA FILTRAR PRODUCTOS, así que tenemos 2 funciones, obtenerProductos y obtenerProductosPorCategoria

  ngOnInit(): void {

    //Necesito enviar de alguna forma a las categorías que pueden mostrarse

    this.obtenerProductos();
    this.clienteService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn; 
      const cliente = this.clienteService.getCliente();
      this.isAdmin = cliente?.admin ?? false; //?. se llama a un encadenamiento opcional y permite acceder a una propiedad de un objeto SOLAMENTE si ese objeto NO ES NULL ni UNDEFINED
    }); //EL operador "??" se llama coalescencia nula, proporciona un valor predeterminado (false) si cliente.admin es "null" o "undefined"
    
    
    
    /**tonces:
ProductService es usado para realizar una solicitud HTTP GET al backend y obtener TODOS los productos...

this.clienteService.isLoggedIn$.subscribe

isLoggedIn$ es un observable proporcionado por ClienteService, que emite booleanos (true o false)

indican si el usuario esta autenticado
subscribe es para realmente comprobar si hay cambios en la autenticacion del usuario, cunado cambia.. ejecutamos lo siguiente:
AL HABER CAMBIOS:

Actualizamos this.isLoggedIn CON EL ESTADO DE AUTENTICACION
Obtenemos el cliente actual con this.clienteService.getCliente()
verificamos si es admin o no, con cliente?.admin ?? false */

    //ME SUSCRIBO A LA CATEGORIA SELECCIONADA
    this.categoriaSuscrita = this.productosService.selectedCategory$.subscribe(categoria=>{
      if (categoria === 'Todos')
      {
        this.obtenerProductos();
      }
      else{
        this.obtenerProductosPorCategoria(categoria);
      }
    })
  }

  //Recibimos parametro categoria y buscamos con suscripcion, trayendo un array data:Producto[] con todos aquellos que tienen dicha categoria
  /**ESTO CONECTA CON productos.service.ts y esta funcion:
   * 
   *   obtenerProductosPorCategoria(categoria:string):Observable<Producto[]>{
       return this.http.get<Producto[]>(`${this.URL}/categoria/${categoria}`);
     }
   // Añadir dentro de la clase ProductService
   private selectedCategorySubject = new BehaviorSubject<string>('Todos');
   selectedCategory$ = this.selectedCategorySubject.asObservable();
   
   seleccionarCategoria(categoria: string) {
     this.selectedCategorySubject.next(categoria);
   }
   
   */

   filtrarProductos()
   {  
      //como ya tenemos this.productos actualizados tras el click, se llamara a este nuevo metodo despues SIEMPRE
      let antesDeFiltrar = new Set();
      this.clienteService.cliente$.subscribe((cliente)=>{
        if (cliente?._id)
          this.compraService.obtenerComprasCliente(cliente._id).subscribe((compras)=>{
            for (const compra of compras)
            {
              for (const producto of compra.productos)
              {
                //MIENTRAS RECORRO CADA PRODUCTO DE COMPRA TAMBIEN RECORRO LAS CATEGORIAS OTRA VEZ
                for (const p of this.productos)
                {
                  if (producto.nombre === p.nombre)
                  {
                    //SI COINCIDE QUE EL PRODUCTO TIENE NOMBRE EN UNA COMPRA CON ALGUNO DE LOS PRODUCTOS DE this.productos
                    antesDeFiltrar.add(p);
                  }
                }
              }
            }
            //DENTRO DEL MISMO SUBSCRIBE YA LE CREO:
            this.productosFiltrados = Array.from (antesDeFiltrar);
          })
      })
   }
   //ESTA FUNCION SE ACTIVA CADA VEZ QUE HAGO CLICK EN CATEGORIA
  obtenerProductosPorCategoria(categoria:string):void{
    this.productosService.obtenerProductosPorCategoria(categoria).subscribe(
      (data:Producto[])=>{
        this.productos = data;
        console.log(`Productos de categoría ${categoria}:`, this.productos);
        //this.filtrarProductos();
      },
      (error)=>{
        console.error(`Error al obtener productos de categoría ${categoria}:`, error);
      }
    )
  }
  //sin categoria obtenemos TODOS los productos, se activa al hacer click en "TODOS"
  obtenerProductos(): void {
    this.productosService.mostrarProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
        //this.filtrarProductos();
        console.log('Productos recibidos:', this.productos);
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  //ESTE MÉTOOD CAMBIA EL ESTADO DE THIS.INTERRUPTOR CUANDOE S LLAMADO
  AlternarYAgregar(): void {
    this.interruptor = !this.interruptor;
    if (!this.interruptor) {
      this.productosService.productoSeleccionado = {
        _id: '',
        nombre: '',
        descr: '',
        stock: 0,
        precio: 0,
        imagen: '',
        categoria: 'League of Legends',
      };
    }
  }

  //Esto sencillamente recoge el producto entero (NO LA ID) porque podemos modificar cualquier campo, y se lo enviamos a...producto en los servicios,
  //Tawmbien activamos de nuevo el formulario para modificar
  /**IMPORTANTÍSIMO!!!
   * 
   * la propiedad this.productosService.productoSelecciondao = { ...producto }; lo que hace es COPIAR EN ESE OBJETO PRODUCTO DEL SERVICIO, LOS DATOS
   * QUE ACTUALMENTE TENEMOS EN "producto" TRAIDO EN EL CONSTRUCTOR DESDE EL HIJO PRODUCTO, ES DECIR, APARECERÁ UN FORMULARIO PARA MODIFICAR
   * PERO AUTOMÁTICAMENTE SERÁ RELLENADO CON LOS DATOS DE ESE PRODUCTO GRACIAS A ...producto
   * 
   */
  editarProducto(producto: Producto): void {
    this.productosService.productoSeleccionado = { ...producto };
    this.interruptor = true;
  }

  eliminarProducto(productoId: string): void {
    if (confirm('¿Realmente desea eliminar este producto?')) {
      this.productosService.eliminarProducto(productoId).subscribe(
        res => {
          console.log('Producto eliminado:', res);
          this.obtenerProductos(); // Actualiza la lista inmediatamente
        },
        err => {
          console.error('Error al eliminar el producto:', err);
        }
      );
    }
  }

  //8- Simplemente cambiamos el interruptor a false porque ya hemos actualizado o dado de alta, y volvemos a llamar a la lista de productos
  //si hay alguno nuevo o actualizado, se mostrará directamente, pero no hemos visto qué ha ocurrido al llamar a:
  // this.productoService.crearProducto(producto).subscribe({                    VAMOS ALLÍ ->
  onProductoAnadido(): void {
    this.interruptor = false;
    this.obtenerProductos(); // Refresca la lista tras añadir o editar un producto
  }

  /**16- Si por ejemplo ESTA LOGIN y NO ES ADMIN, activamos esta funcion que recibe la ID desde el hijo, hacemos un .find y buscamos el producto
   * si existe, lo añadimos al carrito (que actualmente no gestiona con BBDD, sino que lo añade a localStorage del navegador)
   * No hace falta validacion porque si no existe el producto no puede tener este boton
  */
  agregarAlCarrito(productoId: string): void {
    const producto = this.productos.find(p => p._id === productoId);
  
    if (producto) {
      const cliente = this.clienteService.getCliente(); // Obtener el cliente login
  
      if (!cliente || !cliente._id) {
        alert('Debes iniciar sesión para añadir productos al carrito');
        return;
      }
  
      // Usamos el servicio del carrito para agregar el producto
      this.carritoService.agregarCarrito(cliente._id, productoId, 1).subscribe(
        res => {
          console.log('Carrito actualizado:', res);
        },
        err => {
          console.error('Error al agregar producto al carrito:', err);
          alert('Ocurrió un error al añadir el producto al carrito');
        }
      );
    } else {
      console.error('Producto no encontrado en la lista local');
      alert('El producto seleccionado no existe');
    }
  }
  
  
}
