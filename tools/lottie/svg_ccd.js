// Custom lottie-web entry for this site.
//
// Start from the library's own SVG renderer and keep only what the site's
// animations use: the Drop Shadow effect (two Autotrader animations). Left out:
// the expression engine, every other effect, shape modifiers (trim paths,
// repeaters, round corners, zig zag, offset path, pucker and bloat), and the
// canvas and HTML renderers. None of the files in animations/ use them.
//
// If you add an animation that uses one of those features, add it back here
// and rebuild (see build.sh). tools/lottie/check-features.mjs lists what each
// animation needs.
import lottie from './main';
import SVGRenderer from '../renderers/SVGRenderer';
import { registerRenderer } from '../renderers/renderersManager';
import { registerEffect } from '../elements/svgElements/SVGEffects';
import SVGDropShadowEffect from '../elements/svgElements/effects/SVGDropShadowEffect';

registerRenderer('svg', SVGRenderer);
registerEffect(25, SVGDropShadowEffect, true);

export default lottie;
