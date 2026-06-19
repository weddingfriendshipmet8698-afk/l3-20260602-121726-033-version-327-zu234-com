(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-card-filter]').forEach(function (input) {
    var targetSelector = input.getAttribute('data-card-filter');
    var target = document.querySelector(targetSelector);

    if (!target) {
      return;
    }

    var cards = Array.prototype.slice.call(target.querySelectorAll('[data-card]'));

    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = [card.getAttribute('data-title'), card.getAttribute('data-meta'), card.textContent]
          .join(' ')
          .toLowerCase();

        card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
      });
    });
  });

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var query = input ? input.value.trim() : '';
      window.location.href = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
    });
  });

  var carousel = document.querySelector('[data-hero-carousel]');
  var slides = carousel ? Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]')) : [];
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function startCarousel() {
    if (timer || slides.length <= 1) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = parseInt(dot.getAttribute('data-hero-dot'), 10);
      showSlide(index);
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      startCarousel();
    });
  });

  showSlide(0);
  startCarousel();
})();
