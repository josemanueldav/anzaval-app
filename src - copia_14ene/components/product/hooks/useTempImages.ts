/**
 * Maneja imágenes temporales subidas antes de guardar el producto.
 */

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function useTempImages() {
  const [tempImages, setTempImages] = useState<
    { name: string; path: string; preview: string }[]
  >([]);

  async function addTempImage(file: File) {
    const filename = `${Date.now()}-${file.name}`;
    const tempPath = `temp/${filename}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(tempPath, file, { upsert: true });

    if (error) {
      console.error(error);
      return;
    }

    const preview = URL.createObjectURL(file);

    setTempImages((prev) => [...prev, { name: filename, path: tempPath, preview }]);
  }

  function removeTempImage(path: string) {
    setTempImages((prev) => prev.filter((img) => img.path !== path));
  }

  function clearTempImages() {
    setTempImages([]);
  }

  return { tempImages, addTempImage, removeTempImage, clearTempImages };
}
