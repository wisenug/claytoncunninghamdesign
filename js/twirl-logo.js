/**
 * twirl-logo.js
 * Renders a logo as a grid of dots on a <canvas>. Hovering with a mouse twirls
 * the dots around the cursor. No dependencies, works in any framework.
 *
 *   import { mountTwirlLogo } from './twirl-logo.js';
 *   const destroy = mountTwirlLogo(document.querySelector('canvas'), { src: '/favicon.svg' });
 *   // call destroy() on unmount
 *
 * The shape comes from the image's transparency (alpha), so use a logo with a
 * transparent background. Fill color is set by `color`, not by the image.
 */

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

export function mountTwirlLogo(canvas, options = {}) {
  const {
    src,                       // required: URL of your logo (same origin or CORS enabled)
    grid = 112,                // dot density: logo sampled as grid x grid cells
    dotScale = 0.85,           // 1 = dots touch, lower = visible gaps
    radius = 130,              // reach of the twirl in px, at a 300px canvas (scales with size)
    maxAngle = 1.76,           // rotation in radians at the cursor
    ease = 0.14,               // 0..1, how fast dots chase their target
    color = { light: '11, 45, 82', dark: '184, 217, 245' }  // "r, g, b" per color scheme
  } = options;

  if (!src) throw new Error('mountTwirlLogo: options.src is required');

  const ctx = canvas.getContext('2d');
  const darkMQ = matchMedia('(prefers-color-scheme: dark)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = { x: 0, y: 0, on: false };

  let px = null;               // sampled logo pixels
  let dots = null;
  let W = 0, H = 0, K = 1, raf = 0, destroyed = false;

  // --- 1. Rasterize the logo to a grid x grid bitmap -----------------------
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if (destroyed) return;
    const c = document.createElement('canvas');
    c.width = c.height = grid;
    const x = c.getContext('2d', { willReadFrequently: true });
    if (img.naturalWidth && img.naturalHeight) {            // "contain" fit
      const s = Math.min(grid / img.naturalWidth, grid / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      x.drawImage(img, (grid - w) / 2, (grid - h) / 2, w, h);
    } else {
      x.drawImage(img, 0, 0, grid, grid);
    }
    px = x.getImageData(0, 0, grid, grid).data;
    build();
  };
  img.onerror = () => console.error('mountTwirlLogo: could not load', src);
  img.src = src;

  // --- 2. Turn pixels into dots (ordered dither on the alpha edge) ---------
  function build() {
    if (!px) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = window.devicePixelRatio || 1;
    W = r.width; H = r.height; K = W / 300;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cell = Math.min(W, H) / grid;
    const ox = (W - cell * grid) / 2, oy = (H - cell * grid) / 2;
    const hx = [], hy = [];
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const ink = px[(y * grid + x) * 4 + 3] / 255;
        if (ink > (BAYER[y & 3][x & 3] + 0.5) / 16) { hx.push(ox + x * cell); hy.push(oy + y * cell); }
      }
    }
    const n = hx.length;
    dots = { n, hx: Float32Array.from(hx), hy: Float32Array.from(hy),
             dx: new Float32Array(n), dy: new Float32Array(n), size: cell * dotScale };
    draw();
  }

  // --- 3. Twirl: rotate each dot around the cursor, eased ------------------
  function frame() {
    raf = 0;
    if (!dots) return;
    const { n, hx, hy, dx, dy } = dots;
    const R = radius * K;
    let moving = false;
    for (let i = 0; i < n; i++) {
      let tx = 0, ty = 0;
      if (mouse.on) {
        const ex = hx[i] - mouse.x, ey = hy[i] - mouse.y;
        const dist = Math.hypot(ex, ey);
        if (dist < R) {
          const s = 1 - dist / R, a = s * s * maxAngle;
          const c = Math.cos(a), sn = Math.sin(a);
          tx = mouse.x + ex * c - ey * sn - hx[i];
          ty = mouse.y + ex * sn + ey * c - hy[i];
        }
      }
      dx[i] += (tx - dx[i]) * ease;
      dy[i] += (ty - dy[i]) * ease;
      if (Math.abs(tx - dx[i]) > 0.02 || Math.abs(ty - dy[i]) > 0.02) moving = true;
    }
    draw();
    if (mouse.on || moving) wake();     // sleep when idle
  }

  function draw() {
    if (!dots) return;
    const { n, hx, hy, dx, dy, size } = dots;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = `rgb(${darkMQ.matches ? color.dark : color.light})`;
    for (let i = 0; i < n; i++) ctx.fillRect(hx[i] + dx[i], hy[i] + dy[i], size, size);
  }

  function wake() { if (!raf && !destroyed) raf = requestAnimationFrame(frame); }

  // --- 4. Input + lifecycle ------------------------------------------------
  const local = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  let touchTimer = 0;
  const onMove = e => {
    if (e.pointerType !== 'mouse' && !mouse.on) return;    // touch: only follow a finger that is down
    Object.assign(mouse, local(e), { on: true }); wake();
  };
  const onLeave = e => { if (e.pointerType === 'mouse') { mouse.on = false; wake(); } };
  // Touch: a tap twirls at the tap point, then eases back after a beat.
  // No touch-action override, so vertical page scrolling still works.
  const onDown = e => {
    if (e.pointerType === 'mouse') return;
    clearTimeout(touchTimer);
    Object.assign(mouse, local(e), { on: true }); wake();
  };
  const onUp = e => {
    if (e.pointerType === 'mouse') return;
    clearTimeout(touchTimer);
    touchTimer = setTimeout(() => { mouse.on = false; wake(); }, 700);
  };
  const onScheme = () => draw();

  if (!reduceMotion) {                  // reduced motion: static dots, no interaction
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);   // fires when a scroll takes over
  }
  darkMQ.addEventListener('change', onScheme);
  const ro = new ResizeObserver(build);
  ro.observe(canvas);

  return function destroy() {
    destroyed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerleave', onLeave);
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onUp);
    clearTimeout(touchTimer);
    darkMQ.removeEventListener('change', onScheme);
  };
}
