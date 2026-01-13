import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ClienteModal from "../components/ClienteModal";
import { Edit2, Trash2, Plus, Building2, MapPin, Mail, Phone, UserCheck, UserX } from "lucide-react";

interface Cliente {
  id: string;
  nombre: string;
  direccion: string;
  contacto: string;
  correo: string;
  telefono: string;
  activo: boolean;
}

export default function ClienteList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);

  /* ================== Cargar clientes ================== */
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al cargar clientes:", error);
      setClientes([]);
    } else {
      setClientes(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar cliente:", error);
      alert("❌ No se pudo eliminar.");
    } else {
      alert("✅ Cliente eliminado.");
      fetchClientes();
    }
  };

  /* ================== Render ================== */
  return (
    <div className="p-4 sm:p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🏢 Clientes / Proyectos
        </h1>

        <button
          onClick={() => {
            setClienteToEdit(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold shadow"
        >
          <Plus size={18} />
          Nuevo cliente
        </button>
      </div>

      {loading ? (
        <p className="text-gray-300">Cargando clientes...</p>
      ) : clientes.length === 0 ? (
        <p className="text-gray-400">No hay clientes registrados.</p>
      ) : (
        <>
          {/* 💻 Vista en escritorio */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <thead>
                <tr className="bg-white/10 text-left text-gray-300">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Dirección</th>
                  <th className="p-3">Contacto</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3 text-center">Activo</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-white/10 hover:bg-white/10 transition"
                  >
                    <td className="p-3">{c.nombre}</td>
                    <td className="p-3">{c.direccion}</td>
                    <td className="p-3">{c.contacto}</td>
                    <td className="p-3">{c.correo}</td>
                    <td className="p-3">{c.telefono}</td>
                    <td className="p-3 text-center">
                      {c.activo ? "✅" : "🚫"}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setClienteToEdit(c);
                          setModalOpen(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 Vista móvil */}
          <div className="sm:hidden space-y-4">
            {clientes.map((c) => (
              <div
                key={c.id}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Building2 size={16} /> {c.nombre}
                  </h3>
                  {c.activo ? (
                    <UserCheck size={16} className="text-green-400" />
                  ) : (
                    <UserX size={16} className="text-red-400" />
                  )}
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} /> {c.direccion || "Sin dirección"}
                  </p>
                  <p className="flex items-center gap-2">
                    <UserCheck size={14} /> {c.contacto || "Sin contacto"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} /> {c.correo || "Sin correo"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> {c.telefono || "—"}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => {
                      setClienteToEdit(c);
                      setModalOpen(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Edit2 size={16} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <ClienteModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={fetchClientes}
          clienteToEdit={clienteToEdit}
        />
      )}
    </div>
  );
}
