/* capabilities.js — filterable project grid.
   Requires projects.js (manifest) and site.js (CCD.loadLottie). */

// ── Tag metadata: title + description for each tag ────────────────────────
var TAG_META = {
  'UI/UX Design': {
    title: 'UI/UX Design',
    description: 'End-to-end product design across automotive, enterprise, and consumer platforms — from early research through shipped product.'
  },
  'Iconography': {
    title: 'Iconography',
    description: 'Unified icon systems built on precise grids, optical corrections, and systematic rules — spanning UI, spot, and navigation icons.'
  },
  'Illustration': {
    title: 'Illustration',
    description: 'Custom illustration systems built to scale across product, marketing, and brand — with rules for how to extend them.'
  },
  'Design System': {
    title: 'Design System',
    description: 'Component libraries, style guides, and design infrastructure built to last and scale across teams.'
  },
  'Motion Design': {
    title: 'Motion Design',
    description: 'Motion and animation work spanning UI micro-interactions, Lottie animations, and marketing assets.'
  },
  'Visual Identity': {
    title: 'Visual Identity',
    description: 'Brand identity and expression work that extends naturally into product, marketing, and beyond.'
  },
  'Research': {
    title: 'Research',
    description: 'User research, interviews, usability testing, and data-informed design decisions that reduce friction and build confidence.'
  },
  'Case Study': {
    title: 'Case Study',
    description: 'In-depth project walkthroughs covering research, process, and outcomes from discovery through delivery.'
  }
};

var PROJECTS = (window.CCD_PROJECTS || []).filter(function (p) { return !p.homeOnly; });

// ── Render ────────────────────────────────────────────────────────────────
var params = new URLSearchParams(window.location.search);
var rawTag = params.get('tag') || '';
// Drop unknown tags so the page doesn't render "All Capabilities" with an
// empty grid (e.g. someone shares /capabilities.html?tag=Bogus).
var activeTag = TAG_META[rawTag] ? rawTag : '';

var meta = activeTag
  ? TAG_META[activeTag]
  : { title: 'All Capabilities', description: 'Selected projects across product design, illustration, design systems, and brand expression.' };

document.getElementById('cap-title').textContent = meta.title;
document.title = meta.title + ' — Clayton Cunningham';

// ── Filter chips ──────────────────────────────────────────────────────────
var chipsContainer = document.getElementById('cap-filter-chips');

// Reset chip — only shown when a filter is active
if (activeTag) {
  var resetChip = document.createElement('a');
  resetChip.href = 'capabilities.html';
  resetChip.className = 'tag tag--reset';
  resetChip.textContent = 'See All';
  chipsContainer.appendChild(resetChip);
}

// One chip per capability
Object.keys(TAG_META).forEach(function (tag) {
  var chip = document.createElement('a');
  chip.href = 'capabilities.html?tag=' + encodeURIComponent(tag);
  chip.className = 'tag' + (tag === activeTag ? ' tag--active' : '');
  chip.textContent = tag;
  chipsContainer.appendChild(chip);
});

// Sync filter bar top with nav visibility
(function () {
  var nav = document.querySelector('nav');
  var bar = document.getElementById('cap-filter-bar');
  if (!nav || !bar) return;
  new MutationObserver(function () {
    bar.style.top = nav.classList.contains('nav--hidden') ? '0' : '10rem';
  }).observe(nav, { attributes: true, attributeFilter: ['class'] });
})();

// ── Project grid ──────────────────────────────────────────────────────────
var filtered = activeTag
  ? PROJECTS.filter(function (p) { return p.tags.indexOf(activeTag) !== -1; })
  : PROJECTS;

var grid = document.getElementById('project-grid');
filtered.forEach(function (p, i) {
  var delay = (i % 2 === 0) ? 'fade-up-2' : 'fade-up-3';

  var card = document.createElement('a');
  card.href = p.href;
  card.className = 'project-card fade-up ' + delay;
  var mediaHtml = p.lottie
    ? '<div id="' + p.lottieId + '" class="project-card__image" style="aspect-ratio:' + p.lottieRatio + ';"></div>'
    : '<img class="project-card__image" src="' + p.image + '" alt="' + p.alt + '" loading="lazy">';
  card.innerHTML =
    '<div class="project-card__ink-bg" aria-hidden="true"></div>' +
    '<div class="project-card__img-wrap">' + mediaHtml + '</div>' +
    '<div class="project-card__label"><span class="project-card__label-client">' + p.client + '</span>' + (p.label || p.title) + '</div>';

  if (p.href !== '#' && p.bgColor) {
    var inkEl = card.querySelector('.project-card__ink-bg');
    var labelEl = card.querySelector('.project-card__label');
    inkEl.style.background = p.bgColor;
    labelEl.style.background = p.bgColor;
    if (p.fgColor) labelEl.style.color = p.fgColor;
    card.addEventListener('click', function () {
      inkEl.style.opacity = '1';
      inkEl.style.viewTransitionName = 'ink-bg';
      labelEl.style.viewTransitionName = 'page-title';
    });
  }

  grid.appendChild(card);

  if (p.lottie) {
    CCD.loadLottie(document.getElementById(p.lottieId), p.lottie);
  }
});
