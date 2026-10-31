/*!
 * Animations (GSAP + ScrollTrigger)
 * Controlled only by data attributes in the HTML. Remove an attribute and
 * the effect is gone. Needs gsap.min.js and ScrollTrigger.min.js loaded first.
 *
 *   data-animate="fade-up | fade-in | fade-down | slide-left | slide-right | zoom-in"
 *   data-animate-delay="0.2"      seconds
 *   data-animate-duration="0.8"   seconds
 *   data-animate-stagger="0.1"    on a parent: its direct children animate one by one
 *   data-animate-once="false"     replay every time it scrolls into view (default: once)
 *   data-parallax="0.2"           scroll speed factor (use on its own element)
 *   data-hero / data-hero-item    hero entrance timeline (see below)
 */
(function () {
  'use strict';

  var root = document.documentElement;

  // If GSAP did not load (offline, blocked), show everything normally.
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.add('anim-off');
    return;
  }

  // Register the plugin once.
  gsap.registerPlugin(ScrollTrigger);

  var DEFAULTS = { duration: 0.8, ease: 'power3.out', start: 'top 85%' };

  // Start values for each effect. Only transform and opacity are animated.
  var EFFECTS = {
    'fade-up':     { opacity: 0, y: 40 },
    'fade-down':   { opacity: 0, y: -40 },
    'fade-in':     { opacity: 0 },
    'slide-left':  { opacity: 0, x: -60 },
    'slide-right': { opacity: 0, x: 60 },
    'zoom-in':     { opacity: 0, scale: 0.9 }
  };

  function num(el, attr, fallback) {
    var v = parseFloat(el.getAttribute(attr));
    return isNaN(v) ? fallback : v;
  }

  function effectOf(el, fallback) {
    var name = el.getAttribute('data-animate') || fallback;
    return EFFECTS[name] || EFFECTS[fallback];
  }

  /* ---------- Scroll reveals: [data-animate] and stagger parents ---------- */
  function initReveals() {
    var items = gsap.utils.toArray('[data-animate]');

    items.forEach(function (el) {
      // Children of a stagger parent are animated by the parent.
      if (el.parentElement && el.parentElement.hasAttribute('data-animate-stagger')) return;

      var stagger = parseFloat(el.getAttribute('data-animate-stagger'));
      var hasStagger = el.hasAttribute('data-animate-stagger');
      var targets = hasStagger ? gsap.utils.toArray(el.children) : el;
      if (hasStagger && !targets.length) return;

      var once = el.getAttribute('data-animate-once') !== 'false';
      var from = effectOf(el, 'fade-up');

      var tween = gsap.fromTo(targets, from, {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: num(el, 'data-animate-duration', DEFAULTS.duration),
        delay: num(el, 'data-animate-delay', 0),
        ease: DEFAULTS.ease,
        stagger: hasStagger ? (isNaN(stagger) ? 0.1 : stagger) : 0,
        paused: true,
        overwrite: 'auto',
        onStart: function () { mark(targets, true); },
        onComplete: function () { if (once) finish(targets); else mark(targets, false); },
        onReverseComplete: function () { mark(targets, false); }
      });

      ScrollTrigger.create({
        trigger: el,
        start: DEFAULTS.start,
        once: once,
        onEnter: function () { tween.play(); },
        onEnterBack: function () { if (!once) tween.play(); },
        onLeaveBack: function () { if (!once) tween.reverse(); }
      });
    });
  }

  // While a tween runs, CSS transitions on the element are paused so they
  // do not fight with GSAP (cards have a hover transform transition).
  function mark(targets, on) {
    gsap.utils.toArray(targets).forEach(function (t) { t.classList.toggle('is-animating', on); });
  }

  // After a one-time reveal, give the element back to CSS (hover effects work again).
  function finish(targets) {
    gsap.utils.toArray(targets).forEach(function (t) {
      t.classList.remove('is-animating');
      gsap.set(t, { clearProps: 'transform,willChange' });
      t.style.opacity = '1';
    });
  }

  /* ---------- Parallax: [data-parallax="0.2"] ---------- */
  function initParallax() {
    gsap.utils.toArray('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax'));
      if (!speed) return;
      gsap.fromTo(el,
        { y: function () { return -speed * window.innerHeight * 0.5; } },
        {
          y: function () { return speed * window.innerHeight * 0.5; },
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true
          }
        });
    });
  }

  /* ---------- Hero: [data-hero] with [data-hero-item] children ----------
     Items play in page order (heading, text, buttons...). An item marked
     data-hero-item="image" always plays last. Plays once, on load. */
  function initHero() {
    gsap.utils.toArray('[data-hero]').forEach(function (hero) {
      var items = gsap.utils.toArray(hero.querySelectorAll('[data-hero-item]'));
      if (!items.length) return;
      var text = items.filter(function (el) { return el.getAttribute('data-hero-item') !== 'image'; });
      var images = items.filter(function (el) { return el.getAttribute('data-hero-item') === 'image'; });

      var tl = gsap.timeline({
        defaults: { ease: DEFAULTS.ease, duration: DEFAULTS.duration },
        onComplete: function () { finish(items); }
      });
      mark(items, true);
      text.forEach(function (el, i) {
        tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, i === 0 ? 0.1 : '-=0.55');
      });
      images.forEach(function (el) {
        tl.fromTo(el, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.2 }, '-=0.4');
      });
    });
  }

  /* ---------- Rules: reduced motion, failures, refresh, cleanup ---------- */
  var mm = gsap.matchMedia();

  // Visitors who ask for less motion: no animation, content shows normally.
  mm.add('(prefers-reduced-motion: reduce)', function () {
    root.classList.add('anim-off');
  });

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    root.classList.remove('anim-off');
    try {
      initHero();
      initReveals();
      initParallax();
    } catch (err) {
      // Never leave content hidden if something goes wrong.
      root.classList.add('anim-off');
      if (window.console) console.warn('animations.js:', err);
    }
  });

  window.__animReady = true;

  // Recalculate trigger positions once images are loaded (layout shifts).
  var timer;
  function refreshSoon() {
    clearTimeout(timer);
    timer = setTimeout(function () { ScrollTrigger.refresh(); }, 120);
  }
  window.addEventListener('load', refreshSoon);
  document.addEventListener('load', function (e) {
    if (e.target && e.target.tagName === 'IMG') refreshSoon();
  }, true);

  // Clean up when leaving the page (not when it is kept in the back/forward cache).
  window.addEventListener('pagehide', function (e) {
    if (!e.persisted) {
      mm.revert();
      ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
    }
  });
})();
