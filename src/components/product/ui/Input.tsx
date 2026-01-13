export default function Input({ label, field, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="text"
        value={value?.[field] ?? ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="input"
      />
    </div>
  );
}
