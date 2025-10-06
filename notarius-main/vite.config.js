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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router-vendor';
            }
            if (id.includes('react-i18next') || id.includes('i18next')) {
              return 'i18n-vendor';
            }
            if (id.includes('framer-motion') || id.includes('swiper')) {
              return 'ui-vendor';
            }
          }

          // Page chunks - используем правильные пути
          if (id.includes('/src/pages/')) {
            if (
              id.includes('MainPage') ||
              id.includes('AboutPage') ||
              id.includes('ServicesPage')
            ) {
              return 'pages-main';
            }
            if (
              id.includes('NotaryTranslatePage') ||
              id.includes('MilitaryPage') ||
              id.includes('OtherServicesPage')
            ) {
              return 'pages-services';
            }
            // Second level pages
            if (id.includes('/secondLevel/')) {
              return 'pages-second-level';
            }
          }

          // Component chunks
          if (id.includes('/src/components/')) {
            if (
              id.includes('Header') ||
              id.includes('Footer') ||
              id.includes('ScrollToTop')
            ) {
              return 'components-common';
            }
            if (
              id.includes('Form') ||
              id.includes('ReviewForm') ||
              id.includes('ModalWindows')
            ) {
              return 'components-forms';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
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
    ],
  },
});