import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

export default function AsignacionTab({ producto, onChange }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Usuario asignado" field="usuario" value={producto} onChange={onChange} />
      <Input label="Consultor" field="consultor" value={producto} onChange={onChange} />
      <Input label="Área específica" field="area_especifica" value={producto} onChange={onChange} />
      <Input label="Tag anterior" field="tag_anterior" value={producto} onChange={onChange} />
      <Input label="Tag colocado nuevo" field="tag_colocado_nuevo" value={producto} onChange={onChange} />

      <Textarea label="Observaciones" field="observaciones" value={producto} onChange={onChange} />
      <Textarea label="Notas adicionales" field="notas_adicionales" value={producto} onChange={onChange} />
    </div>
  );
}
