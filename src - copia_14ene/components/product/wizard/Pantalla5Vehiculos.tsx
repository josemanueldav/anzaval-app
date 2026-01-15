export default function Pantalla5Vehiculos({
  producto,
  handleChange,
}: any) {
  const esVehiculo = producto.tipo === "vehiculo";

  return (
    <div className="space-y-6 px-1 md:px-0">

      <h3 className="section-title text-blue-500">
        🚗 Vehículo
      </h3>

      {/* ===================== ACTIVO ES VEHÍCULO ===================== */}
      {esVehiculo && (
        <div className="card-base space-y-4">

          <h4 className="font-semibold text-gray-800 dark:text-white">
            Datos del vehículo
          </h4>

          <div>
            <label className="label-base">Tipo</label>
            <input
              value={producto.vehiculo_tipo ?? ""}
              onChange={(e) =>
                handleChange("vehiculo_tipo", e.target.value)
              }
              className="input-base"
              placeholder="Ej. Montacargas, Camioneta…"
            />
          </div>

          <div>
            <label className="label-base">Marca</label>
            <input
              value={producto.vehiculo_marca ?? ""}
              onChange={(e) =>
                handleChange("vehiculo_marca", e.target.value)
              }
              className="input-base"
            />
          </div>

          <div>
            <label className="label-base">Modelo</label>
            <input
              value={producto.vehiculo_modelo ?? ""}
              onChange={(e) =>
                handleChange("vehiculo_modelo", e.target.value)
              }
              className="input-base"
            />
          </div>

          <div>
            <label className="label-base">Año</label>
            <input
              type="number"
              value={producto.vehiculo_ano ?? ""}
              onChange={(e) =>
                handleChange("vehiculo_ano", e.target.value)
              }
              className="input-base"
            />
          </div>

          <div>
            <label className="label-base">Número de serie</label>
            <input
              value={producto.vehiculo_serie ?? ""}
              onChange={(e) =>
                handleChange("vehiculo_serie", e.target.value)
              }
              className="input-base"
            />
          </div>

          <div>
            <label className="label-base">Placas</label>
            <input
              value={producto.vehiculo_placas ?? ""}
              onChange={(e) =>
                handleChange("vehiculo_placas", e.target.value)
              }
              className="input-base"
            />
          </div>

          <div>
            <label className="label-base">Comentarios</label>
            <textarea
              value={producto.vehiculo_comentarios ?? ""}
              onChange={(e) =>
                handleChange("vehiculo_comentarios", e.target.value)
              }
              className="textarea-base"
            />
          </div>

        </div>
      )}

      {/* ===================== NO ES VEHÍCULO ===================== */}
      {!esVehiculo && (
        <div className="card-base text-secondary text-sm">
          Este activo no es un vehículo.  
          No es necesario capturar información vehicular.
        </div>
      )}
    </div>
  );
}
