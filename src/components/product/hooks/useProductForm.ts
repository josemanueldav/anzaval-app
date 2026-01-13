import { useState } from "react";

export function useProductForm(initialData: any) {
  const [producto, setProducto] = useState(initialData);

  const updateField = (field: string, value: any) => {
    setProducto((prev: any) => ({ ...prev, [field]: value }));

  };

  return {
    producto,
    updateField
  };
}
