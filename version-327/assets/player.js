import { H as Hls } from './hls.js';

export function initMoviePlayer(sourceUrl) {
  var video = document.getElementById('movie-video');
  var overlay = document.getElementById('play-overlay');

  if (!video || !overlay || !sourceUrl) {
    return;
  }

  var hls = null;
  var attached = false;

  function attachSource() {
    if (attached) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      attached = true;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      attached = true;
      return;
    }

    video.src = sourceUrl;
    attached = true;
  }

  function startPlayback() {
    attachSource();
    overlay.classList.add('is-hidden');
    video.controls = true;
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  }

  overlay.addEventListener('click', startPlayback);

  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
