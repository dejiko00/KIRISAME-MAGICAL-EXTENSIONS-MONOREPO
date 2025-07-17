import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { genOutputFiles, genWatchedFiles } from "./rollup-plugin-copy.mjs";

describe("rollup-plugin-copy", () => {
  const inputRaw = ["src/manifest.json", "src/index.html"];
  const inputNormalized = inputRaw.map((p) => path.normalize(p));
  const relativeBase = "src";

  let watchedFiles;

  it("normalizes input paths into a Set", () => {
    watchedFiles = genWatchedFiles({ input: inputRaw });
    assert.deepEqual([...watchedFiles], inputNormalized);
  });

  it("contains normalized paths in the Set", () => {
    const firstFile = inputNormalized[0];
    assert.ok(watchedFiles.has(firstFile), `${firstFile} should be in the Set`);
  });

  it("maps normalized input paths to relative output paths", () => {
    const output = genOutputFiles({
      input: watchedFiles,
      output: { relative: relativeBase },
    });

    assert.strictEqual(
      output.get(path.normalize("src/manifest.json")),
      "manifest.json"
    );

    assert.strictEqual(
      output.get(path.normalize("src/index.html")),
      "index.html"
    );
  });

  it("normalizes paths across platforms", () => {
    const mixedInput = ["src/index.html", "src\\style.css"];
    const expected = mixedInput.map((p) => path.normalize(p));
    const result = [...genWatchedFiles({ input: mixedInput })];

    assert.deepEqual(result, expected);
  });

  it("handles absolute paths correctly", () => {
    const absPath = path.resolve("src/index.html");
    const set = genWatchedFiles({ input: [absPath] });

    assert.ok(set.has(absPath));
  });

  it("deduplicates duplicate paths", () => {
    const dupInput = ["src/index.html", "src/index.html"];
    const set = genWatchedFiles({ input: dupInput });

    assert.strictEqual(set.size, 1);
  });

  it("maps full paths to relative file names", () => {
    const input = new Set(
      ["src/js/app.js", "src/css/app.css"].map((p) => path.normalize(p))
    );
    const output = genOutputFiles({ input, output: { relative: "src" } });

    assert.strictEqual(
      output.get(path.normalize("src/js/app.js")),
      "js\\app.js"
    );
    assert.strictEqual(
      output.get(path.normalize("src/css/app.css")),
      "css\\app.css"
    );
  });

  it("ignores files outside the output.relative folder", () => {
    const files = [
      path.normalize("src/index.html"),
      path.normalize("public/favicon.ico"),
    ];
    const inputSet = new Set(files);
    const output = genOutputFiles({
      input: inputSet,
      output: { relative: "src" },
    });

    assert.strictEqual(output.has(files[1]), true);
    assert.strictEqual(output.get(files[1]), "..\\public\\favicon.ico");
  });

  it("correctly maps files in the root of the relative base", () => {
    const input = new Set([path.normalize("src/manifest.json")]);
    const output = genOutputFiles({ input, output: { relative: "src" } });

    assert.strictEqual(
      output.get(path.normalize("src/manifest.json")),
      "manifest.json"
    );
  });
});
