/* site.js — shared behaviors for every page.
   Each module null-checks its own DOM so one file serves all page types. */

var CCD = window.CCD || (window.CCD = {});

CCD.prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lottie loader shared by page scripts and [data-lottie] containers.
// Honors reduced-motion: renders first frame, no autoplay/loop.
CCD.loadLottie = function (el, path, opts) {
  if (!el || typeof lottie === 'undefined') return null;
  opts = opts || {};
  return lottie.loadAnimation({
    container: el,
    renderer: 'svg',
    loop: !CCD.prefersReducedMotion,
    autoplay: !CCD.prefersReducedMotion,
    path: path,
    rendererSettings: opts.slice
      ? { preserveAspectRatio: 'xMidYMid slice', progressiveLoad: true }
      : undefined
  });
};

// Declarative lotties: <div data-lottie="animations/foo.json" data-lottie-slice>
document.querySelectorAll('[data-lottie]').forEach(function (el) {
  CCD.loadLottie(el, el.getAttribute('data-lottie'), {
    slice: el.hasAttribute('data-lottie-slice')
  });
});

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

// On Next Project click: swap ink-bg/page-title from incoming elements to outgoing elements
(function () {
  var nextLink = document.querySelector('.next-project-title');
  if (!nextLink || nextLink.getAttribute('href') === '#') return;
  nextLink.addEventListener('click', function (e) {
    // Skip view-transition setup for new-tab opens (middle/cmd/ctrl-click).
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var vtBg = document.querySelector('.vt-bg');
    var nextBg = document.querySelector('.next-project-bg');
    var projTitle = document.querySelector('.project-title');
    if (vtBg)      vtBg.style.viewTransitionName = '';
    if (nextBg)    nextBg.style.viewTransitionName = 'ink-bg';
    if (projTitle) projTitle.style.viewTransitionName = '';
    nextLink.style.viewTransitionName = 'page-title';
  });
})();

// Hero parallax: shrink padding + radius on scroll
(function () {
  var hero = document.querySelector('.hero-image');
  var heroImg = hero && hero.querySelector('img, video');
  if (!hero || !heroImg) return;
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
  var DURATION = 36; // must match CSS marquee animation duration (seconds)
  var wrapper = document.querySelector('.carousel-wrapper');
  var track = document.querySelector('.carousel-track');
  if (!wrapper || !track) return;

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
    var x = getTranslateX();
    var half = track.scrollWidth / 2;
    var progress = Math.abs(x) / half;
    track.style.transform = '';
    track.style.animation = 'marquee ' + DURATION + 's linear infinite';
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

// Card overlay: tap-to-reveal on touch devices.
// Delegated so it also covers cards rendered after load (capabilities grid).
(function () {
  var SELECTOR = '.work-card, .project-card';
  function clearAll(except) {
    document.querySelectorAll(SELECTOR).forEach(function (c) {
      if (c !== except) c.classList.remove('is-active');
    });
  }
  document.addEventListener('touchend', function (e) {
    var card = e.target.closest(SELECTOR);
    if (!card) { clearAll(null); return; }
    var isActive = card.classList.contains('is-active');
    clearAll(card);
    if (isActive) {
      card.classList.remove('is-active');
    } else {
      e.preventDefault(); // prevent immediate navigation on first tap
      card.classList.add('is-active');
    }
  }, { passive: false });
})();
