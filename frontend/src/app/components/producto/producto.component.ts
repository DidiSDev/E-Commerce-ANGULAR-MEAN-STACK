import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { ComprasService } from '../../services/compras.service';
import { Cliente } from '../../models/cliente.model';
import { WishlistService } from '../../services/wishlist.service';
import { ClienteService } from '../../services/cliente.service';
import { ValoracionService } from '../../services/valoracion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  /**13- Recogemos el producto, si es admin o si está login,
   * 14- emitimos los botones en función de si está login o es admin o no, vamos al .HTML
   * 
   */
  @Input() producto!: Producto;
  @Input() isAdmin: boolean = false;
  @Input() isLoggedIn: boolean = false;

  promedio: number = 0;
  totalValoraciones: number = 0;
  mostrarBotonValoracion: boolean = false;
  
  cantidadClientes =new Set();
  clientes!: Cliente;
  interruptor=false;
  @Output() agregarAlCarrito = new EventEmitter<string>();
  @Output() editar = new EventEmitter<Producto>();
  @Output() eliminar = new EventEmitter<string>();
  @Output() numClientes = new EventEmitter<number>();

  constructor(private wishlistService: WishlistService,
    private clienteService: ClienteService,
    private compraService: ComprasService, private valoracionService: ValoracionService, private router:Router){}
    ngOnInit(): void {
      if (this.isLoggedIn && this.producto._id) {
        this.obtenerPromedioValoracion();
        this.verificarValoracion();
      }
    }

    obtenerPromedioValoracion(): void {
      this.valoracionService.obtenerValoracionPromedio(this.producto._id!).subscribe({
        next: (data) => {
          this.promedio = data.promedio;
          this.totalValoraciones = data.totalValoraciones;
        },
        error: (err) => console.error('Error: ', err)
      });
    }
    verificarValoracion(): void {
      const cliente = this.clienteService.getCliente();
      if (cliente && cliente._id && this.producto._id) {
        //PARA QUE APAREZCA EL BOTÓN NECESITO SABER SI YA HA COMPRADO
        this.compraService.obtenerComprasCliente(cliente._id).subscribe(compras => {
          let comprado = false;
          compras.forEach(compra => {
            compra.productos.forEach(prod => {
              if (typeof prod.nombre === 'string') {
                if (prod.nombre === this.producto.nombre) {
                  comprado = true;
                }
              } else {
                //CASTEO A ANY PORQUE NO RECONOCE LA ID
                const prodObj = prod.productoId as any;
                if (prodObj?._id === this.producto._id) {
                  comprado = true;
                }
              }
            });
          });
          if (comprado) {
            //TAMBIÉN NECESITO SABER SI YA LO HA VALORADO
            this.valoracionService.obtenerValoracionesProducto(this.producto._id!).subscribe(valoraciones => {
              const yaValorado = valoraciones.some(val => {
                if (typeof val.clienteId === 'string') {
                  return val.clienteId === cliente._id;
                } else {
                  const cliObj = val.clienteId as any;
                  return cliObj?._id === cliente._id;
                }
              });
              this.mostrarBotonValoracion = comprado && !yaValorado;
            });
          }
        });
      }
    }
    
    

  onEditar(): void {
    this.editar.emit(this.producto);
  }

  onEliminar(): void {
    this.eliminar.emit(this.producto._id);
  }
  
  onAgregarAlCarrito(): void {
    this.agregarAlCarrito.emit(this.producto._id);
  }

  numeroClientesBack():void
  {
    if (this.producto._id)
    this.compraService.getNumeroClientes(this.producto._id).subscribe((numero)=>{
      alert ("EL NUMERO DE CL QUE HA COMPRADO ESTE PRODUCTO ES : "+ numero);
    })
  }

  abrirCrearValoracion(): void {
    this.router.navigate(['/crear-valoracion', this.producto._id]);
  }

  numeroClientes():void
  {

     this.cantidadClientes.clear();//EMPEZAR VACIO


    this.compraService.getCompras().subscribe((clientes)=>{
      for (const cliente of clientes)
      {
        this.compraService.getTodasLasCompras().subscribe((compras)=>{
          for (const compra of compras)
          {
            for (const producto of compra.productos)
            {
              console.log('PRODUCTO: ', producto);
              console.log('producto._id', producto.productoId._id);
              console.log('this.producto._id', this.producto._id);
              if (producto.productoId._id === this.producto._id)
              {
                console.log('CANTIDAD DE CLIENTES HE AÑADIDO AL ID DE CLIENTE: ', cliente._id);
                  this.cantidadClientes.add(cliente._id);
                  console.log('VARIABLE CANTIDAD CLIENTES: ', this.cantidadClientes);
               
              }
            }
          }
           
        })
        
      }

      //UNA VEZ RECORRIDOS TODOS LOS CLIENTES, SET ALMACENA SOLO LOS DISTINTOS.


     this.interruptor=true;
      
    })
   
    
  }
  onAgregarWishlist(): void {
    const cliente = this.clienteService.getCliente();
    if (!cliente || !cliente._id) {
      alert('¡¡ERROR!! Debes iniciar sesión para agregar a deseados');
      return;
    }
    this.wishlistService.agregarDeseado(cliente._id, this.producto._id!).subscribe({
      next: () => {
        alert('¡¡Producto agregado a tu lista de deseados correctamente!!');
      },
      error: (err) => {
        alert(err.error.mensaje || 'Error al agregar a deseados');
      }
    });
  }
}
