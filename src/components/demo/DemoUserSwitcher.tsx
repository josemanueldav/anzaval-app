// src/components/demo/DemoUserSwitcher.tsx

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ajusta si tu ruta es distinta
import { DEMO_USERS } from "@/components/demo/demoUsers";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function DemoUserSwitcher() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSwitch = async (id: string) => {
    const user = DEMO_USERS.find((u) => u.id === id);
    if (!user) return;

    try {
      setLoadingId(id);

      // Cerrar sesión actual
      await supabase.auth.signOut();

      // Iniciar sesión con el usuario demo
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (error) {
        console.error("Error al cambiar de usuario demo:", error);
        alert("No se pudo iniciar sesión con este usuario demo.");
        return;
      }

      // Recargar vista / ir al dashboard
      window.location.href = "/"; // o la ruta principal del dashboard
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-xs md:text-sm"
        >
          <Users className="w-4 h-4" />
          <span>Usuarios <br />Demo</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
  align="end"
  className="
    w-80 
    bg-gray-900/95 
    backdrop-blur 
    border 
    border-gray-700 
    shadow-xl 
    rounded-xl 
    text-sm
  "
>

        <DropdownMenuLabel className="text-sm text-gray-200">
          Cambiar usuario demo
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {DEMO_USERS.map((u) => (
          <DropdownMenuItem
            key={u.id}
            onClick={() => handleSwitch(u.id)}
            disabled={loadingId === u.id}
            className="flex flex-col items-start gap-0.5 py-2 cursor-pointer"
          >
            <span className="text-xs  text-gray-200 font-medium">
              {u.label} <span className="text-sm text-gray-400">({u.role})</span>
            </span>
            {u.description && (
              <span className="text-xs text-gray-400">
                {u.description}
              </span>
            )}
            {loadingId === u.id && (
              <span className="text-xs text-gray-400">
                Cambiando a este usuario…
              </span>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <div className="px-2 pb-1">
          <p className="text-xs text-gray-400">
            Los usuarios demo están preconfigurados en el entorno de prueba.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
