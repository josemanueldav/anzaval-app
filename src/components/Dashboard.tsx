import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Movimiento {
  tipo: "INSERT" | "UPDATE" | "DELETE";
  producto: string;
  fecha: string;
}

function Dashboard() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [estadoFisico, setEstadoFisico] = useState<any[]>([]);
  const [estadoOperatividad, setEstadoOperatividad] = useState<any[]>([]);
  /*const cardBase =
  "rounded-xl shadow-md p-4 transition-colors bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100";
*/
  // Suscripción a cambios en la tabla productos
  useEffect(() => {
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "productos" },
        (payload) => {
          const nuevoMovimiento: Movimiento = {
            tipo: payload.eventType as Movimiento["tipo"],
            producto:
              (payload.new as any)?.descripcion_corta ||
              (payload.old as any)?.descripcion_corta ||
              "Producto",
            fecha: new Date().toLocaleString(),
          };
          setMovimientos((prev) => [nuevoMovimiento, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Datos de ejemplo para gráficas
  useEffect(() => {
    setEstadoFisico([
      { name: "Nuevo", value: 5 },
      { name: "Usado", value: 8 },
      { name: "Dañado", value: 2 },
    ]);

    setEstadoOperatividad([
      { name: "Operativo", value: 10 },
      { name: "En reparación" , value: 3 },
      { name: "Baja", value: 2 },
    ]);
  }, []);

  const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

  return (
    
    <div className="p-6 space-y-6">
      {/* ---- Tarjetas métricas ---- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Activos", "Categorías", "Stock bajo", "Última actualización"].map(
          (titulo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-gray-800 rounded-xl p-4 text-white text-center"
            >
              <h3 className="font-semibold">{titulo}</h3>
              <p className="text-3xl font-bold">
                {idx === 0
                  ? "15"
                  : idx === 1
                  ? "7"
                  : idx === 2
                  ? "0"
                  : new Date().toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400">
                {idx === 0
                  ? "Total registrados"
                  : idx === 1
                  ? "Tipos de producto"
                  : idx === 2
                  ? "Activos con alerta"
                  : "Datos sincronizados"}
              </p>
            </motion.div>
          )
        )}
      </div>

      {/* ---- Accesos rápidos ---- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-xl p-4 text-white"
      >
        <h2 className="text-lg font-semibold mb-3">Accesos rápidos</h2>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl flex-1">
            Gestionar Activos
          </button>
          <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl flex-1">
            Agregar Activo
          </button>
        </div>
      </motion.div>

      {/* ---- Últimos movimientos ---- */}
      <div className="bg-gray-800 rounded-xl p-4 text-white">
        <h2 className="text-lg font-semibold mb-3">Últimos movimientos</h2>
        {movimientos.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin cambios recientes</p>
        ) : (
          <ul className="relative border-l border-gray-600 pl-4 space-y-4">
            <AnimatePresence>
              {movimientos.map((mov, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative"
                >
                  <span
                    className={`absolute -left-[9px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                      mov.tipo === "INSERT"
                        ? "bg-green-500"
                        : mov.tipo === "UPDATE"
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <div>
                    <span className="font-medium">{mov.tipo}</span>
                    <p className="text-sm text-gray-300">
                      {mov.producto}
                      <span className="block text-xs text-gray-500">
                        {mov.fecha}
                      </span>
                    </p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* ---- Gráficas ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 text-white"
        >
          <h2 className="text-lg font-semibold mb-4">Estado físico</h2>
          <ResponsiveContainer width="100%" height={250}>
            <div className="rounded-xl shadow p-4 bg-white dark:bg-slate-800">
            <PieChart width={300} height={300} style={{ background: "transparent" }}>
              <Pie
                data={estadoFisico}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {estadoFisico.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            </div>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 text-white"
        >
          <h2 className="text-lg font-semibold mb-4">Estado de operatividad</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={estadoOperatividad}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="value" fill="#36A2EB" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
