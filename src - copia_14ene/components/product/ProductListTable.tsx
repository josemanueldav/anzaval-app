// Fully corrected ProductListTable.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ==== Tipos seguros ==== */
const TAB_KEYS = [
  "ident",
  "datos",
  "dim",
  "comp",
  "veh",
  "asg",
  "img",
  "adv",
] as const;

type TabKey = typeof TAB_KEYS[number];

interface ColumnDef {
  key: string;
  label: string;
}

interface ProductoTabla {
  id: string;
  descripcion_corta?: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  imagenes?: number;
  ubicacion?: string;
  piso?: string;
  area_sector?: string;
  no_serie?: string;
  proveedor?: string;
  unidad_medida_dimensiones?: string;
  capacidad?: string;
  asiento?: string;
  respaldo?: string;
  base?: string;
  rodajas?: string;
  no_gavetas?: string;
  no_motor?: string;
  matricula?: string;
  kilometraje?: string;
  usuario?: string;
  consultor?: string;
  area_especifica?: string;
  codigo_barras?: string;
  codigo_qr?: string;
  tag?: string;
  [key: string]: any;
}

export default function ProductListTable({ products }: { products: ProductoTabla[] }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>("ident");

  const tabs: { id: TabKey; label: string }[] = [
    { id: "ident", label: "Identificación" },
    { id: "datos", label: "Datos" },
    { id: "dim", label: "Dimensiones" },
    { id: "comp", label: "Mobiliario" },
    { id: "veh", label: "Vehículos" },
    { id: "asg", label: "Asignación" },
    { id: "img", label: "Imágenes" },
    { id: "adv", label: "Ident. avanzada" },
  ];

  const columnsByTab: Record<TabKey, ColumnDef[]> = {
    ident: [
      { key: "id", label: "ID" },
      { key: "descripcion_corta", label: "Descripción" },
      { key: "ubicacion", label: "Ubicación" },
      { key: "piso", label: "Piso" },
      { key: "area_sector", label: "Área" },
      { key: "tipo", label: "Categoría" },
      { key: "tag", label: "Tag" },
    ],
    datos: [
      { key: "marca", label: "Marca" },
      { key: "submarca", label: "Submarca" },
      { key: "modelo", label: "Modelo" },
      { key: "no_serie", label: "No. serie" },
      { key: "proveedor", label: "Proveedor" },
    ],
    dim: [
      { key: "largo", label: "Largo" },
      { key: "ancho", label: "Ancho" },
      { key: "alto", label: "Alto" },
      { key: "unidad_medida_dimensiones", label: "UM" },
      { key: "capacidad", label: "Capacidad" },
    ],
    comp: [
      { key: "asiento", label: "Asiento" },
      { key: "respaldo", label: "Respaldo" },
      { key: "base", label: "Base" },
      { key: "rodajas", label: "Rodajas" },
      { key: "no_gavetas", label: "Gavetas" },
    ],
    veh: [
      { key: "no_motor", label: "Motor" },
      { key: "matricula", label: "Matrícula" },
      { key: "kilometraje", label: "Kilometraje" },
    ],
    asg: [
      { key: "usuario", label: "Usuario" },
      { key: "consultor", label: "Consultor" },
      { key: "area_especifica", label: "Área esp." },
    ],
    img: [
      { key: "imagenes", label: "Fotos" },
    ],
    adv: [
      { key: "codigo_barras", label: "Código barras" },
      { key: "codigo_qr", label: "QR" },
    ],
  };

  const cols = columnsByTab[activeTab];

  return (
    <div className="w-full">
      {/* Vista Escritorio */}
      <div className="hidden md:block">
        <div
  className="
    flex gap-2 mb-4 pb-2 overflow-x-auto
    border-b border-gray-300 dark:border-white/10
  "
>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabKey)}
              className={`
        px-4 py-2 rounded-full font-semibold whitespace-nowrap
        transition ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
  className="
    overflow-x-auto rounded-xl 
    border border-gray-200 dark:border-white/10
    bg-white dark:bg-white/5
  "
>
  <table
    className="
      min-w-full text-sm 
      text-gray-700 dark:text-gray-200
    "
  >
    <thead
      className="
        bg-gray-100 dark:bg-white/10
        text-gray-800 dark:text-gray-200
      "
    >
              <tr>
                {cols.map((c) => (
                  <th key={c.key} className="px-4 py-2 text-left whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/productos/${p.id}`)}
                  className="border-t border-gray-200 dark:border-white/10
    hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                >
                  {cols.map((c) => (
                    <td key={c.key} className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-200">
                      {c.key === "imagenes"
                        ? `${p.imagenes ?? 0} fotos`
                        : p[c.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
        {products.map((p) => (
          <div
  key={p.id}
  onClick={() => navigate(`/productos/${p.id}`)}
  className="
    rounded-xl p-4 cursor-pointer border
    bg-white dark:bg-white/10
    border-gray-200 dark:border-white/10
    shadow-sm dark:shadow-none
    hover:bg-gray-50 dark:hover:bg-white/20
    transition
  "
>
  <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
    {p.descripcion_corta}
  </h3>

  <p className="text-sm mb-1 text-gray-600 dark:text-gray-300">
    Tag: {p.tag ?? "—"}
  </p>

  <p className="text-xs text-gray-500 dark:text-gray-400">
    Ubicación: {p.ubicacion ?? "—"}
  </p>
</div>

        ))}
      </div>
    </div>
  );
}