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
