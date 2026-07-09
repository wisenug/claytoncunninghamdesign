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

// ── Capability filter for the home work grid ─────────────────────────────
// Chips filter the cards in place. Filtered cards are redistributed
// between the two columns (alternating by their narrative order) so the
// grid stays balanced. ?cap=<slug> deep-links a filter.
(function () {
  var chipRow = document.querySelector('.cap-chips');
  var grid = document.querySelector('.work-grid');
  if (!chipRow || !grid) return;
  var chips = Array.prototype.slice.call(chipRow.querySelectorAll('.chip'));
  var colL = grid.querySelector('.work-col--left');
  var colR = grid.querySelector('.work-col--right');
  if (!colL || !colR || !chips.length) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.work-card'));
  var home = cards.map(function (el) {
    return { el: el, parent: el.parentNode, order: parseFloat(getComputedStyle(el).order) || 0 };
  });
  var reduce = CCD.prefersReducedMotion;
  var busy = false;

  function matches(h, cap) {
    return (h.el.getAttribute('data-caps') || '').split(' ').indexOf(cap) !== -1;
  }

  function apply(cap) {
    if (cap === 'all') {
      home.forEach(function (h) { h.el.hidden = false; h.parent.appendChild(h.el); });
      return;
    }
    var vis = home.filter(function (h) { return matches(h, cap); });
    vis.sort(function (a, b) { return a.order - b.order; });
    vis.forEach(function (h, i) {
      h.el.hidden = false;
      (i % 2 === 0 ? colL : colR).appendChild(h.el);
    });
    home.forEach(function (h) { if (vis.indexOf(h) === -1) h.el.hidden = true; });
  }

  function markActive(cap) {
    chips.forEach(function (ch) {
      var on = ch.getAttribute('data-cap') === cap;
      ch.classList.toggle('is-active', on);
      if (on) ch.setAttribute('aria-current', 'true');
      else ch.removeAttribute('aria-current');
    });
  }

  function setFilter(cap) {
    if (busy) return;
    markActive(cap);
    var url = cap === 'all' ? location.pathname : location.pathname + '?cap=' + cap;
    history.replaceState(null, '', url);
    if (reduce) { apply(cap); return; }
    busy = true;
    grid.classList.add('is-filtering');
    setTimeout(function () {
      apply(cap);
      var shown = cards.filter(function (c) { return !c.hidden; });
      shown.forEach(function (c, i) { c.style.transitionDelay = Math.min(i * 45, 360) + 'ms'; });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          grid.classList.remove('is-filtering');
          setTimeout(function () {
            shown.forEach(function (c) { c.style.transitionDelay = ''; });
            busy = false;
          }, 750);
        });
      });
    }, 230);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function (e) {
      e.preventDefault();
      setFilter(chip.getAttribute('data-cap') || 'all');
    });
  });

  // Deep link: /?cap=illustration (applied instantly, no exit animation)
  var q = new URLSearchParams(location.search).get('cap');
  if (q && q !== 'all' && chips.some(function (c) { return c.getAttribute('data-cap') === q; })) {
    apply(q);
    markActive(q);
  }
})();
