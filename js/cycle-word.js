/* cycle-word.js — headline word cycle (homepage). Requires site.js. */

// Headline word cycle
(function () {
  var words = ['design systems 🤙', 'illustrations 🌭', 'icon libraries ☮️', 'motion 🏄🏻‍♂️'];
  var idx = 0;
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
      inner.className = 'cw-word';
      inner.style.setProperty('--i', i);
      inner.textContent = word;
      mask.appendChild(inner);
      el.appendChild(mask);
    });
  }

  setInterval(function () {
    if (document.hidden || CCD.motionPaused) return;
    idx = (idx + 1) % words.length;
    render(words[idx]);
  }, 2000);
})();
