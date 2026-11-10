/* site.js — shared behaviors for every page.
   Each module null-checks its own DOM so one file serves all page types. */

var CCD = window.CCD || (window.CCD = {});

CCD.prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Set by the pause button (see "Motion pause" below). Page scripts that run
// their own timers check this before each step.
CCD.motionPaused = false;
CCD.lotties = [];

// The Lottie player is fetched on demand, the first time an animation needs
// it, so it never blocks first paint (it used to sit in <head> on six pages).
// It's a custom build, see tools/lottie/. stamp-assets.mjs keeps the ?v= current.
CCD.lottieSrc = 'js/vendor/lottie.ccd.min.js?v=94b9b4862c';
CCD.lottieReady = null;
CCD.whenLottie = function () {
  if (typeof lottie !== 'undefined') return Promise.resolve();
  if (!CCD.lottieReady) {
    CCD.lottieReady = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = CCD.lottieSrc;
      s.onload = resolve;
      s.onerror = function () { CCD.lottieReady = null; reject(new Error('Lottie player failed to load')); };
      document.head.appendChild(s);
    });
  }
  return CCD.lottieReady;
};

// Lottie loader shared by page scripts and [data-lottie] containers.
// Returns a promise for the animation instance (null if there is no element).
// Honors reduced-motion: renders first frame, no autoplay/loop.
CCD.loadLottie = function (el, path, opts) {
  if (!el) return Promise.resolve(null);
  opts = opts || {};
  return CCD.whenLottie().then(function () {
    var anim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: !CCD.prefersReducedMotion,
      autoplay: !CCD.prefersReducedMotion && !CCD.motionPaused,
      path: path,
      rendererSettings: opts.slice
        ? { preserveAspectRatio: 'xMidYMid slice', progressiveLoad: true }
        : undefined
    });
    CCD.lotties.push(anim);
    return anim;
  });
};

// Declarative lotties: <div data-lottie="animations/foo.json" data-lottie-slice>
// Deferred until the container nears the viewport so a page with several
// animations doesn't parse them all at load (elements already in view
// initialize immediately).
// Optional data-lottie-delay="600" (ms) offsets when a specific instance
// starts, so animations that land in view together don't play in lockstep.
(function () {
  var els = document.querySelectorAll('[data-lottie]');
  if (!els.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      observer.unobserve(el);
      var start = function () {
        CCD.loadLottie(el, el.getAttribute('data-lottie'), {
          slice: el.hasAttribute('data-lottie-slice')
        }).catch(function () { /* player failed to load: leave the block empty */ });
      };
      var delay = parseInt(el.getAttribute('data-lottie-delay'), 10) || 0;
      if (delay > 0 && !CCD.prefersReducedMotion) {
        setTimeout(start, delay);
      } else {
        start();
      }
    });
  }, { rootMargin: '300px' });
  els.forEach(function (el) { observer.observe(el); });
})();

// Motion pause: <button class="pause-toggle" data-motion-toggle hidden>
// One button stops everything that moves by itself on the page: the
// carousel, Lotties, autoplaying video, and any page script that checks
// CCD.motionPaused. It stays hidden under reduced motion, where none of
// those run in the first place.
(function () {
  var btn = document.querySelector('[data-motion-toggle]');
  if (!btn || CCD.prefersReducedMotion) return;
  btn.hidden = false;
  btn.addEventListener('click', function () {
    var paused = CCD.motionPaused = !CCD.motionPaused;
    document.documentElement.classList.toggle('motion-paused', paused);
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'Play animations' : 'Pause animations');
    if (btn.hasAttribute('title')) btn.title = btn.getAttribute('aria-label');
    CCD.lotties.forEach(function (anim) { if (paused) anim.pause(); else anim.play(); });
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      if (paused) v.pause();
      else v.play().catch(function () { /* autoplay refused: leave it on its current frame */ });
    });
  });
})();

// Hide nav on scroll down, reveal on scroll up
(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;
  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (y > lastY && y > 80) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }
    lastY = y;
  }, { passive: true });
})();

// Footer year
(function () {
  var year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();
})();

// Skip view transition on back/forward navigation
window.addEventListener('pagereveal', function (e) {
  if (e.viewTransition && navigation?.activation?.navigationType === 'traverse') {
    e.viewTransition.skipTransition();
  }
});

// Scroll reveal
(function () {
  var els = document.querySelectorAll('.text-section, .intro-text, .assumption, .pain-points, .image-note, .update-notice');
  if (!els.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(function (el) { observer.observe(el); });
})();

// On Next Project click: swap ink-bg from the page to the outgoing link
(function () {
  var nextLink = document.querySelector('.next-project-title');
  if (!nextLink || nextLink.getAttribute('href') === '#') return;
  nextLink.addEventListener('click', function (e) {
    // Skip view-transition setup for new-tab opens (middle/cmd/ctrl-click).
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var vtBg = document.querySelector('.vt-bg');
    var nextBg = document.querySelector('.next-project-bg');
    if (vtBg)   vtBg.style.viewTransitionName = '';
    if (nextBg) nextBg.style.viewTransitionName = 'ink-bg';
  });
})();

// Hero parallax: shrink padding + radius on scroll
(function () {
  var hero = document.querySelector('.hero-image');
  var heroImg = hero && hero.querySelector('img, video');
  if (!hero || !heroImg || CCD.prefersReducedMotion) return;
  var basePad = parseFloat(getComputedStyle(hero).paddingLeft);
  var raf = 0;
  function updateHero() {
    raf = 0;
    var p = Math.min(1, Math.max(0, window.scrollY / 400));
    var pad = (basePad * (1 - p)).toFixed(3);
    var rad = (0.8 * (1 - p)).toFixed(3);
    hero.style.paddingLeft  = pad + 'px';
    hero.style.paddingRight = pad + 'px';
    heroImg.style.borderRadius = rad + 'rem';
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(updateHero); }
  window.addEventListener('scroll', schedule, { passive: true });
  // Re-capture basePad on resize — --page-margin changes with viewport width.
  window.addEventListener('resize', function () {
    hero.style.paddingLeft = '';
    hero.style.paddingRight = '';
    basePad = parseFloat(getComputedStyle(hero).paddingLeft);
    schedule();
  }, { passive: true });
  updateHero();
})();

// Carousel: drag to scroll while keeping continuous auto-scroll
(function () {
  var wrapper = document.querySelector('.carousel-wrapper');
  var track = document.querySelector('.carousel-track');
  if (!wrapper || !track) return;
  // Speed lives in styles.css (.carousel-track animation); read it from there.
  var DURATION = parseFloat(getComputedStyle(track).animationDuration) || 36;

  var isDragging = false;
  var startX = 0;
  var startTranslateX = 0;

  function getTranslateX() {
    var matrix = new DOMMatrix(getComputedStyle(track).transform);
    return matrix.m41;
  }

  function startDrag(x) {
    isDragging = true;
    startX = x;
    startTranslateX = getTranslateX();
    track.style.animation = 'none';
    track.style.transform = 'translateX(' + startTranslateX + 'px)';
    wrapper.classList.add('is-dragging');
  }

  function moveDrag(x) {
    if (!isDragging) return;
    var dx = x - startX;
    var newX = startTranslateX + dx;
    var half = track.scrollWidth / 2;
    if (newX > 0) newX -= half;
    if (newX < -half) newX += half;
    track.style.transform = 'translateX(' + newX + 'px)';
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('is-dragging');
    // Reduced motion: leave the track where it was dropped (the CSS marquee
    // is off, so there is nothing to resume).
    if (CCD.prefersReducedMotion) return;
    var x = getTranslateX();
    var half = track.scrollWidth / 2;
    var progress = Math.abs(x) / half;
    track.style.transform = '';
    track.style.animation = ''; // hand the animation back to styles.css
    track.style.animationDelay = '-' + (progress * DURATION).toFixed(3) + 's';
  }

  wrapper.addEventListener('mousedown', function (e) { startDrag(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', function (e) { moveDrag(e.clientX); });
  window.addEventListener('mouseup', endDrag);
  wrapper.addEventListener('touchstart', function (e) { startDrag(e.touches[0].clientX); }, { passive: true });
  wrapper.addEventListener('touchmove', function (e) { moveDrag(e.touches[0].clientX); e.preventDefault(); }, { passive: false });
  wrapper.addEventListener('touchend', endDrag);
})();

// Capabilities accordion: <button data-accordion="section-id">
(function () {
  document.querySelectorAll('[data-accordion]').forEach(function (trigger) {
    var section = document.getElementById(trigger.getAttribute('data-accordion'));
    if (!section) return;

    function toggle() {
      var open = section.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        // Wait a tick for max-height transition to start, then scroll section into view
        requestAnimationFrame(function () {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }

    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();

// Re-land on a URL's #hash target after late layout shifts (lazy images,
// data-lottie containers) settle — the browser's own hash-jump fires before
// that content finishes sizing itself in and can land short.
(function () {
  if (!location.hash) return;
  var id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
  var target = document.getElementById(id);
  if (!target) return;
  window.addEventListener('load', function () {
    setTimeout(function () { target.scrollIntoView(); }, 300);
  });
})();

// Image skeletons: images still downloading get .is-loading (shimmer in
// styles.css), removed on load or error so transparent images aren't left
// with a tinted background.
(function () {
  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete) return;
    img.classList.add('is-loading');
    var done = function () { img.classList.remove('is-loading'); };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
})();
