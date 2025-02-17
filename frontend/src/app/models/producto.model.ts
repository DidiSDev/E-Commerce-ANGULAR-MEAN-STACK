// producto.model.ts
export interface Producto {
  _id?: string; // Ahora es obligatorio
  nombre: string; 
  descr: string;
  stock: number;   
  precio: number; 
  imagen: string; // URL de la imagen del producto.
  categoria: 'League of Legends' | 'Valorant';
}
