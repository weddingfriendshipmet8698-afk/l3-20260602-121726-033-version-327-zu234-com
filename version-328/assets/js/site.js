(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupNavigation() {
        const toggle = document.querySelector(".nav-toggle");
        const nav = document.querySelector(".site-nav");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            const open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(open));
        });
    }

    function setupHero() {
        const root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        const slides = Array.from(root.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(root.querySelectorAll("[data-hero-dot]"));
        const prev = root.querySelector("[data-hero-prev]");
        const next = root.querySelector("[data-hero-next]");
        if (slides.length < 2) {
            return;
        }
        let active = 0;
        let timer = null;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        if (prev) {
            prev.addEventListener("click", function () {
                show(active - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                start();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function setupFilters() {
        const areas = Array.from(document.querySelectorAll("[data-filter-area]"));
        areas.forEach(function (area) {
            const scope = area.parentElement || document;
            const cards = Array.from(scope.querySelectorAll(".movie-card, .rank-item"));
            const empty = scope.querySelector("[data-empty-state]");
            const search = area.querySelector(".js-search-input");
            const region = area.querySelector(".js-region-select");
            const type = area.querySelector(".js-type-select");
            const year = area.querySelector(".js-year-select");
            function textOf(card) {
                return [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-tags"),
                    card.textContent
                ].join(" ").toLowerCase();
            }
            function match(card) {
                const haystack = textOf(card);
                const query = search ? search.value.trim().toLowerCase() : "";
                const regionValue = region ? region.value : "";
                const typeValue = type ? type.value : "";
                const yearValue = year ? year.value : "";
                if (query && !haystack.includes(query)) {
                    return false;
                }
                if (regionValue && card.getAttribute("data-region") !== regionValue) {
                    return false;
                }
                if (typeValue && card.getAttribute("data-type") !== typeValue) {
                    return false;
                }
                if (yearValue && card.getAttribute("data-year") !== yearValue) {
                    return false;
                }
                return true;
            }
            function apply() {
                let visible = 0;
                cards.forEach(function (card) {
                    const ok = match(card);
                    card.style.display = ok ? "" : "none";
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }
            [search, region, type, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    }

    window.initializeMoviePlayer = function (streamUrl) {
        const video = document.getElementById("movie-video");
        const overlay = document.getElementById("player-overlay");
        const button = document.getElementById("player-start");
        const error = document.getElementById("player-error");
        if (!video || !streamUrl) {
            return;
        }
        let attached = false;
        let hls = null;
        function showError() {
            if (error) {
                error.textContent = "视频暂时无法加载，请稍后再试。";
            }
        }
        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showError();
                    }
                });
            } else {
                video.src = streamUrl;
            }
        }
        function play() {
            attach();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            const result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                });
            }
        }
        if (overlay) {
            overlay.addEventListener("click", play);
        }
        if (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                play();
            });
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("error", showError);
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };

    ready(function () {
        setupNavigation();
        setupHero();
        setupFilters();
    });
})();
