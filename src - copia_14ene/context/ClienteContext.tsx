import { createContext, useContext, useState } from "react";

type ClienteContextType = {
  clienteId: string | null;
  setClienteId: (id: string | null) => void;
};

const ClienteContext = createContext<ClienteContextType | null>(null);

export function ClienteProvider({ children }: { children: React.ReactNode }) {
  const [clienteId, setClienteId] = useState<string | null>(
    localStorage.getItem("cliente_id")
  );

  const updateCliente = (id: string | null) => {
    setClienteId(id);
    if (id) localStorage.setItem("cliente_id", id);
    else localStorage.removeItem("cliente_id");
  };

  return (
    <ClienteContext.Provider
      value={{ clienteId, setClienteId: updateCliente }}
    >
      {children}
    </ClienteContext.Provider>
  );
}

export function useCliente() {
  const ctx = useContext(ClienteContext);
  if (!ctx) throw new Error("useCliente debe usarse dentro de ClienteProvider");
  return ctx;
}
