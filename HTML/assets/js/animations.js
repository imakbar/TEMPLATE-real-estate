/*!
 * Animations (GSAP + ScrollTrigger)
 * Controlled only by data attributes in the HTML. See documentation.
 * Needs: gsap.min.js and ScrollTrigger.min.js loaded before this file.
 */
(function () {
  'use strict';

  var root = document.documentElement;

  // If GSAP did not load (offline, blocked, removed), show everything normally.
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.add('anim-off');
    return;
  }

  // Register the plugin once.
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  // STEP 2-4 code is added below.

  window.__animReady = true;
})();
