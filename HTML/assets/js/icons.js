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
    'trash': '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'grid': '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>',
    'list': '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    'camera': '<path d="M4 8h3l1.5-2h7L17 8h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>',
    'calendar': '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',
    'car': '<path d="M4 16v-4l2-5h12l2 5v4zM4 16v2h3v-2M17 16v2h3v-2M7.5 13h.01M16.5 13h.01"/>',
    'building': '<path d="M5 20V4h10v16M15 9h4v11M3 20h18M8 8h2M8 12h2M8 16h2"/>',
    'key': '<path d="M14.5 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zM14 12.5L20 18.5M17 15.5l2-2M15.5 17l2-2"/>',
    'tag': '<path d="M4 4h8l8 8-8 8-8-8zM8.5 8.5h.01"/>',
    'compass': '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z"/>',
    'map': '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
    'eye': '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>',
    'bell': '<path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2h-15zM10 21h4"/>',
    'log-out': '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
    'play': '<path d="M8 5l11 7-11 7z"/>',
    'layers': '<path d="M12 4l9 5-9 5-9-5zM3 14l9 5 9-5"/>',
    'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    'external': '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
    'chevron-up': '<path d="M6 15l6-6 6 6"/>',
    'facebook': '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
    'x-social': '<path d="M4 4l16 16M20 4L4 20"/>',
    'instagram': '<path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 7.5h.01"/>',
    'linkedin': '<path d="M5 9v10M5 5h.01M10 19v-6a3 3 0 0 1 6 0v6M10 9v10"/>',
    'youtube': '<path d="M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9l5 3-5 3z"/>',
    'quote': '<path d="M5 17V12a5 5 0 0 1 4-5M5 17h4v-4H5M14 17V12a5 5 0 0 1 4-5M14 17h4v-4h-4"/>',
    'shield-check': '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4"/>',
    'shield': '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
    'award': '<path d="M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM8.5 13l-1.5 7 5-3 5 3-1.5-7"/>',
    'users': '<path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    'trending-up': '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    'dollar': '<path d="M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.5 0-4.5 1.2-4.5 3.2 0 4.6 9 2.2 9 6.8 0 2-2 3.5-4.5 3.5-2.4 0-4.2-1.1-4.7-2.8"/>',
    'wifi': '<path d="M3 9a13 13 0 0 1 18 0M6 12.5a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0M12 19.5h.01"/>',
    'snowflake': '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
    'flame': '<path d="M12 21c-4 0-6.5-2.6-6.5-6 0-3 2-4.5 3-7 1.5 1 2 2 2 3 1-1.5 2-3.5 1.5-6 3.5 2 6.5 5.5 6.5 10 0 3.4-2.5 6-6.5 6z"/>',
    'waves': '<path d="M3 9c2 0 2-1.5 4.5-1.5S10 9 12 9s2.5-1.5 4.5-1.5S19 9 21 9M3 14c2 0 2-1.5 4.5-1.5S10 14 12 14s2.5-1.5 4.5-1.5S19 14 21 14M3 19c2 0 2-1.5 4.5-1.5S10 19 12 19s2.5-1.5 4.5-1.5S19 19 21 19"/>',
    'dumbbell': '<path d="M6 8v8M3.5 10v4M18 8v8M20.5 10v4M6 12h12"/>',
    'tree': '<path d="M12 21v-6M12 15c-4 0-6.5-2.5-6.5-5.5S8 4 12 3c4 1 6.5 3.5 6.5 6.5S16 15 12 15z"/>',
    'paw': '<path d="M12 13c-3 0-5 2-5 4 0 1.8 1.5 2.5 3 2 1.2-.4 1.5-.4 4 0 1.5.5 3-.2 3-2 0-2-2-4-5-4zM6 10a1.5 2 0 1 0 0-.01M9.5 6.5a1.5 2 0 1 0 0-.01M14.5 6.5a1.5 2 0 1 0 0-.01M18 10a1.5 2 0 1 0 0-.01"/>',
    'elevator': '<path d="M5 4h14v16H5zM12 4v16M8 10l1.5-2L11 10M13 14l1.5 2 1.5-2"/>',
    'zap': '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
    'box': '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5L12 12l8-4.5M12 12v9"/>',
    'laundry': '<path d="M5 3h14v18H5zM5 8h14M8 5.5h.01M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>',
    'tv': '<path d="M3 6h18v12H3zM8 21h8M12 18v3"/>',
    'sofa': '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 14a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v4H3zM6 18v2M18 18v2"/>',
    'clock': '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2"/>',
    'send': '<path d="M21 3L3 10.5l7 3 3 7zM10 13.5L21 3"/>',
    'dots': '<path d="M5 12h.01M12 12h.01M19 12h.01"/>',
    'filter': '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
    'sort': '<path d="M7 4v16M3.5 16.5L7 20l3.5-3.5M17 20V4M13.5 7.5L17 4l3.5 3.5"/>',
    'lock': '<path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>',
    'edit': '<path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/>',
    'download': '<path d="M12 4v12M8 12l4 4 4-4M5 20h14"/>',
    'image': '<path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01"/>',
    'bookmark': '<path d="M6 4h12v17l-6-4-6 4z"/>',
    'settings': '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1.5-2-3.5-2.4.8a7 7 0 0 0-1.6-1L14.5 4h-5l-.5 2.8a7 7 0 0 0-1.6 1L5 7 3 10.5 5 12a7 7 0 0 0 0 .01L3 13.5 5 17l2.4-.8a7 7 0 0 0 1.6 1l.5 2.8h5l.5-2.8a7 7 0 0 0 1.6-1l2.4.8 2-3.5z"/>',
    'garage': '<path d="M3 20V9l9-5 9 5v11M7 20v-7h10v7M7 15.5h10M7 18h10"/>'
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
