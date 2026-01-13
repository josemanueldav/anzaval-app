import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export default function GenerateReportModal({
  onClose,
  proyectos,
  onGenerate,
}: {
  onClose: () => void;
  proyectos: any[];
  onGenerate: (params: {
    proyectoId: string | null;
    fechaInicio: string | null;
    fechaFin: string | null;
    tipoReporte: "general" | "resumen";
    formato: "excel" | "pdf";
  }) => void;
}) {
  const [proyectoId, setProyectoId] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string | null>(null);
  const [fechaFin, setFechaFin] = useState<string | null>(null);
  const [tipoReporte, setTipoReporte] =
    useState<"general" | "resumen">("general");
  const [formato, setFormato] = useState<"excel" | "pdf">("excel");

  const validarYEnviar = () => {
    onGenerate({ proyectoId, fechaInicio, fechaFin, tipoReporte, formato });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-[90%] max-w-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 relative"
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-300"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-4">Generar Reporte</h2>

        {/* PROYECTO */}
        <div className="mb-4">
          <label className="text-sm font-medium">Proyecto</label>
          <select
            value={proyectoId || ""}
            onChange={(e) =>
              setProyectoId(e.target.value || null)
            }
            className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700"
          >
            <option value="">Todos los proyectos</option>
            {proyectos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* RANGO DE FECHAS */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicio || ""}
              onChange={(e) =>
                setFechaInicio(e.target.value || null)
              }
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Fecha fin</label>
            <input
              type="date"
              value={fechaFin || ""}
              onChange={(e) =>
                setFechaFin(e.target.value || null)
              }
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        {/* TIPO DE REPORTE */}
        <div className="mb-4">
          <label className="text-sm font-medium">Tipo de reporte</label>
          <select
            value={tipoReporte}
            onChange={(e) =>
              setTipoReporte(e.target.value as "general" | "resumen")
            }
            className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700"
          >
            <option value="general">General (detalle de activos)</option>
            <option value="resumen">Resumen por proyecto</option>
          </select>
        </div>

        {/* FORMATO */}
        <div className="mb-4">
          <label className="text-sm font-medium">Formato</label>
          <select
            value={formato}
            onChange={(e) =>
              setFormato(e.target.value as "excel" | "pdf")
            }
            className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700"
          >
            <option value="excel">Excel (.csv)</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
          >
            Cancelar
          </button>

          <button
            onClick={validarYEnviar}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
          >
            Generar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
