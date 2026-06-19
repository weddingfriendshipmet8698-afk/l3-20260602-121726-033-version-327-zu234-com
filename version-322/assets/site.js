(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }

    show(0);
    start();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initCatalog() {
    var grid = document.querySelector("[data-card-grid]");
    if (!grid) {
      return;
    }
    var input = document.querySelector("[data-search-input]");
    var sort = document.querySelector("[data-sort-select]");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-category]"));
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var activeCategory = "all";

    function cardText(card) {
      return normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-category"),
        card.getAttribute("data-tags"),
        card.querySelector(".movie-desc") ? card.querySelector(".movie-desc").textContent : ""
      ].join(" "));
    }

    function apply() {
      var keyword = input ? normalize(input.value) : "";
      cards.forEach(function (card) {
        var matchKeyword = !keyword || cardText(card).indexOf(keyword) !== -1;
        var matchCategory = activeCategory === "all" || card.getAttribute("data-category") === activeCategory;
        card.classList.toggle("is-hidden", !(matchKeyword && matchCategory));
      });
    }

    function sortCards() {
      if (!sort) {
        return;
      }
      var mode = sort.value;
      cards.sort(function (a, b) {
        if (mode === "views") {
          return Number(b.getAttribute("data-views")) - Number(a.getAttribute("data-views"));
        }
        if (mode === "title") {
          return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
        }
        return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (input) {
      input.addEventListener("input", apply);
    }

    if (sort) {
      sort.addEventListener("change", function () {
        sortCards();
        apply();
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.getAttribute("data-filter-category") || "all";
        buttons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        apply();
      });
    });
  }

  function initPlayer() {
    var video = document.querySelector("[data-hls-src]");
    var overlay = document.querySelector("[data-play-overlay]");
    if (!video) {
      return;
    }
    var source = video.getAttribute("data-hls-src");
    var loaded = false;

    function attachSource() {
      if (loaded || !source) {
        return Promise.resolve();
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return Promise.resolve();
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        window.__movieHls = hls;
        return Promise.resolve();
      }
      video.src = source;
      return Promise.resolve();
    }

    function play() {
      attachSource().then(function () {
        if (overlay) {
          overlay.classList.add("hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }

    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("hidden");
      }
    });

    video.addEventListener("click", function () {
      if (!loaded) {
        play();
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initCatalog();
    initPlayer();
  });
})();
