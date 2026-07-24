/* Inject JSON-LD structured data into content pages.
   - index.html: Person + WebSite (the canonical Person entity lives here)
   - about.html: Person + ProfilePage
   - Project pages (from js/projects.js): CreativeWork + BreadcrumbList
   - Write-ups (CCD_ARTICLES): Article + BreadcrumbList
   Every CreativeWork states who holds the copyright: the client company for
   commissioned work, Clayton for personal work. Pages elsewhere reference the
   Person by @id rather than repeating it, so crawlers resolve one entity.
   Re-runnable: replaces any existing ld+json block. Page data is read from
   each page's <title>, meta description, canonical, and og:image. */
import fs from 'fs/promises';
import { execFileSync } from 'child_process';

const SITE = 'https://www.claytoncunninghamdesign.com';
const PERSON_ID = `${SITE}/#clayton`;

function gitLastModified(file) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf8' }).trim() || null;
  } catch { return null; }
}

// Full Person entity. Emitted on index.html and about.html only; every other
// page refers to it by @id.
const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Clayton Cunningham',
  jobTitle: 'Senior Product Designer',
  url: `${SITE}/`,
  image: `${SITE}/img/claytoncunningham-og.jpg`,
  description: 'Senior Product Designer at Cox Automotive in Atlanta, Georgia, building design systems, illustration and icon libraries, and motion for Autotrader and Kelley Blue Book. Also available for freelance design and illustration work.',
  worksFor: {
    '@type': 'Organization',
    name: 'Cox Automotive',
    url: 'https://www.coxautomotive.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Atlanta',
    addressRegion: 'GA',
    addressCountry: 'US',
  },
  knowsAbout: [
    'Product Design', 'UI/UX Design', 'Design Systems', 'Illustration Systems',
    'Iconography', 'Motion Design', 'Visual Identity', 'Brand Identity',
    'User Research', 'Figma',
  ],
  sameAs: [
    'https://www.linkedin.com/in/clayton-cunningham-4057aa29',
    'https://dribbble.com/ClaytonCunningham',
  ],
};

// Short reference to the Person for use inside other entities.
const PERSON_REF = { '@type': 'Person', '@id': PERSON_ID, name: 'Clayton Cunningham', url: `${SITE}/` };

/* Who owns the work, keyed by the `client` field in js/projects.js.
   holder  — the Organization that holds copyright, or null when the work was
             commissioned by clients who aren't named publicly.
   note    — provenance sentence for disambiguatingDescription. Deliberately
             says who made it and who owns it without asserting an employment
             relationship, except where the site already states one. */
const OWNERSHIP = {
  'Autotrader': {
    holder: { name: 'Cox Automotive', url: 'https://www.coxautomotive.com' },
    note: 'Designed by Clayton Cunningham as Senior Product Designer at Cox Automotive. Copyright is held by Cox Automotive.',
  },
  'Kelley Blue Book': {
    holder: { name: 'Cox Automotive', url: 'https://www.coxautomotive.com' },
    note: 'Designed by Clayton Cunningham as Senior Product Designer at Cox Automotive. Copyright is held by Cox Automotive.',
  },
  'DICK\'S TSHQ': {
    holder: { name: 'DICK\'S Sporting Goods', url: 'https://www.dickssportinggoods.com' },
    note: 'Designed by Clayton Cunningham as Product Designer at DICK\'S Team Sports HQ. Copyright is held by DICK\'S Sporting Goods.',
  },
  'Coca-Cola': {
    holder: { name: 'The Coca-Cola Company', url: 'https://www.coca-colacompany.com' },
    note: 'Designed by Clayton Cunningham as Designer at The Coca-Cola Company. Copyright is held by The Coca-Cola Company.',
  },
  'Paradesmith': {
    holder: { name: 'Paradesmith' },
    note: 'Freelance design work by Clayton Cunningham for Paradesmith. Copyright is held by the client.',
  },
  'Various': {
    holder: null,
    note: 'Freelance identity work by Clayton Cunningham. Copyright for each mark is held by the respective client, not by Clayton Cunningham.',
  },
  'Personal': {
    self: true,
    note: 'Original personal work by Clayton Cunningham, created outside of any client engagement.',
  },
};

// Personal pages that aren't in the project manifest but are Clayton's own work.
const PERSONAL_PAGES = {
  'just-for-funsies.html': { keywords: ['Illustration', 'Personal Work', 'Side Projects'] },
  'shoe-rotation.html': { keywords: ['Illustration', 'Personal Work', 'Interactive'] },
};

const OWNED_BY_CLAYTON = {
  copyrightHolder: PERSON_REF,
  copyrightNotice: '© Clayton Cunningham. All rights reserved. Not licensed for AI or machine-learning training without explicit written permission.',
  creditText: 'Clayton Cunningham',
};

// Load the project manifest (browser global style) for client names + article dates.
const manifestSrc = await fs.readFile('js/projects.js', 'utf8');
const windowShim = {};
new Function('window', manifestSrc)(windowShim);
const projectByHref = Object.fromEntries(
  windowShim.CCD_PROJECTS.filter(p => !p.homeOnly).map(p => [p.href, p])
);
const ARTICLES = windowShim.CCD_ARTICLES;

const grab = (src, re) => src.match(re)?.[1] ?? '';
const bareTitle = t => t.replace(/ [—–•-] Clayton Cunningham.*$/, '');

const files = (await fs.readdir('.')).filter(f => f.endsWith('.html'));
let injected = 0;

for (const file of files) {
  let src = await fs.readFile(file, 'utf8');
  if (src.includes('http-equiv="refresh"')) continue;         // redirect stubs
  if (!src.includes('rel="canonical"')) continue;             // non-content

  const title = grab(src, /<title>([^<]*)<\/title>/);
  const description = grab(src, /name="description" content="([^"]*)"/);
  const canonical = grab(src, /rel="canonical" href="([^"]*)"/);
  const ogImage = grab(src, /property="og:image" content="([^"]*)"/);
  const project = projectByHref[file];
  const personal = PERSONAL_PAGES[file];

  const graph = [];

  if (file === 'index.html') {
    graph.push({ ...PERSON });
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Clayton Cunningham Design',
      description,
      publisher: { '@id': PERSON_ID },
    });
  }

  if (file === 'about.html') {
    graph.push({ ...PERSON });
    graph.push({
      '@type': 'ProfilePage',
      url: canonical,
      name: title,
      description,
      mainEntity: { '@id': PERSON_ID },
    });
  }

  if (ARTICLES[file]) {
    graph.push({
      '@type': 'Article',
      url: canonical,
      headline: bareTitle(title),
      description,
      image: ogImage,
      datePublished: ARTICLES[file],
      dateModified: gitLastModified(file) || ARTICLES[file],
      author: PERSON_REF,
      publisher: { '@id': PERSON_ID },
    });
  }

  if (project) {
    const own = OWNERSHIP[project.client] ?? { holder: null, note: null };
    const work = {
      '@type': 'CreativeWork',
      url: canonical,
      name: bareTitle(title),
      headline: project.label || project.title,
      description,
      image: ogImage || `${SITE}/${project.image}`,
      creator: PERSON_REF,
    };

    if (own.self) {
      Object.assign(work, OWNED_BY_CLAYTON);
    } else if (own.holder) {
      work.copyrightHolder = {
        '@type': 'Organization',
        name: own.holder.name,
        ...(own.holder.url ? { url: own.holder.url } : {}),
      };
      work.sourceOrganization = { '@type': 'Organization', name: project.client };
    }

    if (own.note) work.disambiguatingDescription = own.note;
    work.keywords = project.tags;
    graph.push(work);
  }

  if (personal) {
    graph.push({
      '@type': 'CreativeWork',
      url: canonical,
      name: bareTitle(title),
      description,
      image: ogImage,
      creator: PERSON_REF,
      ...OWNED_BY_CLAYTON,
      disambiguatingDescription: OWNERSHIP['Personal'].note,
      keywords: personal.keywords,
    });
  }

  if (file !== 'index.html') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: bareTitle(title), item: canonical },
      ],
    });
  }

  const ld = { '@context': 'https://schema.org', '@graph': graph };
  const block = `  <script type="application/ld+json">\n${JSON.stringify(ld, null, 2).replace(/^/gm, '  ')}\n  </script>\n`;

  // Re-runnable: drop any block a previous run left behind.
  src = src.replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '');
  await fs.writeFile(file, src.replace('</head>', block + '</head>'));
  injected++;
  console.log(`${file}: ${graph.map(g => g['@type']).join(' + ')}`);
}
console.log(`\nInjected JSON-LD into ${injected} pages`);
