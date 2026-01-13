import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

export default function IdentificacionTab({ producto, clientes, onChange }: any) {
  const clienteOptions = clientes.map((c: any) => ({
    value: c.id,
    label: c.nombre,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <Select
        label="Proyecto / Cliente"
        field="cliente_id"
        value={producto}
        onChange={onChange}
        options={clienteOptions}
      />

      <Input label="Ubicación" field="ubicacion" value={producto} onChange={onChange} />
      <Input label="Piso" field="piso" value={producto} onChange={onChange} />
      <Input label="Área / Sector" field="area_sector" value={producto} onChange={onChange} />
      <Input label="Tag" field="tag" value={producto} onChange={onChange} />
      <Input label="Descripción Corta" field="descripcion_corta" value={producto} onChange={onChange} />
      <Input label="Tipo" field="tipo" value={producto} onChange={onChange} />
      <Input label="Unidad" field="unidad" value={producto} onChange={onChange} />
      <Input label="Estado" field="estado" value={producto} onChange={onChange} />
      <Input label="Proveedor" field="proveedor" value={producto} onChange={onChange} />

      <Textarea label="Descripción Larga" field="descripcion_larga" value={producto} onChange={onChange} />
    </div>
  );
}
