export default function NumberInput({ label, field, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="number"
        value={value?.[field] ?? ""}
        onChange={(e) => onChange(field, Number(e.target.value))}
        className="input"
      />
    </div>
  );
}
