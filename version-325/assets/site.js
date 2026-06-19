import { H as Hls } from './hls-dru42stk.js';

const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  setupNavigation();
  setupHeroCarousel();
  setupFilters();
  setupPlayers();
});

function setupNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function setupHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  const dots = Array.from(carousel.querySelectorAll('.hero-dot'));
  const prev = carousel.querySelector('.hero-prev');
  const next = carousel.querySelector('.hero-next');
  let activeIndex = 0;
  let timer = null;

  const show = (index) => {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  };

  const nextSlide = () => show(activeIndex + 1);
  const prevSlide = () => show(activeIndex - 1);

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(nextSlide, 5200);
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.target || 0));
      restart();
    });
  });

  if (prev) {
    prev.addEventListener('click', () => {
      prevSlide();
      restart();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      nextSlide();
      restart();
    });
  }

  show(0);
  restart();
}

function setupFilters() {
  const input = document.querySelector('[data-filter-input]');

  if (!input) {
    return;
  }

  const cards = Array.from(document.querySelectorAll('.movie-card, .rank-row'));

  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();

    cards.forEach((card) => {
      const haystack = [
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.category,
        card.textContent
      ].join(' ').toLowerCase();

      card.classList.toggle('is-hidden', Boolean(value) && !haystack.includes(value));
    });
  });
}

function setupPlayers() {
  const players = Array.from(document.querySelectorAll('video[data-src]'));

  players.forEach((video) => {
    const source = video.dataset.src;

    if (!source) {
      return;
    }

    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data && data.fatal) {
          hls.destroy();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      video.insertAdjacentHTML('afterend', '<p class="panel">当前浏览器不支持 HLS 播放，请更换现代浏览器打开。</p>');
    }
  });
}
