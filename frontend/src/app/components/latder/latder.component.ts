// latder.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { CarritoService } from '../../services/carrito.service';
import { RouterModule, Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { Subscription } from 'rxjs';
import { CarritoItem } from '../../models/carrito-item.model';
import { WishlistService } from '../../services/wishlist.service';
import { interval, startWith, switchMap } from 'rxjs';


@Component({
  selector: 'app-latder',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './latder.component.html',
  styleUrls: ['./latder.component.css']
})
export class LatderComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  totalItems: number = 0;
  totalSum: number = 0; 
  cliente: Cliente | null = null;

  topDeseados: any[] = [];


  suscripcionCliente!: Subscription;
  suscripcionCarrito!: Subscription; // Tenemos q suscribirnos porque si no no actualiza hasta que hacemos click sobre el componente carrito en latder
  suscripcionWishlist!: Subscription;

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    public carritoService: CarritoService,
    public wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Lo primero es comprobar si está login el usuario y quién es
    this.clienteService.isLoggedIn$.subscribe((login) => {
      this.isLoggedIn = login;
      if (login) {
        this.suscripcionCliente = this.clienteService.cliente$.subscribe((cl) => {
          this.cliente = cl; // Guardo el cliente suscrito
  
          if (this.cliente && this.cliente._id) {
            // Si tenemos cliente entonces traemos el carrito para esta ID en el init
            this.carritoService.obtenerCarrito(this.cliente._id).subscribe(
              () => {}, // La actualización del carrito se maneja en la suscripción a 'carrito$'
              (error) => {
                console.error('Error al obtener el carrito inicial:', error);
              }
            );
    
            // Me suscribo para obtener el carrito con todos sus item, tengo producto, precio y cantidad. Además de laf echa
            this.suscripcionCarrito = this.carritoService.carrito$.subscribe((cosas: CarritoItem[]) => {
              if (cosas) {
                console.log('Carrito recibido en latder:', cosas); // Depuración
  
                cosas.forEach((item, index) => {
                  console.log(`Item ${index + 1}:`);
                  console.log(`  Producto: ${item.producto.nombre}`);
                  console.log(`  Precio: ${item.producto.precio}`);
                  console.log(`  Cantidad: ${item.cantidad}`);
                });
  
                // TOTAL ITEMS con .reduce, sumamos a item.cantidad (desde 0)
                this.totalItems = cosas.reduce((acc: number, item: CarritoItem) => acc + item.cantidad, 0);
                
                // Lo mismo pero con item.producto.precio
                this.totalSum = cosas.reduce((acc: number, item: CarritoItem) => {
                  if (item.producto && typeof item.producto.precio === 'number') {
                    return acc + (item.producto.precio * item.cantidad);
                  } else {
                    console.warn(`Producto con ID ${item.producto._id} no tiene precio definido.`);
                    return acc;
                  }
                }, 0);
                
                console.log('Total de Items:', this.totalItems);
                console.log('Total Calculado:', this.totalSum);
              }
            }, (error) => {
              console.error('Error al obtener el carrito:', error);
            });
          } else {
            // Resetear totales si no hay cliente (porque a veces se queda al cambiar de usuario el carrito del anterior hasta q hacíamos click en este componente)
            this.totalItems = 0;
            this.totalSum = 0;
            console.warn('Cliente no definido, no se puede cargar el carrito.');
          }
        });
      } else {
        // si hacemos logout tenemos que resetear a 0 el carrito
        this.totalItems = 0;
        this.totalSum = 0;
      }
    });

    //ACTUALIZO LA LISTA DE DESEADOS DE LA DERECHA CADA 2 SEGUNDOS, EN LUGAR DE MANTENER LA SUB ACTIVA PERMANENTEMENTE
    this.suscripcionWishlist = interval(2000).pipe(
      startWith(0),  
      switchMap(() => this.wishlistService.obtenerTopDeseados())
    ).subscribe({
      next: (data) => {
        this.topDeseados = data;
      },
      error: (error) => {
        console.error('Error al obtener top 5 deseados:', error);
      }
    });
  }
  
  irAVerTodasValoraciones(): void {
    this.router.navigate(['/valoraciones']);
  }
  ngOnDestroy(): void {
    if (this.suscripcionCliente) this.suscripcionCliente.unsubscribe();
    if (this.suscripcionCarrito) this.suscripcionCarrito.unsubscribe();
    if (this.suscripcionWishlist) this.suscripcionWishlist.unsubscribe();
  }

}
