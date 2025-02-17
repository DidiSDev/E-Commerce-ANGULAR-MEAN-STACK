import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosComponent } from '../productos/productos.component';
import { ClienteService } from '../../services/cliente.service';
import { Producto } from '../../models/producto.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, ProductosComponent],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit, OnDestroy {

  username: string = '';
  private subscription!: Subscription;

  constructor(private cls: ClienteService) { }

  ngOnInit(): void {
    const cliente = this.cls.getCliente();
    this.username = cliente ? cliente.nombre : '';
    
    this.subscription = this.cls.isLoggedIn$.subscribe(
      (loggedIn) => {
        if(loggedIn) {
          const cliente = this.cls.getCliente();
          this.username = cliente ? cliente.nombre : '';
        } else {
          this.username = '';
        }
      }
    );
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
