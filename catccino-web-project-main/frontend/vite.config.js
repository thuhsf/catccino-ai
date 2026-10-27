import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// A porta 3000 é usada de propósito: é a única origem liberada no CORS
// dos serviços de backend (services/*/config.json -> cors.origin).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3000,
    hmr : {
      clientPort: 80
    }
  },
});
