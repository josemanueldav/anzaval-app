import { useState } from "react";

export function useProductImages(initialImages: string[]) {
  const [imagenes, setImagenes] = useState(initialImages);

  const addImage = (url: string) => {
    setImagenes(prev => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };

  return { imagenes, addImage, removeImage };
}
