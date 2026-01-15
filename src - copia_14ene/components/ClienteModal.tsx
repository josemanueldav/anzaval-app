import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabaseClient";
import { X } from "lucide-react";

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  clienteToEdit?: any | null;
}

export default function ClienteModal({
  isOpen,
  onClose,
  onSaved,
  clienteToEdit,
}: ClienteModalProps) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contacto, setContacto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [activo, setActivo] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (clienteToEdit) {
      setNombre(clienteToEdit.nombre || "");
      setDireccion(clienteToEdit.direccion || "");
      setContacto(clienteToEdit.contacto || "");
      setCorreo(clienteToEdit.correo || "");
      setTelefono(clienteToEdit.telefono || "");
      setActivo(clienteToEdit.activo ?? true);
    } else {
      setNombre("");
      setDireccion("");
      setContacto("");
      setCorreo("");
      setTelefono("");
      setActivo(true);
    }
  }, [clienteToEdit]);

  const handleSave = async () => {
    if (!nombre.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    setSaving(true);

    const data = {
      nombre,
      direccion,
      contacto,
      correo,
      telefono,
      activo,
    };

    const { error } = clienteToEdit
      ? await supabase.from("clientes").update(data).eq("id", clienteToEdit.id)
      : await supabase.from("clientes").insert([data]);

    setSaving(false);

    if (error) {
      console.error("Error al guardar cliente:", error);
      alert("❌ No se pudo guardar el cliente.");
      return;
    }

    alert("✅ Cliente guardado correctamente.");
    onSaved();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-lg text-white relative shadow-2xl transform animate-fadeInUp">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* Logo con fade-in suave */}
        <div className="flex justify-center mb-4 mt-2 animate-fadeIn">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 opacity-90 drop-shadow-md"
          />
        </div>

        <h2 className="text-xl font-bold mb-4 text-center">
          {clienteToEdit ? "Editar cliente" : "Nuevo cliente"}
        </h2>

        <div className="space-y-3">
          <Input label="Nombre" value={nombre} onChange={setNombre} required />
          <Input label="Dirección" value={direccion} onChange={setDireccion} />
          <Input label="Contacto" value={contacto} onChange={setContacto} />
          <Input label="Correo" value={correo} onChange={setCorreo} type="email" />
          <Input label="Teléfono" value={telefono} onChange={setTelefono} type="tel" />

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="accent-blue-500 w-5 h-5"
            />
            <label className="text-sm">Activo</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-lg font-semibold ${
              saving
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ========== Input genérico ========== */
function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder={label}
      />
    </div>
  );
}

/* ========== Animaciones personalizadas ========== */
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
.animate-fadeInUp {
  animation: fadeInUp 0.4s ease-out;
}
`;

// Inyectamos los estilos globales solo una vez
if (!document.getElementById("fadeInStyles")) {
  const style = document.createElement("style");
  style.id = "fadeInStyles";
  style.innerHTML = styles;
  document.head.appendChild(style);
}
