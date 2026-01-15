import { useProductImages } from "../hooks/useProductImages";

export default function TabImagenes({ initialImages }: any) {
  const { imagenes, addImage, removeImage } = useProductImages(initialImages);

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {imagenes.map((img, i) => (
          <div key={i} className="relative">
            <img src={img} className="rounded" />
            <button
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 text-white bg-black/50 px-1"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <button className="btn mt-4" onClick={() => addImage(prompt("URL:")!)}>
        Agregar imagen
      </button>
    </div>
  );
}
