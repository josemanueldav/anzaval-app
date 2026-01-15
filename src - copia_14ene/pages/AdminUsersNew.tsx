import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import UserCard from "@/components/admin/UserCard";
import ModalUsuario from "@/components/admin/ModalUsuario";

export default function AdminUsersNew() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<any | null>(null);

  const [rolesDisponibles, setRolesDisponibles] = useState<string[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);

  // filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroProyecto, setFiltroProyecto] = useState("");
  const [filtroTipoProyecto, setFiltroTipoProyecto] = useState("");


  // ----------------------------------------------------------
  // CARGAR ROLES DISPONIBLES
  // ----------------------------------------------------------
  const cargarRoles = async () => {
    const { data, error } = await supabase.from("roles").select("nombre");
    if (!error && data) {
      setRolesDisponibles(data.map((r) => r.nombre));
    }
  };

  // ----------------------------------------------------------
  // CARGAR PROYECTOS (clientes)
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
  // CARGAR USUARIOS
  // ----------------------------------------------------------
  const cargarUsuarios = async () => {
    try {
      // Usuarios principales (demo)
      const { data: usuariosBase } = await supabase
        .from("usuarios_demo")
        .select("*");

      if (!usuariosBase) {
        setUsuarios([]);
        setLoading(false);
        return;
      }

      // Roles y proyectos DEMO
      let rolesAsignados: any[] = [];

      const { data: rolesData, error: rolesError } = await supabase
        .from("usuarios_proyectos")
        .select("email, rol, cliente_id, activo");

      if (rolesError) {
        console.warn("⚠️ Error cargando usuarios_proyectos:", rolesError);
      } else {
        rolesAsignados = rolesData ?? [];
      }

      // Componer usuario final
      const resultado = usuariosBase.map((u: any) => {
        const extras = rolesAsignados.filter(
          (r: any) => r.email === u.email && !r.cliente_id
        );

        const proyectosUser =
          rolesAsignados
            ?.filter((r: any) => r.email === u.email && r.cliente_id)
            ?.map((r: any) => r.cliente_id) ?? [];

        const proyectosIds =
        rolesAsignados
        ?.filter((r: any) => r.email === u.email && r.cliente_id)
        ?.map((r: any) => r.cliente_id) ?? [];
     
const proyectosConNombre = proyectosIds.map((pId: string) => {
        const px = proyectos.find((p) => p.id === pId);
       return px
    ? { id: pId, nombre: px.nombre, tipo: px.tipo ?? "activo" }
    : { id: pId, nombre: pId, tipo: "otro" };
        });
        return {
          id: u.id,
          nombre: u.nombre,
          email: u.email,
          rol: u.rol, // rol principal
          roles: [u.rol, ...extras.map((r: any) => r.rol)],
          proyectos: proyectosConNombre,
          totalProyectos: proyectosUser.length,
        };
      });

      console.log("USUARIOS PARA FILTRO:", resultado);

      setUsuarios(resultado);
    } catch (err) {
      console.error("Error general cargando usuarios:", err);
    }

    setLoading(false);
  };

  // ----------------------------------------------------------
  // GUARDAR USUARIO (crear o editar)
  // ----------------------------------------------------------
  const guardarUsuario = async (data: {
  nombre: string;
  email: string;
  roles: string[];
  proyectosAsignados: string[];
}) => {
  const { nombre, email, roles, proyectosAsignados } = data;

  try {
    const rolPrincipal = roles[0] ?? "usuario";
    let usuarioId = usuarioEditar?.id;

    // -----------------------------------
    // 1) Crear o actualizar usuario base
    // -----------------------------------
    if (usuarioEditar) {
      await supabase
        .from("usuarios_demo")
        .update({ nombre, email, rol: rolPrincipal })
        .eq("id", usuarioEditar.id);
    } else {
      const { data: nuevo, error } = await supabase
        .from("usuarios_demo")
        .insert({ nombre, email, rol: rolPrincipal })
        .select("id")
        .single();

      if (error || !nuevo) throw error;
      usuarioId = nuevo.id;
    }

    if (!usuarioId) throw new Error("No se pudo determinar usuario_id");

    // -----------------------------------
    // 2) Desactivar TODAS las asignaciones
    // -----------------------------------
    await supabase
      .from("usuarios_proyectos")
      .update({ activo: false })
      .eq("usuario_id", usuarioId);

    // -----------------------------------
    // 3) Roles adicionales
    // -----------------------------------
    const rolesExtras = roles
      .filter((r) => r !== rolPrincipal)
      .map((rol) => ({
        usuario_id: usuarioId,
        rol,
        cliente_id: null,
        activo: true,
      }));

    // -----------------------------------
    // 4) Proyectos
    // -----------------------------------
    const proyectosData = proyectosAsignados.map((clienteId) => ({
      usuario_id: usuarioId,
      rol: rolPrincipal,
      cliente_id: clienteId,
      activo: true,
    }));

    const rows = [...rolesExtras, ...proyectosData];

    if (rows.length > 0) {
      const { error } = await supabase
        .from("usuarios_proyectos")
        .upsert(rows, {
      onConflict: "usuario_id,cliente_id",
    });


      if (error) throw error;
    }

   const usuarioActualizado = {
  ...usuarioEditar,
  nombre,
  email,
  rol: rolPrincipal,
  roles,
  proyectos: proyectosAsignados.map((id) => {
    const p = proyectos.find((x) => x.id === id);
    return p
      ? { id, nombre: p.nombre, tipo: p.tipo ?? "activo" }
      : { id, nombre: id, tipo: "otro" };
  }),
  totalProyectos: proyectosAsignados.length,
};

// 1️⃣ Actualizar lista local (optimista)
setUsuarios((prev) =>
  prev.map((u) => (u.id === usuarioActualizado.id ? usuarioActualizado : u))
);

// 2️⃣ Actualizar usuario del modal
setUsuarioEditar(usuarioActualizado);

// 3️⃣ Cerrar modal (o no, ver opción abajo)
setModalOpen(false);

// 4️⃣ Sync final (opcional pero recomendable)
cargarUsuarios();

    

  } catch (err) {
    console.error("Error guardando usuario:", err);
    alert("No se pudo guardar el usuario.");
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
  // INICIALIZACIÓN
  // ----------------------------------------------------------
  useEffect(() => {
  const inicializar = async () => {
    await cargarRoles();
    await cargarProyectos(); // solo carga roles y proyectos
  };

  inicializar();
}, []);

useEffect(() => {
  if (!proyectos || proyectos.length === 0) return;

  // cuando ya hay proyectos cargados, ahora sí cargamos usuarios
  cargarUsuarios();
}, [proyectos]);


  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------
  return (
    <div
  className="
    w-full 
    min-h-[260px]
    bg-gray-600/60 dark:bg-gray-600
    border border-gray-600/40 
    rounded-2xl 
    p-5 
    shadow-sm 
    hover:shadow-md 
    transition-all 
    duration-200 
    flex 
    flex-col
    justify-between
  "
>

{/* ENCABEZADO */}
<div className="mb-8">
  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
    <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-lg shadow">
      🧑‍💼
    </span>
    Administración de Usuarios
  </h1>

  <p className="text-gray-200 mt-1 ml-11">
    Gestiona usuarios, roles y asignaciones de proyectos.
  </p>
</div>

{/* LEYENDA DE TIPOS DE PROYECTO (CLICKABLE) */}
<div className="flex flex-wrap items-center gap-3 text-sm mb-2 select-none">
  {[
  { tipo: "activo",   color: "bg-green-400 dark:bg-emerald-600", label: "Activo" },
  { tipo: "revision", color: "bg-yellow-400 dark:bg-yellow-600", label: "Revisión" },
  { tipo: "terminado",color: "bg-blue-400 dark:bg-blue-700", label: "Terminado" },
  { tipo: "otro",     color: "bg-gray-400 dark:bg-slate-500", label: "Otros" },
]
.map((item) => {
    const activo = filtroTipoProyecto === item.tipo;

    return (
      <button
        key={item.tipo}
        type="button"
        onClick={() =>
          setFiltroTipoProyecto(activo ? "" : item.tipo)
        }
        className={`
          flex items-center gap-1 px-2 py-1 rounded-full border
          cursor-pointer transition-colors
          ${
            activo
              ? "bg-gray-200 dark:bg-slate-700 border-gray-400 dark:border-slate-500"
              : "bg-transparent border-transparent"
          }
        `}
      >
        <span className={`w-3 h-3 rounded-full ${item.color}`} />
        <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
      </button>
    );
  })}
</div>


      {/* FILTROS */}
      <div
  className="
    bg-gray-800/50 backdrop-blur border border-gray-700/50 
    rounded-xl p-5 shadow-md mb-8
  "
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* BUSCAR */}
           <div className="flex flex-col gap-1">
            <label className="text-gray-300 font-medium text-sm">Buscar</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value.toLowerCase())}
              placeholder="Nombre o email..."
              className="w-full rounded-lg bg-gray-900/40 px-3 py-2 
                   border border-gray-700 placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* ROL */}
           <div className="flex flex-col gap-1">
            <label className="text-gray-300 font-medium text-sm">Rol</label>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="w-full rounded-lg bg-gray-900/40 px-3 py-2 
                   border border-gray-700 text-gray-200 
                   focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Todos</option>
              {rolesDisponibles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

            {/* Filtro por proyecto */}
    <div className="flex flex-col gap-1">
      <label className="text-gray-300 font-medium text-sm">Proyecto</label>
      <select
        value={filtroProyecto}
        onChange={(e) => setFiltroProyecto(e.target.value)}
        className="w-full rounded-lg bg-gray-900/40 px-3 py-2 
                   border border-gray-700 text-gray-200 
                   focus:ring-2 focus:ring-blue-600"
      >
        <option value="">Todos</option>
        {proyectos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>
    </div>

        </div>
      </div>

      {/* BOTÓN CREAR */}
      <button
        onClick={() => {
          setUsuarioEditar(null);
          setModalOpen(true);
        }}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        + Crear usuario
      </button>

      {/* LISTA DE USUARIOS */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Cargando usuarios...</p>
      ) : usuariosFiltrados.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Sin resultados.</p>
      ) : (
<div
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2"
>          {usuariosFiltrados.map((u) => (
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

      {/* MODAL */}
      <ModalUsuario
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={usuarioEditar}
        rolesDisponibles={rolesDisponibles}
        proyectos={proyectos}
        onSave={guardarUsuario}
      />
    </div>
  );
}
