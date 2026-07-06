/* projects.js — single source of truth for project metadata.
   Consumed by index.js (view-transition ink colors) and capabilities.js
   (filterable project grid). To add a project, add one entry here with the
   page's [--color-bg, --color-black] as bgColor/fgColor.
   homeOnly: true — gets ink colors on the home page but stays out of the
   capabilities grid. */

// Tag metadata: title + description per capability. Used by capabilities.js
// (client filter) and generate-tag-pages.mjs (static SEO pages).
window.CCD_TAG_META = {
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

// URL slug for a tag's static page, e.g. 'UI/UX Design' → 'capabilities-uiux-design.html'
window.CCD_TAG_HREF = function (tag) {
  return 'capabilities-' + tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.html';
};

// Process write-ups (file → original publish date). Consumed by
// inject-schema.mjs (Article datePublished) and generate-rss.mjs (feed).
window.CCD_ARTICLES = {
  'how-to-build-a-scalable-illustration-system.html': '2026-07-04',
  'icon-grids-and-optical-corrections.html': '2026-07-04',
};

window.CCD_PROJECTS = [
  {
    href: 'sketches-illustrations-doodles.html',
    bgColor: '#4D93FC',
    fgColor: '#19133A',
    image: 'img/sketch_thumbnail.webp',
    alt: 'Sketches, illustrations, and doodles',
    client: 'Personal',
    title: 'Sketches, Illustrations and Doodles',
    label: 'A collection of drawn things',
    tags: ['Illustration']
  },
  {
    href: 'tshq-mobile-app.html',
    bgColor: '#006554',
    fgColor: '#E0FAE0',
    image: 'img/tshq_app_thumbnail.webp',
    alt: 'DICK\'S TSHQ mobile app',
    client: 'DICK\'S TSHQ',
    title: 'DICK\'S TSHQ Mobile App',
    label: 'Designing mobile app features that ease the pain of youth sports management',
    tags: ['UI/UX Design', 'Research', 'Illustration', 'Case Study']
  },
  {
    href: 'tshq-registration.html',
    bgColor: '#f0f0f0',
    fgColor: '#1B561A',
    image: 'img/tshq_reg_thumbnail.webp',
    alt: 'DICK\'S TSHQ Registration Redesign',
    client: 'DICK\'S TSHQ',
    title: 'Registration Redesign',
    label: 'Redesigning youth sports registration for over 3 million players and 10,000 teams',
    tags: ['UI/UX Design', 'Design System', 'Research', 'Illustration', 'Case Study']
  },
  {
    href: 'tshq-fanwear-redesign.html',
    bgColor: '#FF5F1F',
    fgColor: '#0D0D1A',
    image: 'img/tshq_fanwear_thumbnail.webp',
    alt: 'DICK\'S TSHQ Fan Wear Redesign',
    client: 'DICK\'S TSHQ',
    title: 'Fan Wear',
    label: 'Designing a standalone fan wear store that turned team spirit into club revenue',
    tags: ['UI/UX Design', 'Research', 'Case Study']
  },
  {
    href: 'tshq-assorted-projects.html',
    bgColor: '#2E1F4A',
    fgColor: '#F0E6FF',
    image: 'img/tshq_assorted_projects_thumbnail.webp',
    alt: 'DICK\'S TSHQ Assorted Projects',
    client: 'DICK\'S TSHQ',
    title: 'Assorted',
    label: 'Selected works from DICK\'s Team Sports Headquarters',
    tags: ['Illustration', 'Iconography']
  },
  {
    href: 'logos.html',
    bgColor: '#FFF8D5',
    fgColor: '#553B06',
    image: 'img/lotuslion_thumbnail.webp',
    alt: 'Logos and brand identity work',
    client: 'Various',
    title: 'Logos',
    label: 'A collection of logo and brand identity work',
    tags: ['Visual Identity']
  },
  {
    href: 'coca-cola-assorted-projects.html',
    bgColor: '#ffffff',
    fgColor: '#D42020',
    image: 'img/coca-cola_assorted_thumbnail.webp',
    alt: 'Illustrated Coca-Cola vending machine with bottles on a night sky background',
    client: 'Coca-Cola',
    title: 'Assorted Projects',
    label: 'Designing for one of the world\'s most iconic brands',
    tags: ['Visual Identity']
  },
  {
    href: 'coca-cola-campus-messaging.html',
    bgColor: '#DE4138',
    fgColor: '#000000',
    image: 'img/cm_thumbnail.webp',
    alt: 'Coca-Cola Campus Messaging',
    client: 'Coca-Cola',
    title: 'Campus Messaging',
    label: 'Unified campus communication experiences across Coca-Cola\'s world headquarters',
    tags: ['Visual Identity', 'Illustration']
  },
  {
    href: 'paradesmith.html',
    bgColor: '#07465A',
    fgColor: '#1BBFCA',
    image: 'img/paradesmith_thumbnail.webp',
    alt: 'Paradesmith',
    client: 'Paradesmith',
    title: 'MVP Design',
    label: 'Building an MVP to transform scattered online content into curated community experiences',
    tags: ['UI/UX Design', 'Visual Identity']
  },
  {
    href: 'autotrader-illustration-system.html',
    bgColor: '#E3F2FF',
    fgColor: '#0F2960',
    image: 'img/at_illustration_style_2.webp',
    alt: 'Autotrader illustration system',
    client: 'Autotrader',
    title: 'Illustration System',
    label: 'Designing a scalable illustration system across web, mobile apps, and marketing',
    tags: ['UI/UX Design', 'Illustration', 'Motion Design']
  },
  {
    href: 'kbb-icons-illustrations.html',
    bgColor: '#FFBF00',
    fgColor: '#002B5C',
    image: 'img/Kbb_thumbnail.webp',
    alt: 'KBB icons and illustrations',
    client: 'Kelley Blue Book',
    title: 'Icons & Illustrations',
    label: 'Growing a renowned leader\'s visual library',
    tags: ['UI/UX Design', 'Iconography', 'Illustration']
  },
  {
    href: 'autotrader-icons.html',
    bgColor: '#FF8806',
    fgColor: '#001F6E',
    lottie: 'animations/spot_icons.json',
    lottieRatio: '2000/1409',
    lottieId: 'lottie-at-icons-cap',
    image: 'img/autotrader_icons_thumbnail.webp',
    alt: 'Autotrader iconography system',
    client: 'Autotrader',
    title: 'Iconography',
    label: 'Unifying a fragmented icon language',
    tags: ['UI/UX Design', 'Iconography', 'Motion Design']
  },
  {
    href: 'shoe-rotation.html',
    bgColor: '#b8e4f0',
    fgColor: '#0F3D4A',
    homeOnly: true
  }
];
