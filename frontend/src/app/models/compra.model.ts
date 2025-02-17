// compra.model.ts
import { ProductoCompra } from "./producto-compra.model";

export interface Compra {
  _id?: string;        // Opcional para NUEVAS COMPRAS
  clienteId: string;
  productos: ProductoCompra[];
  fecha?: Date;        // LO MISOM, OPCIONAL
  total: number;
}
