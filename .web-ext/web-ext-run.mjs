// @ts-check
/// <reference path="../types/web-ext.d.ts" />
import webExt from "web-ext";

webExt.cmd
  .run(
    {
      watchFile: ["**/*.js"],
      sourceDir: "./dist",
      target: ["chromium", "firefox-desktop"],
      verbose: true,
    },
    {
      shouldExitProgram: false,
    }
  )
  .then((extensionRunner) => {
    console.log(extensionRunner);
  });
