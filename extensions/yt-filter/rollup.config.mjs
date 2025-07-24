import { relative } from "node:path";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { copyFilesPlugin } from "../../.rollup/rollup-plugin-copy.mjs";

const sourceFolder = "src";

const inputFiles = {
  contentScripts: `${sourceFolder}/content-scripts/index.ts`,
  background: `${sourceFolder}/background/index.ts`,
};

const outputFilenames = Object.entries(inputFiles).reduce((acc, [key, val]) => {
  acc[key] = relative(sourceFolder, val).replace(".ts", ".js");
  return acc;
}, {});

export default defineConfig({
  input: {
    contentScripts: `${sourceFolder}/content-scripts/index.ts`,
    background: `${sourceFolder}/background/index.ts`,
  },
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: (chunk) => {
      return outputFilenames[chunk.name] || "[name].js";
    },
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
