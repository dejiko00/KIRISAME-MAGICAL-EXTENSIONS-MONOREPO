import { globSync } from "node:fs";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { copyFilesPlugin } from "../../.rollup/rollup-plugin-copy.mjs";

export default defineConfig({
  input: [...globSync("src/**/*.ts")],
  output: {
    dir: "dist",
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true,
  },
  watch: {},
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
    copyFilesPlugin({
      input: ["src/manifest.json", "src/index.html"],
      output: {
        relative: "src",
      },
    }),
  ],
});
