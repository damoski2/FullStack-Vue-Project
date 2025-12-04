import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [vue()];

  // Vue DevTools plugin removed from production builds
  // It causes localStorage errors during build on Render
  // To enable in development, uncomment the following:
  // if (mode === "development") {
  //   const vueDevTools = (await import("vite-plugin-vue-devtools")).default;
  //   plugins.push(vueDevTools());
  // }

  return {
    plugins,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
