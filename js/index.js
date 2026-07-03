/* index.js — home page: view-transition ink colors + rotating shoe thumbnail.
   Requires projects.js and site.js. */

// View transition: ink-spill from card into project page.
// Colors come from the shared manifest in projects.js.
(function () {
  var colorsByHref = {};
  (window.CCD_PROJECTS || []).forEach(function (p) {
    colorsByHref[p.href] = [p.bgColor, p.fgColor];
  });
  document.querySelectorAll('.work-card').forEach(function (card) {
    var colors = colorsByHref[card.getAttribute('href')];
    if (!colors) return;
    var bg = colors[0], fg = colors[1];
    var inkEl = document.createElement('div');
    inkEl.className = 'work-card__ink-bg';
    inkEl.setAttribute('aria-hidden', 'true');
    inkEl.style.background = bg;
    card.insertBefore(inkEl, card.firstChild);
    var labelEl = card.querySelector('.work-card__label');
    labelEl.style.background = bg;
    labelEl.style.color = fg;
    card.addEventListener('click', function () {
      inkEl.style.opacity = '1';
      inkEl.style.viewTransitionName = 'ink-bg';
      labelEl.style.viewTransitionName = 'page-title';
    });
  });
})();

// Rotating shoe thumbnail for "Just for funsies" card.
// Defers the 36-frame preload + spin until the card nears the viewport,
// so the home page doesn't fetch 36 webps that may never be seen.
// Skip auto-spinning rotation thumbnails when the user prefers reduced motion
if (!CCD.prefersReducedMotion) {
  document.querySelectorAll('.rotation-thumb').forEach(function (img) {
    var prefix = img.dataset.rotationPrefix;
    var total  = parseInt(img.dataset.rotationTotal, 10);
    if (!prefix || !total) return;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var idx = 1;
    var interval = null;
    var preloaded = false;
    var visible = false;
    var preloadRefs = []; // hold references so the browser can't GC mid-load
    function preload() {
      if (preloaded) return;
      preloaded = true;
      for (var i = 1; i <= total; i++) {
        var pre = new Image();
        pre.src = prefix + pad(i) + '.webp';
        preloadRefs.push(pre);
      }
    }
    function step() {
      if (document.hidden) return;
      idx = (idx % total) + 1;
      img.src = prefix + pad(idx) + '.webp';
    }
    function start() { if (!interval && visible) interval = setInterval(step, 3375 / total); }
    function stop()  { if (interval) { clearInterval(interval); interval = null; } }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        visible = e.isIntersecting;
        if (visible) { preload(); start(); } else { stop(); }
      });
    }, { rootMargin: '200px' }).observe(img);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  });
}
