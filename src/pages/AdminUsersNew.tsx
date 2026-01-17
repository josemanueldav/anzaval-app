import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import UserCard from "@/components/admin/UserCard";
import ModalUsuario from "@/components/admin/ModalUsuario";

import { SUPABASE_FUNCTIONS_URL } from "@/lib/supabaseFunctions";


export default function AdminUsersNew() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<any | null>(null);

  const [rolesDisponibles, setRolesDisponibles] = useState<string[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);

  // filtros
  const [busqueda, _setBusqueda] = useState("");
  const [filtroRol, _setFiltroRol] = useState("");
  const [filtroProyecto, _setFiltroProyecto] = useState("");
  const [filtroTipoProyecto, _setFiltroTipoProyecto] = useState("");

  // ----------------------------------------------------------
  // CARGAR ROLES
  // ----------------------------------------------------------
  const cargarRoles = async () => {
    const { data, error } = await supabase.from("roles").select("nombre");
    if (!error && data) {
      setRolesDisponibles(data.map((r) => r.nombre));
    }
  };

  // ----------------------------------------------------------
  // CARGAR PROYECTOS
  // ----------------------------------------------------------
  const cargarProyectos = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombre, tipo");

    if (!error && data) {
      setProyectos(data);
    }
  };

  // ----------------------------------------------------------
  // CARGAR USUARIOS (READ-ONLY)
  // ----------------------------------------------------------
  const cargarUsuarios = async () => {
    try {
      setLoading(true);

      const { data: usuariosBase, error } = await supabase
        .from("usuarios")
        .select(`
          id,
          nombre,
          email,
          rol,
          usuarios_proyectos (
            rol,
            cliente_id,
            activo
          )
        `);

      if (error || !usuariosBase) {
        setUsuarios([]);
        return;
      }

      const resultado = usuariosBase.map((u: any) => {
        const proyectosAsignados =
          u.usuarios_proyectos
            ?.filter((p: any) => p.cliente_id && p.activo)
            .map((p: any) => {
              const px = proyectos.find((x) => x.id === p.cliente_id);
              return px
                ? { id: px.id, nombre: px.nombre, tipo: px.tipo ?? "activo" }
                : { id: p.cliente_id, nombre: p.cliente_id, tipo: "otro" };
            }) ?? [];

        const rolesExtras =
          u.usuarios_proyectos
            ?.filter((p: any) => !p.cliente_id && p.activo)
            .map((p: any) => p.rol) ?? [];

        return {
          id: u.id,
          nombre: u.nombre,
          email: u.email,
          rol: u.rol,
          roles: [u.rol, ...rolesExtras],
          proyectos: proyectosAsignados,
          totalProyectos: proyectosAsignados.length,
        };
      });

      setUsuarios(resultado);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // GUARDAR USUARIO (CREATE / UPDATE → EDGE FUNCTIONS)
  // ----------------------------------------------------------
  const guardarUsuario = async (data: {
    nombre: string;
    email: string;
    roles: string[];
    proyectosAsignados: string[];
  }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesión no válida");

      const rolPrincipal = data.roles[0] ?? "usuario";
      const rolesExtras = data.roles.filter(r => r !== rolPrincipal);

      const endpoint = usuarioEditar
  ? `${SUPABASE_FUNCTIONS_URL}/update-user`
  : `${SUPABASE_FUNCTIONS_URL}/create-user`;


      const payload = {
        userId: usuarioEditar?.id ?? null,
        nombre: data.nombre,
        email: data.email,
        password: usuarioEditar ? undefined : "Temporal123!",
        rolPrincipal,
        rolesExtras,
        proyectosAsignados: [...new Set(data.proyectosAsignados)], // seguridad extra
      };
      console.log("ENDPOINT EDGE:", endpoint);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err;
      }

      setModalOpen(false);
      setUsuarioEditar(null);
      await cargarUsuarios();

    } catch (err) {
      console.error("Error guardando usuario:", err);
      alert("No se pudo guardar el usuario");
    }
  };

  const eliminarUsuario = async () => {
  if (!usuarioEditar) return;

  const ok = confirm(
    `¿Eliminar definitivamente al usuario ${usuarioEditar.email}?`
  );
  if (!ok) return;

  try {
    const { data: { session } } = await supabase.auth.getSession();

    const res = await fetch("${SUPABASE_FUNCTIONS_URL}/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        userId: usuarioEditar.id,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw err;
    }

    setUsuarios(prev =>
      prev.filter(u => u.id !== usuarioEditar.id)
    );

    setModalOpen(false);
    setUsuarioEditar(null);

  } catch (err) {
    console.error("Error eliminando usuario:", err);
    alert("No se pudo eliminar el usuario");
  }
};


  // ----------------------------------------------------------
  // FILTROS
  // ----------------------------------------------------------
  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = busqueda.trim().toLowerCase();

    const coincideTexto =
      (u.nombre ?? "").toLowerCase().includes(texto) ||
      (u.email ?? "").toLowerCase().includes(texto);

    const coincideRol =
      filtroRol === "" || u.roles.includes(filtroRol);

    const coincideProyecto =
      filtroProyecto === "" ||
      u.proyectos?.some((p: any) => p.id === filtroProyecto);

    const coincideTipoProyecto =
      filtroTipoProyecto === "" ||
      u.proyectos?.some((p: any) => p.tipo === filtroTipoProyecto);

    return coincideTexto && coincideRol && coincideProyecto && coincideTipoProyecto;
  });

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  useEffect(() => {
    (async () => {
      await cargarRoles();
      await cargarProyectos();
    })();
  }, []);

  useEffect(() => {
    if (proyectos.length > 0) {
      cargarUsuarios();
    }
  }, [proyectos]);

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------
  return (
    <div className="w-full p-5">
      <button
        onClick={() => {
          setUsuarioEditar(null);
          setModalOpen(true);
        }}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white"
      >
        + Crear usuario
      </button>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {usuariosFiltrados.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onEdit={() => {
                setUsuarioEditar(u);
                setModalOpen(true);
              }}
              filtroTipoProyecto={filtroTipoProyecto}
            />
          ))}
        </div>
      )}

      <ModalUsuario
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={usuarioEditar}
        rolesDisponibles={rolesDisponibles}
        proyectos={proyectos}
        onSave={guardarUsuario}
        onDelete={eliminarUsuario}
      />
    </div>
  );
}
