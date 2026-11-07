// Lists the Lottie features each animation in animations/ needs, and flags any
// that the custom build (svg_ccd.js) leaves out. Run after adding an animation:
//   node tools/lottie/check-features.mjs
import fs from 'fs';
import path from 'path';

const DIR = 'animations';
// Shape types and effect codes the custom build does NOT include.
const MISSING_SHAPES = { tm: 'trim paths', rp: 'repeater', rd: 'round corners', zz: 'zig zag', op: 'offset path', pb: 'pucker and bloat' };
const SUPPORTED_EFFECTS = new Set([25]); // 25 = Drop Shadow
const problems = [];

function walk(o, f, state) {
  if (Array.isArray(o)) return o.forEach(v => walk(v, f, state));
  if (o && typeof o === 'object') {
    if (typeof o.ty === 'string' && MISSING_SHAPES[o.ty]) state.shapes.add(MISSING_SHAPES[o.ty]);
    if (Array.isArray(o.ef)) o.ef.forEach(e => { if (!SUPPORTED_EFFECTS.has(e.ty) && e.ty !== 0 && e.ty !== 1 && e.ty !== 2 && e.ty !== 3 && e.ty !== 4 && e.ty !== 6 && e.ty !== 7 && e.ty !== 10) state.effects.add(e.ty); });
    Object.values(o).forEach(v => walk(v, f, state));
  }
}

for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const text = fs.readFileSync(path.join(DIR, f), 'utf8');
  const state = { shapes: new Set(), effects: new Set() };
  walk(JSON.parse(text), f, state);
  if (/"x":"[^"]/.test(text)) state.shapes.add('expressions');
  if (state.shapes.size || state.effects.size) {
    problems.push(`${f}: needs ${[...state.shapes, ...[...state.effects].map(e => 'effect ' + e)].join(', ')}`);
  }
}

if (problems.length) {
  console.error('These animations need features missing from the custom Lottie build:\n  ' + problems.join('\n  '));
  console.error('Add the feature to tools/lottie/svg_ccd.js and rebuild with: bash tools/lottie/build.sh');
  process.exit(1);
}
console.log('OK: every animation only uses features in the custom Lottie build');
