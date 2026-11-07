import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';

const VERSION = '5.13.0';

// Same post-processing steps lottie-web's own build applies.
const injectVersion = () => ({ name: 'inject-version', renderChunk: (code) => code.replace('[[BM_VERSION]]', VERSION) });
const navigatorGuard = () => ({ name: 'navigator-guard', renderChunk: (code) => '(typeof navigator !== "undefined") && ' + code });
const documentGuard = () => ({ name: 'document-guard', renderChunk: (code) => '(typeof document !== "undefined") && ' + code });

export default {
  input: 'player/js/modules/svg_ccd.js',
  treeshake: false, // matches upstream: only what the entry imports is included
  plugins: [
    nodeResolve(),
    babel({ babelHelpers: 'runtime', skipPreflightCheck: true }),
    injectVersion(),
    navigatorGuard(),
    documentGuard(),
    terser({ compress: { passes: 2 } }),
  ],
  output: {
    format: 'umd',
    name: 'lottie',
    esModule: false,
    exports: 'default',
    sourcemap: false,
    compact: false,
    file: 'out/lottie.ccd.min.js',
  },
};
