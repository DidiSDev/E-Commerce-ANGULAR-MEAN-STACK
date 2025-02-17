import { Component, OnInit } from '@angular/core';
import { CarritoItem } from '../../models/carrito-item.model';
import { CarritoService } from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carrito-momento',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './carrito-momento.component.html',
  styleUrl: './carrito-momento.component.css'
})
export class CarritoMomentoComponent implements OnInit{
  
  cartItems:CarritoItem[]=[];
  carritos:any[]=[];
  total:number=0;
  totalGlobal:number=0;
  subtotales: number[] = [];

  constructor (private carritoService:CarritoService){}

  ngOnInit(): void {

    //NADA MAS INICIAR ESTE COMPONENTE NOS SUSCRIBIMOS PERO A SU asObservable, PORQUE NO VAMOS A ENVIAR EL CLIENTE ID, VMAOS A VER TODOS LOS ITEMS DE TODOS LOS CARRITOS DE TODOS LOS USERS

    /**   ESTO ES PARA SOLO 1 CLIENTE, EL ACTUAL
    this.carritoService.carrito$.subscribe((items)=>{
      //SI TODO VA BIEN 
      this.cartItems=items;
      this.calcularTotalEsteCliente();
    },
  (error)=>{console.error('ERROR', error)});


  */


  //SAGIT3 EJEMPLO ESTE ES PARA TODOS LOS CLIENTES, KJUNTO CON calcularSubTotal Y calcularTotalTodos


  // this.carritoService.obtenerTodosLosCarritos().subscribe(
  //   carritos => {
  //     this.carritos = carritos;
  //     this.calcularSubtotales();
  //     this.calcularTotalTodos();
  //   },
  //   err => console.error('error al obtener carritos', err)
  // );
  
  
  
  }

  //SAGIT3 SOLO PARA ESTE CLIENTE,
  private calcularTotalEsteCliente()
  {
    this.total =this.cartItems.reduce((acc, item)=>acc+item.producto.precio * item.cantidad, 0);
  }

  //PARA TODOS LOS CARRITOS DE TODOS LOS CLIENTES

  private calcularTotalTodos()
  {
    this.totalGlobal = this.subtotales.reduce((total, subtotal) => total + subtotal, 0);

  }

  private calcularSubtotales(): void
  {
    //SI this.carritos != array, salimos
    if (!Array.isArray(this.carritos))
    {
      console.log('carritos no esun array', this.carritos);
      return;
    }


    //SI TODO OK Y ES UN ARRAY: POR CADA CARRITO CALCULAMOS LA SUMA DE (PRECIO * CANTIDAD) DE SUS ITEMS..
    //SI NO HAY ITEMS, DEVOLVEMOS 0
    this.subtotales = this.carritos.map(c => c.items?.reduce(
      (acc: number, item: { producto: { precio: number; }; cantidad: number; })=>acc+(item.producto.precio * item.cantidad), 0) ?? 0);
  }

  
  

}
