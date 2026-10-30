/*!
 * Icon sprite: original 24x24 line icons (2px rounded stroke).
 * Injects a hidden SVG sprite into the page so icons work everywhere,
 * including when pages are opened straight from disk (file://).
 *
 * Use an icon:
 *   <svg class="icon" aria-hidden="true"><use href="#i-search"></use></svg>
 * Filled variant (stars, hearts):
 *   <svg class="icon icon-fill" aria-hidden="true"><use href="#i-star"></use></svg>
 *
 * Add an icon: copy one <symbol> below, change the id (i-yourname) and path.
 */
(function () {
  var icons = {
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'minus': '<path d="M5 12h14"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up-right': '<path d="M7 17L17 7M8 7h9v9"/>',
    'chevron-down': '<path d="M6 9l6 6 6-6"/>',
    'chevron-right': '<path d="M9 6l6 6-6 6"/>',
    'search': '<path d="M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0zM15.5 15.5L20 20"/>',
    'close': '<path d="M6 6l12 12M18 6L6 18"/>',
    'check': '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    'check-circle': '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 12.5l2.5 2.5 4.5-5"/>',
    'info': '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01"/>',
    'alert': '<path d="M12 4l9 16H3zM12 10v4M12 17h.01"/>',
    'heart': '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    'star': '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    'map-pin': '<path d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>',
    'bed': '<path d="M3 18V6M3 13h18v5M21 13v-1.5A2.5 2.5 0 0 0 18.5 9H11v4M7 11h.01"/>',
    'bath': '<path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2zM6 12V6a2 2 0 0 1 3.5-1.3M7 18l-1 2M17 18l1 2"/>',
    'area': '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    'home': '<path d="M4 11l8-7 8 7M6 10v10h12V10M10 20v-5h4v5"/>',
    'phone': '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    'mail': '<path d="M4 6h16v12H4zM4 7l8 6 8-6"/>',
    'user': '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0"/>',
    'sliders': '<path d="M5 7h9M18 7h1M5 17h1M10 17h9M14 5v4M8 15v4"/>',
    'share': '<path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/>',
    'upload': '<path d="M12 16V4M8 8l4-4 4 4M5 15v4h14v-4"/>',
    'trash': '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>'
  };

  var symbols = '';
  for (var name in icons) {
    if (Object.prototype.hasOwnProperty.call(icons, name)) {
      symbols += '<symbol id="i-' + name + '" viewBox="0 0 24 24">' + icons[name] + '</symbol>';
    }
  }

  function inject() {
    if (document.getElementById('icon-sprite')) return;
    var wrap = document.createElement('div');
    wrap.id = 'icon-sprite';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    wrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + symbols + '</svg>';
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();
