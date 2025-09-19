import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(fileURLToPath(new URL('./src', import.meta.url))),
      "@components": path.resolve(fileURLToPath(new URL('./src/components', import.meta.url))),
      "@media": path.resolve(fileURLToPath(new URL('./src/assets/media', import.meta.url))),
      "@hooks": path.resolve(fileURLToPath(new URL('./src/hooks', import.meta.url))),
      "@pages": path.resolve(fileURLToPath(new URL('./src/pages', import.meta.url))),
      "@pagesSecondLevel": path.resolve(fileURLToPath(new URL('./src/pages/secondLevel', import.meta.url))),
      "@utils": path.resolve(fileURLToPath(new URL('./src/utils', import.meta.url))),
      "@nav": path.resolve(fileURLToPath(new URL('./src/nav', import.meta.url))),
    },
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    strictPort: true,
    allowedHosts: 'all'
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
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'i18n-vendor': ['react-i18next', 'i18next'],
          'ui-vendor': ['framer-motion', 'swiper'],
          // Page chunks
          'pages-main': [
            './src/pages/MainPage/MainPage.jsx',
            './src/pages/AboutPage/AboutPage.jsx',
            './src/pages/ServicesPage/ServicesPage.jsx'
          ],
          'pages-services': [
            './src/pages/NotaryTranslatePage/NotaryTranslatePage.jsx',
            './src/pages/MilitaryPage/MilitaryPage.jsx',
            './src/pages/OtherServicesPage/OtherServicesPage.jsx'
          ],
          // Component chunks
          'components-common': [
            './src/components/Header/Header.jsx',
            './src/components/Footer/Footer.jsx',
            './src/components/ScrollToTop/ScrollToTop.jsx'
          ],
          'components-forms': [
            './src/components/Form/Form.jsx',
            './src/components/ReviewForm/ReviewForm.jsx',
            './src/components/ModalWindows/FreeConsult.jsx',
            './src/components/ModalWindows/OrderConsult.jsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'i18next',
      'framer-motion',
      'swiper'
    ]
  }
});
