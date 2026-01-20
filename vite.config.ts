// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: '/',  // 👈 importante
    plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024 // 10 MB
      },
      devOptions: {
        enabled: false, // permite probar PWA en modo dev
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg"
      ],
      manifest: {
        name: "Anzaval Consulting",
        short_name: "Anzaval",
        description: "Sistema de inventario para Anzaval Consulting",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        start_url: "/",
        display: "standalone",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/icon-192x192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "/icon-512x512.png",
            type: "image/png",
            sizes: "512x512"
          },
          {
            src: "/icon-512x512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      // base
      "swiper/css": path.resolve(__dirname, "node_modules/swiper/swiper.css"),
      // módulos
      "swiper/css/navigation": path.resolve(__dirname, "node_modules/swiper/modules/navigation.css"),
      "swiper/css/pagination": path.resolve(__dirname, "node_modules/swiper/modules/pagination.css"),
      "swiper/css/zoom": path.resolve(__dirname, "node_modules/swiper/modules/zoom.css"),
      "swiper/css/thumbs": path.resolve(__dirname, "node_modules/swiper/modules/thumbs.css"),

      // (opcional) si estás importando con “modules/…” en algún archivo:
      "swiper/modules/navigation.css": path.resolve(__dirname, "node_modules/swiper/modules/navigation.css"),
      "swiper/modules/pagination.css": path.resolve(__dirname, "node_modules/swiper/modules/pagination.css"),
      "swiper/modules/zoom.css": path.resolve(__dirname, "node_modules/swiper/modules/zoom.css"),
      "swiper/modules/thumbs.css": path.resolve(__dirname, "node_modules/swiper/modules/thumbs.css"),
      "swiper/swiper.css": path.resolve(__dirname, "node_modules/swiper/swiper.css"),

       "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@layouts": path.resolve(__dirname, "src/layouts")
    },
  },
 
});







