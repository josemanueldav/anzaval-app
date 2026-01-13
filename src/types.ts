import type { User } from "@supabase/supabase-js";

// 🔹 Usuario
export type SupabaseUser = User;

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "empleado" | "cliente";
  creadoEn: string; // ISO Date
}

// 🔹 Producto
export interface Producto {
   id: string
  descripcion_corta: string
  tipo: string
  created_at: string
  ubicacion?: string | null
  piso?: string | null
  area_sector?: string | null
  tag?: string | null
  descripcion_larga?: string | null
  marca?: string | null
  modelo?: string | null
  largo?: number | null
  ancho?: number | null
  alto?: number | null
}

// 🔹 Categoría de productos
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

// 🔹 Inventario (movimientos de entrada/salida)
export interface InventarioMovimiento {
  id: number;
  productoId: number;
  tipo: "entrada" | "salida" | "ajuste";
  cantidad: number;
  fecha: string; // ISO Date
  usuarioId?: string;
  comentario?: string;
}

// 🔹 Pedido (venta o compra)
export interface Pedido {
  id: number;
  clienteId?: string;
  productos: PedidoDetalle[];
  total: number;
  estado: "pendiente" | "pagado" | "cancelado" | "enviado";
  fecha: string; // ISO Date
}

// 🔹 Detalle de un pedido (líneas con productos)
export interface PedidoDetalle {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

declare module "swiper/swiper.css";



