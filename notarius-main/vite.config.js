import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(fileURLToPath(new URL("./src", import.meta.url))),
      src: path.resolve(fileURLToPath(new URL("./src", import.meta.url))),
      "@components": path.resolve(
        fileURLToPath(new URL("./src/components", import.meta.url))
      ),
      "@media": path.resolve(
        fileURLToPath(new URL("./src/assets/media", import.meta.url))
      ),
      "@config": path.resolve(
        fileURLToPath(new URL("./src/config", import.meta.url))
      ),
      "@hooks": path.resolve(
        fileURLToPath(new URL("./src/hooks", import.meta.url))
      ),
      "@pages": path.resolve(
        fileURLToPath(new URL("./src/pages", import.meta.url))
      ),
      "@pagesSecondLevel": path.resolve(
        fileURLToPath(new URL("./src/pages/secondLevel", import.meta.url))
      ),
      "@utils": path.resolve(
        fileURLToPath(new URL("./src/utils", import.meta.url))
      ),
      "@nav": path.resolve(
        fileURLToPath(new URL("./src/nav", import.meta.url))
      ),
      "@contexts": path.resolve(
        fileURLToPath(new URL("./src/contexts", import.meta.url))
      ),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "src/styles/vars" as *;
          @use "src/styles/func" as *;
          @use "src/styles/mixins" as *;
          @use "src/styles/fonts" as *;
          `, // (если хочешь глобально)
        // @use "src/styles/reset" as *;
      },
    },
  },
  build: {
    // Убираем ручное разбиение чанков, чтобы избежать неправильного порядка загрузки vendor-бандлов
    rollupOptions: {},
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-i18next",
      "i18next",
      "framer-motion",
      "swiper",
      "react-pdf",
      "pdfjs-dist",
    ],
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
