/* about.js — logo field above the footer. Requires site.js. */

// Logo field: a scatter of logos above the footer. They hover in place with
// a faint wobble, dodge the cursor,
// wobble back into place on springs, and the one you click or tap flips.
(function () {
  var field = document.getElementById('logo-field');
  if (!field) return;

  var NS = 'http://www.w3.org/2000/svg';
  var MARKS = [
    'M12.492 40C12.492 25.862 23.158 14.215 36.882 12.667V6.4C19.707 7.972 6.256 22.415 6.256 40s13.451 32.028 30.624 33.6v-6.267C23.158 65.785 12.492 54.138 12.492 40Z',
    'M24.964 40c0-7.235 5.11-13.275 11.92-14.711v-6.334C26.612 20.464 18.728 29.311 18.728 40s7.884 19.536 18.152 21.045v-6.334C30.074 53.275 24.964 47.235 24.964 40Z',
    'M43.105 6.4A33.744 33.744 0 0 1 43.105 73.6ZM49.339 65.882A27.51 27.51 0 0 0 49.339 14.122Z'
  ];

  var SPRING      = 0.045;  // pull back toward home
  var DAMPING     = 0.82;   // velocity kept per frame (lower = less wobble)
  var REPEL       = 95;     // cursor reach, px
  var PUSH        = 1.4;     // cursor strength
  var ROT_SPRING  = 0.08;
  var ROT_DAMPING = 0.88;
  var BLAST       = 150;    // click reach, px
  var BLAST_KICK  = 6; 
  var DRIFT       = 2.4;    // idle wobble, px either way
  var DRIFT_ROT   = 2.5;    // idle wobble, degrees either way


  var logos = [];
  var pointer = { x: 0, y: 0, active: false };
  var raf = null, last = 0, builtWidth = 0, fieldW = 0, fieldH = 0;
  var visible = false, clock = 0;

  // Small seeded generator so the layout is the same on every visit
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeLogo(size) {
    var el = document.createElement('div');
    el.className = 'logo-field-item';
    el.style.width = el.style.height = size + 'px';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 80 80');
    var disc = document.createElementNS(NS, 'circle');
    disc.setAttribute('cx', 40); disc.setAttribute('cy', 40); disc.setAttribute('r', 40);
    disc.setAttribute('class', 'logo-field-disc');
    svg.appendChild(disc);
    MARKS.forEach(function (d) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill-rule', 'evenodd');
      p.setAttribute('class', 'logo-field-mark');
      svg.appendChild(p);
    });
    el.appendChild(svg);
    return el;
  }

  function place(l) {
    l.el.style.transform =
      'translate3d(' + (l.hx + l.x + l.ax - l.r).toFixed(2) + 'px,' + (l.hy + l.y + l.ay - l.r).toFixed(2) + 'px,0)' +
      ' rotate(' + (l.rot + l.ar).toFixed(2) + 'deg)';
  }

  function build() {
    var w = field.clientWidth, h = field.clientHeight;
    if (!w || !h) return;
    builtWidth = fieldW = w;
    fieldH = h;
    field.textContent = '';
    logos = [];

    var rand = rng(9);
    var scale = w > 700 ? 1.2 : 1;
    var count = Math.round((w * h) / 100000 * 14);

    // A spread of sizes, weighted toward the small end, placed biggest first
    var sizes = [];
    for (var s = 0; s < count; s++) {
      sizes.push(Math.round((28 + 68 * Math.pow(rand(), 1.7)) * scale));
    }
    sizes.sort(function (a, b) { return b - a; });

    // Best-candidate placement: each logo tries a batch of random spots and
    // keeps the one with the most room, so the scatter stays loose and even.
    // Logos of a similar size also keep their distance from each other,
    // which stops the little ones from bunching up.
    sizes.forEach(function (size) {
      var r = size / 2;
      var best = null, bestScore = 10;   // minimum gap between any two logos
      for (var tries = 0; tries < 60; tries++) {
        var x = r + rand() * (w - size);
        var y = r + rand() * (h - size);
        var score = Infinity;
        for (var i = 0; i < logos.length; i++) {
          var o = logos[i];
          var dx = o.hx - x, dy = o.hy - y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var gap = dist - o.r - r;
          if (o.r < r * 1.35) gap = Math.min(gap, dist * 0.45 - r);
          if (gap < score) score = gap;
        }
        if (score > bestScore) { bestScore = score; best = { x: x, y: y }; }
      }
      if (!best) return;
      var l = {
        el: null, r: r, hx: best.x, hy: best.y,
        x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0,
        ax: 0, ay: 0, ar: 0,                      // idle wobble offsets
        p1: rand() * 6.283, p2: rand() * 6.283, p3: rand() * 6.283,
        speed: 0.8 + rand() * 0.6,
        dir: rand() < 0.5 ? -1 : 1
      };
      logos.push(l);
    });

    // Here and there, let a logo swell into the empty space around it
    logos.forEach(function (l) {
      if (rand() > 0.3) return;
      var room = Math.min(l.hx, w - l.hx, l.hy, h - l.hy);
      logos.forEach(function (o) {
        if (o === l) return;
        var dx = o.hx - l.hx, dy = o.hy - l.hy;
        room = Math.min(room, Math.sqrt(dx * dx + dy * dy) - o.r - 10);
      });
      l.r = Math.max(l.r, Math.min(room, l.r * 1.7, 70 * scale));
    });

    logos.forEach(function (l) {
      l.el = makeLogo(Math.round(l.r * 2));
      // Fade out toward the top so the field rises out of the page
      var t = l.hy / h;
      l.el.style.opacity = (0.06 + 0.94 * t * t * (3 - 2 * t)).toFixed(3);
      place(l);
      field.appendChild(l.el);
    });
  }

  build();

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (field.clientWidth !== builtWidth) build();
    }, 150);
  });

  if (CCD.prefersReducedMotion) return;

  function tick(now) {
    raf = null;
    if (CCD.motionPaused) { last = 0; return; }
    var dt = last ? Math.min((now - last) / 16.667, 2.5) : 1;
    last = now;
    clock += dt / 60;

    var rect = field.getBoundingClientRect();
    var mx = pointer.x - rect.left, my = pointer.y - rect.top;
    var damp = Math.pow(DAMPING, dt), rotDamp = Math.pow(ROT_DAMPING, dt);
    var moving = false;

    for (var i = 0; i < logos.length; i++) {
      var l = logos[i];
      var fx = -SPRING * l.x, fy = -SPRING * l.y;

      if (pointer.active) {
        var dx = l.hx + l.x - mx, dy = l.hy + l.y - my;
        var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        var reach = REPEL + l.r;
        if (d < reach) {
          var f = 1 - d / reach;
          f = f * f * PUSH * (1.3 - l.r / 100);   // small logos scatter further
          fx += dx / d * f;
          fy += dy / d * f;
          l.vr += f * 0.35 * l.dir * dt;
        }
      }

      l.vx = (l.vx + fx * dt) * damp;
      l.vy = (l.vy + fy * dt) * damp;
      l.x += l.vx * dt;
      l.y += l.vy * dt;

      // Stay inside the field: a soft bounce off its edges, never into
      // the card above or the footer below
      var minX = l.r - l.hx, maxX = fieldW - l.r - l.hx;
      var minY = l.r - l.hy, maxY = fieldH - l.r - l.hy;
      if (l.x < minX) { l.x = minX; l.vx *= -0.3; } else if (l.x > maxX) { l.x = maxX; l.vx *= -0.3; }
      if (l.y < minY) { l.y = minY; l.vy *= -0.3; } else if (l.y > maxY) { l.y = maxY; l.vy *= -0.3; }
      l.vr = (l.vr - ROT_SPRING * l.rot * dt) * rotDamp;
      l.rot += l.vr * dt;

      // Idle wobble: every logo hovers on its own slow, slightly different path
      var t = clock * l.speed;
      l.ax = DRIFT * (Math.sin(t * 1.9 + l.p1) + 0.5 * Math.sin(t * 3.1 + l.p2)) / 1.5;
      l.ay = DRIFT * (Math.sin(t * 2.3 + l.p2) + 0.5 * Math.sin(t * 3.7 + l.p3)) / 1.5;
      l.ar = DRIFT_ROT * Math.sin(t * 1.5 + l.p3);
      place(l);

      if (Math.abs(l.vx) > 0.02 || Math.abs(l.vy) > 0.02 || Math.abs(l.vr) > 0.02) moving = true;
    }

    // Keep going while there is something to see or something still settling
    if (moving || visible) raf = requestAnimationFrame(tick);
    else last = 0;
  }

  function start() {
    if (!raf && !CCD.motionPaused) raf = requestAnimationFrame(tick);
  }

  // The wobble only runs while the field is on screen
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) start();
  }).observe(field);

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
    // Only wake the loop when the cursor is near the field
    var rect = field.getBoundingClientRect();
    if (e.clientY > rect.top - REPEL * 2 && e.clientY < rect.bottom + REPEL * 2) start();
  });

  document.documentElement.addEventListener('pointerleave', function () {
    pointer.active = false;
    start();
  });

  window.addEventListener('scroll', function () {
    if (pointer.active) start();
  }, { passive: true });

  // Click or tap a logo: it flips in place while its neighbors get a nudge
  field.addEventListener('pointerdown', function (e) {
    if (CCD.motionPaused) return;
    var rect = field.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    var hit = null;
    logos.forEach(function (l) {
      var dx = l.hx + l.x - mx, dy = l.hy + l.y - my;
      if (dx * dx + dy * dy <= (l.r + 4) * (l.r + 4)) hit = l;
    });
    logos.forEach(function (l) {
      if (l === hit) return;
      var dx = l.hx + l.x - mx, dy = l.hy + l.y - my;
      var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      var reach = BLAST + l.r;
      if (d > reach) return;
      var f = (1 - d / reach) * BLAST_KICK;
      l.vx += dx / d * f;
      l.vy += dy / d * f;
      l.vr += f * 0.4 * l.dir;
    });
    if (hit) hit.el.classList.add('is-flipping');
    start();
  });

  field.addEventListener('animationend', function (e) {
    if (e.animationName !== 'logo-field-flip') return;
    var item = e.target.closest('.logo-field-item');
    if (item) item.classList.remove('is-flipping');
  });
})();
