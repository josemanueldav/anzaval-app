import { Outlet } from "react-router-dom";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import MenuSidebar from "@/components/MenuSidebar";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="
        h-screen w-screen
        flex bg-gray-100 text-gray-900
        dark:bg-slate-900 dark:text-gray-100
        overflow-hidden
      "
    >
      {/* SIDEBAR */}
      <MenuSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* TOPBAR */}
        <Topbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onToggleMobileMenu={() => setMobileOpen(true)}
        />

        {/* CONTENIDO SCROLLABLE */}
        <main
          className="
            flex-1 overflow-y-auto
            p-4 sm:p-6 lg:p-8
          "
        >
          {/* WRAPPER CENTRAL (limita ancho) */}
          <div className="max-w-7xl mx-auto w-full">

            {children ?? <Outlet />}

          </div>
        </main>
      </div>
    </div>
  );
}
