/*!
 * Showcase shell (documentation only, not needed on real pages).
 * Every file in /components/ contains only its own content inside
 * <main class="doc-main">. This script wraps it with the top bar, the list of
 * all components and previous/next links, so the navigation lives in ONE place.
 *
 * To add a component page: create components/<name>.html and add one line to NAV.
 */
(function () {
  var NAV = [
    { title: 'Phase 1 · Foundation UI', items: [
      ['button', 'Button'], ['icon-button', 'Icon button'], ['input', 'Input'], ['textarea', 'Textarea'],
      ['select', 'Select'], ['checkbox-radio', 'Checkbox, radio, switch'], ['badge', 'Badge'],
      ['avatar', 'Avatar'], ['rating', 'Rating'], ['skeleton', 'Skeleton loader']
    ]},
    { title: 'Phase 2 · Layout', items: [
      ['container', 'Container and sections'], ['header', 'Header'], ['mobile-navigation', 'Mobile navigation'],
      ['footer', 'Footer'], ['section-heading', 'Section heading'], ['breadcrumbs', 'Breadcrumbs'],
      ['pagination', 'Pagination'], ['modal-drawer', 'Modal and drawer']
    ]},
    { title: 'Phase 3 · Real estate', items: [
      ['property-card', 'Property card (grid)'], ['property-card-list', 'Property card (list)'],
      ['property-gallery', 'Property gallery'], ['property-search-form', 'Property search form'],
      ['advanced-filters', 'Advanced filters'], ['property-specifications', 'Property specifications'],
      ['amenities-list', 'Amenities list'], ['floor-plan-card', 'Floor plan card'],
      ['agent-card', 'Agent card'], ['location-card', 'Location card']
    ]},
    { title: 'Phase 4 · Sections', items: [
      ['hero-section', 'Hero section'], ['featured-properties', 'Featured properties'],
      ['property-categories', 'Property categories'], ['popular-locations', 'Popular locations'],
      ['why-choose-us', 'Why choose us'], ['agent-showcase', 'Agent showcase'],
      ['testimonials', 'Testimonials'], ['blog-cards', 'Blog cards'],
      ['cta-banner', 'CTA banner'], ['newsletter', 'Newsletter']
    ]}
  ];

  var main = document.querySelector('main.doc-main');
  if (!main) return;

  var current = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
  var live = [];
  NAV.forEach(function (g) { g.items.forEach(function (i) { if (i[0]) live.push(i); }); });

  /* ---- Top bar -------------------------------------------------------- */
  var bar = document.createElement('header');
  bar.className = 'doc-topbar';
  bar.innerHTML =
    '<div class="container-xl">' +
      '<a class="doc-brand" href="index.html">' +
        '<span class="doc-brand-mark"><svg class="icon" aria-hidden="true"><use href="#i-home"></use></svg></span>' +
        'Real Estate Template' +
      '</a>' +
      '<nav class="doc-topnav" aria-label="Primary">' +
        '<a href="index.html" aria-current="page">Components</a>' +
        '<a href="../documentation/index.html">Documentation</a>' +
      '</nav>' +
    '</div>';

  /* ---- Sidebar -------------------------------------------------------- */
  var html = '<button type="button" class="btn btn-secondary btn-sm doc-nav-toggle" aria-expanded="false" aria-controls="doc-nav">Browse components</button>';
  html += '<nav id="doc-nav" class="doc-nav" aria-label="Components">';
  html += '<a class="doc-nav-all" href="index.html"' + (current === 'index' ? ' aria-current="page"' : '') + '>All components</a>';
  NAV.forEach(function (g) {
    html += '<h2>' + g.title + '</h2><ul>';
    g.items.forEach(function (i) {
      if (i[0]) {
        html += '<li><a href="' + i[0] + '.html"' + (i[0] === current ? ' aria-current="page"' : '') + '>' + i[1] + '</a></li>';
      } else {
        html += '<li><span class="doc-nav-soon">' + i[1] + '</span></li>';
      }
    });
    html += '</ul>';
  });
  html += '</nav>';

  var aside = document.createElement('aside');
  aside.className = 'doc-sidebar';
  aside.setAttribute('aria-label', 'Components navigation');
  aside.innerHTML = html;

  var toggle = aside.querySelector('.doc-nav-toggle');
  toggle.addEventListener('click', function () {
    var open = aside.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---- Layout --------------------------------------------------------- */
  var layout = document.createElement('div');
  layout.className = 'container-xl doc-layout';
  main.parentNode.insertBefore(layout, main);
  layout.appendChild(aside);
  layout.appendChild(main);
  document.body.insertBefore(bar, document.body.firstChild);

  /* ---- Previous / next ------------------------------------------------ */
  var idx = -1;
  live.forEach(function (i, n) { if (i[0] === current) idx = n; });
  if (idx > -1) {
    var prev = live[idx - 1], next = live[idx + 1];
    var pager = document.createElement('nav');
    pager.className = 'doc-pager';
    pager.setAttribute('aria-label', 'Previous and next component');
    pager.innerHTML =
      (prev ? '<a class="doc-pager-link" href="' + prev[0] + '.html"><span>Previous</span><strong>' + prev[1] + '</strong></a>' : '<span></span>') +
      (next ? '<a class="doc-pager-link is-next" href="' + next[0] + '.html"><span>Next</span><strong>' + next[1] + '</strong></a>' : '<span></span>');
    main.appendChild(pager);
  }
})();
