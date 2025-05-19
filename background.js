"use strict";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download" && request.url) {
    const filename = request.url.split("/").pop();
    chrome.downloads.download(
      {
        url: request.url,
        filename,
        saveAs: false,
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error("Download API failed:", chrome.runtime.lastError);
        }
      }
    );
  }
});
