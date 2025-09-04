import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@media": path.resolve(__dirname, "src/assets/media"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
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
});
