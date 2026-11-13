/* cycle-word.js — headline word cycle (homepage). Requires site.js. */

// Headline word cycle
(function () {
  var words = ['design systems 🤙', 'illustrations 🌭', 'icon libraries ☮️', 'motion 🏄🏻‍♂️'];
  var idx = 0;
  // Emoji stay upright: inside the italic serif word they get slanted
  // (Firefox fakes an oblique on them), so they carry a class that resets it.
  var EMOJI = /\p{Extended_Pictographic}/u;
  var el = document.querySelector('.cycle-word');
  if (!el || CCD.prefersReducedMotion) return;

  // Masked word reveal: each word slides up from behind its own clip box,
  // staggered 75ms. Screen readers get the full phrase via aria-label.
  function render(text) {
    el.textContent = '';
    el.setAttribute('aria-label', text);
    text.split(' ').forEach(function (word, i) {
      if (i > 0) el.appendChild(document.createTextNode(' '));
      var mask = document.createElement('span');
      mask.className = 'cw-mask';
      mask.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.className = EMOJI.test(word) ? 'cw-word cw-emoji' : 'cw-word';
      inner.style.setProperty('--i', i);
      inner.textContent = word;
      mask.appendChild(inner);
      el.appendChild(mask);
    });
  }

  function next() {
    if (document.hidden || CCD.motionPaused) return;
    idx = (idx + 1) % words.length;
    render(words[idx]);
  }

  // First swap comes early so the cycling reads as intentional right away,
  // then settles into a steady rhythm.
  setTimeout(function () {
    next();
    setInterval(next, 2000);
  }, 1000);
})();
