import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  

  useEffect(() => {
    // Verificar que existe sesión válida (link correcto)
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError("El enlace no es válido o ha expirado.");
      }
      setLoading(false);
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
     setLoading(true);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const { data, error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError || !data.user) {
      setError("No se pudo actualizar la contraseña.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    setError("Sesión inválida");
    setLoading(false);
    return;
  }

  const userId = data.user.id;

   // 2️⃣ Marcar passwordTemporal = false
    const { data: updated, error: perfilError } = await supabase
      .from("usuarios")
      .update({ password_temporal: false })
      .eq("id", userId)
      .select();

      console.log("UPDATED:", updated, perfilError);

    if (perfilError) {
      setError("Contraseña cambiada, pero no se pudo actualizar el perfil");
      setLoading(false);
      return;
    }


    setSuccess("Contraseña actualizada correctamente.");
    setTimeout(() => {
      supabase.auth.signOut();
      navigate("/login");
    }, 2000);
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <form
        onSubmit={handleUpdatePassword}
        className="w-full max-w-sm bg-white/10 p-6 rounded-xl"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Restablecer contraseña
        </h2>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-900/40 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-green-400 text-sm bg-green-900/40 p-2 rounded">
            {success}
          </div>
        )}

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-white/20"
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-white/20"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
        >
          Guardar contraseña
        </button>
      </form>
    </div>
  );
}
