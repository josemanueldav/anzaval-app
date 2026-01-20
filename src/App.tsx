import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

import Layout from "@/layouts/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
//import HomeRedirect from "@/components/HomeRedirect";
import PostLoginRedirect from "@/routes/PostLoginRedirect";
// Páginas
import Login from "./login/Login";
import Dashboard from "@/pages/AdminDashboard";
import Productos from "./pages/Productos";
import ProductDetail from "./pages/ProductDetail";
import Clientes from "./pages/ClienteList";
import AdminUsersNew from "@/pages/AdminUsersNew";
import RolesAdmin from "@/pages/RolesAdmin";
import AdminAsignaciones from "@/pages/AdminAsignaciones";
import AdminPanel from "@/pages/AdminPanel";
import UiGuide from "@/pages/UiGuide";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/authStore";
import PWAModal from "@/components/PWAModal";
import ResetPassword from "@/pages/ResetPassword";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const initAuthListener = useAuthStore((s) => s.initAuthListener);
  const loadUserFromSession = useAuthStore((s) => s.loadUserFromSession);


  useEffect(() => {
  useAuthStore.getState().loadUserFromSession();
}, []);

 useEffect(() => {
    initAuthListener();
    loadUserFromSession();
  }, []);


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
     <TooltipProvider>
    <Router>
      {!session ? (
        <Routes>
          {/* LOGIN SIN LAYOUT */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          {/* TODAS LAS RUTAS CON LAYOUT */}
          <Route element={<Layout />}>

             {/* Ruta raíz */}
            <Route
  path="/"
  element={
    <ProtectedRoute>
      <PostLoginRedirect />
    </ProtectedRoute>
  }
/>
          
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredPermission="ver_dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin panel principal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredPermission="gestionar_usuarios">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Usuarios */}
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute requiredPermission="gestionar_usuarios">
                  <AdminUsersNew />
                </ProtectedRoute>
              }
            />

            {/* Roles */}
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute requiredPermission="gestionar_usuarios">
                  <RolesAdmin />
                </ProtectedRoute>
              }
            />

            {/* Asignaciones */}
            <Route
              path="/admin/asignaciones"
              element={
                <ProtectedRoute requiredPermission="gestionar_usuarios">
                  <AdminAsignaciones />
                </ProtectedRoute>
              }
            />

            {/* Clientes */}
            <Route
              path="/clientes"
              element={
                <ProtectedRoute requiredPermission="gestionar_clientes">
                  <Clientes />
                </ProtectedRoute>
              }
            />

            {/* Productos */}
            {/* Ruta de productos: accesible a cualquier usuario logueado */}
        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <Productos  />
            </ProtectedRoute>
          }
        />

            {/* Detalle de producto */}
            <Route
              path="/productos/:id"
              element={
                <ProtectedRoute requiredPermission="capturar_activos">
                  <ProductDetail />
                </ProtectedRoute>
              }
            />

         
            {/* Fallback dentro del layout */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
          <Route path="/ui-guide" element={<UiGuide />} />

          <Route path="/reset-password" element={<ResetPassword />} />


        </Routes>
      )}
    </Router>
    </TooltipProvider>
    
  );
  <PWAModal />
}

export default App;
