/*!
 * Real Estate Template: small behaviors shared by every page.
 * No dependencies besides Bootstrap's own JS. Each block is independent;
 * delete the ones you do not use.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* 1. Sticky header: adds .is-scrolled after the page moves down ------ */
    var header = document.querySelector('.site-header[data-sticky]');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* 2. Favorite buttons: toggles aria-pressed -------------------------- */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-favorite');
      if (!btn) return;
      e.preventDefault();
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Remove from favorites' : 'Save to favorites');
    });

    /* 3. Gallery thumbnails: <div data-gallery> main + [data-thumb] ------ */
    document.querySelectorAll('[data-gallery]').forEach(function (g) {
      var main = g.querySelector('[data-gallery-main]');
      g.querySelectorAll('[data-thumb]').forEach(function (t) {
        t.addEventListener('click', function () {
          if (main) { main.src = t.getAttribute('data-thumb'); main.alt = t.getAttribute('data-alt') || main.alt; }
          g.querySelectorAll('[data-thumb]').forEach(function (o) { o.setAttribute('aria-current', 'false'); });
          t.setAttribute('aria-current', 'true');
        });
      });
    });

    /* 3b. Lightbox: [data-gallery-index] on a photo jumps the carousel inside the modal */
    document.querySelectorAll('[data-gallery-index]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = document.querySelector(btn.getAttribute('data-bs-target'));
        var car = modal && modal.querySelector('.carousel');
        if (car && window.bootstrap) window.bootstrap.Carousel.getOrCreateInstance(car, { ride: false }).to(Number(btn.getAttribute('data-gallery-index')));
      });
    });

    /* 4. Textarea character counter: data-counter="#id" ------------------ */
    document.querySelectorAll('textarea[data-counter]').forEach(function (ta) {
      var out = document.querySelector(ta.getAttribute('data-counter'));
      if (!out) return;
      var max = ta.getAttribute('maxlength');
      var update = function () { out.textContent = ta.value.length + (max ? ' / ' + max : ''); };
      ta.addEventListener('input', update);
      update();
    });

    /* 5. Indeterminate checkboxes: data-indeterminate -------------------- */
    document.querySelectorAll('input[type="checkbox"][data-indeterminate]').forEach(function (c) {
      c.indeterminate = true;
      c.addEventListener('change', function () { c.indeterminate = false; });
    });

    /* 6. Grid / list view switch: [data-view-toggle] controls [data-view-target] */
    document.querySelectorAll('[data-view-toggle]').forEach(function (group) {
      var target = document.querySelector(group.getAttribute('data-view-toggle'));
      if (!target) return;
      group.querySelectorAll('[data-view]').forEach(function (b) {
        b.addEventListener('click', function () {
          target.setAttribute('data-view', b.getAttribute('data-view'));
          group.querySelectorAll('[data-view]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        });
      });
    });

    /* 8. Toasts: <button data-toast="#id"> shows a Bootstrap toast */
    document.querySelectorAll('[data-toast]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = document.querySelector(b.getAttribute('data-toast'));
        if (t && window.bootstrap) window.bootstrap.Toast.getOrCreateInstance(t).show();
      });
    });

    /* 9. Back to top button: .back-to-top */
    var top = document.querySelector('.back-to-top');
    if (top) {
      var show = function () { top.classList.toggle('is-visible', window.scrollY > 400); };
      show();
      window.addEventListener('scroll', show, { passive: true });
      top.addEventListener('click', function () {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
    }

    /* 10. Show / hide password: <button data-toggle-password="#id"> */
    document.querySelectorAll('[data-toggle-password]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = document.querySelector(b.getAttribute('data-toggle-password'));
        if (!f) return;
        var show = f.type === 'password';
        f.type = show ? 'text' : 'password';
        b.setAttribute('aria-pressed', show ? 'true' : 'false');
        b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });

    /* 11. Multi-step form: [data-steps] with .stepper, [data-step-panel], [data-step-next], [data-step-prev] */
    document.querySelectorAll('[data-steps]').forEach(function (root) {
      var panels = root.querySelectorAll('[data-step-panel]');
      var items = root.querySelectorAll('.stepper li');
      var cur = 0;
      function go(n) {
        cur = Math.max(0, Math.min(panels.length - 1, n));
        panels.forEach(function (p, i) { p.hidden = i !== cur; });
        items.forEach(function (li, i) {
          li.classList.toggle('is-done', i < cur);
          li.classList.toggle('is-active', i === cur);
          if (i === cur) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
        });
        var h = panels[cur].querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: false }); }
      }
      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-step-next]')) go(cur + 1);
        else if (e.target.closest('[data-step-prev]')) go(cur - 1);
      });
      go(0);
    });

    /* 12. Removable items: [data-remove] inside [data-removable]; shows [data-empty] when none are left */
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-remove]');
      if (!b) return;
      var item = b.closest('[data-removable]');
      if (!item) return;
      var list = item.parentElement;
      item.remove();
      var root = document.querySelector('[data-removable-root]');
      if (root && !root.querySelector('[data-removable]')) {
        var empty = document.querySelector('[data-empty]');
        if (empty) empty.hidden = false;
        root.hidden = true;
      }
    });

    /* 7. Range slider output: <input type=range data-output="#id"> ------- */
    document.querySelectorAll('input[type="range"][data-output]').forEach(function (r) {
      var out = document.querySelector(r.getAttribute('data-output'));
      if (!out) return;
      var fmt = r.getAttribute('data-prefix') || '';
      var update = function () { out.textContent = fmt + Number(r.value).toLocaleString('en-US'); };
      r.addEventListener('input', update);
      update();
    });
  });
})();
