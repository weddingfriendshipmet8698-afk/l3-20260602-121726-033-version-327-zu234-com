(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupNavigation() {
        var button = document.querySelector('[data-nav-toggle]');
        var nav = document.querySelector('[data-site-nav]');

        if (!button || !nav) {
            return;
        }

        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');

        if (!hero) {
            return;
        }

        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        if (!slides.length) {
            return;
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
            });
        }

        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function normalize(text) {
        return String(text || '').toLowerCase().trim();
    }

    function setupFilters() {
        var forms = selectAll('[data-filter-form]');

        forms.forEach(function (form) {
            var input = form.querySelector('[data-filter-input]');
            var list = document.querySelector('[data-filter-list]');
            var empty = document.querySelector('[data-empty-state]');

            if (!input || !list) {
                return;
            }

            var cards = selectAll('.movie-card', list);

            function applyFilter() {
                var query = normalize(input.value);
                var terms = query.split(/\s+/).filter(Boolean);
                var visibleCount = 0;

                cards.forEach(function (card) {
                    var haystack = normalize(card.textContent + ' ' + [
                        card.getAttribute('data-title'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-genre')
                    ].join(' '));
                    var matched = terms.every(function (term) {
                        return haystack.indexOf(term) !== -1;
                    });

                    card.style.display = matched ? '' : 'none';

                    if (matched) {
                        visibleCount += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('is-visible', visibleCount === 0);
                }
            }

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilter();
            });

            input.addEventListener('input', applyFilter);

            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get('q');

            if (initialQuery) {
                input.value = initialQuery;
                applyFilter();
            }
        });
    }

    setupNavigation();
    setupHero();
    setupFilters();
}());
