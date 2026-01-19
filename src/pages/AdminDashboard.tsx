import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FiBarChart2, FiDownload, FiFileText, FiFolder } from "react-icons/fi";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import DashboardCharts from "@/components/admin/DashboardCharts";
import GenerateReportModal from "@/components/admin/GenerateReportModal";

/* ------------------------------------------------------------------
   TIPOS
------------------------------------------------------------------ */

interface Producto {
  id: string;
  cliente_id: string | null;
  created_at: string;
  descripcion_corta?: string | null;
  tipo?: string | null;
  estado_fisico?: string | null;
  estado_operatividad?: string | null;
  consultor?: string | null;
  [key: string]: any;
}

interface Cliente {
  id: string;
  nombre: string;
  tipo?: string | null;
}

/*interface Perfil {
  id: string;
  nombre: string;
  rol: string;
}*/

/* ------------------------------------------------------------------
   COMPONENTE
------------------------------------------------------------------ */

export default function AdminDashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  //const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  //const [cargando, setCargando] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  // Filtros globales
  const [filtroProyectoId, setFiltroProyectoId] = useState<string | "todos">(
    "todos"
  );
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  // Modal de reporte avanzado
  const [modalReporte, setModalReporte] = useState(false);

  /* ------------------------------------------------------------------
     1. CARGA DE DATOS INICIAL
  ------------------------------------------------------------------ */

  useEffect(() => {
    const cargarTodo = async () => {
      //setCargando(true);

      const [
        { data: productosData },
        { data: clientesData },
        //{ data: perfilesData },
      ] = await Promise.all([
        supabase.from("productos").select("*"),
        supabase.from("clientes").select("id, nombre, tipo"),
        supabase.from("perfiles").select("id, nombre, rol"),
      ]);

      setProductos(productosData || []);
      setClientes(clientesData || []);
      //setPerfiles(perfilesData || []);
      setUltimaActualizacion(new Date().toLocaleString());
      //setCargando(false);
    };

    cargarTodo();
  }, []);

  /* ------------------------------------------------------------------
     2. DERIVADOS: PRODUCTOS FILTRADOS POR CONTROLES GLOBALES
  ------------------------------------------------------------------ */

  const productosFiltrados = useMemo(() => {
    let datos = [...productos];

    if (filtroProyectoId !== "todos") {
      datos = datos.filter((p) => p.cliente_id === filtroProyectoId);
    }

    if (filtroFechaInicio) {
      const fi = new Date(filtroFechaInicio);
      datos = datos.filter((p) => new Date(p.created_at) >= fi);
    }

    if (filtroFechaFin) {
      const ff = new Date(filtroFechaFin);
      datos = datos.filter((p) => new Date(p.created_at) <= ff);
    }

    return datos;
  }, [productos, filtroProyectoId, filtroFechaInicio, filtroFechaFin]);

  const proyectoSeleccionado =
    filtroProyectoId !== "todos"
      ? clientes.find((c) => c.id === filtroProyectoId)
      : null;

  /* ------------------------------------------------------------------
     3. HELPERS PARA EXPORTACIÓN
  ------------------------------------------------------------------ */

  const getSource = (subset?: Producto[]) =>
    subset && subset.length ? subset : productosFiltrados;

  /* ------------------------------------------------------------------
     4. EXPORTADOR: EXCEL GENERAL (DINÁMICO)
  ------------------------------------------------------------------ */

  const handleExportGeneralExcel = async (subset?: Producto[]) => {
    const source = getSource(subset);

    if (!source.length) {
      alert("No hay activos para exportar.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Inventario");

    // Encabezados dinámicos (todas las columnas)
    const cols = Object.keys(source[0]);
    sheet.addRow(cols);

    source.forEach((p) => {
      sheet.addRow(cols.map((c) => (p as any)[c]));
    });

    // Auto-fit de columnas
    sheet.columns.forEach((col: any) => {
      let max = 10;
      col.eachCell({ includeEmpty: true }, (cell: any) => {
        const len = cell.value ? cell.value.toString().length : 0;
        if (len > max) max = len;
      });
      col.width = max + 2;
    });

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_general_inventario.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ------------------------------------------------------------------
     5. EXPORTADOR: PDF GENERAL
  ------------------------------------------------------------------ */

  const handleExportPDF = async (subset?: Producto[]) => {
    const source = getSource(subset);

    if (!source.length) {
      alert("No hay activos para exportar.");
      return;
    }

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    const logoUrl = "/logo-anzaval.png";
    const logoBase64 = await fetch(logoUrl)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          })
      );

    doc.addImage(logoBase64, "PNG", margin, 10, 30, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Reporte de Inventario (General)", margin + 40, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${new Date().toLocaleString()}`, margin + 40, 28);
    doc.text("Empresa: Anzaval Tecnología", margin + 40, 33);

    autoTable(doc, {
      startY: 45,
      head: [
        [
          "Proyecto",
          "Descripción",
          "Tipo",
          "Estado físico",
          "Operatividad",
          "Fecha alta",
        ],
      ],
      body: source.map((p) => {
        const c = clientes.find((x) => x.id === p.cliente_id);
        return [
          c?.nombre || "Sin proyecto",
          p.descripcion_corta || "",
          p.tipo || "",
          p.estado_fisico || "",
          p.estado_operatividad || "",
          new Date(p.created_at).toLocaleDateString(),
        ];
      }),
      theme: "striped",
      headStyles: {
        fillColor: [0, 92, 175],
        textColor: 255,
        fontSize: 10,
      },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin },
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth - margin - 20,
        doc.internal.pageSize.getHeight() - 10
      );
      doc.text(
        "Anzaval Tecnología — Sistema de Inventario",
        margin,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save("reporte_general.pdf");
  };

  /* ------------------------------------------------------------------
     6. EXPORTADOR: EXCEL RESUMEN POR PROYECTO
  ------------------------------------------------------------------ */

  const handleExportResumenPorProyectoExcel = async (subset?: Producto[]) => {
    const source = getSource(subset);
    if (!source.length) {
      alert("No hay activos para exportar.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const resumenSheet = workbook.addWorksheet("Resumen");

    resumenSheet.columns = [
      { header: "Proyecto", key: "proyecto", width: 30 },
      { header: "Total activos", key: "total", width: 15 },
      { header: "Operativos", key: "activos", width: 15 },
      { header: "En revisión", key: "revision", width: 15 },
      { header: "Fuera de servicio", key: "fuera", width: 20 },
    ];

    const mapa = new Map<
      string,
      {
        nombre: string;
        total: number;
        activos: number;
        revision: number;
        fuera: number;
      }
    >();

    source.forEach((p) => {
      const c = clientes.find((x) => x.id === p.cliente_id);
      const key = c?.id || "sin_cliente";
      const nombre = c?.nombre || "Sin proyecto";

      if (!mapa.has(key)) {
        mapa.set(key, { nombre, total: 0, activos: 0, revision: 0, fuera: 0 });
      }

      const item = mapa.get(key)!;
      item.total++;

      const est = (p.estado_operatividad || "").toLowerCase();
      if (est.includes("bueno") || est.includes("operativo")) item.activos++;
      else if (est.includes("revision")) item.revision++;
      else if (est.includes("fuera") || est.includes("baja")) item.fuera++;
    });

    Array.from(mapa.values()).forEach((r) => resumenSheet.addRow(r));

    for (const [key, r] of mapa.entries()) {
      const sheet = workbook.addWorksheet(r.nombre.substring(0, 25));
      sheet.columns = [
        { header: "ID", key: "id", width: 36 },
        { header: "Descripción", key: "descripcion", width: 40 },
        { header: "Tipo", key: "tipo", width: 20 },
        { header: "Físico", key: "fisico", width: 15 },
        { header: "Operatividad", key: "oper", width: 20 },
        { header: "Fecha alta", key: "fecha", width: 20 },
      ];

      const prods = source.filter((p) => p.cliente_id === key);
      prods.forEach((p) =>
        sheet.addRow({
          id: p.id,
          descripcion: p.descripcion_corta,
          tipo: p.tipo,
          fisico: p.estado_fisico,
          oper: p.estado_operatividad,
          fecha: new Date(p.created_at).toLocaleDateString(),
        })
      );
    }

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_resumen_proyectos.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ------------------------------------------------------------------
     7. EXPORTADOR: PDF RESUMEN POR PROYECTO
  ------------------------------------------------------------------ */

  const handleExportResumenPorProyectoPDF = async (subset?: Producto[]) => {
    const source = getSource(subset);
    if (!source.length) {
      alert("No hay activos para exportar.");
      return;
    }

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 14;

    const logoUrl = "/logo-anzaval.png";
    const logoBase64 = await fetch(logoUrl)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          })
      );

    doc.addImage(logoBase64, "PNG", margin, 10, 30, 20);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Resumen de activos por proyecto", margin + 40, 20);

    const mapa = new Map<
      string,
      { nombre: string; total: number }
    >();

    source.forEach((p) => {
      const c = clientes.find((x) => x.id === p.cliente_id);
      const key = c?.id || "sin_cliente";
      const nombre = c?.nombre || "Sin proyecto";

      if (!mapa.has(key)) {
        mapa.set(key, { nombre, total: 0 });
      }
      mapa.get(key)!.total++;
    });

    autoTable(doc, {
      startY: 45,
      head: [["Proyecto", "Total activos"]],
      body: Array.from(mapa.values()).map((r) => [r.nombre, r.total]),
      theme: "striped",
      headStyles: { fillColor: [0, 92, 175], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin },
    });

    doc.save("reporte_resumen_proyectos.pdf");
  };

  /* ------------------------------------------------------------------
     8. EXPORTADOR: ZIP CON UN PDF POR PROYECTO
  ------------------------------------------------------------------ */

  const handleExportPDFsPorProyectoZIP = async (subset?: Producto[]) => {
    const source = getSource(subset);

    if (!source.length) {
      alert("No hay activos para generar reportes.");
      return;
    }

    const zip = new JSZip();

    const logoUrl = "/logo-anzaval.png";
    const logoBase64 = await fetch(logoUrl)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          })
      );

    const mapa = new Map<
      string,
      { cliente: Cliente | null; items: Producto[] }
    >();

    source.forEach((p) => {
      const cliente = clientes.find((c) => c.id === p.cliente_id) || null;
      const key = cliente?.id || "sin_cliente";

      if (!mapa.has(key)) {
        mapa.set(key, { cliente, items: [] });
      }
      mapa.get(key)!.items.push(p);
    });

    for (const [, grupo] of mapa.entries()) {
      const { cliente, items } = grupo;

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;

      doc.addImage(logoBase64, "PNG", margin, 10, 30, 20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(
        cliente?.nombre || "Proyecto sin asignar",
        margin + 40,
        18
      );
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Reporte de activos por proyecto", margin + 40, 25);
      doc.text(
        `Generado: ${new Date().toLocaleString()}`,
        margin + 40,
        32
      );

      // Mini-gráfica por estado de operatividad
      const countsMap = new Map<string, number>();
      items.forEach((p) => {
        const keyEstado = p.estado_operatividad || "Sin dato";
        countsMap.set(keyEstado, (countsMap.get(keyEstado) || 0) + 1);
      });

      const miniData = Array.from(countsMap.entries()).map(
        ([label, value]) => ({ label, value })
      );

      const chartX = margin;
      const chartY = 42;
      const barHeight = 5;
      const maxWidth = pageWidth - margin * 2;
      const maxValue =
        miniData.reduce((max, item) => Math.max(max, item.value), 1) || 1;

      doc.setFontSize(9);
      miniData.forEach((item, index) => {
        const y = chartY + index * (barHeight + 4);
        const barWidth = (item.value / maxValue) * maxWidth;

        doc.text(`${item.label} (${item.value})`, chartX, y - 1);
        doc.setFillColor(0, 92, 175);
        doc.rect(chartX, y, barWidth, barHeight, "F");
      });

      const tableStartY =
        chartY + miniData.length * (barHeight + 6) +
        (miniData.length ? 4 : 0);

      autoTable(doc, {
        startY: tableStartY,
        head: [
          [
            "ID",
            "Descripción",
            "Tipo",
            "Físico",
            "Operatividad",
            "Fecha alta",
          ],
        ],
        body: items.map((p) => [
          p.id,
          p.descripcion_corta || "",
          p.tipo || "",
          p.estado_fisico || "",
          p.estado_operatividad || "",
          new Date(p.created_at).toLocaleDateString(),
        ]),
        theme: "striped",
        headStyles: { fillColor: [0, 92, 175], textColor: 255, fontSize: 9 },
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
      });

      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          "Anzaval Tecnología — Sistema de Inventario",
          margin,
          doc.internal.pageSize.getHeight() - 8
        );
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth - margin - 20,
          doc.internal.pageSize.getHeight() - 8
        );
      }

      const pdfBuffer = doc.output("arraybuffer");
      const nombreSeguro = (cliente?.nombre || "Sin_proyecto").replace(
        /[^\w\d]+/g,
        "_"
      );
      zip.file(`Proyecto_${nombreSeguro}.pdf`, pdfBuffer);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "Reportes_por_proyecto.zip");
  };

  /* ------------------------------------------------------------------
     9. GENERADOR UNIFICADO PARA EL MODAL AVANZADO
  ------------------------------------------------------------------ */

  const handleGenerateReport = (params: {
    proyectoId: string | null;
    fechaInicio: string | null;
    fechaFin: string | null;
    tipoReporte: "general" | "resumen";
    formato: "excel" | "pdf";
  }) => {
    const { proyectoId, fechaInicio, fechaFin, tipoReporte, formato } = params;

    let datos = [...productos];

    if (proyectoId) datos = datos.filter((p) => p.cliente_id === proyectoId);
    if (fechaInicio)
      datos = datos.filter(
        (p) => new Date(p.created_at) >= new Date(fechaInicio)
      );
    if (fechaFin)
      datos = datos.filter(
        (p) => new Date(p.created_at) <= new Date(fechaFin)
      );

    if (!datos.length) {
      alert("No hay activos que coincidan con los filtros del reporte.");
      return;
    }

    if (formato === "excel") {
      tipoReporte === "general"
        ? handleExportGeneralExcel(datos)
        : handleExportResumenPorProyectoExcel(datos);
    } else {
      tipoReporte === "general"
        ? handleExportPDF(datos)
        : handleExportResumenPorProyectoPDF(datos);
    }
  };

  /* ------------------------------------------------------------------
     10. RENDER UI (ESTILO D, DISTRIBUCIÓN 1)
  ------------------------------------------------------------------ */

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER + CONTEXTO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            Reportes
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Última actualización:{" "}
            {ultimaActualizacion || "Cargando datos..."}
          </p>
        </div>

        {proyectoSeleccionado && (
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            Proyecto seleccionado:{" "}
            <span className="font-semibold">
              {proyectoSeleccionado.nombre}
            </span>
          </div>
        )}
      </div>

      {/* FILTROS GLOBALES */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 space-y-4">
        <div className="space-y-3">

  {/* Proyecto */}
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
      Proyecto
    </label>
    <select
      value={filtroProyectoId}
      onChange={(e) =>
        setFiltroProyectoId(e.target.value as string | "todos")
      }
      className="text-sm px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100
                 outline-none focus:ring-2 focus:ring-blue-500/60 transition"
    >
      <option value="todos">Todos los proyectos</option>
      {clientes.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nombre}
        </option>
      ))}
    </select>
  </div>

  {/* Fechas en una sola línea (solo móvil) */}
  <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
    
    {/* Fecha inicio */}
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
        Fecha inicio
      </label>
      <input
        type="date"
        value={filtroFechaInicio}
        onChange={(e) => setFiltroFechaInicio(e.target.value)}
        className="text-sm px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100
                   outline-none focus:ring-2 focus:ring-blue-500/60 transition"
      />
    </div>

    {/* Fecha fin */}
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
        Fecha fin
      </label>
      <input
        type="date"
        value={filtroFechaFin}
        onChange={(e) => setFiltroFechaFin(e.target.value)}
        className="text-sm px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100
                   outline-none focus:ring-2 focus:ring-blue-500/60 transition"
      />
    </div>

  </div>
</div>


        {/* BARRA SECUNDARIA: EXPORTACIONES + INFO */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-gray-100 dark:border-slate-800 pt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Mostrando{" "}
            <span className="font-semibold">
              {productosFiltrados.length}
            </span>{" "}
            activos de{" "}
            <span className="font-semibold">{productos.length}</span>{" "}
            registrados.
          </div>

          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:justify-end">

            {/* Excel general (filtrado) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleExportGeneralExcel()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 
                             text-xs md:text-sm rounded-lg border border-blue-500 
                             text-blue-600 dark:text-blue-300 bg-white dark:bg-slate-900
                             hover:bg-blue-50 dark:hover:bg-slate-800
                             transition transform hover:scale-[1.02] shadow-sm"
                >
                  <FiDownload size={16} />
                  Excel general
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Exportar los activos filtrados a Excel
              </TooltipContent>
            </Tooltip>

            {/* Resumen por proyecto Excel */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleExportResumenPorProyectoExcel()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 
                             text-xs md:text-sm rounded-lg border border-emerald-500 
                             text-emerald-600 dark:text-emerald-300 bg-white dark:bg-slate-900
                             hover:bg-emerald-50 dark:hover:bg-slate-800
                             transition transform hover:scale-[1.02] shadow-sm"
                >
                  <FiFileText size={16} />
                  Resumen Excel
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Resumen por proyecto en Excel (multi-hoja)
              </TooltipContent>
            </Tooltip>

            {/* ZIP PDF por proyecto */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleExportPDFsPorProyectoZIP()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 
                             text-xs md:text-sm rounded-lg border border-amber-500 
                             text-amber-600 dark:text-amber-300 bg-white dark:bg-slate-900
                             hover:bg-amber-50 dark:hover:bg-slate-800
                             transition transform hover:scale-[1.02] shadow-sm"
                >
                  <FiFolder size={16} />
                  ZIP PDF proyectos
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Un PDF por proyecto dentro de un ZIP
              </TooltipContent>
            </Tooltip>

            {/* Modal de reporte avanzado */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setModalReporte(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 
                             text-xs md:text-sm rounded-lg bg-blue-600 text-white 
                             hover:bg-blue-700 transition transform hover:scale-[1.03]
                             shadow"
                >
                  <FiBarChart2 size={16} />
                  Reporte avanzado
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Reportes con filtros personalizados
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE CHARTS + KPIs */}
      <DashboardCharts
        productos={productosFiltrados}
        clientes={clientes}
      />

      {/* MODAL DE REPORTE AVANZADO */}
      {modalReporte && (
        <GenerateReportModal
          onClose={() => setModalReporte(false)}
          proyectos={clientes}
          onGenerate={handleGenerateReport}
        />
      )}
    </div>
  );
}
