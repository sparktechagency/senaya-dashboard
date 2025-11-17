// import { defineConfig } from "vite";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [tailwindcss()],
//   server: {
//     host: "0.0.0.0", // Listen on all interfaces
//     port: 5173,
//   },
// });

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: "0.0.0.0", // Ensures it listens on all interfaces
    port: 5173,
  },
  preview: {
    host: "0.0.0.0", // Ensures preview listens on all interfaces
    port: 5173, // Same port as dev, or change if needed
  },
});
