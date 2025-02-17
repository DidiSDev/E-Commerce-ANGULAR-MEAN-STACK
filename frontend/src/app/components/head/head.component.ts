// head.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  username: string = '';
  totalItems: number = 0;
  private subscriptions: Subscription = new Subscription();
  cliente: Cliente | null = null;
  suscripcionCliente!:Subscription;

  constructor(private clienteService: ClienteService, private router: Router, public carritoService: CarritoService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.clienteService.isLoggedIn$.subscribe((EstoyLogin) => {
        this.isLoggedIn = EstoyLogin;
        this.username = EstoyLogin ? this.clienteService.getCliente()?.nombre || '' : '';
      })
    );

    this.suscripcionCliente=this.clienteService.cliente$.subscribe((cli) => {

      this.cliente=cli;
    });


    if (this.cliente && this.cliente._id)
      {
        this.subscriptions.add(
     
     
          this.carritoService.carrito$.subscribe((carrito) => {
            this.totalItems = carrito.reduce((acc: any, item: { cantidad: any; }) => acc + item.cantidad, 0);
          })
        );
      }
   
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.clienteService.logout();
    alert('Has cerrado sesión.');
    this.router.navigate(['/login']);
  }
}
