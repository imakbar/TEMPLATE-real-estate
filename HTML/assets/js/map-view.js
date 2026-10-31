/*!
 * Property map
 * Shows properties as price pins on a Google Map, with a popup card.
 * Without an API key it shows a demo map so the page still looks right.
 *
 * <div class="map-view" data-property-map="#map-data" data-map-key="YOUR_KEY"></div>
 * <script type="application/json" id="map-data">[ { ... }, ... ]</script>
 *
 * Optional attributes: data-map-zoom="12"  data-map-center="40.72,-73.99"
 *   data-map-marker="price | icon"   pin style (default price)
 *   data-map-animate="false"         turn off the drop and pop-in animations
 * Each property: id, lat, lng, price, title, address, image, url,
 *                status ("sale" | "rent"), beds, baths, area
 */
(function () {
  'use strict';

  var PLACEHOLDER = /^(|YOUR_API_KEY|YOUR_KEY)$/;
  var CLUSTER_PX = 48;
  var instances = [];
  var googleState = 'idle'; // idle | loading | ready | failed

  // Soft green map style that matches the theme.
  var MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#f1f0e8' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#5f6763' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f7f6f0' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: '#dce6d8' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e5dcc6' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9ddd7' }] }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  }

  function MapView(el) {
    this.el = el;
    this.items = [];
    this.active = null;
    this.gmap = null;
    this.projector = null;
    this.demo = true;
    this.raf = 0;
    this.nodes = {};
    this.inView = true;
    this.marker = el.getAttribute('data-map-marker') === 'icon' ? 'icon' : 'price';
    this.animate = el.getAttribute('data-map-animate') !== 'false';

    try {
      var src = document.querySelector(el.getAttribute('data-property-map'));
      this.items = JSON.parse(src.textContent).filter(function (p) {
        return isFinite(p.lat) && isFinite(p.lng);
      });
    } catch (e) {
      if (window.console) console.warn('map-view.js: could not read property data', e);
    }

    this.key = (el.getAttribute('data-map-key') || '').trim();
    this.build();
    this.watchView();
    this.useDemo();
    if (!PLACEHOLDER.test(this.key)) instances.push(this), loadGoogle();
  }

  MapView.prototype.build = function () {
    var el = this.el;
    el.innerHTML =
      '<div class="map-view-canvas"></div>' +
      '<div class="map-view-layer"></div>' +
      '<div class="map-popup" role="dialog" aria-label="Property"></div>' +
      '<div class="map-controls">' +
        '<div class="map-zoom"><button type="button" class="map-ctrl" data-map-act="zoom-in" aria-label="Zoom in">' + icon('plus') + '</button>' +
        '<button type="button" class="map-ctrl" data-map-act="zoom-out" aria-label="Zoom out">' + icon('minus') + '</button></div>' +
        '<button type="button" class="map-ctrl map-ctrl--solo" data-map-full aria-label="Full screen">' + icon('expand') + '</button>' +
      '</div>';
    this.canvas = el.querySelector('.map-view-canvas');
    this.layer = el.querySelector('.map-view-layer');
    this.popup = el.querySelector('.map-popup');
    this.fullBtn = el.querySelector('[data-map-full]');

    var self = this;
    el.addEventListener('click', function (e) {
      var t = e.target;
      var pin = t.closest('.map-pin');
      var cl = t.closest('.map-cluster');
      var z = t.closest('[data-map-act]');
      if (pin) return self.open(pin.getAttribute('data-id'));
      if (cl) return self.zoomToCluster(cl);
      if (z) return self.zoom(z.getAttribute('data-map-act') === 'zoom-in' ? 1 : -1);
      if (t.closest('.map-popup-close')) return self.close(true);
      if (t.closest('[data-map-full]')) return self.toggleFull();
      if (!t.closest('.map-popup')) self.close();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (self.active != null) self.close(true);
      else if (el.classList.contains('is-fullscreen')) self.toggleFull();
    });
    window.addEventListener('resize', function () { self.queue(); });
  };

  /* ---------- Demo map (no API key, or Google failed) ---------- */
  MapView.prototype.useDemo = function () {
    this.demo = true;
    this.el.classList.add('is-demo');
    this.el.classList.remove('is-google');
    this.canvas.innerHTML = '';
    var note = this.el.querySelector('.map-notice');
    if (!note) {
      note = document.createElement('div');
      note.className = 'map-notice';
      note.innerHTML = '<strong>Demo map.</strong> Add a Google Maps API key to show the real map.';
      this.el.appendChild(note);
    }
    var ps = this.items;
    var b = { n: -90, s: 90, e: -180, w: 180 };
    ps.forEach(function (p) {
      b.n = Math.max(b.n, p.lat); b.s = Math.min(b.s, p.lat);
      b.e = Math.max(b.e, p.lng); b.w = Math.min(b.w, p.lng);
    });
    this.bounds = b;
    this.render();
  };

  MapView.prototype.project = function (p) {
    var w = this.el.clientWidth, h = this.el.clientHeight;
    if (this.demo) {
      var b = this.bounds, padX = 0.14, padY = 0.24;
      var dx = (b.e - b.w) || 1, dy = (b.n - b.s) || 1;
      return {
        x: (padX + (1 - 2 * padX) * (p.lng - b.w) / dx) * w,
        y: (padY + (1 - 2 * padY) * (b.n - p.lat) / dy) * h
      };
    }
    var proj = this.projector && this.projector.getProjection();
    if (!proj) return null;
    var pt = proj.fromLatLngToContainerPixel(new google.maps.LatLng(p.lat, p.lng));
    return pt ? { x: pt.x, y: pt.y } : null;
  };

  /* ---------- Drawing pins and clusters ---------- */
  MapView.prototype.queue = function () {
    var self = this;
    if (this.raf) return;
    this.raf = requestAnimationFrame(function () { self.raf = 0; self.render(); });
  };

  MapView.prototype.render = function () {
    var self = this, pts = [], i;
    for (i = 0; i < this.items.length; i++) {
      var xy = this.project(this.items[i]);
      if (xy) pts.push({ p: this.items[i], x: xy.x, y: xy.y });
    }

    // Group pins that are close together (Google map only).
    var groups = [];
    pts.forEach(function (pt) {
      var hit = null;
      if (!self.demo) {
        for (var g = 0; g < groups.length; g++) {
          if (Math.abs(groups[g].x - pt.x) < CLUSTER_PX && Math.abs(groups[g].y - pt.y) < CLUSTER_PX) { hit = groups[g]; break; }
        }
      }
      if (hit) {
        hit.list.push(pt);
        hit.x = hit.list.reduce(function (s, a) { return s + a.x; }, 0) / hit.list.length;
        hit.y = hit.list.reduce(function (s, a) { return s + a.y; }, 0) / hit.list.length;
      } else groups.push({ x: pt.x, y: pt.y, list: [pt] });
    });

    // Reuse existing elements so pins do not flicker or replay their drop animation.
    var self2 = this, seen = {}, dropIndex = 0;
    groups.sort(function (g1, g2) { return g1.y - g2.y; });
    groups.forEach(function (g) {
      var single = g.list.length === 1, p = single ? g.list[0].p : null;
      var key = single ? 'p' + p.id : 'c' + g.list.map(function (a) { return a.p.id; }).join(',');
      var node = self2.nodes[key];
      if (!node) {
        node = document.createElement('button');
        node.type = 'button';
        if (single) {
          node.className = 'map-pin map-pin--' + self2.marker + (p.status === 'rent' ? ' is-rent' : '');
          node.setAttribute('data-id', p.id);
          node.setAttribute('aria-label', p.title + ', ' + p.price);
          node.innerHTML = self2.marker === 'icon'
            ? '<svg class="map-pin-shape" viewBox="0 0 40 52" aria-hidden="true"><path d="M20 1.5C9.4 1.5 1.5 9.7 1.5 19.8 1.5 33 20 50.5 20 50.5S38.5 33 38.5 19.8C38.5 9.7 30.6 1.5 20 1.5z"/></svg>' + icon('home')
            : esc(p.price);
        } else {
          node.className = 'map-cluster';
          node.setAttribute('data-ids', g.list.map(function (a) { return a.p.id; }).join(','));
          node.setAttribute('aria-label', g.list.length + ' properties, zoom in');
          node.textContent = g.list.length;
        }
        self2.nodes[key] = node;
        self2.layer.appendChild(node);
        if (self2.animate) {
          if (self2.inView) self2.drop(node, dropIndex++); else node.classList.add('is-hold');
        }
      }
      if (single) node.classList.toggle('is-active', String(p.id) === String(self2.active));
      node.style.left = g.x.toFixed(1) + 'px';
      node.style.top = g.y.toFixed(1) + 'px';
      seen[key] = true;
    });
    Object.keys(this.nodes).forEach(function (k) {
      if (!seen[k]) { self2.nodes[k].remove(); delete self2.nodes[k]; }
    });
    this.placePopup();
  };

  // Drop a pin from above onto its place (CSS animation, plays once).
  MapView.prototype.drop = function (node, i) {
    node.classList.remove('is-hold', 'is-drop');
    node.style.animationDelay = (i * 70) + 'ms';
    void node.offsetWidth;
    node.classList.add('is-drop');
    node.addEventListener('animationend', function done() {
      node.classList.remove('is-drop');
      node.style.animationDelay = '';
      node.removeEventListener('animationend', done);
    });
  };

  // Start the drop when the map scrolls into view.
  MapView.prototype.watchView = function () {
    var self = this;
    if (!this.animate || !('IntersectionObserver' in window)) return;
    this.inView = false;
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      self.inView = true;
      var i = 0;
      Object.keys(self.nodes).map(function (k) { return self.nodes[k]; })
        .sort(function (a, b) { return parseFloat(a.style.top) - parseFloat(b.style.top); })
        .forEach(function (n) { self.drop(n, i++); });
    }, { threshold: 0.35 });
    io.observe(this.el);
  };

  /* ---------- Popup ---------- */
  MapView.prototype.find = function (id) {
    for (var i = 0; i < this.items.length; i++) if (String(this.items[i].id) === String(id)) return this.items[i];
    return null;
  };

  MapView.prototype.open = function (id) {
    var p = this.find(id);
    if (!p) return;
    this.active = p.id;
    var meta = '';
    if (p.beds != null) meta += '<li>' + icon('bed') + esc(p.beds) + ' Beds</li>';
    if (p.baths != null) meta += '<li>' + icon('bath') + esc(p.baths) + ' Baths</li>';
    if (p.area) meta += '<li>' + icon('area') + esc(p.area) + '</li>';
    this.popup.innerHTML =
      '<div class="map-popup-media"><img src="' + esc(p.image) + '" alt="">' +
        (p.status ? '<span class="badge ' + (p.status === 'rent' ? 'badge-rent' : 'badge-sale') + '">' + (p.status === 'rent' ? 'For rent' : 'For sale') + '</span>' : '') + '</div>' +
      '<div class="map-popup-body">' +
        '<div class="map-popup-price">' + esc(p.price) + '</div>' +
        '<h3 class="map-popup-title"><a href="' + esc(p.url || '#') + '">' + esc(p.title) + '</a></h3>' +
        '<p class="map-popup-address">' + icon('map-pin') + esc(p.address) + '</p>' +
        (meta ? '<ul class="map-popup-meta">' + meta + '</ul>' : '') +
      '</div>' +
      '<button type="button" class="map-popup-close" aria-label="Close">' + icon('close') + '</button>';
    // Restart the pop-in animation every time a card opens.
    this.popup.classList.remove('is-open');
    void this.popup.offsetWidth;
    this.popup.classList.toggle('is-animated', this.animate);
    this.popup.classList.add('is-open');
    this.render();
    // Keep the pin and popup in view on the real map.
    if (this.gmap) this.gmap.panTo({ lat: p.lat, lng: p.lng });
    var link = this.popup.querySelector('a');
    if (link && !this.el.contains(document.activeElement)) link.focus({ preventScroll: true });
  };

  MapView.prototype.close = function (restoreFocus) {
    if (this.active == null) return;
    var id = this.active;
    this.active = null;
    this.popup.classList.remove('is-open');
    this.render();
    if (restoreFocus) {
      var pin = this.layer.querySelector('.map-pin[data-id="' + id + '"]');
      if (pin) pin.focus();
    }
  };

  MapView.prototype.placePopup = function () {
    if (this.active == null) return;
    var p = this.find(this.active), xy = p && this.project(p);
    if (!xy) return;
    var pop = this.popup, w = this.el.clientWidth, half = pop.offsetWidth / 2;
    // Keep the card inside the map: flip below the pin near the top, slide sideways near the edges.
    var below = xy.y - pop.offsetHeight - 64 < 8;
    var left = Math.min(Math.max(xy.x, half + 8), Math.max(w - half - 8, half + 8));
    pop.classList.toggle('is-below', below);
    pop.style.left = left.toFixed(1) + 'px';
    pop.style.top = xy.y.toFixed(1) + 'px';
    pop.style.setProperty('--arrow-x', (half + xy.x - left).toFixed(1) + 'px');
  };

  /* ---------- Google Maps ---------- */
  MapView.prototype.useGoogle = function () {
    var self = this, c = this.el.getAttribute('data-map-center');
    var center = c ? { lat: parseFloat(c.split(',')[0]), lng: parseFloat(c.split(',')[1]) } : { lat: 0, lng: 0 };
    this.demo = false;
    this.el.classList.remove('is-demo');
    this.el.classList.add('is-google');
    var note = this.el.querySelector('.map-notice');
    if (note) note.remove();

    this.gmap = new google.maps.Map(this.canvas, {
      center: center,
      zoom: parseInt(this.el.getAttribute('data-map-zoom'), 10) || 12,
      disableDefaultUI: true,
      gestureHandling: 'cooperative',
      clickableIcons: false,
      styles: MAP_STYLE
    });

    // A transparent overlay gives us the lat/lng to pixel conversion.
    var proj = new google.maps.OverlayView();
    proj.onAdd = function () {};
    proj.onRemove = function () {};
    proj.draw = function () { self.queue(); };
    proj.setMap(this.gmap);
    this.projector = proj;

    ['bounds_changed', 'zoom_changed', 'drag', 'idle'].forEach(function (ev) {
      self.gmap.addListener(ev, function () { self.queue(); });
    });

    if (this.items.length) {
      var bounds = new google.maps.LatLngBounds();
      this.items.forEach(function (p) { bounds.extend({ lat: p.lat, lng: p.lng }); });
      if (!c) this.gmap.fitBounds(bounds, 64);
    }
  };

  MapView.prototype.zoom = function (d) {
    if (this.gmap) this.gmap.setZoom(this.gmap.getZoom() + d);
  };

  MapView.prototype.zoomToCluster = function (btn) {
    if (!this.gmap) return;
    var ids = btn.getAttribute('data-ids').split(','), self = this;
    var b = new google.maps.LatLngBounds();
    ids.forEach(function (id) { var p = self.find(id); if (p) b.extend({ lat: p.lat, lng: p.lng }); });
    this.gmap.fitBounds(b, 96);
    if (this.gmap.getZoom() > 18) this.gmap.setZoom(18);
  };

  MapView.prototype.toggleFull = function () {
    var on = this.el.classList.toggle('is-fullscreen');
    this.fullBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
    this.fullBtn.innerHTML = icon(on ? 'shrink' : 'expand');
    document.documentElement.style.overflow = on ? 'hidden' : '';
    if (this.gmap) google.maps.event.trigger(this.gmap, 'resize');
    this.queue();
    this.fullBtn.focus();
  };

  /* ---------- Load the Google Maps script once ---------- */
  function loadGoogle() {
    if (googleState === 'ready') return instances.forEach(function (m) { if (!m.gmap) m.useGoogle(); });
    if (googleState !== 'idle') return;
    googleState = 'loading';

    window.__mapViewReady = function () {
      googleState = 'ready';
      instances.forEach(function (m) {
        try { m.useGoogle(); } catch (e) { m.useDemo(); }
      });
    };
    // Google calls this when the key is wrong or not allowed for this site.
    window.gm_authFailure = function () {
      googleState = 'failed';
      instances.forEach(function (m) { m.gmap = null; m.useDemo(); });
    };

    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(instances[0].key) + '&callback=__mapViewReady&loading=async';
    s.async = true;
    s.onerror = function () { googleState = 'failed'; };
    document.head.appendChild(s);
  }

  document.querySelectorAll('[data-property-map]').forEach(function (el) { new MapView(el); });
})();
