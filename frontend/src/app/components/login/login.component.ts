// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { Router, RouterModule } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {

  usuario: string = '';
  pass: string = '';
  
  constructor(private clienteService: ClienteService, private router: Router, private compraService:ComprasService) { }

  /**EXPLICACION:
   * En el formulario, recogemos con un (ngSubmit)="onLogin()" que activa el login el boton que tine "type:submit"
   * Aqui en el .ts arriba tenemos definidas dos variables :usuario: string = '';
  pass: string = '';
  
  Estas variables serán tratadas en la funcion onLogin() que se activa al pulsar el botón Login gracias al "submit"
    
    * Nuestro constructor debe tener obligatoriamente el clienteService y el Router y sus respectivos imports, Router y RouterModule

  tras esto comprobamos que usuario y pass no estén vacios, si no lo estan avisamos y llamamos AL METODO LOGIN DEL SERVICO:
  this.ClienteService.login(this.usuario, this.pass).subscribe(
  res => { if (res.cliente) {this.router.navigate({'/productos'})}})
  Es decir, que si hay respuesta y tenemos usuario y pass, tenemos un cliente (bien sea admin o no, lo llevamos a/navigate)


  Pero qué ocurre en el login de ClienteService? Vamos alli a explicarlo
   */
  onLogin(): void {


    console.log('Intentando iniciar sesión con:', { usuario: this.usuario, pass: this.pass });

    this.logamos();

    
}

logamos()
{
  this.clienteService.login(this.usuario, this.pass).subscribe(
    res => {
        if (res.cliente) {
            // El servicio ya llamó a setCliente, no es necesario hacerlo aquí
          
            
            // Redirigir según si el cliente es admin
            if (res.cliente.admin) {
                this.router.navigate(['/productos']);
            } else {
                this.router.navigate(['/productos']);
            }
        } else {
            alert("ERROR EN LOGIN");
        }
    },
    err => {
        console.error('Error en login:', err);
        alert(err.error.mensaje || 'Error en login.');
    }
);
}

}
