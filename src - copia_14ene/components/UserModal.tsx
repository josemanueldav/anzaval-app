import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabaseClient";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  userToEdit?: any | null;
}

interface Cliente {
  id: string;
  nombre: string;
}

export default function UserModal({ isOpen, onClose, onSaved, userToEdit }: UserModalProps) {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("capturista");
  const [activo, setActivo] = useState(true);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentUserRole, setCurrentUserRole] = useState<string>("capturista"); // rol detectado

  /* ================== Cargar datos ================== */
  useEffect(() => {
    if (isOpen) {
      fetchCurrentUserRole();
      fetchClientes();

      if (userToEdit) {
        setEmail(userToEdit.email || "");
        setRol(userToEdit.rol || "capturista");
        setActivo(userToEdit.activo ?? true);
        setClienteId(userToEdit.cliente_id || null);
      } else {
        setEmail("");
        setRol("capturista");
        setActivo(true);
        setClienteId(null);
      }
    }
  }, [isOpen, userToEdit]);

  /* ===== Detectar rol real del usuario logueado ===== */
  const fetchCurrentUserRole = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;
    if (!email) return;

    const { data: userRole } = await supabase
      .from("usuarios_roles")
      .select("rol")
      .eq("email", email)
      .maybeSingle();

    if (userRole?.rol) setCurrentUserRole(userRole.rol);
    else setCurrentUserRole("capturista");
  };

  /* ====== Obtener lista de clientes ====== */
  const fetchClientes = async () => {
    const { data, error } = await supabase.from("clientes").select("id, nombre").order("nombre");
    if (!error && data) setClientes(data);
  };

  /* ============ Guardar usuario ============ */
  const handleSave = async () => {
    if (!email.trim()) {
      alert("El campo Email es obligatorio.");
      return;
    }

    setLoading(true);
    const payload = {
      email: email.trim(),
      rol,
      activo,
      cliente_id: clienteId || null,
    };

    try {
      if (userToEdit) {
        const { error } = await supabase
          .from("usuarios_roles")
          .update(payload)
          .eq("id", userToEdit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("usuarios_roles").insert([payload]);
        if (error) throw error;
      }

      await onSaved();
      onClose();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("❌ No se pudo guardar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  /* ================== UI ================== */
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-md text-white relative shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-300 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h2 className="text-xl font-semibold">
            {userToEdit ? "Editar usuario" : "Nuevo usuario"}
          </h2>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
              placeholder="usuario@empresa.com"
            />
          </div>

          {/* Rol: solo admins o supervisores pueden verlo */}
          {(currentUserRole === "administrador" || currentUserRole === "supervisor") && (
            <div>
              <label className="block text-sm mb-1">Rol</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
              >
                <option value="administrador">Administrador</option>
                <option value="supervisor">Supervisor</option>
                <option value="capturista">Capturista</option>
              </select>
            </div>
          )}

          {/* Cliente: visible para administradores y supervisores */}
          {(currentUserRole === "administrador" || currentUserRole === "supervisor") && (
            <div>
              <label className="block text-sm mb-1">Cliente</label>
              <select
                value={clienteId || ""}
                onChange={(e) => setClienteId(e.target.value || null)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none"
              >
                <option value="">Sin asignar</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-sm">Activo</label>
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ================== Animación fade-in ================== */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
`;
document.head.appendChild(style);
