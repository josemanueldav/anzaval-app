import { useMemo } from "react";
import { FiTrendingUp, FiPackage, FiCalendar, FiUsers } from "react-icons/fi";
import AggregatedChart from "./AggregatedChart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Tipos provenientes de tu dashboard
interface Producto {
  id: string;
  cliente_id: string | null;
  created_at: string;
  tipo?: string | null;
}

interface Cliente {
  id: string;
  nombre: string;
}

export default function DashboardCharts({
  productos,
  clientes,
}: {
  productos: Producto[];
  clientes: Cliente[];
}) {
  // -------------------------------
  //   KPI CALCULATIONS
  // -------------------------------

  const totalActivos = productos.length;

  const totalProyectos = clientes.length;

  const activosHoy = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    return productos.filter((p) =>
      p.created_at.startsWith(hoy)
    ).length;
  }, [productos]);

  const tiposUnicos = useMemo(() => {
    const set = new Set(productos.map((p) => p.tipo || "Sin tipo"));
    return set.size;
  }, [productos]);

  // -------------------------------
  //   TIMELINE CHART (BY DATE)
  // -------------------------------

  const timelineData = useMemo(() => {
    const map = new Map<string, number>();
    productos.forEach((p) => {
      const fecha = p.created_at?.slice(0, 10) ?? "Sin fecha";
      map.set(fecha, (map.get(fecha) || 0) + 1);
    });

    return Array.from(map.entries()).map(([fecha, cantidad]) => ({
      fecha,
      cantidad,
    }));
  }, [productos]);

  // -------------------------------
  //   UI
  // -------------------------------

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* -----------------------------
          KPI CARDS (4)
      ------------------------------ */}
      <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total activos */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total de activos</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {totalActivos}
            </p>
          </div>
          <FiPackage size={28} className="text-blue-600 dark:text-blue-400" />
        </div>

        {/* Proyectos */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Proyectos</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {totalProyectos}
            </p>
          </div>
          <FiUsers size={28} className="text-purple-600 dark:text-purple-400" />
        </div>

        {/* Activos creados hoy */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Altas hoy</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {activosHoy}
            </p>
          </div>
          <FiCalendar size={28} className="text-green-600 dark:text-green-400" />
        </div>

        {/* Tipos distintos */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tipos únicos</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {tiposUnicos}
            </p>
          </div>
          <FiTrendingUp size={28} className="text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      {/* -----------------------------
          DYNAMIC AGGREGATED CHART
      ------------------------------ */}
      <AggregatedChart productos={productos} clientes={clientes} />

      {/* -----------------------------
          TIMELINE CHART
      ------------------------------ */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Altas de activos por fecha
        </h2>

        {timelineData.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No hay datos suficientes para esta gráfica.
          </p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <XAxis
                  dataKey="fecha"
                  tick={{ fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
