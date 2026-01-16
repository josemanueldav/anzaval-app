import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
//import { AuthProvider } from "./context/AuthContext";
import "./styles/base.css";      // 👈 agrega esta línea
import "./styles/swiper-fix.css"; // 👈 mantiene el fix del Swiper
import "swiper/swiper.css";
import { registerSW } from 'virtual:pwa-register';
import { ClienteProvider } from "@/context/ClienteContext";

registerSW({ immediate: true });


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   
      <ClienteProvider>
      <App />
      </ClienteProvider>
    
  </React.StrictMode>,

  
)


