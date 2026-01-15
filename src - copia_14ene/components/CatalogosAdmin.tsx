import { useState } from "react"

type CatalogItem = {
  id: number
  nombre: string
  activo: boolean
}

export default function Catalogos() {
  const [items, setItems] = useState<CatalogItem[]>([
    { id: 1, nombre: "Ejemplo 1", activo: true },
    { id: 2, nombre: "Ejemplo 2", activo: false },
  ])

  const [categoria, setCategoria] = useState("")
  const [nuevoValor, setNuevoValor] = useState("")

  const handleAdd = () => {
    if (!categoria || !nuevoValor) return
    setItems((prev) => [
      ...prev,
      { id: prev.length + 1, nombre: nuevoValor, activo: true },
    ])
    setNuevoValor("")
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Gestión de Catálogos
      </h2>

      {/* Formulario agregar */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Categoría (ej. tipo)"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
        />
        <input
          type="text"
          placeholder="Nuevo valor"
          value={nuevoValor}
          onChange={(e) => setNuevoValor(e.target.value)}
          className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
        />
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Agregar
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50"
          >
            <span className="text-gray-800">{item.nombre}</span>
            <div className="space-x-2">
              {item.activo ? (
                <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Activo
                </button>
              ) : (
                <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Inactivo
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
