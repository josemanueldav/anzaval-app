//import { useEffect, useState } from "react";
//import { supabase } from "@/lib/supabaseClient";
//import Input from "../inputs/Input";
//import CampoObligatorio from "./CampoObligatorio";
//import DropdownCliente from "../inputs/DropdownCliente"; // ⬅️ NUEVO IMPORT

export default function Pantalla1Proyecto({
  producto,
  handleChange,
  //persistSticky,
  submitAttempted,
}: {
  producto: any;
  handleChange: (field: string, value: any) => void;
  persistSticky: (draft?: any) => void;
  submitAttempted: boolean;
}) {
 

  return (
    <div className="space-y-6 px-1 md:px-0">

      {/* === Cliente === */}
      

      {/* ===================== PROYECTO / UBICACIÓN ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          📍 Proyecto y ubicación
        </h3>

        {/* Ubicación */}
        <div>
          <label className="label-base">
            Ubicación <span className="text-red-500">*</span>
          </label>
          <input
            value={producto.ubicacion ?? ""}
            onChange={(e) => handleChange("ubicacion", e.target.value)}
            className="input-base"
            placeholder="Ej. Planta Monterrey"
          />
        </div>

        {/* Piso */}
        <div>
          <label className="label-base">
            Piso <span className="text-red-500">*</span>
          </label>
          <input
            value={producto.piso ?? ""}
            onChange={(e) => handleChange("piso", e.target.value)}
            className="input-base"
            placeholder="Ej. Piso 2"
          />
        </div>

        {/* Área / sector */}
        <div>
          <label className="label-base">
            Área o sector <span className="text-red-500">*</span>
          </label>
          <input
            value={producto.area_sector ?? ""}
            onChange={(e) => handleChange("area_sector", e.target.value)}
            className="input-base"
            placeholder="Ej. Producción, Almacén, Calidad…"
          />
        </div>
      </div>

      {/* ===================== CLASIFICACIÓN ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          🗂️ Clasificación del activo
        </h3>

        {/* Tipo */}
        <div>
          <label className="label-base">
            Tipo de activo <span className="text-red-500">*</span>
          </label>
          <select
            value={producto.tipo ?? ""}
            onChange={(e) => handleChange("tipo", e.target.value)}
            className="select-base"
          >
            <option value="">Seleccionar tipo</option>
            <option value="equipo">Equipo</option>
            <option value="mobiliario">Mobiliario</option>
            <option value="herramienta">Herramienta</option>
            <option value="vehiculo">Vehículo</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Tag */}
        <div>
          <label className="label-base">
            Tag del activo <span className="text-red-500">*</span>
          </label>
          <input
            value={producto.tag ?? ""}
            onChange={(e) => handleChange("tag", e.target.value)}
            className="input-base"
            placeholder="Ej. ANZ-001"
          />

          {submitAttempted && !producto.tag && (
            <p className="text-xs text-red-500 mt-1">
              Este campo es obligatorio
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
