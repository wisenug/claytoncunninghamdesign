/**
 * showcase-embed.js — drop into any page:
 *   <div id="showcase-root"></div>
 *   <script src="showcase-embed.js"></script>
 */
(function () {
  "use strict";

  // ── SVG path data ────────────────────────────────────────────────────────────

  var P = {
    spinnerRing: "M52.385 104.77C81.3165 104.77 104.77 81.3165 104.77 52.385C104.77 23.4536 81.3165 0 52.385 0C23.4536 0 0 23.4536 0 52.385C0 81.3165 23.4536 104.77 52.385 104.77ZM52.385 91.6738C74.0836 91.6738 91.6738 74.0836 91.6738 52.385C91.6738 30.6865 74.0836 13.0963 52.385 13.0963C30.6865 13.0963 13.0963 30.6865 13.0963 52.385C13.0963 74.0836 30.6865 91.6738 52.385 91.6738Z",
    spinnerArc:  "M13.0963 52.385C13.0963 30.6864 30.6864 13.0963 52.385 13.0963C56.0015 13.0963 58.9332 10.1646 58.9332 6.54813C58.9332 2.9317 56.0015 0 52.385 0C23.4536 0 0 23.4536 0 52.385C0 81.3165 23.4536 104.77 52.385 104.77C81.3165 104.77 104.77 81.3165 104.77 52.385C104.77 48.7686 101.838 45.8369 98.222 45.8369C94.6055 45.8369 91.6738 48.7686 91.6738 52.385C91.6738 74.0837 74.0837 91.6738 52.385 91.6738C30.6864 91.6738 13.0963 74.0836 13.0963 52.385Z",
    heart:       "M5.53751 5.47243C4.12625 6.81699 3.26626 8.84806 3.27412 11.6217L3.27413 11.6263C3.27412 13.6908 4.26062 15.7005 5.4037 17.3087C6.52885 18.8917 7.67532 19.9032 7.71234 19.9356L7.73372 19.9543L21.2816 32.6604L34.7916 20.0074C34.7998 19.9996 34.8097 19.9905 34.8209 19.98C35.0811 19.737 36.1234 18.7632 37.1556 17.3064C38.302 15.6883 39.2888 13.674 39.2888 11.6091C39.2888 8.84421 38.4257 6.8158 37.0114 5.47168C35.5864 4.11745 33.4079 3.27407 30.4346 3.27407C28.9251 3.27407 27.362 3.85811 25.9012 4.71981C24.4533 5.57383 23.2219 6.63194 22.4075 7.41533L21.2727 8.50697L20.1378 7.41539C19.331 6.63941 18.1037 5.58137 16.6559 4.72544C15.1952 3.86186 13.6282 3.27407 12.1105 3.27407C9.13701 3.27407 6.9596 4.11755 5.53751 5.47243ZM3.2791 3.10197C5.45891 1.02519 8.52709 0 12.1105 0C14.4385 0 16.593 0.88476 18.3222 1.90708C19.4568 2.57793 20.4595 3.33838 21.2728 4.02956C22.0918 3.33401 23.0993 2.5713 24.2377 1.89979C25.9668 0.879897 28.1164 0 30.4346 0C34.0184 0 37.0854 1.0253 39.2668 3.09842C41.4589 5.18165 42.5629 8.13925 42.5629 11.6091C42.5629 14.6594 41.1395 17.3469 39.8271 19.1992C39.1583 20.1431 38.4858 20.9158 37.9678 21.4654C37.708 21.7411 37.4855 21.9624 37.3196 22.1226C37.2366 22.2028 37.1683 22.2673 37.1177 22.3146C37.088 22.3425 37.0712 22.3581 37.0619 22.3668C37.0498 22.378 37.0515 22.3762 37.0515 22.3762L37.0298 22.3972L23.3752 35.1853C22.7701 35.7662 21.9956 36.0147 21.2903 36.0147H21.2726C20.5827 36.0147 19.7844 35.7852 19.1712 35.1698L5.53314 22.3791C5.30425 22.1763 4.0091 20.998 2.73506 19.2055C1.42403 17.361 0.000781047 14.6784 5.93844e-05 11.6286L5.91242e-05 11.6263L6.57593e-05 11.6309L5.93844e-05 11.6286C-0.00930532 8.15131 1.08894 5.18861 3.2791 3.10197Z",
    checkCircle: "M21.2814 3.27407C11.3362 3.27407 3.27407 11.3362 3.27407 21.2814C3.27407 31.2266 11.3362 39.2888 21.2814 39.2888C31.2266 39.2888 39.2888 31.2266 39.2888 21.2814C39.2888 11.3362 31.2266 3.27407 21.2814 3.27407ZM0 21.2814C0 9.52802 9.52802 0 21.2814 0C33.0348 0 42.5629 9.52802 42.5629 21.2814C42.5629 33.0348 33.0348 42.5629 21.2814 42.5629C9.52802 42.5629 0 33.0348 0 21.2814Z",
    checkTick:   "M31.1449 13.5514C31.7977 14.1769 31.8197 15.2132 31.1942 15.866L18.6436 28.9622C18.3348 29.2844 17.9079 29.4666 17.4617 29.4666C17.0154 29.4666 16.5885 29.2844 16.2798 28.9622L11.3687 23.8376C10.7431 23.1848 10.7652 22.1486 11.4179 21.523C12.0707 20.8975 13.1069 20.9195 13.7325 21.5723L17.4617 25.4636L28.8304 13.6006C29.4559 12.9479 30.4922 12.9258 31.1449 13.5514Z",
    xClose:      "M0.359607 0.359607C0.839083 -0.119869 1.61647 -0.119869 2.09594 0.359607L11.05 9.31364L20.004 0.359608C20.4835 -0.119868 21.2609 -0.119868 21.7403 0.359608C22.2198 0.839084 22.2198 1.61647 21.7403 2.09594L12.7863 11.05L21.7403 20.004C22.2198 20.4835 22.2198 21.2609 21.7403 21.7403C21.2609 22.2198 20.4835 22.2198 20.004 21.7403L11.05 12.7863L2.09594 21.7403C1.61647 22.2198 0.839083 22.2198 0.359607 21.7403C-0.119869 21.2609 -0.119869 20.4835 0.359607 20.004L9.31364 11.05L0.359607 2.09594C-0.119869 1.61647 -0.119869 0.839083 0.359607 0.359607Z",
    photos:      "M0 9.15572C0 4.09916 4.09916 0 9.15572 0H76.2977C81.3542 0 85.4534 4.09916 85.4534 9.15572V57.9862C85.4534 63.0428 81.3542 67.142 76.2977 67.142H9.15572C4.09916 67.142 0 63.0428 0 57.9862V9.15572ZM6.10381 50.0946V57.9862C6.10381 59.6717 7.4702 61.0381 9.15572 61.0381H76.2977C77.9832 61.0381 79.3496 59.6717 79.3496 57.9862V50.0947L68.4061 39.1512C66.0224 36.7675 62.1577 36.7675 59.774 39.1512L56.1985 42.7267L60.1443 46.6725C61.3361 47.8643 61.3361 49.7967 60.1443 50.9885C58.9524 52.1804 57.02 52.1804 55.8282 50.9885L34.8351 29.9954C32.4514 27.6118 28.5867 27.6118 26.203 29.9954L6.10381 50.0946ZM51.8824 38.4107L39.1512 25.6794C34.3838 20.912 26.6544 20.912 21.887 25.6794L6.10381 41.4626V9.15572C6.10381 7.4702 7.4702 6.10381 9.15572 6.10381H76.2977C77.9832 6.10381 79.3496 7.4702 79.3496 9.15572V41.4626L72.7221 34.8351C67.9548 30.0677 60.2253 30.0677 55.458 34.8351L51.8824 38.4107ZM47.3046 18.3114C47.3046 15.7832 49.3541 13.7336 51.8824 13.7336C54.4107 13.7336 56.4603 15.7832 56.4603 18.3114C56.4603 20.8397 54.4107 22.8893 51.8824 22.8893C49.3541 22.8893 47.3046 20.8397 47.3046 18.3114Z",
    tooltipFill: "M30.7333 5.21057e-06L1.26671 0L16 14.7333L30.7333 5.21057e-06Z",
    tooltipStroke:"M28.7569 0.818359L16.0001 13.5752L3.24327 0.818359L28.7569 0.818359Z",
    infoCircle:  "M15.9611 2.45555C8.50218 2.45555 2.45555 8.50218 2.45555 15.9611C2.45555 23.42 8.50218 29.4666 15.9611 29.4666C23.42 29.4666 29.4666 23.42 29.4666 15.9611C29.4666 8.50218 23.42 2.45555 15.9611 2.45555ZM0 15.9611C0 7.14601 7.14601 0 15.9611 0C24.7761 0 31.9221 7.14601 31.9221 15.9611C31.9221 24.7761 24.7761 31.9221 15.9611 31.9221C7.14601 31.9221 0 24.7761 0 15.9611ZM13.0963 8.59442C13.0963 7.46429 14.0124 6.54813 15.1426 6.54813C16.2727 6.54813 17.1888 7.46429 17.1888 8.59442C17.1888 9.72456 16.2727 10.6407 15.1426 10.6407C14.0124 10.6407 13.0963 9.72456 13.0963 8.59442ZM11.4592 13.85C11.4592 13.172 12.0089 12.6223 12.687 12.6223H16.3703C17.2744 12.6223 18.0074 13.3552 18.0074 14.2593V22.4445H20.8722C21.5502 22.4445 22.0999 22.9941 22.0999 23.6722C22.0999 24.3503 21.5502 24.9 20.8722 24.9H12.687C12.0089 24.9 11.4592 24.3503 11.4592 23.6722C11.4592 22.9941 12.0089 22.4445 12.687 22.4445H15.5518V15.0778H12.687C12.0089 15.0778 11.4592 14.5281 11.4592 13.85Z",
    chevron:     "M0.289241 0.264241C0.664241 -0.0982588 1.25174 -0.0857588 1.61424 0.289241L6.25174 5.21424L10.8892 0.289241C11.2517 -0.0857588 11.8392 -0.0982588 12.2142 0.264241C12.5892 0.626741 12.6017 1.21424 12.2392 1.58924L6.92674 7.21424C6.75174 7.40174 6.50174 7.50174 6.25174 7.50174C6.00174 7.50174 5.75174 7.40174 5.57674 7.21424L0.264241 1.58924C-0.0982588 1.21424 -0.0857588 0.626741 0.289241 0.264241Z",
  };

  // ── Easing (spring approximations as cubic-bezier) ────────────────────────

  var E = {
    snappy:   "cubic-bezier(0.34,1.56,0.64,1)",
    bouncy:   "cubic-bezier(0.34,1.65,0.64,1)",
    slider:   "cubic-bezier(0.25,1.20,0.50,1)",
    progress: "cubic-bezier(0.20,1.30,0.50,1)",
    toggle:   "cubic-bezier(0.34,1.40,0.64,1)",
    toast:    "cubic-bezier(0.30,1.30,0.60,1)",
    tooltip:  "cubic-bezier(0.34,1.45,0.64,1)",
    dropdown: "cubic-bezier(0.30,1.20,0.60,1)",
  };

  // ── Root check ────────────────────────────────────────────────────────────

  var root = document.getElementById("showcase-root");
  if (!root) return;

  // ── Inject CSS ────────────────────────────────────────────────────────────

  var styleEl = document.createElement("style");
  styleEl.textContent = [
    "@keyframes sc-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }",
    "@keyframes sc-shimmer { from{background-position:200% 0} to{background-position:-200% 0} }",
    "@keyframes sc-badge-in { from{transform:scale(0) rotate(-25deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }",
    "@keyframes sc-toast-in { from{opacity:0;transform:translateY(22px) scale(0.92)} to{opacity:1;transform:translateY(0) scale(1)} }",
    "@keyframes sc-tooltip-in { from{opacity:0;transform:scale(0.82) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }",
    "@keyframes sc-row-in { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }",
    "#showcase-root * { box-sizing:border-box; }",
  ].join("\n");
  document.head.appendChild(styleEl);

  // ── Canvas scaffold ───────────────────────────────────────────────────────

  var CANVAS_W = 2000, CANVAS_H = 906;

  var outer = document.createElement("div");
  outer.style.cssText = "width:100%;overflow:hidden;background:#FFA76C;";

  var canvas = document.createElement("div");
  canvas.style.cssText = "transform-origin:top left;position:relative;overflow:hidden;" +
    "font-family:'DM Sans',sans-serif;width:" + CANVAS_W + "px;height:" + CANVAS_H + "px;";

  outer.appendChild(canvas);
  root.appendChild(outer);

  function updateScale() {
    var s = Math.min(1, root.offsetWidth / CANVAS_W);
    canvas.style.transform = "scale(" + s + ")";
    outer.style.height = Math.round(CANVAS_H * s) + "px";
  }
  updateScale();
  window.addEventListener("resize", updateScale);

  // ── DOM helpers ───────────────────────────────────────────────────────────

  function div(css, children) {
    var d = document.createElement("div");
    if (css) d.style.cssText = css;
    if (children) children.forEach(function(c) { if (c) d.appendChild(c); });
    return d;
  }
  function span(text, css) {
    var s = document.createElement("span");
    if (css) s.style.cssText = css;
    s.textContent = text;
    return s;
  }
  function svgNS(tag, attrs) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (attrs) Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    return el;
  }
  function makeSvg(viewBox, w, h, children) {
    var s = svgNS("svg", { viewBox: viewBox, width: w, height: h, fill: "none" });
    if (children) children.forEach(function(c) { s.appendChild(c); });
    return s;
  }
  function pth(d, attrs) {
    return svgNS("path", Object.assign({ d: d }, attrs || {}));
  }

  // ── Interaction cycle helper ──────────────────────────────────────────────

  function runCycle(frames, apply) {
    var idx = 0;
    function tick() {
      var hold = frames[idx].hold;
      apply(frames[idx].state);
      setTimeout(function() { idx = (idx + 1) % frames.length; tick(); }, hold);
    }
    tick();
  }

  // ── Avatar ────────────────────────────────────────────────────────────────

  (function() {
    var wrap = div("position:absolute;left:198px;top:159px;width:96.585px;height:98.222px;");
    var circle = div(
      "position:absolute;left:0;top:6.55px;width:91.674px;height:91.674px;" +
      "background:#024aa5;border-radius:50%;display:flex;align-items:center;" +
      "justify-content:center;box-shadow:0 4px 8px rgba(0,0,0,0.2);"
    );
    circle.appendChild(span("AA",
      "color:white;font-weight:800;font-size:39px;text-transform:uppercase;" +
      "letter-spacing:-0.5px;user-select:none;"
    ));
    wrap.appendChild(circle);

    var count = 1, badge = null;
    function showBadge() {
      if (badge) badge.remove();
      badge = div(
        "position:absolute;left:67.12px;top:0;width:29.467px;height:29.467px;" +
        "background:#bc0005;border-radius:50%;border:1.637px solid white;" +
        "display:flex;align-items:center;justify-content:center;" +
        "transform-origin:center;animation:sc-badge-in 0.4s " + E.bouncy + " forwards;"
      );
      badge.appendChild(span(String(count),
        "color:white;font-size:16.37px;line-height:1;user-select:none;"
      ));
      wrap.appendChild(badge);
    }
    showBadge();
    setInterval(function() {
      if (badge) { badge.style.opacity = "0"; badge.style.transform = "scale(0)"; }
      setTimeout(function() { count = (count % 9) + 1; showBadge(); }, 260);
    }, 1800);

    canvas.appendChild(wrap);
  })();

  // ── Spinner ───────────────────────────────────────────────────────────────

  (function() {
    var wrap = div("position:absolute;left:452px;top:156px;width:104.77px;height:104.77px;");
    var trackSvg = makeSvg("0 0 104.77 104.77", "104.77", "104.77", [
      pth(P.spinnerRing, { "clip-rule":"evenodd", fill:"black", "fill-opacity":"0.1", "fill-rule":"evenodd" })
    ]);
    trackSvg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    var arcSvg = makeSvg("0 0 104.77 104.77", "104.77", "104.77", [
      pth(P.spinnerArc, { fill:"#012169" })
    ]);
    arcSvg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;" +
      "transform-origin:50% 50%;animation:sc-spin 0.95s linear infinite;";
    wrap.appendChild(trackSvg);
    wrap.appendChild(arcSvg);
    canvas.appendChild(wrap);
  })();

  // ── Skeleton Loader ───────────────────────────────────────────────────────

  (function() {
    function shimmer(delaySec) {
      return div(
        "position:absolute;inset:0;" +
        "background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.5) 50%,transparent 100%);" +
        "background-size:200% 100%;" +
        "animation:sc-shimmer 3.2s " + (delaySec||"0s") + " linear infinite;"
      );
    }
    var imgRect = div(
      "position:absolute;left:710px;top:185px;width:216.898px;height:134px;" +
      "border-radius:7.436px;overflow:hidden;background:rgba(0,0,0,0.1);"
    );
    imgRect.appendChild(shimmer("0s"));
    var photoWrap = div(
      "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" +
      "width:85.453px;height:67.142px;opacity:0.35;"
    );
    var photoSvg = makeSvg("0 0 85.4534 67.142","100%","100%",[
      pth(P.photos, {"clip-rule":"evenodd",fill:"#6D7782","fill-rule":"evenodd"})
    ]);
    photoSvg.style.cssText = "width:100%;height:100%;";
    photoWrap.appendChild(photoSvg);
    imgRect.appendChild(photoWrap);
    canvas.appendChild(imgRect);

    [
      {left:944, top:185,   width:209, delay:"0.15s"},
      {left:944, top:236.1, width:200, delay:"0.30s"},
      {left:944, top:287.2, width:233, delay:"0.45s"},
    ].forEach(function(b) {
      var bar = div(
        "position:absolute;left:" + b.left + "px;top:" + b.top + "px;" +
        "width:" + b.width + "px;height:32px;border-radius:7.436px;" +
        "overflow:hidden;background:rgba(0,0,0,0.1);"
      );
      bar.appendChild(shimmer(b.delay));
      canvas.appendChild(bar);
    });
  })();

  // ── Filter Chip ───────────────────────────────────────────────────────────

  (function() {
    var chip = div(
      "position:absolute;left:1270px;top:156px;" +
      "display:flex;align-items:center;border-radius:9999px;cursor:pointer;user-select:none;" +
      "height:52.385px;gap:6.548px;padding:0 26.193px;" +
      "background:#fff;box-shadow:0 0 0 1.637px rgba(0,0,0,0.2);" +
      "transition:background 0.18s,box-shadow 0.22s,transform 0.32s " + E.snappy + ";" +
      "transform-origin:center;"
    );
    chip.appendChild(span("Chip Text","font-family:'DM Sans',sans-serif;font-size:22.92px;color:#2d363e;white-space:nowrap;"));
    chip.appendChild(span("(123)","font-family:'DM Sans',sans-serif;font-size:22.92px;color:#6d7782;white-space:nowrap;"));
    runCycle([
      {state:"rest",hold:2200},{state:"hover",hold:1050},
      {state:"pressed",hold:400},{state:"hover",hold:620},{state:"rest",hold:1700}
    ], function(s) {
      chip.style.transform = s==="hover" ? "scale(1.07) translateY(-3px)" : s==="pressed" ? "scale(0.93) translateY(1.5px)" : "scale(1)";
      chip.style.background = s==="hover" ? "#f0f8ff" : s==="pressed" ? "#e3f2ff" : "#fff";
      chip.style.boxShadow  = s==="hover" ? "0 6px 16px rgba(1,33,105,0.14),0 0 0 1.5px rgba(1,33,105,0.4)"
                            : s==="pressed" ? "0 1px 2px rgba(0,0,0,0.06),0 0 0 2px #012169"
                            : "0 0 0 1.637px rgba(0,0,0,0.2)";
    });
    canvas.appendChild(chip);
  })();

  // ── Action Chip ───────────────────────────────────────────────────────────

  (function() {
    var chip = div(
      "position:absolute;left:1309px;top:260px;" +
      "display:flex;align-items:center;border-radius:9999px;cursor:pointer;user-select:none;" +
      "height:52.385px;padding:6.548px 26.193px;" +
      "background:#fff;box-shadow:0 0 0 1.637px rgba(0,0,0,0.2);" +
      "transition:background 0.18s,box-shadow 0.22s,transform 0.32s " + E.snappy + ";" +
      "transform-origin:center;"
    );
    chip.appendChild(span("Action Chip","font-family:'DM Sans',sans-serif;font-size:22.92px;color:#2d363e;white-space:nowrap;"));
    runCycle([
      {state:"rest",hold:2400},{state:"hover",hold:900},
      {state:"pressed",hold:360},{state:"hover",hold:750}
    ], function(s) {
      chip.style.transform = s==="hover" ? "scale(1.07) translateY(-3px)" : s==="pressed" ? "scale(0.93) translateY(1.5px)" : "scale(1)";
      chip.style.background = s==="hover" ? "#f4f8ff" : s==="pressed" ? "#e8f0ff" : "#fff";
      chip.style.boxShadow  = s==="hover" ? "0 6px 16px rgba(1,33,105,0.14),0 0 0 1.5px rgba(1,33,105,0.4)"
                            : s==="pressed" ? "0 1px 2px rgba(0,0,0,0.06),0 0 0 2px #012169"
                            : "0 0 0 1.637px rgba(0,0,0,0.2)";
    });
    canvas.appendChild(chip);
  })();

  // ── Toast ─────────────────────────────────────────────────────────────────

  (function() {
    var wrap = div("position:absolute;left:818.3px;top:440px;width:530.399px;");
    var toast = null, alive = true;

    function show() {
      if (toast) toast.remove();
      toast = div(
        "border-radius:6.548px;display:flex;align-items:flex-start;position:relative;" +
        "background:#2d363e;padding:26.193px 13.096px;gap:13.096px;" +
        "box-shadow:0 6px 32px rgba(0,0,0,0.18);" +
        "animation:sc-toast-in 0.5s " + E.toast + " forwards;"
      );
      var iconSvg = makeSvg("0 0 42.5629 42.5629","52.385","52.385",[
        pth(P.checkCircle,{"clip-rule":"evenodd",fill:"white","fill-rule":"evenodd"}),
        pth(P.checkTick,  {"clip-rule":"evenodd",fill:"white","fill-rule":"evenodd"}),
      ]);
      iconSvg.style.flexShrink = "0";
      var textWrap = div("flex:1;min-width:0;padding-right:52.385px;");
      var title = document.createElement("p");
      title.style.cssText = "font-family:'DM Sans',sans-serif;font-weight:800;font-size:26.19px;color:white;line-height:1.2;margin-bottom:6.548px;";
      title.textContent = "Title";
      var body = document.createElement("p");
      body.style.cssText = "font-family:'DM Sans',sans-serif;font-size:22.92px;color:white;line-height:1.5;";
      body.textContent = "Provides a brief feedback that an action has been completed. ";
      body.appendChild(span("Undo","text-decoration:underline;font-size:14px;"));
      textWrap.appendChild(title); textWrap.appendChild(body);
      var closeBtn = document.createElement("button");
      closeBtn.style.cssText = "position:absolute;top:13.1px;right:13.1px;width:52.385px;height:52.385px;" +
        "display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;border:none;";
      closeBtn.appendChild(makeSvg("0 0 22.0999 22.0999","22.1","22.1",[
        pth(P.xClose,{"clip-rule":"evenodd",fill:"white","fill-opacity":"0.6","fill-rule":"evenodd"})
      ]));
      toast.appendChild(iconSvg); toast.appendChild(textWrap); toast.appendChild(closeBtn);
      wrap.appendChild(toast);
    }

    function hide(cb) {
      if (!toast) { cb && cb(); return; }
      toast.style.transition = "opacity 0.2s,transform 0.2s";
      toast.style.opacity = "0"; toast.style.transform = "translateY(-10px) scale(0.96)";
      setTimeout(function() { if(toast){toast.remove();toast=null;} cb&&cb(); }, 220);
    }

    function cycle(d) {
      setTimeout(function() {
        show();
        setTimeout(function() { hide(function() { if(alive) cycle(900); }); }, 2800);
      }, d||0);
    }
    cycle(500);
    canvas.appendChild(wrap);
  })();

  // ── Range Slider ──────────────────────────────────────────────────────────

  (function() {
    var wrap = div(
      "position:absolute;left:147px;top:366px;width:487.836px;" +
      "display:flex;flex-direction:column;gap:13.096px;"
    );

    function makeField(initVal) {
      var fw = div("flex:1 0 0;min-width:1px;");
      var field = div(
        "height:78.578px;background:white;border-radius:6.548px;" +
        "border:1.637px solid rgba(0,0,0,0.2);position:relative;" +
        "display:flex;flex-direction:column;justify-content:center;"
      );
      var lbl = span("Label",
        "font-family:'DM Sans',sans-serif;font-size:19.64px;color:#59636e;" +
        "position:absolute;top:7px;left:26.19px;"
      );
      var val = span(String(initVal),
        "font-family:'DM Sans',sans-serif;font-size:26.19px;color:#2d363e;font-weight:400;" +
        "margin-top:26px;padding-left:26.193px;padding-right:26.193px;"
      );
      field.appendChild(lbl); field.appendChild(val);
      fw.appendChild(field);
      return {fw:fw, val:val};
    }

    var minF = makeField(250), maxF = makeField(710);
    var inputRow = div("display:flex;align-items:center;gap:19.644px;");
    inputRow.appendChild(minF.fw);
    inputRow.appendChild(span("–","font-family:Roboto,sans-serif;font-size:26.19px;color:#59636e;align-self:flex-start;margin-top:24px;"));
    inputRow.appendChild(maxF.fw);
    wrap.appendChild(inputRow);

    var TX = "0.8s " + E.slider;
    var trackArea = div("display:flex;flex-direction:column;gap:6.548px;");
    var trackWrap = div("position:relative;height:52.385px;");
    trackWrap.appendChild(div(
      "position:absolute;top:50%;transform:translateY(-50%);" +
      "left:0;right:0;height:6.548px;background:#e1e4e8;border-radius:9999px;"
    ));
    var trackActive = div(
      "position:absolute;top:50%;transform:translateY(-50%);" +
      "height:6.548px;background:#012169;border-radius:9999px;" +
      "left:4%;right:29%;transition:left " + TX + ",right " + TX + ";"
    );
    function mkHandle(pct) {
      return div(
        "position:absolute;top:50%;transform:translateY(-50%) translateX(-50%);" +
        "width:39.289px;height:39.289px;background:white;border:3.274px solid #012169;" +
        "border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.2);" +
        "left:" + pct + "%;transition:left " + TX + ";"
      );
    }
    var minH = mkHandle(4), maxH = mkHandle(71);
    trackWrap.appendChild(trackActive);
    trackWrap.appendChild(minH);
    trackWrap.appendChild(maxH);
    var minMax = div("display:flex;justify-content:space-between;");
    minMax.appendChild(span("0","font-family:'DM Sans',sans-serif;font-size:19.64px;color:#59636e;"));
    minMax.appendChild(span("1,000","font-family:'DM Sans',sans-serif;font-size:19.64px;color:#59636e;"));
    trackArea.appendChild(trackWrap); trackArea.appendChild(minMax);
    wrap.appendChild(trackArea);

    var MIN_WP=[25,10,38,5,18,42,8,30,15,22], MAX_WP=[71,88,55,95,62,78,84,50,91,66];
    var mi=0, mxi=0;
    function schedMin() {
      setTimeout(function() {
        mi=(mi+1)%MIN_WP.length;
        var p=Math.max(4,Math.min(44,MIN_WP[mi]));
        minH.style.left=p+"%"; trackActive.style.left=p+"%";
        minF.val.textContent=String(Math.round(MIN_WP[mi]*10));
        schedMin();
      }, 1400+Math.random()*800);
    }
    function schedMax() {
      setTimeout(function() {
        mxi=(mxi+1)%MAX_WP.length;
        var p=Math.max(56,Math.min(96,MAX_WP[mxi]));
        maxH.style.left=p+"%"; trackActive.style.right=(100-p)+"%";
        maxF.val.textContent=String(Math.round(MAX_WP[mxi]*10));
        schedMax();
      }, 1800+Math.random()*1000);
    }
    schedMin(); setTimeout(schedMax, 900);
    canvas.appendChild(wrap);
  })();

  // ── Progress Bar ──────────────────────────────────────────────────────────

  (function() {
    var wrap = div(
      "position:absolute;left:811.75px;top:699px;width:597.517px;" +
      "display:flex;flex-direction:column;gap:3.274px;"
    );
    wrap.appendChild(span("Label","font-family:'DM Sans',sans-serif;font-size:26.19px;color:#2d363e;font-weight:400;"));
    var row = div("display:flex;align-items:center;gap:13.096px;");
    var trackOuter = div(
      "position:relative;flex:1;height:26.193px;border-radius:9999px;" +
      "overflow:hidden;background:rgba(0,0,0,0.2);"
    );
    var fill = div(
      "position:absolute;left:0;top:0;height:100%;border-radius:9999px;" +
      "background:#ed6500;width:88%;transition:width 1.4s " + E.progress + ";"
    );
    trackOuter.appendChild(fill);
    var pctLbl = span("88%","font-family:'DM Sans',sans-serif;font-size:26.19px;color:#2d363e;font-weight:400;min-width:52px;text-align:right;");
    row.appendChild(trackOuter); row.appendChild(pctLbl); wrap.appendChild(row);
    var VALS=[88,32,46,95,3,71,58,14,79,41], vi=0;
    function next() {
      setTimeout(function() {
        vi=(vi+1)%VALS.length;
        fill.style.width=VALS[vi]+"%"; pctLbl.textContent=VALS[vi]+"%"; next();
      }, 2400+Math.random()*600);
    }
    next();
    canvas.appendChild(wrap);
  })();

  // ── Tooltip ───────────────────────────────────────────────────────────────

  (function() {
    var wrap = div("position:absolute;left:1503px;top:615px;width:308.88px;height:165px;");
    var infoWrap = div(
      "position:absolute;left:135px;bottom:0;width:39.289px;height:39.289px;" +
      "transition:transform 0.3s " + E.snappy + ";transform-origin:center;"
    );
    var infoSvg = makeSvg("0 0 31.9221 31.9221","100%","100%",[
      pth(P.infoCircle,{"clip-rule":"evenodd",fill:"#2D363E","fill-rule":"evenodd"})
    ]);
    infoSvg.style.cssText="width:100%;height:100%;";
    infoWrap.appendChild(infoSvg);
    wrap.appendChild(infoWrap);

    var ttEl=null, alive=true;
    function show() {
      ttEl = div(
        "position:absolute;top:0;left:0;width:100%;transform-origin:50% 100%;" +
        "animation:sc-tooltip-in 0.4s " + E.tooltip + " forwards;"
      );
      var bubble = div(
        "position:relative;border-radius:6.548px;background:white;padding:19.644px;" +
        "box-shadow:0 0 0 1.637px rgba(0,0,0,0.1),0 4px 24px rgba(0,0,0,0.08);"
      );
      var txt = document.createElement("p");
      txt.style.cssText="font-family:'DM Sans',sans-serif;font-size:19.64px;color:#2d363e;line-height:1.5;";
      txt.textContent="Lorem ipsum dolor sit amet, coadipiscing elit,";
      bubble.appendChild(txt);
      var ptr = div("position:absolute;bottom:-13.1px;left:50%;transform:translateX(-50%);width:32.741px;height:16.37px;");
      var ptrSvg = makeSvg("0 0 32.7407 16.3703","32.7407","16.3703");
      ptrSvg.style.cssText="position:absolute;inset:0;width:100%;height:100%;";
      ptrSvg.appendChild(pth(P.tooltipFill,{fill:"white"}));
      var defs=svgNS("defs"),msk=svgNS("mask",{id:"sc-tt-mask",maskUnits:"userSpaceOnUse",x:"0",y:"1",width:"33",height:"14"});
      msk.style.maskType="alpha";
      var mr=svgNS("rect",{fill:"white",width:"32.7407",height:"13.0963",y:"1.63703"});
      msk.appendChild(mr); defs.appendChild(msk); ptrSvg.appendChild(defs);
      var mg=svgNS("g",{mask:"url(#sc-tt-mask)"});
      mg.appendChild(pth(P.tooltipStroke,{stroke:"black","stroke-opacity":"0.1","stroke-width":"1.637"}));
      ptrSvg.appendChild(mg);
      ptr.appendChild(ptrSvg); bubble.appendChild(ptr); ttEl.appendChild(bubble);
      wrap.insertBefore(ttEl,infoWrap);
      infoWrap.style.transform="scale(1.18)";
    }
    function hide(cb) {
      if(!ttEl){cb&&cb();return;}
      ttEl.style.animation="none"; ttEl.style.transition="opacity 0.18s,transform 0.18s";
      ttEl.style.opacity="0"; ttEl.style.transform="scale(0.88) translateY(10px)";
      infoWrap.style.transform="scale(1)";
      setTimeout(function(){if(ttEl){ttEl.remove();ttEl=null;}cb&&cb();},200);
    }
    function cycle(d) {
      setTimeout(function(){show();setTimeout(function(){hide(function(){if(alive)cycle(700);});},2500);},d||0);
    }
    cycle(800);
    canvas.appendChild(wrap);
  })();

  // ── Toggle ────────────────────────────────────────────────────────────────

  (function() {
    var wrap = div("position:absolute;left:436px;top:677px;display:flex;align-items:center;gap:13.096px;");
    wrap.appendChild(span("Label","font-family:'DM Sans',sans-serif;font-size:26.19px;color:#2d363e;white-space:nowrap;"));
    var track = div(
      "display:flex;align-items:center;border-radius:9999px;cursor:pointer;" +
      "height:52.385px;width:78.578px;padding:0 6.548px;" +
      "background:#012169;transition:background 0.38s;"
    );
    var handle = div(
      "width:32.741px;height:32.741px;background:white;border-radius:50%;" +
      "transform-origin:center;transform:translateX(26px);" +
      "transition:transform 0.38s " + E.toggle + ";"
    );
    track.appendChild(handle); wrap.appendChild(track);
    var on=true;
    setInterval(function(){
      on=!on;
      track.style.background=on?"#012169":"#cbced4";
      handle.style.transform=on?"translateX(26px)":"translateX(0)";
      if(handle.animate){
        handle.animate(
          [{scaleX:1,scaleY:1},{scaleX:1.06,scaleY:0.96},{scaleX:1,scaleY:1}],
          {duration:320,easing:"cubic-bezier(0.34,1.56,0.64,1)",fill:"none"}
        );
      }
    },2400);
    canvas.appendChild(wrap);
  })();

  // ── Icon Button ───────────────────────────────────────────────────────────

  (function() {
    var wrap = div(
      "position:absolute;left:169px;top:641px;" +
      "display:flex;flex-direction:column;align-items:center;cursor:pointer;gap:6.548px;" +
      "transform-origin:center;transition:transform 0.3s " + E.snappy + ";"
    );
    var circleBg = div(
      "border-radius:50%;display:flex;align-items:center;justify-content:center;" +
      "width:78.578px;height:78.578px;background:rgba(0,0,0,0);transition:background 0.18s;"
    );
    var heartPath = pth(P.heart,{"clip-rule":"evenodd",fill:"#D54101","fill-rule":"evenodd"});
    circleBg.appendChild(makeSvg("0 0 42.5629 36.0147","52.385","52.385",[heartPath]));
    var lbl = span("Button Text",
      "font-family:'DM Sans',sans-serif;font-size:26.19px;color:#2d363e;" +
      "white-space:nowrap;text-align:center;text-decoration:none;"
    );
    wrap.appendChild(circleBg); wrap.appendChild(lbl);
    runCycle([
      {state:"rest",hold:1800},{state:"hover",hold:750},
      {state:"pressed",hold:180},{state:"hover",hold:420}
    ], function(s) {
      wrap.style.transform = s==="hover"?"scale(1.06)":s==="pressed"?"scale(0.92)":"scale(1)";
      circleBg.style.background = s==="hover"?"rgba(109,119,130,0.12)":s==="pressed"?"rgba(109,119,130,0.18)":"rgba(0,0,0,0)";
      heartPath.setAttribute("fill", s==="hover"?"#ff5500":s==="pressed"?"#a32f00":"#D54101");
      lbl.style.textDecoration = (s==="hover"||s==="pressed")?"underline":"none";
    });
    canvas.appendChild(wrap);
  })();

  // ── Listbox ───────────────────────────────────────────────────────────────

  (function() {
    var SELECTED_ROW = 4;
    var HOVER_SEQ    = [0,1,2,3,4];
    var HOVER_HOLDS  = [300,260,230,210,480];
    var OPT_LABELS   = ["Option 1","Option 2","Option 3","Option 4","Option 5","Option 6"];

    var wrap = div("position:absolute;left:1542px;top:127px;width:250px;");

    var inputBox = div(
      "position:relative;border-radius:5px;display:flex;align-items:center;" +
      "height:60px;background:white;box-shadow:0 0 0 1.25px rgba(0,0,0,0.2);" +
      "transition:box-shadow 0.2s;"
    );
    var inputInner = div("flex:1;padding:0 20px;overflow:hidden;");
    var inputSpan = span("Label","font-family:'DM Sans',sans-serif;font-size:20px;color:#59636e;display:block;");
    inputInner.appendChild(inputSpan);
    inputBox.appendChild(inputInner);

    var chevWrap = div(
      "position:absolute;right:12px;top:50%;transform:translateY(-50%);" +
      "transition:transform 0.3s " + E.snappy + ";transform-origin:center;"
    );
    chevWrap.appendChild(makeSvg("0 0 12.5035 7.50174","12.5","7.5",[
      pth(P.chevron,{"clip-rule":"evenodd",fill:"#6D7782","fill-rule":"evenodd"})
    ]));
    inputBox.appendChild(chevWrap);
    wrap.appendChild(inputBox);

    var popover=null, rowEls=[], ckEls=[], selectedRow=null, alive=true;

    function setHovered(ri) {
      rowEls.forEach(function(r,i){
        r.style.background = i===ri ? "rgba(1,33,105,0.07)"
          : (selectedRow!==null&&i===selectedRow) ? "rgba(1,33,105,0.04)"
          : "rgba(0,0,0,0)";
      });
    }

    function setSelected(ri) {
      selectedRow=ri;
      rowEls.forEach(function(r,i){
        var sel=i===ri;
        r.style.background=sel?"rgba(1,33,105,0.04)":"rgba(0,0,0,0)";
        var lbl=r.querySelector(".sc-opt");
        if(lbl){lbl.style.color=sel?"#012169":"#2d363e";lbl.style.fontWeight=sel?"600":"400";}
        if(ckEls[i]){ckEls[i].style.transform=sel?"scale(1)":"scale(0)";ckEls[i].style.opacity=sel?"1":"0";}
      });
      inputSpan.textContent=OPT_LABELS[ri-1]||"Label";
      inputSpan.style.color="#2d363e";
    }

    function openDropdown() {
      if(popover) return;
      inputBox.style.boxShadow="0 0 0 2px #012169";
      chevWrap.style.transform="translateY(-50%) rotate(180deg)";

      popover=div(
        "position:relative;border-radius:10px;margin-top:5px;background:white;overflow:hidden;" +
        "box-shadow:0 0 0 1px rgba(0,0,0,0.05),0 5px 20px rgba(0,0,0,0.1);" +
        "height:0;opacity:0.6;transition:height 0.45s " + E.dropdown + ",opacity 0.3s;"
      );
      var inner=div("padding:20px;");
      rowEls=[]; ckEls=[];

      var ph=div(
        "display:flex;align-items:center;border-radius:6.25px;height:50px;" +
        "padding:0 12.5px;background:rgba(0,0,0,0);transition:background 0.12s;" +
        "opacity:0;animation:sc-row-in 0.25s 0.04s ease forwards;"
      );
      ph.appendChild(div("width:36px;flex-shrink:0;"));
      ph.appendChild(span("Option","font-family:'DM Sans',sans-serif;font-size:25px;color:#6d7782;"));
      inner.appendChild(ph); rowEls.push(ph); ckEls.push(null);

      OPT_LABELS.forEach(function(label,i){
        var delay=(0.06+i*0.045).toFixed(3)+"s";
        var row=div(
          "display:flex;align-items:center;border-radius:6.25px;height:50px;" +
          "padding:0 12.5px;background:rgba(0,0,0,0);transition:background 0.12s;" +
          "opacity:0;animation:sc-row-in 0.3s "+delay+" "+E.dropdown+" forwards;"
        );
        var ckSlot=div("width:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;");
        var ckSvg=makeSvg("0 0 18 14","18","14");
        var ckPath=svgNS("path",{d:"M1 7L6.5 12.5L17 1",stroke:"#012169","stroke-width":"2.2","stroke-linecap":"round","stroke-linejoin":"round"});
        ckSvg.appendChild(ckPath);
        ckSvg.style.cssText="display:block;transform:scale(0);opacity:0;transform-origin:center;transition:transform 0.25s "+E.snappy+",opacity 0.25s;";
        ckSlot.appendChild(ckSvg);
        row.appendChild(ckSlot);
        var lbl=span(label,"font-family:'DM Sans',sans-serif;font-size:25px;color:#2d363e;");
        lbl.className="sc-opt";
        row.appendChild(lbl);
        inner.appendChild(row); rowEls.push(row); ckEls.push(ckSvg);
        if(selectedRow===i+1){
          lbl.style.color="#012169"; lbl.style.fontWeight="600";
          row.style.background="rgba(1,33,105,0.04)";
          ckSvg.style.transform="scale(1)"; ckSvg.style.opacity="1";
        }
      });

      var fade=div(
        "position:absolute;bottom:0;left:0;right:0;height:60px;" +
        "background:linear-gradient(to top,white 20%,transparent 100%);" +
        "display:flex;flex-direction:column;align-items:center;justify-content:flex-end;" +
        "padding-bottom:8px;pointer-events:none;"
      );
      fade.appendChild(makeSvg("0 0 12.5035 7.50174","12.5","7.5",[
        pth(P.chevron,{"clip-rule":"evenodd",fill:"#6D7782","fill-rule":"evenodd"})
      ]));
      popover.appendChild(inner); popover.appendChild(fade);
      wrap.appendChild(popover);
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        popover.style.height="332.5px"; popover.style.opacity="1";
      });});
    }

    function closeDropdown(cb) {
      if(!popover){cb&&cb();return;}
      inputBox.style.boxShadow="0 0 0 1.25px rgba(0,0,0,0.2)";
      chevWrap.style.transform="translateY(-50%) rotate(0deg)";
      popover.style.height="0"; popover.style.opacity="0";
      setTimeout(function(){if(popover){popover.remove();popover=null;rowEls=[];ckEls=[];}cb&&cb();},280);
    }

    function cycle(startDelay) {
      var ids=[];
      ids.push(setTimeout(function(){
        openDropdown();
        var t=480;
        HOVER_SEQ.forEach(function(ri,si){
          ids.push(setTimeout(function(){setHovered(ri);},t));
          t+=HOVER_HOLDS[si];
        });
        ids.push(setTimeout(function(){
          setSelected(SELECTED_ROW); setHovered(-1);
          ids.push(setTimeout(function(){
            closeDropdown(function(){if(alive)ids.push(setTimeout(function(){cycle(0);},2200));});
          },600));
        },t));
      },startDelay||0));
    }

    cycle(800);
    canvas.appendChild(wrap);
  })();

})();
