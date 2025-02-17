// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ComprasComponent } from './components/compras/compras.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { CarritoMomentoComponent } from './components/carrito-momento/carrito-momento.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CrearValoracionComponent } from './components/crear-valoracion/crear-valoracion.component';
import { ValoracionesComponent } from './components/valoraciones/valoraciones.component';


export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'main', component: MainComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'compras', component: ComprasComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'carrito-momento', component: CarritoMomentoComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'crear-valoracion/:productoId', component: CrearValoracionComponent },
  { path: 'valoraciones', component: ValoracionesComponent },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
