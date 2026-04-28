import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 550,
    rolldownOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/three")) {
            return "three-vendor";
          }
        }
      }
    }
  },
  server: {
    host: "127.0.0.1",
    port: 5173
  }
});
