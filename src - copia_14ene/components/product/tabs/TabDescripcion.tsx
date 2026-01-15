export default function TabDescripcion({ producto, updateField }: any) {
  return (
    <textarea
      className="textarea"
      value={producto.descripcion || ""}
      onChange={e => updateField("descripcion", e.target.value)}
      placeholder="Descripción..."
    />
  );
}
