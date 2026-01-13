//import React from "react";

export default function Pantalla7Imagenes({
  imagenes,
  imagenesTemporales,
  handleUpload,
  handleCancelarImagenesTemporales,
  handleDeleteImagen,
}: any) {
  return (
    <div className="space-y-6 px-1 md:px-0">

      {/* ===================== IMÁGENES ACTUALES ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          📷 Imágenes del activo
        </h3>

        {imagenes.length === 0 && (
          <p className="text-secondary text-sm">
            No hay imágenes registradas para este activo.
          </p>
        )}

        {imagenes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {imagenes.map((img: any) => (
              <div
                key={img.id}
                className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
              >
                <img
                  src={img.url}
                  alt="Imagen del activo"
                  className="w-full h-32 object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleDeleteImagen(img.id)}
                  className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================== IMÁGENES TEMPORALES ===================== */}
      {imagenesTemporales.length > 0 && (
        <div className="card-base space-y-4">
          <h3 className="section-title text-blue-500">
            ⏳ Imágenes pendientes de guardar
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {imagenesTemporales.map((img: any, index: number) => {
  let preview: string | undefined;

  if (img instanceof File) {
    preview = URL.createObjectURL(img);
  } else if (img?.file instanceof File) {
    preview = URL.createObjectURL(img.file);
  } else {
    preview = img?.preview || img?.url;
  }

  if (!preview) return null;

  return (
    <div
      key={index}
      className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
    >
      <img
        src={preview}
        alt="Imagen temporal"
        className="w-full h-32 object-cover opacity-90"
      />
    </div>
  );
})}

          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancelarImagenesTemporales}
              className="btn-secondary w-full"
            >
              Cancelar imágenes
            </button>
          </div>
        </div>
      )}

      {/* ===================== SUBIR NUEVAS IMÁGENES ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          ➕ Agregar imágenes
        </h3>

        <label className="btn-primary w-full text-center cursor-pointer py-4">
          Seleccionar imágenes
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        <p className="text-tertiary text-sm">
          Puedes seleccionar una o varias imágenes desde tu dispositivo.
        </p>
      </div>

    </div>
  );
}
