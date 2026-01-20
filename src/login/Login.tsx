import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import logo from "../logo.png";

const Login: React.FC = () => {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [message, setMessage] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
      return;
    }

    // ⛔ NO redirigir aquí
    // ⛔ NO getUser aquí
    // ⛔ NO window.location.href

    // El authStore + ProtectedRoute + PostLoginRedirect
    // se encargarán del resto
  };

  const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setMessage(null);
  setLoading(true);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    setError("No se pudo enviar el correo de recuperación");
    setLoading(false);
    return;
  }

  setMessage(
    "Te enviamos un correo con instrucciones para restablecer tu contraseña."
  );
  setLoading(false);
};


  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      <div className="flex flex-1 items-center justify-center px-6 py-8 sm:py-0">
        <form
  onSubmit={mode === "login" ? handleLogin : handleResetPassword}
  className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 sm:p-8 text-white"
>

          <h2 className="text-2xl font-semibold text-center mb-6">
  {mode === "login" ? "Iniciar Sesión" : "Recuperar contraseña"}
</h2>


          {error && (
  <div className="mb-4 text-red-400 text-sm bg-red-900/40 p-2 rounded-lg text-center">
    {error}
  </div>
)}

{message && (
  <div className="mb-4 text-green-400 text-sm bg-green-900/40 p-2 rounded-lg text-center">
    {message}
  </div>
)}

          {error && (
            <div className="mb-4 text-red-400 text-sm bg-red-900/40 p-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        {mode === "login" && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg shadow font-semibold transition-colors duration-200 ${
              loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
          ? "Procesando..."
          : mode === "login"
          ? "Entrar"
          : "Enviar correo"}
          </button>

          <button
  type="button"
  onClick={() =>
    setMode(mode === "login" ? "reset" : "login")
  }
  className="mt-4 text-sm text-blue-300 hover:underline w-full text-center"
>
  {mode === "login"
    ? "¿Olvidaste tu contraseña?"
    : "Volver al inicio de sesión"}
</button>

          <p className="text-gray-400 text-xs text-center mt-6 opacity-70 select-none">
            © {new Date().getFullYear()} Anzaval · Acceso Seguro
          </p>
        </form>
      </div>

      <div
        className="hidden sm:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/login-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative z-10 text-center px-6">
          <img
            src={logo}
            alt="Anzaval Logo"
            className="mx-auto mb-4 w-24 h-24 object-contain"
          />
          <h1 className="text-3xl font-bold tracking-wide">
            Anzaval Consulting
          </h1>
          <p className="text-blue-300 mt-2 text-sm uppercase tracking-wider">
            Sistema de Inventarios
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
