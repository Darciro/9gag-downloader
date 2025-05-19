// 1. Download button click
document.getElementById("9gag-download-btn").addEventListener("click", () => {
  const selectedSource = document.getElementById("video-format-selector").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      downloadFrom9Gag: true,
      selectedSource,
    });
  });
});

// 2. On popup load: request data from content script
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) throw new Error("No active tab found");

    // Send message and await response
    const response = await chrome.tabs.sendMessage(tab.id, {
      getDataFrom9Gag: true,
    });

    // Set the post title safely
    document.getElementById("post-title").textContent =
      response.postPitle || "";

    // Populate your format selector
    const formatSelector = document.getElementById("video-format-selector");
    formatSelector.innerHTML = "";
    new Set(
      response.postVideos.length ? response.postVideos : response.postImages
    ).forEach((src) => {
      const opt = document.createElement("option");
      opt.value = src;
      opt.textContent = src.split(/[#?]/)[0].split(".").pop().trim();
      formatSelector.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to fetch 9GAG data:", err);
  }
});
