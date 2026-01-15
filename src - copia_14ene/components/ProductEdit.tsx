// src/components/ProductEdit.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // Cargar datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setMensaje("❌ Error cargando producto");
      } else {
        setFormData(data || {});
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("productos")
      .update(formData)
      .eq("id", id);

    if (error) {
      console.error(error);
      setMensaje("❌ Error al guardar cambios");
    } else {
      setMensaje("✅ Producto actualizado");
      setTimeout(() => navigate("/productos"), 1000);
    }
  };

  if (loading) return <p>Cargando producto...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Descripción corta"
          value={formData.descripcion_corta || ""}
          onChange={(e) =>
            setFormData({ ...formData, descripcion_corta: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Marca"
          value={formData.marca || ""}
          onChange={(e) =>
            setFormData({ ...formData, marca: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Modelo"
          value={formData.modelo || ""}
          onChange={(e) =>
            setFormData({ ...formData, modelo: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
      </form>

      {mensaje && <p className="mt-3">{mensaje}</p>}
    </div>
  );
};

export default ProductEdit;
