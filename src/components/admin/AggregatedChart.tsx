import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ---------------------------------------
   TIPOS FLEXIBLES (EVITAMOS CONFLICTOS)
----------------------------------------*/

// Lo mínimo que necesitamos de un producto para las gráficas
type ProductoLike = {
  cliente_id?: string | null;
  created_at?: string;
  tipo?: string | null;
  estado_fisico?: string | null;
  estado_operatividad?: string | null;
  consultor?: string | null;
};

// Lo mínimo que necesitamos de un cliente
type ClienteLike = {
  id: string;
  nombre: string;
  tipo?: string | null;
};

type DatasetKey =
  | "proyecto"
  | "estado_fisico"
  | "tipo"
  | "consultor"
  | "fecha";

const selectorOpciones: { key: DatasetKey; label: string }[] = [
  { key: "proyecto", label: "Activos por proyecto" },
  { key: "estado_fisico", label: "Activos por estado físico" },
  { key: "tipo", label: "Activos por tipo" },
  { key: "consultor", label: "Activos por consultor" },
  { key: "fecha", label: "Activos por fecha de alta" },
];

interface AggregatedChartProps {
  productos: ProductoLike[];
  clientes: ClienteLike[];
}

/* ---------------------------------------
               COMPONENTE
----------------------------------------*/

export default function AggregatedChart({
  productos,
  clientes,
}: AggregatedChartProps) {
  const [dataset, setDataset] = useState<DatasetKey>("proyecto");

  /* ---------------------------------------
          GENERAR LOS DATOS AGRUPADOS
  ----------------------------------------*/
  const data = useMemo(() => {
    const map = new Map<string, number>();

    if (!productos.length) return [];

    if (dataset === "proyecto") {
      productos.forEach((p) => {
        const cliente = clientes.find((c) => c.id === p.cliente_id);
        const nombre = cliente?.nombre || "Sin proyecto";
        map.set(nombre, (map.get(nombre) || 0) + 1);
      });
    }

    if (dataset === "estado_fisico") {
      productos.forEach((p) => {
        const key = p.estado_fisico || "Sin dato";
        map.set(key, (map.get(key) || 0) + 1);
      });
    }

    if (dataset === "tipo") {
      productos.forEach((p) => {
        const key = p.tipo || "Sin tipo";
        map.set(key, (map.get(key) || 0) + 1);
      });
    }

    if (dataset === "consultor") {
      productos.forEach((p) => {
        const key = p.consultor || "Sin consultor";
        map.set(key, (map.get(key) || 0) + 1);
      });
    }

    if (dataset === "fecha") {
      productos.forEach((p) => {
        const d = p.created_at ? new Date(p.created_at) : null;
        const key =
          d && !isNaN(d.getTime())
            ? d.toISOString().slice(0, 10)
            : "Sin fecha";
        map.set(key, (map.get(key) || 0) + 1);
      });
    }

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [dataset, productos, clientes]);

  /* ---------------------------------------
                 RENDER
  ----------------------------------------*/
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 space-y-4">
      {/* Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Visualización de Inventario
        </h2>

        <select
          value={dataset}
          onChange={(e) => setDataset(e.target.value as DatasetKey)}
          className="text-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-100"
        >
          {selectorOpciones.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Gráfica */}
      {data.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No hay datos suficientes para esta gráfica.
        </p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#0284c7"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
