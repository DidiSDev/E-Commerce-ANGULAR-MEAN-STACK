import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/productos.service';


@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent{

  
  
 

  constructor(private productService: ProductService)
  {

  }


  seleccionarCategoria(categoria:string)
  {
    this.productService.seleccionarCategoria(categoria);
  }
}
