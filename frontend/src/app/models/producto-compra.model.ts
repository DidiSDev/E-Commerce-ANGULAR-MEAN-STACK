// producto-compra.model.ts
export interface ProductoCompra {
  [x: string]: any;
  productoId?: string; // Opcional al recibir datos del backend
  nombre?: string;     // Opcional al enviar datos al backend
  cantidad: number;
}
