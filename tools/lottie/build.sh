#!/usr/bin/env bash
# Rebuild js/vendor/lottie.ccd.min.js from lottie-web's source.
# Run from the repo root:  bash tools/lottie/build.sh
# Needs node and npm. Works in a temp folder, so nothing is added to the repo's
# node_modules or package.json.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$TMP"
npm init -y >/dev/null
# Exact versions so a rebuild is byte-identical to the committed file.
# Bump deliberately, rebuild, and compare (then bump CCD.lottieSrc's ?v).
npm i --silent --no-audit --no-fund --save-exact \
  lottie-web@5.13.0 \
  rollup@2.80.0 @rollup/plugin-node-resolve@13.3.0 @rollup/plugin-babel@5.3.1 \
  @rollup/plugin-terser@0.4.4 terser@5.51.2 \
  @babel/core@7.29.13 @babel/preset-env@7.29.7 @babel/plugin-transform-runtime@7.29.7 @babel/runtime@7.29.13

# Work on a copy of the library source so the entry file can sit beside the
# library's own modules (it imports them by relative path).
mkdir build && cp -r node_modules/lottie-web/player build/player
cp "$REPO/tools/lottie/svg_ccd.js" build/player/js/modules/svg_ccd.js
cp "$REPO/tools/lottie/rollup.config.js" build/rollup.config.js
cp "$REPO/tools/lottie/babelrc.json" build/.babelrc.json
ln -s "$TMP/node_modules" build/node_modules

cd build
npx rollup -c rollup.config.js 2>&1 | grep -iE "created|error" || true
cp out/lottie.ccd.min.js "$REPO/js/vendor/lottie.ccd.min.js"
echo "wrote js/vendor/lottie.ccd.min.js ($(wc -c < "$REPO/js/vendor/lottie.ccd.min.js") bytes)"
