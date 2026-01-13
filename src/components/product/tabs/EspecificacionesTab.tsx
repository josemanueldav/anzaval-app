import Input from "../ui/Input";

export default function EspecificacionesTab({ producto, onChange }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Marca" field="marca" value={producto} onChange={onChange} />
      <Input label="Submarca" field="submarca" value={producto} onChange={onChange} />
      <Input label="Modelo" field="modelo" value={producto} onChange={onChange} />
      <Input label="Versión" field="version" value={producto} onChange={onChange} />
      <Input label="No. Serie" field="no_serie" value={producto} onChange={onChange} />
      <Input label="País Origen" field="pais_origen" value={producto} onChange={onChange} />
      <Input label="Material" field="material" value={producto} onChange={onChange} />
      <Input label="Color" field="color" value={producto} onChange={onChange} />
      <Input label="Movilidad" field="movilidad" value={producto} onChange={onChange} />
      <Input label="Vida útil remanente" field="vida_util_remanente" value={producto} onChange={onChange} />
      <Input label="Estado físico" field="estado_fisico" value={producto} onChange={onChange} />
      <Input label="Estado operatividad" field="estado_operatividad" value={producto} onChange={onChange} />
    </div>
  );
}
