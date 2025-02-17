// formulario-alta.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-formulario-alta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './formulario-alta.component.html',
  styleUrls: ['./formulario-alta.component.css']
})
export class FormularioAltaComponent implements OnInit {
  @Output() productoAnadido = new EventEmitter<void>();

  // Atributos enlazados al formulario
  nombre: string = '';
  descr: string = '';
  cantidad: number = 0;
  precio: number = 0;
  foto: string = '';
  categoria: 'League of Legends' | 'Valorant' = 'League of Legends'; // Valor predeterminado


  // Variable para almacenar el ID del producto si se está editando
  productoId?: string;

  constructor(private productoService: ProductService) { }

  ngOnInit(): void {
    if (this.productoService.productoSeleccionado && this.productoService.productoSeleccionado._id) {
      const producto = this.productoService.productoSeleccionado;
      this.nombre = producto.nombre;
      this.descr = producto.descr;
      this.cantidad = producto.stock;
      this.precio = producto.precio;
      this.foto = producto.imagen;
      this.productoId = producto._id;
      this.categoria= producto.categoria
    }
  }

  // Método para manejar el alta o actualización del producto, cómo? 

 
  darAlta() {
    const producto: Producto = {
      nombre: this.nombre,
      descr: this.descr,
      stock: this.cantidad,
      precio: this.precio,
      imagen: this.foto,
      categoria: this.categoria,
    };

    if (this.productoId) {
      // Actualizar producto existente
      producto._id = this.productoId;
    }

    // Validación de campos
    if (this.nombre === '' || this.descr === '' || this.cantidad < 0 || this.precio <= 0 || this.foto === '') {
      alert('¡Por favor, rellena todos los campos!');
      return;
    }

    if (this.productoId) {
      // Actualizar producto existente
      this.productoService.actualizarProducto(this.productoId, producto).subscribe({
        next: (res) => {
          console.log('Producto actualizado correctamente:', res);
          this.resetFormulario();
          this.productoAnadido.emit();
        },
        error: (err) => {
          console.error('Error al actualizar el producto:', err);
          alert('Error al actualizar el producto');
        },
      });
       /**4- VENIMOS DE productos.component
   * instanciamos un objeto producto recogiendo los campos del formulario,
   * si tenemos id es que ya existe, con lo que ya no será alta, será "actualizar" y cambiamos el botón, sin embargo, si no existe queda "Alta"
   * 
   * Como estamos explicando el alta -> ignoramos la llamada al método del servicio actualizarProducto.
   * 
   * a .crearProducto le enviamos este producto
   * 5- this.productoService.crearProducto(producto).subscribe(
   * esto funciona de forma diferente porque tenemos que avisar a productos.component.ts de que HEMOS CREADO EL PRODUCTO, así que emitimos resultado..
   * tras .subscribe abrimos parentesis y corchete y hacemos un next con respuesta ({next: (res) => {console.log('todo OK', res);
   * this.resetFormulario();
   * this.productoAnadido.emit()}}); o mostramos error
   * 
   * 6- productoAnadido.emit() se recoge en productos.component.html (productoAnadido) continuamos allí:
   */
    } else {
      // Crear nuevo producto
      this.productoService.crearProducto(producto).subscribe({
        next: (res) => {
          console.log('Producto insertado correctamente:', res);
          this.resetFormulario();
          this.productoAnadido.emit();
        },
        error: (err) => {
          console.error('Error al insertar el producto:', err);
          alert('Error al insertar el producto');
        },
      });
    }
  }

  resetFormulario() {
    this.nombre = '';
    this.descr = '';
    this.cantidad = 0;
    this.precio = 0;
    this.foto = '';
    this.productoId = undefined;
    this.productoService.productoSeleccionado = {
      nombre: '',
      descr: '',
      stock: 0,
      precio: 0,
      imagen: '',
      categoria: 'League of Legends'
    };
  }
}
