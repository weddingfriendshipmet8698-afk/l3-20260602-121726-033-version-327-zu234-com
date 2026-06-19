(function () {
  var form = document.querySelector('[data-live-search-form]');
  var input = form ? form.querySelector('input[name="q"]') : null;
  var results = document.querySelector('[data-search-results]');
  var summary = document.querySelector('[data-search-summary]');
  var data = window.MOVIE_SEARCH_DATA || [];

  function card(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="' + movie.url + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="card-score">' + movie.rating + '</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function runSearch(query) {
    var keyword = String(query || '').trim().toLowerCase();

    if (!keyword) {
      results.innerHTML = data.slice(0, 30).map(card).join('');
      summary.textContent = '显示推荐影片 30 部。';
      return;
    }

    var matched = data.filter(function (movie) {
      return String(movie.keywords || '').toLowerCase().indexOf(keyword) !== -1;
    }).slice(0, 120);

    results.innerHTML = matched.map(card).join('');
    summary.textContent = matched.length ? '找到 ' + matched.length + ' 条相关影片。' : '没有找到相关影片。';
  }

  if (!form || !input || !results || !summary) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  input.value = initialQuery;
  runSearch(initialQuery);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    runSearch(input.value);
  });

  input.addEventListener('input', function () {
    runSearch(input.value);
  });
})();
