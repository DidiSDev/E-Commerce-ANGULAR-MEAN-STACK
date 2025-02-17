// carrito.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { ComprasService } from '../../services/compras.service';
import { Compra } from '../../models/compra.model';
import { CarritoItem } from '../../models/carrito-item.model';
import { Cliente } from '../../models/cliente.model';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {

  cartItems: CarritoItem[] = [];
  total: number = 0;
  private subscription!: Subscription;
  //TODAS LAS FUNCIONES AHORA REQUIEREN DEL USER ID
  private clienteSuscripcion!:Subscription;
  cliente:Cliente | null = null;
  vecesCompradoProd : {[IdProducto:string]:number}= {};
 
  interruptor82=true;

  constructor(
    private carritoService: CarritoService, 
    private router: Router, 
    private clienteService: ClienteService,
    private comprasService: ComprasService
  ) {}

  ngOnInit(): void {

    this.clienteSuscripcion = this.clienteService.cliente$.subscribe((cliente) => {
      this.cliente = cliente;
    
      if (this.cliente && this.cliente._id) {
        this.subscription = this.carritoService.obtenerCarrito(this.cliente._id).subscribe(
          (carrito) => {
            this.cartItems = carrito.items;
            this.calculateTotal();
            //HH -1
            //this.vecesComprado();
            console.log('Carrito actualizado:', this.cartItems);
          },
          (error) => {
            console.error('Error al obtener el carrito:', error);
          }
        );
      } else {
        console.warn('Cliente no definido, no se puede cargar el carrito.');
      }
    });
    
  }

  vecesComprado()
  {
    this.comprasService.getTodasLasCompras().subscribe((compras)=>{
      const contador :{[idprod:string]:number}={};
      for (const compra of compras)
      {
          for (const producto of compra.productos)
          {
            console.log('A VEEEEEEEEEEEER: ', producto.productoId._id);
            if (producto.productoId._id && producto.productoId)
            {
              
              if (contador[producto.productoId._id])
                {
                  
                  contador[producto.productoId._id]++;
                }
                else
                {
                  contador[producto.productoId._id]=1;
                }
            }
        
           
          }
      }
      console.log('CONTADOR: ', contador); //EL CONTADOR ALMACENA CADA ID CON SU POROPIO VALOR
      this.vecesCompradoProd= contador;
    })
  }

  //SAGIT QUE COMPRUEBA CATEGORÍAS ANTES DE REALIZAR LA COMPRA Y PERMITE EL PASO EN CASO DE SER TODAS EQUIUAL
  formalizarCarrito()
  {
    if (this.cliente?._id)
    this.carritoService.obtenerCarrito(this.cliente?._id).subscribe((carrito)=>{
        let boolean = true;
        let categorias = new Set();
      for (const producto of carrito.items)
      {
          //RECORREMOS CADA PRODUCTO Y AÑADIMOS CADA CATEGORIA, COMO PRODUCTO ESTÁ "REFERENCIADO" EN compra.js TENEMOS QUE HACER producto.producto.categoria :)
          categorias.add(producto.producto.categoria);

      }
      if (categorias.size > 1)
      {
        boolean = false; //NO PERMITIMOS LA COMPRA PORQUE HAY MAS DE 1 CATEGORIA, NO SON TODOS LOS PRODUCTOS DE LA MISMA CATEGORIA
        alert( "NO SON TODOS LOS PRODUCTOS DE LA MISMA CATEGORIA");
      }
      else{
        //SIGNIFICA QUE SON TODAS DE LA MISMA CATEGORIA, PERMITIMOS:

        this.hacerCompra();
      }
    })
  }
  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.clienteSuscripcion.unsubscribe();
  }

  eliminarUnidad(productoId: string): void {
    if (productoId) {
      if (this.cliente && this.cliente._id)
      this.carritoService.decrementarProducto(this.cliente?._id,productoId).subscribe((carrito)=>{
        this.cartItems=carrito.items;
        this.calculateTotal();
    });
    } 
  }

  limpiarCarrito(): void {
    if(confirm('¿Deseas vaciar todo el carrito?')){
      if (this.cliente && this.cliente._id)
      this.carritoService.vaciarCarrito(this.cliente?._id).subscribe((carrito)=>{
        this.cartItems = carrito.items;
      });
    }
  }


  hacerCompra(): void {
    const cliente = this.clienteService.getCliente();
    const clienteId = cliente?._id;

    if (!clienteId) {
      alert('Cliente no identificado');
      return;
    }

    const datosCompra: Compra = {

      clienteId: clienteId,
      productos: this.cartItems.map(item => ({
        productoId: item.producto._id!,
        cantidad: item.cantidad,
        
      })),
      total: this.total,
      // _id y fecha son opcionales y no se incluyen aquí
    };

    //SAGIT EJEMPLO DE HACERCOMPRA()
    // const productos= this.cartItems.map(item => ({productoId:item.producto._id!,cantidad:item.cantidad}));

    // //DEFINO LA FUNCION DE FORMA ABREVIADA
  
    // this.comprasService.eliminarProductosUsuario(clienteId, productos).subscribe((probandoOk)=>
    // {
    //   alert ('TODO OK');
    //   console.log('todo OK:', probandoOk);
    //   this.carritoService.vaciarCarrito(clienteId).subscribe(()=>{
    //     this.cartItems=[];
    //     this.total=0;
    //     this.router.navigate(['/compras']);
      
    //   })
    // }, (error)=>{
    //   console.log('error',error);
    // })
   




  //   ESTE ES EL BUENO CON EL EJEMPLO DE next:() PERO ES MÁS FÁCIL DE LA FORMA ABREVIADA
   this.comprasService.realizarCompra(datosCompra).subscribe({
      next: () => {
        alert('¡COMPRA REALIZADA!');
        if (this.cliente && this.cliente._id)
          //NO PUEDO PONER limpiarCarrito() PORQUE VOLVERA A SALIR EL MENSAJE "DESEAS VACIAR EL CARRO?"
        this.carritoService.vaciarCarrito(this.cliente._id).subscribe((carrito)=>{
          this.cartItems=carrito;
        })
        this.router.navigate(['/compras']);
      },
      error: (error) => {
        console.error('Error', error);
        const mensaje = error?.error?.mensaje || 'Ocurrió un error al realizar la compra';
        alert(mensaje);
      }
    });

    
  }

  comprarCarrito():void
  {
    
    let objetos = new Set();
    this.clienteService.cliente$.subscribe((cliente)=>
    {
      if (cliente?._id)
      {
        this.comprasService.obtenerComprasCliente(cliente._id).subscribe((compras)=>{
          for (const compra of compras)
          {
            for (const producto of compra.productos)
            {
              objetos.add(producto.nombre) //AÑADIMOS TODOS LOS PRODUCTOS COMPRADOS
              console.log('PRODUCTO AÑADIDO A OBJETOS: ', producto.nombre); //SE AÑADEN BIEN LOS PRODUCTOS
            }
          }

          const objetosComprados = Array.from(objetos);
        for (const item of this.cartItems)
        {
          console.log('ITEM del carrito: ',item.producto.nombre );
          if (!objetosComprados.includes(item.producto.nombre))
          {
            this.interruptor82=false; //SI EN ALGUN MOMENTO NO ENCUENTRA ENTRE LOS OBJETOS COMPRADOS ALGUN ITEM DEL CARRITO... FALSE Y FUERA
            alert("ESE PRODUCTO NO LO HAS COMPRADO, FUERA!!");
            return;
          }
        
        }
         //AL TERMINAR, SI TODO FUE BIEN, PERMITIMOS COMPRAR...
    console.log('INTERRUPTOR ESTA EN: ', this.interruptor82);
    if (this.interruptor82)
    {
      this.hacerCompra();
    }
      //TODA LA LOGICA DEBE IR DENTRO DEL MISMO .SUBSCRIBE, SI NO, NO SE ACTUALIZA CORRECTAMENTE
        })   
      }
    })
  
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  }



}
