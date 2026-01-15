// src/components/product/wizard/CampoObligatorio.tsx

export default function CampoObligatorio({
  label,
  value,
  submitAttempted,
  children
}: {
  label: string;
  value: any;
  submitAttempted: boolean;
  children: any;
}) {
  const error = submitAttempted && (!value || value === "");

  return (
    <div className={`mb-2 p-2 rounded-md transition-all
      ${error ? "border-l-4 border-red-600 bg-red-600/10" : "border-l-4 border-blue-500"}
    `}>
      <label className="text-sm block mb-1">
        {label} <span className="text-red-400">*</span>
      </label>

      {children}

      {error && (
        <p className="text-red-400 text-xs mt-1">
          Este campo es obligatorio
        </p>
      )}
    </div>
  );
}
