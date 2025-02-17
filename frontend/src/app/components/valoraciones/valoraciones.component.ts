import { Component, OnInit } from '@angular/core';
import { ValoracionService } from '../../services/valoracion.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-valoraciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './valoraciones.component.html',
  styleUrls: ['./valoraciones.component.css']
})
export class ValoracionesComponent implements OnInit {
  valoraciones: any[] = [];
  selectedValoracionIndex: number | null = null;

  constructor(private valoracionService: ValoracionService) { }

  ngOnInit(): void {
    this.cargarValoraciones();
  }

  cargarValoraciones(): void {
    this.valoracionService.obtenerTodasValoraciones().subscribe({
      next: (data) => {
        this.valoraciones = data;
      },
      error: (error) => {
        console.error('Error: ', error);
      }
    });
  }

  toggleDetalles(index: number): void {
    this.selectedValoracionIndex = this.selectedValoracionIndex === index ? null : index;
  }
}
