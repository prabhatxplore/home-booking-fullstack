import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

console.log("This is my env", process.env.VITE_LOCAL)
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      watch: {
        usePolling: true,      // ← add this
        interval: 1000         // ← add this
      },
      proxy: {
        "/api": {
          target: env.VITE_LOCAL,
          changeOrigin: true,
        },
        "/uploads": {
          target: env.VITE_LOCAL,
          changeOrigin: true,
        }
      },
      allowedHosts: ["votable-kaylee-exocentric.ngrok-free.dev"]
    },
  });
}