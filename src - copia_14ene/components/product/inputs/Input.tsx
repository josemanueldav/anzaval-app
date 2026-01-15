// src/components/product/inputs/Input.tsx
//import React from "react";

export default function Input({
  label,
  field,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  field: string;
  value: any;
  onChange: (field: string, value: any) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200" >{label}</label>
      <input
        type={type}
        value={value?.[field] ?? ""}
        onChange={(e) =>
          onChange(field, type === "number" ? Number(e.target.value) : e.target.value)
        }
        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
