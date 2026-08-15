// Guidelines carousel: arrow-button navigation over native horizontal scroll.
(function () {
  var track = document.getElementById('guidelines-carousel');
  var prevBtn = document.querySelector('.guidelines-prev');
  var nextBtn = document.querySelector('.guidelines-next');
  if (!track || !prevBtn || !nextBtn) return;

  function scrollByItem(dir) {
    var item = track.querySelector('.guidelines-scroll-item');
    if (!item) return;
    var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    var amount = item.getBoundingClientRect().width + gap;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }

  function updateButtons() {
    var max = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= max;
  }

  prevBtn.addEventListener('click', function () { scrollByItem(-1); });
  nextBtn.addEventListener('click', function () { scrollByItem(1); });
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
})();
