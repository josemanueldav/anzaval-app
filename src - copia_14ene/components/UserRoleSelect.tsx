export default function UserRoleSelect({ clientes, clienteId, setClienteId }: any) {
  return (
    <select
      value={clienteId}
      onChange={(e) => setClienteId(e.target.value)}
      className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white focus:outline-none w-full"
    >
      <option value="">Sin asignar</option>
      {clientes.map((c: any) => (
        <option key={c.id} value={c.id}>
          {c.nombre}
        </option>
      ))}
    </select>
  );
}
