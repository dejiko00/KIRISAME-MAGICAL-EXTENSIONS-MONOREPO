if (typeof browser === "undefined") {
  // @ts-ignore
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}
browser.runtime.onInstalled.addListener(() => {
  browser.tabs.create({ url: "http://youtube.com" });
});

// function listener(details: browser.webRequest._OnBeforeRequestDetails): void {
//   const filter = browser.webRequest.filterResponseData(details.requestId);
//   console.debug(filter, details.url);
// }

// browser.webRequest.onCompleted.addListener(() => {}, {
//   urls: ["https://www.youtube.com/*"],
//   types: ["main_frame"],
// });
