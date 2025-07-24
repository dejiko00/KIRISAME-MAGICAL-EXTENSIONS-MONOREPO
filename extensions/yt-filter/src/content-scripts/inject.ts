import { utils } from "../utils/common";
import { ExtensionCustomElementsRegistryTimeout } from "../utils/error";

const onDocumentInit = () => {
  return new Promise<void>((resolve) => {
    const mo = new MutationObserver(() => {
      mo.disconnect();
      mo.takeRecords();
      resolve();
    });
    mo.observe(document, { childList: true, subtree: true });
  });
};

/** https://github.com/webcomponents/polyfills/ */
// async function onRegistryReady(): Promise<void> {
//   if (!!window.customElements) return;
//   if ("__CE_registry" in document) return;

//   const EVENT_KEY = "_yt-ce-registry-ready";

//   Object.defineProperty(document, "__CE_registry", {
//     get() {},
//     set(val) {
//       if (typeof val === "object") {
//         utils.debug("__CE_registry being re-set.");
//         delete this.__CE_registry;
//         this.__CE_registry = val;
//         document.dispatchEvent(new CustomEvent(EVENT_KEY));
//       }
//       return true;
//     },
//     configurable: true,
//     enumerable: false,
//   });

//   return await new Promise<void>((resolve, reject) => {
//     const timeout = setTimeout(() => {
//       reject(new ExtensionCustomElementsRegistryTimeout());
//     }, 10_000);

//     const handler = () => {
//       document.removeEventListener(EVENT_KEY, handler);
//       clearTimeout(timeout);
//       utils.debug("__CE_registry ready.");
//       resolve();
//     };
//     document.addEventListener(EVENT_KEY, handler);
//   });
// }

export const onCustomElementsReady = async (): Promise<void> => {
  if (!!window.customElements) return;

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new ExtensionCustomElementsRegistryTimeout()),
      10_000
    );

    const check = () => {
      if (!!window.customElements) {
        clearTimeout(timeout);
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };

    requestAnimationFrame(check);
  });
};
browser.scripting.registerContentScripts

export const onInject = async () => {
  await onDocumentInit();
  await onCustomElementsReady();
  await window.customElements.whenDefined("ytd-rich-grid-renderer");
  await window.customElements.whenDefined("ytd-rich-item-renderer");
  utils.debug("injected.");
};
