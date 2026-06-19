(function () {
  function setupPlayer(root) {
    var video = root.querySelector("[data-player-video]");
    var overlay = root.querySelector("[data-player-overlay]");
    var button = root.querySelector("[data-player-button]");

    if (!video) {
      return;
    }

    var stream = video.getAttribute("data-stream");
    var ready = false;
    var hlsInstance = null;

    function attachStream() {
      if (ready || !stream) {
        return;
      }

      ready = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = stream;
    }

    function startPlayback(event) {
      if (event) {
        event.preventDefault();
      }

      attachStream();

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }

    if (button) {
      button.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (!ready || video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(setupPlayer);
})();
