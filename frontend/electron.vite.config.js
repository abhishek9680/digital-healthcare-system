import { defineConfig } from "electron-vite";
export default defineConfig({
  main: {
    entry: "src/electron/main.js",
  },
  preload: {
    entry: "src/electron/preload.js",
  },
  renderer: {},
});