import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';
import { ProductosComponent } from '../productos/productos.component';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ProductosComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public admin=false;
  

  isLoggedIn: boolean = false;
  username: string = '';
  private subscription!: Subscription;

  constructor(private cls: ClienteService, private router: Router) { }

  ngOnInit(): void {
  // me suscriboal BehaviorSubject para escuchar cambios en el estado de inicio de sesión, porque al conectar sigue apareciendo "login" aunque tengamos el *ngIf,
    //chatgpt me ha dicho que el .suscribe está obsoleto pero depende de donde lo usemos, aquí estamos haciendo una llamada a ese *ngIf directamente, y lo detecta com corrrecto
      this.subscription = this.cls.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
        if(loggedIn) {
          const cliente = this.cls.getCliente();
          this.username = cliente ? cliente.nombre : '';
          if (cliente?.admin==true)
          {
            this.admin=true;
          }
        } else {
          this.username = '';
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria al parecer es una buena práctica en un proyecto de estas características, porque se actualizan muchas cosas por sesión
    this.subscription.unsubscribe();
  }


}
