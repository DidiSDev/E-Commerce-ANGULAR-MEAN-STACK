import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  clienteId: string = '';

  constructor(
    private wishlistService: WishlistService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    const cliente = this.clienteService.getCliente();
    if (cliente && cliente._id) {
      this.clienteId = cliente._id;
      this.cargarWishlist();
    } else {
      alert('Debes iniciar sesión');
    }
  }

  cargarWishlist(): void {
    this.wishlistService.obtenerWishlistUsuario(this.clienteId).subscribe({
      next: (data) => {
        this.wishlist = data;
      },
      error: (error) => {
        console.error('Error', error);
      }
    });
  }

  eliminar(productoId: string): void {
    this.wishlistService.eliminarDeseado(this.clienteId, productoId).subscribe({
      next: () => {
        alert('¡¡Producto eliminado de tu lista de deseados!!');
        this.cargarWishlist();
      },
      error: (error) => {
        alert(error.error.mensaje || 'Error');
      }
    });
  }
}
