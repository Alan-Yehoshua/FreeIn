import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://backendchat-hi9n.onrender.com', // Reemplaza con tu URL de backend en Render
        changeOrigin: true,
        secure: true,
      },
      '/get_messages': {
        target: 'https://backendchat-hi9n.onrender.com', // Asegúrate de que todas las rutas que usas apunten al backend en Render
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
