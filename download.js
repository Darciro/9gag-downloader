// Wrap in an IIFE to avoid polluting global scope
(() => {
  // Listen for messages from popup or background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.getDataFrom9Gag) {
      let titleEl, videoSources, imgSources;

      if (document.getElementById("individual-post")) {
        titleEl = document.querySelector("section#individual-post header h1");
        videoSources = Array.from(
          document.querySelectorAll("#individual-post article video source")
        )
          .map((el) => el.src)
          .filter(Boolean);
        imgSources = Array.from(
          document.querySelectorAll("#individual-post article picture img")
        )
          .map((el) => el.src)
          .filter(Boolean);
      } else {
        const items = Array.from(
          document.querySelectorAll("#container section article")
        );
        let firstVisible = null;

        function updateFirstVisible() {
          // Filter items whose bounding rect intersects the viewport
          const visibleItems = items.filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom > 0;
          });

          if (visibleItems.length) {
            // Sort by nearest to the top of viewport
            visibleItems.sort(
              (a, b) =>
                a.getBoundingClientRect().top - b.getBoundingClientRect().top
            );
            const newFirst = visibleItems[0];
            if (newFirst !== firstVisible) {
              firstVisible = newFirst;
              document
                .querySelectorAll(".item--active")
                .forEach((el) => el.classList.remove("item--active"));
              firstVisible.classList.add("item--active");
            }
          }
        }

        // Listen for scroll events
        window.addEventListener("scroll", () => {
          window.requestAnimationFrame(updateFirstVisible); // throttle with rAF :contentReference[oaicite:9]{index=9}
        });

        // Run once on load
        updateFirstVisible();

        videoSources = Array.from(
          document.querySelectorAll(".item--active video source")
        )
          .map((el) => el.src)
          .filter(Boolean);

        titleEl = document.querySelector(".item--active h2");
        imgSources = Array.from(
          document.querySelectorAll("#container .post-container picture img")
        )
          .map((el) => el.src)
          .filter(Boolean);
      }

      sendResponse({
        postPitle: titleEl?.textContent.trim() || "",
        postVideos: videoSources,
        postImages: imgSources,
      });

      return true; // Keeps the channel open, safe even for sync responses
    }

    if (request.downloadFrom9Gag) {
      const url = request.selectedSource;
      chrome.runtime.sendMessage({ action: "download", url });
      document.body.classList.add("9gag-downloader");
      return true; // keep message channel open if needed
    }
  });
})();
