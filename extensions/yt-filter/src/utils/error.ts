import { extensionId, numPadding, utils } from "./common";

let _errorId = 0;

const getErrorId = (): string => {
  const errorId = `${extensionId} | ERRID_${numPadding(_errorId)}`;
  _errorId++;
  return errorId;
};

export type ErrorLevel = "FATAL" | "UNSAFE" | "WARNING";
const getErrorFormat = (
  errorId: string,
  level: ErrorLevel,
  message: string
) => {
  return `
  \n .·\´¯\`(>▂<)\´¯\`·. 
  \n${level} | ${errorId}
  \n${message}
  \nPlease create a new issue at https://github.com/dejiko00/KIRISAME-MAGICAL-EXTENSIONS-MONOREPO with this error and the console logs.
  \nThank you for your attention to this important matter.
  \n
  `;
};

export class ExtensionError extends Error {
  constructor(errorId: string, level: ErrorLevel, message: string) {
    super(getErrorFormat(errorId, level, message));
  }
}

export class ExtensionSelectError extends ExtensionError {
  static errorId = getErrorId();
  constructor(type: "GRID" | "ITEM") {
    super(
      ExtensionSelectError.errorId,
      "FATAL",
      type === "GRID"
        ? `Query selector 'ytd-rich-grid-renderer' found no node.`
        : `Query selector 'ytd-rich-grid-renderer > #contents > *' found no nodes.`
    );
  }
}

export class ExtensionCustomElementsRegistryTimeout extends ExtensionError {
  static errorId = getErrorId();
  constructor() {
    super(
      ExtensionCustomElementsRegistryTimeout.errorId,
      "FATAL",
      `__CE_registry polyfill was not initialized within 10 seconds.`
    );
  }
}
