(function () {
  var navButton = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (navButton && mobileNav) {
    navButton.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      navButton.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function setupFilters(scope) {
    var input = scope.querySelector("[data-search-input]");
    var selects = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-select]"));
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
    var emptyState = scope.querySelector("[data-empty-state]");

    function applyFilters() {
      var query = input ? normalize(input.value) : "";
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute("data-search") + " " + card.textContent);
        var matched = !query || haystack.indexOf(query) !== -1;

        selects.forEach(function (select) {
          var name = select.getAttribute("data-filter-name");
          var value = select.value;

          if (value && card.getAttribute("data-" + name) !== value) {
            matched = false;
          }
        });

        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", applyFilters);
    }

    selects.forEach(function (select) {
      select.addEventListener("change", applyFilters);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]")).forEach(setupFilters);
})();
