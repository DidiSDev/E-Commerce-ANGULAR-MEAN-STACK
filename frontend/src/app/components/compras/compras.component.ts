// compras.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { ComprasService } from '../../services/compras.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  private subscription!:Subscription
  compras: any[] = [];
  selectedCompraIndex: number | null = null;



  constructor(
    private clienteService: ClienteService,
    private comprasService: ComprasService
  ) { }

  ngOnInit(): void {
    const clienteId = this.clienteService.getCliente()?._id;
    if (clienteId) {
      this.comprasService.obtenerComprasCliente(clienteId).subscribe(
        data => {
          this.compras = data;
          console.log('Compras recibidas:', this.compras);
        },
        error => {
          console.error('Error al obtener las compras:', error);
        }
      );
    } else {
      console.error('Cliente no identificado');
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  Detalles(index: number): void {
    console.log('Toggle Detalles para Compra Índice:', index);
    this.selectedCompraIndex = this.selectedCompraIndex === index ? null : index;
  }
}
