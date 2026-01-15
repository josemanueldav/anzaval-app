// src/lib/supabaseProducts.ts
import { supabase } from "./supabaseClient";

const TABLE = "productos";

/**
 * Obtiene un producto por ID
 */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(producto: any) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(producto)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(id: string, producto: any) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(producto)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Elimina un producto (opcional)
 */
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
