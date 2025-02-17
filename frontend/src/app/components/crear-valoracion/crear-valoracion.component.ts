import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValoracionService } from '../../services/valoracion.service';
import { ClienteService } from '../../services/cliente.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-valoracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-valoracion.component.html',
  styleUrls: ['./crear-valoracion.component.css']
})
export class CrearValoracionComponent implements OnInit {
  productoId!: string;
  valoracionForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private valoracionService: ValoracionService,
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('productoId');
    if (id) {
      this.productoId = id;
    }
    this.valoracionForm = this.fb.group({
      estrellas: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', Validators.required]
    });
  }

  enviarValoracion(): void {
    const cliente = this.clienteService.getCliente();
    if (!cliente || !cliente._id) {
      alert('Debes iniciar sesión para valorar');
      return;
    }
    const { estrellas, comentario } = this.valoracionForm.value;
    this.valoracionService.agregarValoracion(cliente._id, this.productoId, comentario, estrellas)
      .subscribe({
        next: () => {
          alert('Valoración enviada correctamente');
          this.router.navigate(['/productos']); // O la ruta que desees redirigir
        },
        error: (err) => {
          alert(err.error.mensaje || 'Error al enviar la valoración');
        }
      });
  }
}
