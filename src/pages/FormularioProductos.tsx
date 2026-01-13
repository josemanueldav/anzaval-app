import { useState } from "react"

/* const camposPorTipo: Record<string, string[]> = {
  mueble: [
    "Material","asiento","respaldo","base","cubierta","rodajas",
    "descansabrazos","no_cajones","no_gavetas","no_entrepaños",
    "no_puertas_abatibles","no_puertas_corredizas",
    "Largo","Ancho","Alto","unidad de medida de dimensiones"
  ],
  equipo: [
    "capacidad","um_capacidad","Marca","Modelo","No. Serie","no_economico",
    "submarca","version","no_motor","matricula","kilometraje",
    "Estado_fisico","Estado de operatividad",
    "Vida util remanente estimada","tag_colocado_nuevo"
  ],
  infraestructura: [
    "Material","Largo","Ancho","Alto","unidad de medida de dimensiones",
    "diametro","um_diametro","color","movilidad","País de origen","Consultor"
  ]
}*/

import { supabase } from "../lib/supabaseClient"

export default function FormularioProducto() {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (campo: string, valor: string) => {
    setFormData({ ...formData, [campo]: valor })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("productos").insert([
      {
        nombre: formData["Descripción corta"],
        descripcion: formData["Descripcion larga"],
        tipo: formData["Tipo"],
        cantidad: formData["Cantidad"] || 0,
        categoria: formData["Area / Sector"],
        comentarios: formData["Comentarios"],
      }
    ])

    setLoading(false)

    if (error) {
      alert("❌ Error al guardar: " + error.message)
    } else {
      alert("✅ Producto guardado en Supabase")
      setFormData({})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold">Agregar producto</h2>

      <input
        type="text"
        placeholder="Descripción corta"
        className="w-full border p-2 rounded"
        value={formData["Descripción corta"] || ""}
        onChange={(e) => handleChange("Descripción corta", e.target.value)}
      />

      <textarea
        placeholder="Descripción larga"
        className="w-full border p-2 rounded"
        value={formData["Descripcion larga"] || ""}
        onChange={(e) => handleChange("Descripcion larga", e.target.value)}
      />

      <select
        value={formData["Tipo"] || ""}
        onChange={(e) => handleChange("Tipo", e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Seleccionar tipo</option>
        <option value="mueble">Mueble</option>
        <option value="equipo">Equipo</option>
        <option value="infraestructura">Infraestructura</option>
      </select>

      <input
        type="number"
        placeholder="Cantidad"
        className="w-full border p-2 rounded"
        value={formData["Cantidad"] || ""}
        onChange={(e) => handleChange("Cantidad", e.target.value)}
      />

      <textarea
        placeholder="Comentarios"
        className="w-full border p-2 rounded"
        value={formData["Comentarios"] || ""}
        onChange={(e) => handleChange("Comentarios", e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  )
}
