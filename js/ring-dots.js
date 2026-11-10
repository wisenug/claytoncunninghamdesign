/* ring-dots.js: dotted rings behind the about photo. Requires site.js.

   Two rings of dots sit behind the circular photo: a light ring touching the
   photo and a darker ring touching that. Dots push away from the cursor on
   hover and ripple outward on click or tap. With reduced motion the rings
   are static.

   The canvas is added as the first child of #photo-wrap, sits behind the
   photo, ignores pointer events (nearby links stay clickable) and never
   affects layout. */

(function () {
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  function mountRingDots(wrap, options = {}) {
    const o = {
      // Rings, in multiples of the photo radius (1 = photo edge).
      // fade: 0 = solid dots, 1 = dissolves to nothing toward the outer edge.
      bands: [
        // Starts well under the photo (0.80) so the existing tilt/parallax never exposes a gap.
        { from: 0.80, to: 1.09, color: '184, 217, 245', fade: 0 },    // light ring hugging the photo
        { from: 1.09, to: 1.22, color: '74, 134, 196', fade: 0.55 }   // darker outer ring, touching the first
      ],
      cell: 3,            // px between dots
      dotScale: 0.8,      // dot size as a share of the cell
      radius: 100,        // hover reach in px (at a 390px photo; scales with photo size)
      strength: 30,       // max hover push in px
      falloff: 3,         // 3 = cubic, tight around the cursor
      ease: 0.12,         // how fast dots chase their target
      wave: { speed: 450, width: 40, strength: 18, duration: 1000 },  // click ripple (fast enough to reach the rings from the photo center)
      ...options
    };

    const cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:absolute;pointer-events:none;z-index:0;';
    wrap.prepend(cv);
    const ctx = cv.getContext('2d');
    const reduceMotion = CCD.prefersReducedMotion;
    const mouse = { x: 0, y: 0, on: false };

    let S = 0, C = 0, K = 1, outerR = 0, raf = 0, dots = null, waves = [], dead = false;

    // --- Build the dots -------------------------------------------------------
    function build() {
      const D = wrap.offsetWidth;                    // layout size, ignores CSS transforms
      if (!D) return;
      const R = D / 2;
      K = D / 390;
      const maxTo = Math.max(...o.bands.map(b => b.to));
      outerR = R * maxTo;
      const pad = Math.ceil((o.strength + o.wave.strength * 2) * K) + 4;   // room for pushed dots
      S = Math.ceil(outerR + pad) * 2;
      C = S / 2;
      const dpr = window.devicePixelRatio || 1;
      cv.width = S * dpr; cv.height = S * dpr;
      cv.style.width = cv.style.height = S + 'px';
      cv.style.left = cv.style.top = (D - S) / 2 + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = o.cell, half = Math.ceil(outerR / cell) + 1;
      const hx = [], hy = [], band = [];
      for (let gy = -half; gy < half; gy++) {
        for (let gx = -half; gx < half; gx++) {
          const x = (gx + 0.5) * cell, y = (gy + 0.5) * cell;
          const r = Math.hypot(x, y);
          for (let b = 0; b < o.bands.length; b++) {
            const bd = o.bands[b], r0 = bd.from * R, r1 = bd.to * R;
            if (r < r0 - (b ? 0 : cell) || r >= r1 + (b === o.bands.length - 1 ? cell : 0)) continue;
            const prev = o.bands[b - 1], next = o.bands[b + 1];
            const inEdge = prev && prev.to === bd.from ? 9 : (r - r0) / cell + 0.5;   // hard edge where bands touch
            const outEdge = next && next.from === bd.to ? 9 : (r1 - r) / cell + 0.5;
            const edge = Math.min(inEdge, outEdge);                       // soft, dithered edges elsewhere
            const t = Math.min(1, Math.max(0, (r - r0) / (r1 - r0)));
            const ink = Math.min(1, Math.max(0, edge)) * (1 - bd.fade * t);
            if (ink > (BAYER[gy & 3][gx & 3] + 0.5) / 16) {
              hx.push(C + x - cell / 2); hy.push(C + y - cell / 2); band.push(b);
            }
            break;
          }
        }
      }
      const n = hx.length;
      dots = { n, hx: Float32Array.from(hx), hy: Float32Array.from(hy), band: Uint8Array.from(band),
               dx: new Float32Array(n), dy: new Float32Array(n), size: cell * o.dotScale };
      draw();
    }

    // --- Animate: hover push + click ripple, eased ----------------------------
    function frame(now) {
      raf = 0;
      if (!dots) return;
      const { n, hx, hy, dx, dy } = dots;
      const R = o.radius * K, push = o.strength * K, w = o.wave;
      waves = waves.filter(v => now - v.start < w.duration);
      const amp = 1 + (waves.length - 1) * 0.5;
      let moving = false;

      for (let i = 0; i < n; i++) {
        let tx = 0, ty = 0;
        if (mouse.on) {
          const ex = hx[i] + dx[i] - mouse.x, ey = hy[i] + dy[i] - mouse.y;
          const d2 = ex * ex + ey * ey;
          if (d2 < R * R && d2 > 0.1) {
            const d = Math.sqrt(d2), p = Math.pow(1 - d / R, o.falloff) * push;
            tx += ex / d * p; ty += ey / d * p;
          }
        }
        for (const v of waves) {
          const age = now - v.start;
          const ring = age / 1000 * w.speed * K, life = 1 - age / w.duration;
          const ex = hx[i] - v.x, ey = hy[i] - v.y, d = Math.hypot(ex, ey);
          if (d < 0.1) continue;
          const off = Math.abs(d - ring);
          if (off < w.width * K) {
            const k = (1 - off / (w.width * K)) * life * w.strength * K * amp;
            tx += ex / d * k; ty += ey / d * k;
          }
        }
        dx[i] += (tx - dx[i]) * o.ease; dy[i] += (ty - dy[i]) * o.ease;
        if (Math.abs(dx[i]) < 0.01) dx[i] = 0;
        if (Math.abs(dy[i]) < 0.01) dy[i] = 0;
        if (dx[i] !== 0 || dy[i] !== 0) moving = true;
      }
      draw();
      if (mouse.on || waves.length || moving) wake();     // sleeps when idle
    }

    function draw() {
      const { n, hx, hy, dx, dy, band, size } = dots;
      ctx.clearRect(0, 0, S, S);
      for (let b = 0; b < o.bands.length; b++) {
        ctx.fillStyle = `rgb(${o.bands[b].color})`;
        for (let i = 0; i < n; i++) if (band[i] === b) ctx.fillRect(hx[i] + dx[i], hy[i] + dy[i], size, size);
      }
    }

    function wake() { if (!raf && !dead) raf = requestAnimationFrame(frame); }

    // --- Input (listens on window so the canvas never blocks clicks) ----------
    const local = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const near = p => Math.hypot(p.x - C, p.y - C) < outerR + o.radius * K;

    const onMove = e => {
      if (e.pointerType !== 'mouse') return;
      const p = local(e), was = mouse.on;
      mouse.on = near(p); mouse.x = p.x; mouse.y = p.y;
      if (mouse.on || was) wake();
    };
    const onOut = () => { if (mouse.on) { mouse.on = false; wake(); } };
    const onUp = e => {                                    // click or tap on the photo or rings
      const p = local(e);
      if (Math.hypot(p.x - C, p.y - C) > outerR + 8) return;
      waves.push({ x: p.x, y: p.y, start: performance.now() });
      wake();
    };

    if (!reduceMotion) {                                   // reduced motion: static rings
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      document.documentElement.addEventListener('pointerleave', onOut);
    }
    const ro = new ResizeObserver(build);
    ro.observe(wrap);

    return function destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onOut);
      cv.remove();
    };
  }

  var wrap = document.getElementById('photo-wrap');
  if (wrap) mountRingDots(wrap);
})();
