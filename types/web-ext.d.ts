// types/web-ext.d.ts
declare module "web-ext" {
  export interface RunOptions {
    /** Path to the extension's source directory */
    sourceDir?: string;

    /** Directory where build artifacts (like signed extensions) will be saved */
    artifactsDir?: string;

    /** Path or alias to the Firefox binary to run (e.g., "firefox", "nightly", or full path) */
    firefox?: string;

    /** Use a specific Firefox profile (by name or path) */
    firefoxProfile?: string;

    /** If the specified profile path doesn’t exist, create it automatically */
    profileCreateIfMissing?: boolean;

    /** Persist any changes made to the profile after running */
    keepProfileChanges?: boolean;

    /** List of URLs to open in Firefox after launching */
    startUrl?: string[];

    /** Additional command-line arguments to pass to Firefox */
    args?: string[];

    /** Firefox preferences to set, in the form `name=value` (e.g., `"general.useragent.locale=fr-FR"`) */
    pref?: string[];

    /** Automatically reload the extension on source file changes (default: true) */
    reload?: boolean;

    /** Specific files to watch for changes to trigger a reload */
    watchFile?: string[];

    /** File paths or glob patterns to ignore when watching for changes */
    watchIgnored?: string[];

    /** Open the Firefox Browser Console when starting */
    browserConsole?: boolean;

    /** Open the DevTools for the extension after it loads (Firefox 106+) */
    devtools?: boolean;

    /** Show verbose logging output */
    verbose?: boolean;

    /** List of glob patterns of files to exclude from the build/package */
    ignoreFiles?: string[];

    /** Platforms to run the extension on. Can include "firefox-desktop", "firefox-android", "chromium" */
    target?: ("firefox-desktop" | "firefox-android" | "chromium")[];

    /** Disable prompts or any interaction requiring stdin */
    noInput?: boolean;

    /** Path to a CommonJS config file with default option values */
    config?: string;

    /** Enable or disable config file discovery from home/working directory (default: true) */
    configDiscovery?: boolean;

    /** Path or alias to a Chromium-based browser binary (e.g., Chrome or Opera) */
    chromiumBinary?: string;

    /** Path to a specific Chromium browser profile to use */
    chromiumProfile?: string;

    /** Path to a custom `adb` binary (for Android debugging) */
    adbBin?: string;

    /** ADB host to connect to (for Android) */
    adbHost?: string;

    /** ADB port to connect to (for Android) */
    adbPort?: number;

    /** Device name to connect to via ADB */
    androidDevice?: string;

    /** Timeout in milliseconds for ADB device discovery */
    adbDiscoveryTimeout?: number;

    /** Delete old extension artifacts from Android device before installing */
    adbRemoveOldArtifacts?: boolean;

    /** Package name of Firefox APK to run on Android (e.g., "org.mozilla.firefox") */
    firefoxApk?: string;

    /** Android component to launch within the APK (defaults to `<apk>/.App`) */
    firefoxApkComponent?: string;

    /** Pre-install the extension into the profile before startup (for older Firefox versions) */
    preInstall?: boolean;
  }

  export interface RunCommandOptions {
    /** default: `true` */
    shouldExitProgram?: boolean;
  }

  export interface ExtensionRunner {
    exit: () => void;
    reloadAllExtensions: () => void;
  }

  const webExt: {
    cmd: {
      run(
        options?: RunOptions,
        commandOptions?: RunCommandOptions
      ): Promise<ExtensionRunner>;
    };
  };

  export default webExt;
}
