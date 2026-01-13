import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { cleanData } from "../utils/cleanInsert";

type Props = {
  producto: any;
  onClose: () => void;
};

const EditProductModal: React.FC<Props> = ({ producto, onClose }) => {
  const [formData, setFormData] = useState<any>(producto);
  const [catalogos, setCatalogos] = useState<Record<string, string[]>>({});
  const [mensaje, setMensaje] = useState("");

  // Cargar catálogos dinámicos
  useEffect(() => {
    const fetchCatalogos = async () => {
      const { data, error } = await supabase
        .from("catalogos")
        .select("categoria, valor")
        .eq("activo", true);

      if (error) {
        console.error("Error cargando catálogos:", error);
      } else {
        const grouped: Record<string, string[]> = {};
        data?.forEach((row) => {
          if (!grouped[row.categoria]) grouped[row.categoria] = [];
          grouped[row.categoria].push(row.valor);
        });
        setCatalogos(grouped);
      }
    };

    fetchCatalogos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { id, ...rest } = cleanData(formData);
    const { error } = await supabase
      .from("productos")
      .update(rest)   // ⬅️ ya no incluye "id"
      .eq("id", producto.id);

    if (error) {
      console.error("Error al actualizar:", error);
      setMensaje("❌ " + error.message);
    } else {
      setMensaje("✅ Producto actualizado");
      setTimeout(onClose, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 space-y-3">
        <h2 className="text-lg font-bold">Editar producto</h2>

        <input
          name="descripcion_corta"
          value={formData.descripcion_corta || ""}
          onChange={handleChange}
          placeholder="Descripción corta"
          className="w-full border p-2 rounded"
          required
        />

        {/* ✅ Select dinámico: Tipo */}
        <select
          name="tipo"
          value={formData.tipo || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Selecciona Tipo --</option>
          {catalogos["tipo"]?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <input
          name="marca"
          value={formData.marca || ""}
          onChange={handleChange}
          placeholder="Marca"
          className="w-full border p-2 rounded"
        />
        <input
          name="modelo"
          value={formData.modelo || ""}
          onChange={handleChange}
          placeholder="Modelo"
          className="w-full border p-2 rounded"
        />

        {/* ✅ Select dinámico: País de origen */}
        <select
          name="pais_origen"
          value={formData.pais_origen || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- País de origen --</option>
          {catalogos["pais_origen"]?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* ✅ Select dinámico: Estado físico */}
        <select
          name="estado_fisico"
          value={formData.estado_fisico || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Estado físico --</option>
          {catalogos["estado_fisico"]?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* ✅ Select dinámico: Estado de operatividad */}
        <select
          name="estado_operatividad"
          value={formData.estado_operatividad || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Estado de operatividad --</option>
          {catalogos["estado_operatividad"]?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {mensaje && <p className="text-sm">{mensaje}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
