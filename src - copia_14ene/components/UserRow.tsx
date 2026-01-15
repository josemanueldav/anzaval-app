import { useState } from "react";
import UserRoleSelect from "./UserRoleSelect";

interface Cliente {
  id: string;
  nombre: string;
}

/*interface UserRowProps {
  user: any;
  clientes: Cliente[];
  onSave: (userId: string, role: string, cliente_id: string | null) => void;
}*/

export default function UserRow({ user, clientes, onSave }: any) {
  clientes.find((c: Cliente) => c.id === clienteId)?.nombre || "—"
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState(user.user_metadata?.role || "capturista");
  const [clienteId, setClienteId] = useState(user.user_metadata?.cliente_id || "");

  const handleSave = () => {
    onSave(user.id, role, clienteId || null);
    setEditing(false);
  };

  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      <td className="p-3">{user.email}</td>
      <td className="p-3">
        {editing ? (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white focus:outline-none"
          >
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="capturista">Capturista</option>
          </select>
        ) : (
          <span className="capitalize">{role || "capturista"}</span>
        )}
      </td>
      <td className="p-3">
        {editing ? (
          <UserRoleSelect
            clientes={clientes}
            clienteId={clienteId}
            setClienteId={setClienteId}
          />
        ) : (
          clientes.find((c: Cliente) => c.id === clienteId)?.nombre || "—"
        )}
      </td>
      <td className="p-3 text-right">
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-white text-sm"
          >
            Guardar
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-white/10 hover:bg-white/20 px-4 py-1 rounded-lg text-gray-300 text-sm"
          >
            Editar
          </button>
        )}
      </td>
    </tr>
  );
}
