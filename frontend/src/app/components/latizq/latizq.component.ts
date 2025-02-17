import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriasComponent } from "../categorias/categorias.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-latizq',
  standalone: true,
  imports: [CommonModule, CategoriasComponent],
  templateUrl: './latizq.component.html',
  styleUrl: './latizq.component.css'
})
export class LatizqComponent implements OnInit{
  

  mostrarCategorias=false;

  /**SOLUCIÓN PARA QUE LAS CATEGORÍAS AQUÍ EN LATERAL IZQUIERDO SOLAMENTE SE MUESTREN CUANDO HEMOS PULSADO EN HEAD SOBRE "PRODUCTOS"
   * 
   * 1- GENERAMOS UN INTERRUPTOR "mostrarCategorias"
   * 2- implements OnInit y en constructor traemos "Router"
   * 3- this.router.events.subscribe(() =>{this.mostrarCategorias=this.router.url ==='/productos'})
   * 
   */
  constructor(private router:Router){}
  ngOnInit(): void {
      this.router.events.subscribe(() => {
        if (this.router.url==='/productos')
        {
          this.mostrarCategorias=true;
        }
        else
        {
          this.mostrarCategorias=false;
        }
        
      });
    }

    
  
  }


