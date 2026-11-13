/* index.js — home page: view-transition ink colors, capability filter.
   (The rotating shoe thumbnail lives in site.js.)
   Requires projects.js and site.js. */

// View transition: ink-spill from card into project page.
// Colors come from the shared manifest in projects.js.
(function () {
  var known = {};
  (window.CCD_PROJECTS || []).forEach(function (p) { known[p.href] = true; });
  var inks = [];
  document.querySelectorAll('.work-card').forEach(function (card) {
    if (!known[card.getAttribute('href')]) return;
    // Ink and label colors come from the card's --card-bg / --card-fg
    // (generated into index.html by inject-colors.mjs).
    var inkEl = document.createElement('div');
    inkEl.className = 'work-card__ink-bg';
    inkEl.setAttribute('aria-hidden', 'true');
    card.insertBefore(inkEl, card.firstChild);
    inks.push(inkEl);
    card.addEventListener('click', function (e) {
      // New-tab opens: leave the page's static names in place.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      // The static ink-bg moves from the page to the card so the
      // ink spills out of the card (names must be unique per snapshot).
      var vtBg = document.querySelector('.vt-bg');
      if (vtBg) vtBg.style.viewTransitionName = 'none';
      inkEl.style.opacity = '1';
      inkEl.style.viewTransitionName = 'ink-bg';
    });
  });

  // Coming back with the Back button restores the page as it was left, with
  // the clicked card's ink still switched on and covering its thumbnail.
  // Put everything back the way a fresh load has it.
  window.addEventListener('pageshow', function () {
    inks.forEach(function (inkEl) {
      inkEl.style.opacity = '';
      inkEl.style.viewTransitionName = '';
    });
    var vtBg = document.querySelector('.vt-bg');
    if (vtBg) vtBg.style.viewTransitionName = '';
  });
})();

// ── Capability filter for the home work grid ─────────────────────────────
// A chip shows only the cards tagged with it (data-caps on each card).
// Matching cards are dealt between the two columns alternately so the grid
// stays balanced. With SHOW_REST on, the rest of the work follows under a
// "More work" heading instead. ?cap=<slug> deep-links a filter.
(function () {
  // false: a chip shows only the work that matches it. true: the rest of the
  // work follows under a "More work" heading.
  var SHOW_REST = false;
  var chipRow = document.querySelector('.cap-chips');
  var grid = document.querySelector('.work-grid');
  var rest = document.querySelector('.work-rest');
  var main = document.querySelector('main');
  if (!chipRow || !grid || !rest) return;
  var chips = Array.prototype.slice.call(chipRow.querySelectorAll('.chip'));
  var colL = grid.querySelector('.work-col--left');
  var colR = grid.querySelector('.work-col--right');
  var restL = rest.querySelector('.work-col--left');
  var restR = rest.querySelector('.work-col--right');
  if (!colL || !colR || !restL || !restR || !chips.length) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.work-card'));
  var home = cards.map(function (el) {
    return { el: el, parent: el.parentNode, order: parseFloat(getComputedStyle(el).order) || 0 };
  });
  var reduce = CCD.prefersReducedMotion;
  var busy = false;

  function matches(h, cap) {
    return (h.el.getAttribute('data-caps') || '').split(' ').indexOf(cap) !== -1;
  }

  function deal(list, left, right) {
    list.sort(function (a, b) { return a.order - b.order; });
    list.forEach(function (h, i) { (i % 2 === 0 ? left : right).appendChild(h.el); });
  }

  function apply(cap) {
    var vis = cap === 'all' ? [] : home.filter(function (h) { return matches(h, cap); });
    if (!vis.length) {
      home.forEach(function (h) { h.parent.appendChild(h.el); });
      rest.hidden = true;
      grid.classList.remove('has-rest');
    } else {
      var others = home.filter(function (h) { return vis.indexOf(h) === -1; });
      deal(vis, colL, colR);
      deal(others, restL, restR);
      // Non-matches are parked in the (hidden) second grid so "All" can
      // restore them; with SHOW_REST off they never appear.
      var showRest = SHOW_REST && others.length > 0;
      rest.hidden = !showRest;
      grid.classList.toggle('has-rest', showRest);
    }
    // Moving a playing video in the DOM pauses it
    if (!reduce && !CCD.motionPaused) {
      document.querySelectorAll('video[data-motion-thumb]').forEach(function (v) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      });
    }
  }

  function markActive(cap) {
    var activeChip = null;
    chips.forEach(function (ch) {
      var on = ch.getAttribute('data-cap') === cap;
      ch.classList.toggle('is-active', on);
      if (on) { ch.setAttribute('aria-current', 'true'); activeChip = ch; }
      else ch.removeAttribute('aria-current');
    });
    return activeChip;
  }

  // Keep the active chip visible in the scrollable row
  function revealChip(chip, instant) {
    if (!chip) return;
    var left = chip.offsetLeft - (chipRow.clientWidth - chip.offsetWidth) / 2;
    left = Math.max(0, left);
    try {
      chipRow.scrollTo({ left: left, behavior: (instant || reduce) ? 'auto' : 'smooth' });
    } catch (err) {
      chipRow.scrollLeft = left;
    }
  }

  // A filter picked from the pinned bar, deep in the page: bring the top of
  // the results back into view (just below the nav and the chips).
  function revealResults() {
    var nav = document.querySelector('nav');
    var bar = document.querySelector('.cap-chips-bar');
    var clear = (nav ? nav.offsetHeight : 0) + (bar ? bar.offsetHeight : 0);
    var top = grid.getBoundingClientRect().top;
    if (top >= 0) return;
    try {
      window.scrollTo({ top: window.scrollY + top - clear, behavior: reduce ? 'auto' : 'smooth' });
    } catch (err) {
      window.scrollTo(0, window.scrollY + top - clear);
    }
  }

  function setFilter(cap) {
    if (busy) return;
    revealChip(markActive(cap));
    var url = cap === 'all' ? location.pathname : location.pathname + '?cap=' + cap;
    history.replaceState(null, '', url);
    if (reduce) { apply(cap); revealResults(); return; }
    busy = true;
    main.classList.add('is-filtering');
    setTimeout(function () {
      apply(cap);
      revealResults();
      cards.forEach(function (c) { c.style.transitionDelay = ''; });
      // Stagger the matches in; the rest follow together
      var shown = Array.prototype.slice.call(grid.querySelectorAll('.work-card'));
      shown.forEach(function (c, i) { c.style.transitionDelay = Math.min(i * 45, 360) + 'ms'; });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          main.classList.remove('is-filtering');
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

  // Mouse wheel scrolls the chip row horizontally (touch scrolls natively)
  chipRow.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
    if (chipRow.scrollWidth <= chipRow.clientWidth) return;
    e.preventDefault();
    chipRow.scrollLeft += e.deltaY;
  }, { passive: false });

  // Deep link: /?cap=illustration (applied instantly, no exit animation)
  var q = new URLSearchParams(location.search).get('cap');
  if (q && q !== 'all' && chips.some(function (c) { return c.getAttribute('data-cap') === q; })) {
    apply(q);
    revealChip(markActive(q), true);
  }
})();

// ── Chip row peek ────────────────────────────────────────────────────────
// A row that scrolls needs a visible hint that it does. Where the row runs
// out of room, the right clip edge is moved so the chip it lands on is cut
// between 30% and 70% of the way across: the nearest spot to the page margin
// that does it. Nothing moves if every chip already fits.
(function () {
  var row = document.querySelector('.cap-chips');
  if (!row) return;
  var chips = Array.prototype.slice.call(row.querySelectorAll('.chip'));
  if (chips.length < 2) return;
  var MIN = 0.3, MAX = 0.7;
  var raf = 0;

  function tune() {
    raf = 0;
    row.style.removeProperty('--chip-inset');
    var width = row.clientWidth;
    var margin = parseFloat(getComputedStyle(row).paddingLeft) || 0;
    var edge = width - margin;                 // where the clip falls by default
    var last = chips[chips.length - 1];
    if (last.offsetLeft + last.offsetWidth <= edge) return;   // all chips fit

    var best = edge, bestGap = Infinity;
    for (var i = 1; i < chips.length; i++) {
      var left = chips[i].offsetLeft, w = chips[i].offsetWidth;
      var cut = Math.min(Math.max(edge, left + MIN * w), left + MAX * w);
      var gap = Math.abs(cut - edge);
      if (gap < bestGap) { bestGap = gap; best = cut; }
    }
    row.style.setProperty('--chip-inset', Math.max(0, width - best).toFixed(1) + 'px');
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(tune); }
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  tune();
})();

// ── Chips bar mirrors the nav: hide on scroll down, return on scroll up ──
// The bar scrolls away in flow with the headline. It only swaps to
// position:fixed (a spacer preserves layout) once its in-flow spot is fully
// off screen, and only swaps back when that spot has returned to exactly
// where the pinned bar sits, below the nav. Both swaps are invisible, and
// the gap between the two thresholds means scroll jitter can't flip it.
(function () {
  var bar = document.querySelector('.cap-chips-bar');
  var nav = document.querySelector('nav');
  if (!bar || !nav) return;
  var spacer = null;
  var lastY = window.scrollY;
  function fix() {
    spacer = document.createElement('div');
    spacer.style.height = bar.offsetHeight + 'px';
    bar.parentNode.insertBefore(spacer, bar);
    bar.classList.add('cap-chips-bar--fixed');
  }
  function unfix() {
    bar.classList.remove('cap-chips-bar--fixed', 'cap-chips-bar--shown');
    spacer.parentNode.removeChild(spacer);
    spacer = null;
  }
  function update() {
    var y = window.scrollY;
    var dy = y - lastY;
    lastY = y;
    var top = (spacer || bar).getBoundingClientRect().top;   // in-flow spot, relative to the viewport
    if (!spacer) {
      if (top + bar.offsetHeight < 0) fix();   // off screen: pin it, still hidden
      return;
    }
    if (top >= nav.offsetHeight) { unfix(); return; }
    if (dy) bar.classList.toggle('cap-chips-bar--shown', dy < 0);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// Motion thumbnail: hold on the poster frame when the user prefers reduced motion
if (CCD.prefersReducedMotion) {
  document.querySelectorAll('video[data-motion-thumb]').forEach(function (v) {
    v.removeAttribute('autoplay');
    v.pause();
  });
}
