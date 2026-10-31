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
