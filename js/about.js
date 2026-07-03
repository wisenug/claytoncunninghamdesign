/* about.js — emoji cycle + photo tilt. Requires site.js. */

// Emoji cycle — starts after initial rise animation
(function () {
  var emojis = ['🍑', '🏄‍♂️', '🌼', '🤠', '⚾', '🔥', '🪻', '🤙', '🎨', '🏖️', '🍔', '🪐', '🇺🇸', '🗿', '🌷', '🌞', '🦩'];
  var idx = 0;
  var el = document.querySelector('.peach');
  if (!el) return;

  setInterval(function () {
    if (document.hidden) return;
    idx = (idx + 1) % emojis.length;
    el.classList.remove('swapping');
    // Force reflow so the animation re-triggers
    void el.offsetWidth;
    el.textContent = emojis[idx];
    el.classList.add('swapping');
  }, 2000);
})();

// Photo tilt + parallax follows the cursor
(function () {
  var wrap  = document.getElementById('photo-wrap');
  var inner = document.getElementById('photo-inner');
  var img   = document.getElementById('about-photo');
  if (!wrap || !inner) return;
  if (CCD.prefersReducedMotion) return;

  var cx = 0, cy = 0;           // current tilt (degrees)
  var tx = 0, ty = 0;           // target tilt
  var px = 0, py = 0;           // current parallax (%)
  var ptx = 0, pty = 0;         // target parallax
  var raf = null;

  var MAX_TILT      = 14;       // max rotation degrees
  var MAX_PARALLAX  = 3;        // max image translate %
  var LERP          = 0.10;     // smoothing factor

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    cx = lerp(cx, tx, LERP);
    cy = lerp(cy, ty, LERP);
    px = lerp(px, ptx, LERP);
    py = lerp(py, pty, LERP);

    inner.style.transform =
      'rotateX(' + (-cy).toFixed(3) + 'deg) rotateY(' + cx.toFixed(3) + 'deg)';
    img.style.transform =
      'translate(' + px.toFixed(3) + '%, ' + py.toFixed(3) + '%)';

    // Shadow shifts opposite to tilt direction, depth grows with tilt intensity
    var tiltMag = Math.sqrt(cx * cx + cy * cy);
    var shadowX = (-cx * 0.9).toFixed(2);
    var shadowY = (cy  * 0.9 + 8).toFixed(2);
    var shadowBlur = (20 + tiltMag * 1.4).toFixed(1);
    var shadowAlpha = (0.35 + tiltMag * 0.018).toFixed(3);
    inner.style.filter =
      'drop-shadow(' + shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px rgba(0,0,0,' + shadowAlpha + '))';

    // Keep running until values have settled
    if (Math.abs(cx - tx) > 0.01 || Math.abs(cy - ty) > 0.01 ||
        Math.abs(px - ptx) > 0.01 || Math.abs(py - pty) > 0.01) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  function startTick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', function (e) {
    var rect = wrap.getBoundingClientRect();
    var relX = (e.clientX - rect.left)  / rect.width  - 0.5;  // -0.5 → 0.5
    var relY = (e.clientY - rect.top)   / rect.height - 0.5;

    tx  =  relX * MAX_TILT;
    ty  =  relY * MAX_TILT;
    ptx = -relX * MAX_PARALLAX;
    pty = -relY * MAX_PARALLAX;
    startTick();
  });

  document.addEventListener('mouseleave', function () {
    tx = ty = ptx = pty = 0;
    startTick();
  });
})();
