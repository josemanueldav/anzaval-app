import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProductForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    descripcion_corta: "",
    tipo: "",
    marca: "",
    modelo: "",
    ubicacion: "",
    piso: "",
    area_sector: "",
    tag: "",
  });
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Insertar producto
    const { data: producto, error } = await supabase
      .from("productos")
      .insert([form])
      .select()
      .single();

    if (error || !producto) {
      alert("Error guardando producto");
      console.error("Error guardando producto:", error);
      setLoading(false);
      return;
    }

    // 2️⃣ Subir imágenes al bucket y registrar en DB
    for (const file of imagenes) {
      const filePath = `${producto.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Error subiendo imagen:", uploadError);
        continue;
      }

      await supabase.from("productos_imagenes").insert([
        { producto_id: producto.id, imagen_url: filePath },
      ]);
    }

    setLoading(false);
    navigate("/productos"); // redirigir al catálogo
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
      <h2 className="text-xl font-bold">Nuevo producto</h2>

      {/* Campos de captura */}
      {Object.keys(form).map((key) => (
        <div key={key}>
          <label className="block text-sm text-gray-300 capitalize">{key}</label>
          <input
            type="text"
            name={key}
            value={(form as any)[key]}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>
      ))}

      {/* Subir imágenes */}
      <div>
        <label className="block text-sm text-gray-300">Imágenes</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        {/* Preview */}
        {imagenes.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {imagenes.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="h-24 w-full object-cover rounded-lg border border-gray-700"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        {loading ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}
