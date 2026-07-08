/* Inject JSON-LD structured data into content pages.
   - Every page: Person (entity for search/AI lookups) + BreadcrumbList
   - index.html: WebSite
   - about.html: ProfilePage
   - Project pages (from js/projects.js): CreativeWork with client name
   Idempotent: skips any file that already has a ld+json block.
   Re-run after adding a page. Data is read from each page's existing
   <title>, meta description, canonical, and og:image tags. */
import fs from 'fs/promises';
import { execFileSync } from 'child_process';

const SITE = 'https://www.claytoncunninghamdesign.com';

function gitLastModified(file) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf8' }).trim() || null;
  } catch { return null; }
}

const PERSON = {
  '@type': 'Person',
  '@id': `${SITE}/#clayton`,
  name: 'Clayton Cunningham',
  jobTitle: 'Product Designer & Illustrator',
  url: `${SITE}/about.html`,
  image: `${SITE}/img/claytoncunningham-og.jpg`,
  knowsAbout: [
    'Product Design', 'UI/UX Design', 'Illustration Systems', 'Iconography',
    'Design Systems', 'Brand Identity', 'Motion Design', 'User Research'
  ],
  sameAs: [
    'https://www.linkedin.com/in/clayton-cunningham-4057aa29',
    'https://dribbble.com/ClaytonCunningham',
  ],
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

const files = (await fs.readdir('.')).filter(f => f.endsWith('.html'));
let injected = 0;

for (const file of files) {
  const src = await fs.readFile(file, 'utf8');
  if (src.includes('application/ld+json')) continue;          // idempotent
  if (src.includes('http-equiv="refresh"')) continue;         // redirect stubs
  if (!src.includes('rel="canonical"')) continue;             // non-content

  const title = grab(src, /<title>([^<]*)<\/title>/);
  const description = grab(src, /name="description" content="([^"]*)"/);
  const canonical = grab(src, /rel="canonical" href="([^"]*)"/);
  const ogImage = grab(src, /property="og:image" content="([^"]*)"/);
  const project = projectByHref[file];

  const graph = [{ ...PERSON }];

  if (file === 'index.html') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Clayton Cunningham Design',
      description,
      publisher: { '@id': `${SITE}/#clayton` },
    });
  }

  if (file === 'about.html') {
    graph.push({
      '@type': 'ProfilePage',
      url: canonical,
      name: title,
      description,
      mainEntity: { '@id': `${SITE}/#clayton` },
    });
  }

  if (ARTICLES[file]) {
    graph.push({
      '@type': 'Article',
      url: canonical,
      headline: title.replace(/ [—–•-] Clayton Cunningham.*$/, ''),
      description,
      image: ogImage,
      datePublished: ARTICLES[file],
      dateModified: gitLastModified(file) || ARTICLES[file],
      author: { '@id': `${SITE}/#clayton` },
    });
  }

  if (project) {
    graph.push({
      '@type': 'CreativeWork',
      url: canonical,
      name: title,
      headline: project.label || project.title,
      description,
      image: ogImage || `${SITE}/${project.image}`,
      creator: { '@id': `${SITE}/#clayton` },
      sourceOrganization: { '@type': 'Organization', name: project.client },
      genre: project.tags,
    });
  }

  if (file !== 'index.html') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: title.replace(/ [—–•-] Clayton Cunningham.*$/, ''), item: canonical },
      ],
    });
  }

  const ld = { '@context': 'https://schema.org', '@graph': graph };
  const block = `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n`;
  await fs.writeFile(file, src.replace('</head>', block + '</head>'));
  injected++;
  console.log(`${file}: ${graph.map(g => g['@type']).join(' + ')}`);
}
console.log(`\nInjected JSON-LD into ${injected} pages`);
