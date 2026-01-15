// src/components/product/wizard/Pantalla8IdentAvanzada.tsx

import Input from "../inputs/Input";
import BarcodeImage from "../widgets/BarcodeImage";
import { QRCodeCanvas } from "qrcode.react";

export default function Pantalla8IdentAvanzada({
  producto,
  handleChange,
  tipoDetectado,
  detected,
  videoRef,
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
  scanning,
  start,
  stop,
  barcodeToPNG,
}: any) {
  return (
    <div className="flex flex-col space-y-8 px-1 md:px-0">

      {/* ======================= CÓDIGO DE BARRAS ======================= */}
      <section className="card-base space-y-4">
       <h3 className="section-title text-blue-500 flex items-center gap-2">
          🏷️ Código de barras
        </h3>

        <Input
          label="Código de barras / SKU"
          field="codigo_barras"
          value={producto}
          onChange={handleChange}
        />

        {producto?.codigo_barras?.trim() && (
          <div className="mt-4 flex flex-col items-center space-y-2">
            <BarcodeImage value={producto.codigo_barras} />

            <button
              type="button"
              onClick={() => barcodeToPNG("codigo_barras")}
              className="
  px-4 py-2 rounded-lg text-sm font-medium transition-colors
  bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300
  dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20
"
 
            >
              Descargar como imagen
            </button>
          </div>
        )}
      </section>

      {/* ======================= CÓDIGO QR ======================= */}
      <section className="card-base space-y-4">
        <h3 className="section-title text-blue-500 flex items-center gap-2">

          📱 Código QR
        </h3>

        <Input
          label="Contenido del QR"
          field="codigo_qr"
          value={producto}
          onChange={handleChange}
        />

        {producto?.codigo_qr?.trim() && (
          <div className="mt-4 flex flex-col items-center space-y-2">
            <div className="p-3 rounded-2xl bg-white text-black dark:bg-[#020617] dark:text-white border border-gray-300 dark:border-white/15">
              <div className="
  inline-flex items-center justify-center
  p-4 rounded-2xl
  bg-white
  border border-gray-300
  dark:bg-white
">
  <QRCodeCanvas
    value={producto.codigo_qr || ""}
    size={180}
    bgColor="#ffffff"
    fgColor="#000000"
  />
</div>

            </div>
            <p className="text-xs text-gray-400">
              Este QR representa el texto configurado arriba.
            </p>
          </div>
        )}
      </section>

      {/* ======================= SCANNER ======================= */}
      <section className="card-base space-y-4">
        <h3 className="section-title text-blue-500 flex items-center gap-2">

          🔍 Escáner de códigos
        </h3>

        <div className="flex flex-col gap-4 items-stretch">

          {/* Fila superior: selector de cámara + botón escaneo */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {devices.length > 1 && (
              <div className="flex-1">
                <label className="text-xs text-white/60 mb-1 block">
                  Cámara
                </label>
                <select
                  value={selectedDeviceId ?? ""}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/30 text-sm text-gray-100"
                >
                  {devices.map((d: any, idx: number) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Cámara ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex-1 flex items-end">
              <button
                type="button"
                onClick={() => (scanning ? stop() : start())}
                className={`
                  w-full px-4 py-3 rounded-xl font-semibold text-sm
                  transition-colors active:scale-[0.98]
                  ${scanning
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"}
                `}
              >
                {scanning ? "Detener escaneo" : "Iniciar escaneo"}
              </button>
            </div>
          </div>

          {/* Tipo detectado */}
          {tipoDetectado && (
            <div>
              <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-300 border border-green-400/40 text-xs">
                {tipoDetectado} detectado
              </span>
            </div>
          )}

          {/* Vista de cámara estilo “WhatsApp” */}
          <div className="mt-2 w-full flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-black/60 border border-white/15">
              {/* Video en vivo */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />

              {/* Oscurecimiento suave */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* Marco del escáner */}
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <div
                  className={`w-56 h-56 max-w-[75%] max-h-[75%] rounded-xl relative transition-all duration-300 ${
                    detected
                      ? "border-4 border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.8)]"
                      : "border-4 border-blue-500"
                  }`}
                >
                  {/* Esquinas */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-xl"></div>

                  {/* Línea láser */}
                  <div className="absolute left-0 w-full h-0.5 bg-blue-400 animate-scan-line"></div>
                </div>
              </div>

              {/* Mensaje de estado */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div className="px-3 py-1 rounded-full bg-black/60 text-xs text-white/80">
                  {scanning
                    ? "Apunta el código dentro del recuadro"
                    : "Pulsa “Iniciar escaneo” para activar la cámara"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
