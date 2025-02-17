// register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';
import { RouterModule } from '@angular/router';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  usuario: string = '';
  email: string = '';
  pass: string = '';
  confirmarpass: string = '';
  cliente!: Cliente;

  constructor(private clienteService: ClienteService, private router: Router, private compraService:ComprasService) { }

  /**
   * 
   * 4- Lo que hace onRegister es validar y en caso de OK crea un objeto cliente con "this.usuario, this.email...."
   * por defecto NUNCA será admin.
   * 5- El constructor de esta clase va a tener obligatoriamente el ClienteService y Router, y los imports: Router y RouterModule
   * Pero esto es como siempre...
   * 
   * 6- Finalmente, preguntamos a la función QUE ESTÁ DENTRO DE cliente.service.ts así:
   * 
   * this.clienteService.registrar(cliente).subscribe(
   * res=>{
   * alert(res.mensaje);
   * this.router.navigate(['login']);},
   * err => {console.error(err)});
   * 
   * la respuesta no tiene por qué ser validada, simplemente si la hay, TODO OK, nos vamos a /login, si no mostramos el error
   * 
   * 7- NOS VAMOS A VER QUE OCURRE EN cliente.service.ts .registrar
   */
  onRegister(): void {
    if (this.pass !== this.confirmarpass) {
      alert('¡Las contraseñas no coinciden!');
      return;
    }

    const cliente: Cliente = {
      nombre: this.usuario,
      email: this.email,
      password: this.pass,
      admin: false
      // No se incluye _id aquí, ya que es opcional y será generado por el backend
    };


    

    this.clienteService.registrar(cliente).subscribe(
      res => {
        alert(res.mensaje);
        this.router.navigate(['/login']);
      },
      err => {
        console.error('Error en registro:', err);
        alert(err.error.mensaje || 'Error al registrar.');
      }
    );
  }

}
