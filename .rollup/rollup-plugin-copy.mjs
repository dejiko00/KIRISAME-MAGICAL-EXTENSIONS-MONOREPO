import { readFileSync } from "node:fs";
import { normalize, relative } from "node:path";

/**
 * @param {{ input: string[], output: { relative: string } }}
 * @returns {Set<string>}
 */
export function genWatchedFiles({ input }) {
  return new Set(input.map((path) => normalize(path)));
}

/**
 * @param {{ input: Set<string>, output: { relative: string } }}
 * @returns {Map<string, string>}
 */
export function genRelativeFileMap({ input, output }) {
  return new Map(
    Array.from(input).map((path) => [path, relative(output.relative, path)])
  );
}

/**
 * @typedef {import('rollup').Plugin} Plugin
 * @param {{ input: string[], output: { relative: string } }}
 * @returns {Plugin}
 */
export function copyFilesPlugin({ input, output }) {
  const watchedFiles = genWatchedFiles({ input });
  const mapRelativeFiles = genRelativeFileMap({ input: watchedFiles, output });
  const changes = [];
  let init = false;

  return {
    name: "rollup-plugin-copy",
    async buildStart() {
      watchedFiles.forEach((file) => {
        this.addWatchFile(file);
      });

      if (!init) {
        init = true;
        changes.push(...watchedFiles);
      }
    },
    async watchChange(id) {
      if (watchedFiles.has(id)) {
        changes.push(id);
      }
    },
    async generateBundle() {
      while (changes.length > 0) {
        const file = changes.pop();
        this.emitFile({
          type: "asset",
          fileName: mapRelativeFiles.get(file),
          source: readFileSync(file),
        });
      }
    },
  };
}
