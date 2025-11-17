import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: true, // <-- allows access from your AWS IP
    port: 5173, // optional, default is 5173
  },
});
