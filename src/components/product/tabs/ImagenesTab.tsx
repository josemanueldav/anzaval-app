export default function ImagenesTab({
  tempImages,
  addTempImage,
  removeTempImage,
}: any) {
  return (
    <div className="space-y-4">
      <label className="block text-sm">Subir imágenes</label>
      <input
        type="file"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          files.forEach((file) => addTempImage(file));
        }}
        className="file-input"
      />

      {tempImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tempImages.map((img: any) => (
            <div key={img.path} className="relative">
              <img src={img.preview} className="rounded-lg object-cover h-32 w-full" />
              <button
                onClick={() => removeTempImage(img.path)}
                className="absolute top-1 right-1 p-1 bg-red-600 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No hay imágenes temporales</p>
      )}
    </div>
  );
}
