import { Component, Input, OnInit } from '@angular/core';
import { ValoracionService } from '../../services/valoracion.service';
import { ClienteService } from '../../services/cliente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-valoracion',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './valoracion.component.html',
  styleUrls: ['./valoracion.component.css']
})
export class ValoracionComponent implements OnInit {
  @Input() productoId!: string;
  valoracionForm!: FormGroup;
  promedio: number = 0;
  totalValoraciones: number = 0;
  valoraciones: any[] = [];

  constructor(
    private valoracionService: ValoracionService,
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.valoracionForm = this.fb.group({
      comentario: [''],
      estrellas: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
    this.cargarPromedio();
    this.cargarValoraciones();
  }

  cargarPromedio(): void {
    this.valoracionService.obtenerValoracionPromedio(this.productoId).subscribe({
      next: (data) => {
        this.promedio = data.promedio;
        this.totalValoraciones = data.totalValoraciones;
      },
      error: (error) => console.error('Error al obtener el promedio', error)
    });
  }

  cargarValoraciones(): void {
    this.valoracionService.obtenerValoracionesProducto(this.productoId).subscribe({
      next: (data) => {
        this.valoraciones = data;
      },
      error: (error) => console.error('Error al obtener valoraciones:', error)
    });
  }

  enviarValoracion(): void {
    const cliente = this.clienteService.getCliente();
    if (!cliente || !cliente._id) {
      alert('¡Debes iniciar sesión!');
      return;
    }
    const { comentario, estrellas } = this.valoracionForm.value;
    this.valoracionService.agregarValoracion(cliente._id, this.productoId, comentario, estrellas).subscribe({
      next: () => {
        alert('¡¡Valoración enviada correctamente!!');
        this.valoracionForm.reset({ estrellas: 5, comentario: '' });
        this.cargarPromedio();
        this.cargarValoraciones();
      },
      error: (err) => alert(err.error.mensaje || '¡¡Error al enviar valoración!!')
    });
  }
}
