/* funsies.js — Just For Funsies landing page.
   Spinning shoe thumbnail, same behavior as the home page card:
   defer the 36-frame preload + spin until the card nears the viewport. */

var CCD = window.CCD || (window.CCD = {});

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
