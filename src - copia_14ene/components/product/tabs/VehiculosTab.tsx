import Input from "../ui/Input";
import NumberInput from "../ui/NumberInput";

export default function VehiculosTab({ producto, onChange }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="No. Motor" field="no_motor" value={producto} onChange={onChange} />
      <Input label="Matrícula" field="matricula" value={producto} onChange={onChange} />
      <NumberInput label="Kilometraje" field="kilometraje" value={producto} onChange={onChange} />
      <Input label="No. Económico" field="no_economico" value={producto} onChange={onChange} />
    </div>
  );
}
