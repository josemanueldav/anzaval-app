// src/components/product/hooks/useProductData.ts
import { useEffect, useState } from "react";
import { getProductById, createProduct, updateProduct } from "@/lib/supabaseProducts";

export function useProductData(productId?: string) {
  const [producto, setProducto] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar si viene un ID (modo edición)
  useEffect(() => {
    if (!productId) return;
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProductById(productId!);
      setProducto(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Guardar nuevo o actualizar
  const saveProduct = async () => {
    setLoading(true);
    try {
      if (productId) {
        await updateProduct(productId, producto);
      } else {
        await createProduct(producto);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const updateField = (field: string, value: any) => {
    setProducto((prev: any) => ({ ...prev, [field]: value }));
  };

  return {
    producto,
    setProducto,
    updateField,
    saveProduct,
    loading,
    error
  };
}
