(function () {
    var video = document.getElementById('movie-player');
    var button = document.querySelector('[data-play-button]');

    if (!video) {
        return;
    }

    var streamUrl = video.getAttribute('data-stream');
    var hlsInstance = null;

    function attachStream() {
        if (!streamUrl || video.dataset.ready === 'true') {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else {
            video.src = streamUrl;
        }

        video.dataset.ready = 'true';
    }

    function startPlayback() {
        attachStream();

        if (button) {
            button.classList.add('is-hidden');
        }

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                video.controls = true;
            });
        }
    }

    if (button) {
        button.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
        if (video.dataset.ready !== 'true') {
            startPlayback();
        }
    });

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}());
