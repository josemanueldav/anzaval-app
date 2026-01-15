import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import UserModal from "../components/UserModal";

interface Usuario {
  id: string;
  email: string;
  rol: string;
  activo: boolean;
  cliente_id: string | null;
  created_at: string;
  cliente?: { nombre: string };
}

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState("capturista");

  /* ================== Cargar usuarios ================== */
  useEffect(() => {
    fetchUsuarios();
    fetchCurrentUserRole();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("usuarios_roles")
      .select("*, cliente:cliente_id (nombre)")
      .order("created_at", { ascending: false });

    if (!error && data) setUsuarios(data);
    setLoading(false);
  };

  const fetchCurrentUserRole = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;
    if (!email) return;

    const { data: userRole } = await supabase
      .from("usuarios_roles")
      .select("rol")
      .eq("email", email)
      .maybeSingle();

    const normalized =
  userRole?.rol?.toLowerCase().trim() || "capturista";

// Normalizar variantes comunes
if (["admin", "administrador"].includes(normalized)) {
  setCurrentUserRole("administrador");
} else if (["supervisor", "super"].includes(normalized)) {
  setCurrentUserRole("supervisor");
} else {
  setCurrentUserRole("capturista");
}

  };

  /* ================== Acciones ================== */
  const handleNew = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: Usuario) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este usuario permanentemente?")) return;
    const { error } = await supabase.from("usuarios_roles").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("❌ No se pudo eliminar.");
    } else {
      fetchUsuarios();
    }
  };

  /* ================== UI ================== */
  return (
    <div className="p-6 text-white space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          👥 Administración de Usuarios
        </h1>
       {["administrador", "supervisor"].includes(currentUserRole) && (
  <button
    onClick={handleNew}
    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
  >
    ➕ Nuevo usuario
  </button>
)}

      </div>

      {/* Tabla para escritorio */}
      <div className="hidden md:block">
        {loading ? (
          <p className="text-gray-400">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-gray-400">No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Rol</th>
                  <th className="py-3 px-4 text-left">Cliente</th>
                  <th className="py-3 px-4 text-center">Activo</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-t border-white/10 hover:bg-white/10">
                    <td className="py-2 px-4">{u.email}</td>
                    <td className="py-2 px-4 capitalize">{u.rol}</td>
                    <td className="py-2 px-4">{u.cliente?.nombre || "—"}</td>
                    <td className="py-2 px-4 text-center">
                      {u.activo ? "✅" : "🚫"}
                    </td>
                    <td className="py-2 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-400 hover:underline"
                      >
                        ✏️ Editar
                      </button>
                      {(currentUserRole === "administrador" ||
                        currentUserRole === "supervisor") && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-red-400 hover:underline"
                        >
                          🗑️ Borrar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vista móvil tipo tarjetas */}
      <div className="md:hidden space-y-3">
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="bg-white/10 p-4 rounded-lg shadow border border-white/20 flex flex-col space-y-2"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm">{u.email}</p>
              <span className="text-xs bg-blue-600/30 px-2 py-1 rounded-full capitalize">
                {u.rol}
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Cliente: <span className="text-white">{u.cliente?.nombre || "—"}</span>
            </p>
            <p className="text-xs text-gray-300">
              Estado: {u.activo ? "✅ Activo" : "🚫 Inactivo"}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleEdit(u)}
                className="text-blue-400 text-sm hover:underline"
              >
                ✏️ Editar
              </button>
              {(currentUserRole === "administrador" ||
                currentUserRole === "supervisor") && (
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-red-400 text-sm hover:underline"
                >
                  🗑️ Borrar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de usuario */}
      {modalOpen && (
        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={fetchUsuarios}
          userToEdit={selectedUser}
        />
      )}
    </div>
  );
}
