// src/components/product/inputs/Textarea.tsx
export default function Textarea({
  label,
  field,
  value,
  onChange,
  rows = 3,
}: any) {
  return (
    <div className="sm:col-span-2 text-gray-700 dark:text-gray-200">
      <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <textarea
        value={value?.[field] ?? ""}
        onChange={(e) => onChange(field, e.target.value)}
        rows={rows}
        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
