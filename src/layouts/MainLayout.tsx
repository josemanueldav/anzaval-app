// src/layouts/MainLayout.tsx
import React from "react";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
