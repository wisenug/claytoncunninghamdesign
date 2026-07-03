/* shoe-rotation.js — 360° shoe viewers, motion toggle, scroll gradient.
   Requires site.js. */

const rotations = [];
const controllerBySection = new WeakMap();
let motionPaused = CCD.prefersReducedMotion;

function createRotation(config) {
  const { stageId, loaderId, loaderFillId, frames } = config;
  const TOTAL = frames.length;
  const stage = document.getElementById(stageId);
  const loader = document.getElementById(loaderId);
  const loaderFill = document.getElementById(loaderFillId);

  let currentFrame = 0;
  let spinInterval = null;
  let loadedCount = 0;
  let ready = false;
  let visible = false;
  let loadStarted = false;

  // Build frame DOM but defer actual image loading until the section
  // approaches the viewport (see startLoad below). The src lives on
  // data-src until then so the browser doesn't fetch 36 images per shoe
  // (8 shoes × ~36 frames = 288 requests) on initial page load.
  const frameImgs = frames.map((src, i) => {
    const div = document.createElement('div');
    div.className = 'frame' + (i === 0 ? ' active' : '');
    const img = document.createElement('img');
    img.dataset.src = src;
    img.draggable = false;
    img.alt = '';
    div.appendChild(img);
    stage.appendChild(div);
    return img;
  });

  function showFrame(n) {
    const next = ((n % TOTAL) + TOTAL) % TOTAL;
    frameImgs[currentFrame].parentElement.classList.remove('active');
    frameImgs[next].parentElement.classList.add('active');
    currentFrame = next;
  }

  function startSpin() {
    if (spinInterval || motionPaused || !visible || !ready) return;
    const FULL_ROTATION_MS = 3375;
    spinInterval = setInterval(() => showFrame(currentFrame + 1), FULL_ROTATION_MS / TOTAL);
  }

  function stopSpin() {
    clearInterval(spinInterval);
    spinInterval = null;
  }

  function startLoad() {
    if (loadStarted) return;
    loadStarted = true;
    frameImgs.forEach((img) => {
      img.onload = img.onerror = () => {
        loadedCount++;
        loaderFill.style.width = (loadedCount / TOTAL) * 100 + '%';
        if (loadedCount === TOTAL && !ready) {
          ready = true;
          setTimeout(() => {
            loader.classList.add('hidden');
            startSpin();
          }, 300);
        }
      };
      img.src = img.dataset.src;
    });
  }

  function setVisible(v) {
    visible = v;
    if (v) { startLoad(); startSpin(); } else { stopSpin(); }
  }

  const controller = { startSpin, stopSpin, setVisible, isReady: () => ready };
  rotations.push(controller);

  return controller;
}

// ── Motion toggle ──
const motionToggle = document.getElementById('motion-toggle');
function syncMotionToggle() {
  motionToggle.classList.toggle('paused', motionPaused);
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.setAttribute('aria-label', motionPaused ? 'Play animations' : 'Pause animations');
}
// Reflect initial state if user prefers reduced motion
syncMotionToggle();
motionToggle.addEventListener('click', () => {
  motionPaused = !motionPaused;
  syncMotionToggle();
  rotations.forEach(r => {
    if (motionPaused) r.stopSpin();
    else if (r.isReady()) r.startSpin();
  });
});

// ── Scroll-driven gradient ──
function updateGradient() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const t = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

  // Baby blue (#b8e4f0) → aquamarine green (#7fffd4)
  const r = Math.round(184 + (127 - 184) * t);
  const g = Math.round(228 + (255 - 228) * t);
  const b = Math.round(240 + (212 - 240) * t);
  document.body.style.background = `rgb(${r},${g},${b})`;
}

// Coalesce scroll events into one paint frame so we don't restyle the
// body 60-120×/s on fast scroll.
let gradientRaf = 0;
window.addEventListener('scroll', () => {
  if (gradientRaf) return;
  gradientRaf = requestAnimationFrame(() => {
    gradientRaf = 0;
    updateGradient();
  });
}, { passive: true });
updateGradient();

function pad(n) { return String(n).padStart(2, '0'); }

function buildFrames(prefix, count, skip) {
  var nums = [];
  for (var i = 1; i <= count; i++) {
    if (!skip || skip.indexOf(i) === -1) nums.push(i);
  }
  return nums.map(function(n) { return prefix + pad(n) + '.webp'; });
}

// Frame counts/prefixes per shoe. Easter skips frames 14 and 32 —
// out-of-sequence duplicates that cause visible skips.
var SHOES = [
  { key: 'reebok',      prefix: 'img/shoes/shoe-',                         count: 36 },
  { key: 'nb992',       prefix: 'img/shoes/nb992/nb992-',                  count: 36 },
  { key: 'treeline',    prefix: 'img/shoes/treeline/treeline-',            count: 36 },
  { key: 'bigbubble',   prefix: 'img/shoes/am1-bigbubble/am1-bigbubble-',  count: 36 },
  { key: 'easter',      prefix: 'img/shoes/am1-easter/am1-easter-',        count: 35, skip: [14, 32] },
  { key: 'aj1',         prefix: 'img/shoes/aj1/aj1-',                      count: 36 },
  { key: 'answer',      prefix: 'img/shoes/reebok-answer/reebok-answer-',  count: 36 },
  { key: 'birkenstock', prefix: 'img/shoes/birkenstock/birkenstock-',      count: 35 }
];

SHOES.forEach(function(s) {
  var section = document.getElementById('stage-' + s.key).closest('.shoe-section');
  var controller = createRotation({
    stageId: 'stage-' + s.key,
    loaderId: 'loader-' + s.key,
    loaderFillId: 'loader-fill-' + s.key,
    frames: buildFrames(s.prefix, s.count, s.skip)
  });
  if (section) controllerBySection.set(section, controller);
});

// Only spin shoes that are on-screen — avoids 8 timers churning all the time.
var sectionObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    var c = controllerBySection.get(e.target);
    if (c) c.setVisible(e.isIntersecting);
  });
}, { rootMargin: '100px' });
document.querySelectorAll('.shoe-section').forEach(function(s) {
  sectionObserver.observe(s);
});

// Pause everything when the tab is hidden.
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    rotations.forEach(function(r) { r.stopSpin(); });
  } else if (!motionPaused) {
    rotations.forEach(function(r) { r.startSpin(); });
  }
});
