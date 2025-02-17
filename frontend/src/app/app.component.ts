import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeadComponent } from "./components/head/head.component";
import { CategoriasComponent } from "./components/categorias/categorias.component";
import { LatizqComponent } from "./components/latizq/latizq.component";
import { CarritoComponent } from "./components/carrito/carrito.component";
import { LatderComponent } from "./components/latder/latder.component";
import { MainComponent } from './components/main/main.component';
import { ProductoComponent } from './components/producto/producto.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
//1º LO PRIMERO ES IMPORTAR EL COMPONENTE QUE QUEREMOS

//a los componentes se les llama a traves de las etiquetas del decorador
//si cambiamos el nombre app-root a cualquier otra cosa, ya no cargará el localhost:4200
//WEB SPA es una página que carga distintas funcionalidades.
@Component({
  selector: 'app-root',
  standalone: true,
  //2º AQUI DEBAJO METEMOS LOS STANDALONES
  //FINALMENTE EL SIGUIENTE PASO ES FIJARME EN LA ETIQUETA DEL SELECTOR DE "nombre.component.ts"
  imports: [RouterOutlet, HeadComponent, LatizqComponent, LatderComponent, FooterComponent, HttpClientModule],
  //AL PARECER A VECES DA UN ERROR SI DEJAS ESPACIOS ENTRE LOS IMPORTS, MEJOR NO DEJARLO POR SI ACASO.
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  
}
