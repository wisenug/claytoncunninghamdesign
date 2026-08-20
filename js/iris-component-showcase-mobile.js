/**
 * iris-component-showcase-mobile.js
 *   <div id="showcase-root-mobile"></div>
 *   <script src="js/iris-component-showcase-mobile.js"></script>
 */
(function () {
  "use strict";

  // ── SVG paths (mobile — ~0.5× desktop) ──────────────────────────────────────

  var P = {
    spinnerRing: "M26.1925 52.385C40.6583 52.385 52.385 40.6583 52.385 26.1925C52.385 11.7268 40.6583 0 26.1925 0C11.7268 0 0 11.7268 0 26.1925C0 40.6583 11.7268 52.385 26.1925 52.385ZM26.1925 45.8369C37.0418 45.8369 45.8369 37.0418 45.8369 26.1925C45.8369 15.3432 37.0418 6.54813 26.1925 6.54813C15.3432 6.54813 6.54813 15.3432 6.54813 26.1925C6.54813 37.0418 15.3432 45.8369 26.1925 45.8369Z",
    spinnerArc:  "M6.54813 26.1925C6.54813 15.3432 15.3432 6.54813 26.1925 6.54813C28.0007 6.54813 29.4666 5.08228 29.4666 3.27407C29.4666 1.46585 28.0007 0 26.1925 0C11.7268 0 0 11.7268 0 26.1925C0 40.6583 11.7268 52.385 26.1925 52.385C40.6583 52.385 52.385 40.6583 52.385 26.1925C52.385 24.3843 50.9192 22.9185 49.111 22.9185C47.3028 22.9185 45.8369 24.3843 45.8369 26.1925C45.8369 37.0418 37.0418 45.8369 26.1925 45.8369C15.3432 45.8369 6.54813 37.0418 6.54813 26.1925Z",
    photos:      "M0 3.80345C0 1.70286 1.70286 0 3.80345 0H31.6954C33.796 0 35.4988 1.70286 35.4988 3.80345V24.0885C35.4988 26.1891 33.796 27.8919 31.6954 27.8919H3.80345C1.70286 27.8919 0 26.1891 0 24.0885V3.80345ZM2.53563 20.8102V24.0885C2.53563 24.7887 3.10325 25.3563 3.80345 25.3563H31.6954C32.3956 25.3563 32.9632 24.7887 32.9632 24.0885V20.8102L28.4171 16.2641C27.4269 15.2739 25.8214 15.2739 24.8312 16.2641L23.3458 17.7494L24.985 19.3886C25.4801 19.8837 25.4801 20.6864 24.985 21.1815C24.4899 21.6766 23.6871 21.6766 23.192 21.1815L14.4711 12.4606C13.4809 11.4704 11.8754 11.4704 10.8852 12.4606L2.53563 20.8102ZM21.5529 15.9565L16.2641 10.6677C14.2836 8.68722 11.0727 8.68722 9.09224 10.6677L2.53563 17.2243V3.80345C2.53563 3.10325 3.10325 2.53563 3.80345 2.53563H31.6954C32.3956 2.53563 32.9632 3.10325 32.9632 3.80345V17.2243L30.2101 14.4711C28.2296 12.4907 25.0187 12.4907 23.0382 14.4711L21.5529 15.9565ZM19.6511 7.60689C19.6511 6.5566 20.5026 5.70517 21.5529 5.70517C22.6032 5.70517 23.4546 6.5566 23.4546 7.60689C23.4546 8.65719 22.6032 9.50862 21.5529 9.50862C20.5026 9.50862 19.6511 8.65719 19.6511 7.60689Z",
    checkCircle: "M10.6407 1.63703C5.66812 1.63703 1.63703 5.66812 1.63703 10.6407C1.63703 15.6133 5.66812 19.6444 10.6407 19.6444C15.6133 19.6444 19.6444 15.6133 19.6444 10.6407C19.6444 5.66812 15.6133 1.63703 10.6407 1.63703ZM0 10.6407C0 4.76401 4.76401 0 10.6407 0C16.5174 0 21.2814 4.76401 21.2814 10.6407C21.2814 16.5174 16.5174 21.2814 10.6407 21.2814C4.76401 21.2814 0 16.5174 0 10.6407Z",
    checkTick:   "M15.5725 6.77569C15.8988 7.08847 15.9099 7.60661 15.5971 7.93298L9.3218 14.4811C9.16742 14.6422 8.95397 14.7333 8.73084 14.7333C8.50772 14.7333 8.29426 14.6422 8.13988 14.4811L5.68433 11.9188C5.37155 11.5924 5.38258 11.0743 5.70896 10.7615C6.03533 10.4487 6.55347 10.4598 6.86625 10.7861L8.73084 12.7318L14.4152 6.80031C14.728 6.47393 15.2461 6.46291 15.5725 6.77569Z",
    xClose:      "M0.179803 0.179803C0.419541 -0.0599345 0.808233 -0.0599345 1.04797 0.179803L5.52499 4.65682L10.002 0.179804C10.2417 -0.0599339 10.6304 -0.0599339 10.8702 0.179804C11.1099 0.419542 11.1099 0.808234 10.8702 1.04797L6.39315 5.52499L10.8702 10.002C11.1099 10.2417 11.1099 10.6304 10.8702 10.8702C10.6304 11.1099 10.2417 11.1099 10.002 10.8702L5.52499 6.39315L1.04797 10.8702C0.808233 11.1099 0.419541 11.1099 0.179803 10.8702C-0.0599345 10.6304 -0.0599345 10.2417 0.179803 10.002L4.65682 5.52499L0.179803 1.04797C-0.0599345 0.808233 -0.0599345 0.419541 0.179803 0.179803Z",
    chevron:     "M0.144621 0.132121C0.332121 -0.0491294 0.625871 -0.0428794 0.807121 0.144621L3.12587 2.60712L5.44462 0.144621C5.62587 -0.0428794 5.91962 -0.0491294 6.10712 0.132121C6.29462 0.313371 6.30087 0.607121 6.11962 0.794621L3.46337 3.60712C3.37587 3.70087 3.25087 3.75087 3.12587 3.75087C3.00087 3.75087 2.87587 3.70087 2.78837 3.60712L0.132121 0.794621C-0.0491294 0.607121 -0.0428794 0.313371 0.144621 0.132121Z",
  };

  var E = {
    snappy:   "cubic-bezier(0.34,1.56,0.64,1)",
    slider:   "cubic-bezier(0.25,1.20,0.50,1)",
    progress: "cubic-bezier(0.20,1.30,0.50,1)",
    toggle:   "cubic-bezier(0.34,1.40,0.64,1)",
    toast:    "cubic-bezier(0.30,1.30,0.60,1)",
    dropdown: "cubic-bezier(0.30,1.20,0.60,1)",
  };

  var root = document.getElementById("showcase-root-mobile");
  if (!root) return;

  // ── CSS ──────────────────────────────────────────────────────────────────────

  var styleEl = document.createElement("style");
  styleEl.textContent = [
    "@keyframes sc-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }",
    "@keyframes sc-shimmer { from{background-position:200% 0} to{background-position:-200% 0} }",
    "@keyframes sc-toast-in { from{opacity:0;transform:translateY(11px) scale(0.92)} to{opacity:1;transform:translateY(0) scale(1)} }",
    "@keyframes sc-row-in  { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:translateX(0)} }",
    "#showcase-root-mobile * { box-sizing:border-box; }",
  ].join("\n");
  document.head.appendChild(styleEl);

  // ── Canvas ───────────────────────────────────────────────────────────────────

  var CANVAS_W = 390, CANVAS_H = 453;

  var outer = document.createElement("div");
  outer.style.cssText = "overflow:hidden;background:#FFA76C;";

  var canvas = document.createElement("div");
  canvas.style.cssText = "transform-origin:top left;position:relative;overflow:hidden;" +
    "font-family:'DM Sans',sans-serif;width:" + CANVAS_W + "px;height:" + CANVAS_H + "px;" +
    "background:#FFA76C;";

  outer.appendChild(canvas);
  root.appendChild(outer);

  function updateScale() {
    var s = Math.min(1, root.offsetWidth / CANVAS_W);
    canvas.style.transform = "scale(" + s + ")";
    outer.style.width  = Math.round(CANVAS_W * s) + "px";
    outer.style.height = Math.round(CANVAS_H * s) + "px";
  }
  updateScale();
  window.addEventListener("resize", updateScale);

  // ── Helpers ──────────────────────────────────────────────────────────────────

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

  // ── Spinner ── left 19, top 38, 52.385px ─────────────────────────────────────

  (function() {
    var wrap = div("position:absolute;left:19px;top:38px;width:52.385px;height:52.385px;");
    var trackSvg = makeSvg("0 0 52.385 52.385","52.385","52.385",[
      pth(P.spinnerRing,{"clip-rule":"evenodd",fill:"black","fill-opacity":"0.1","fill-rule":"evenodd"})
    ]);
    trackSvg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    var arcSvg = makeSvg("0 0 52.385 52.385","52.385","52.385",[
      pth(P.spinnerArc,{fill:"#012169"})
    ]);
    arcSvg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;" +
      "transform-origin:50% 50%;animation:sc-spin 0.95s linear infinite;";
    wrap.appendChild(trackSvg);
    wrap.appendChild(arcSvg);
    canvas.appendChild(wrap);
  })();

  // ── Toggle ── left 91, top 54 ────────────────────────────────────────────────

  (function() {
    var wrap = div("position:absolute;left:91px;top:54px;display:flex;align-items:center;gap:6.548px;");
    wrap.appendChild(span("Label","font-family:'DM Sans',sans-serif;font-size:13.1px;color:#2d363e;white-space:nowrap;"));
    var track = div(
      "display:flex;align-items:center;border-radius:9999px;" +
      "height:26.193px;width:39.289px;padding:0 3.274px;" +
      "background:#012169;transition:background 0.38s;"
    );
    var handle = div(
      "width:16.37px;height:16.37px;background:white;border-radius:50%;" +
      "transform-origin:center;transform:translateX(16.37px);" +
      "transition:transform 0.38s " + E.toggle + ";"
    );
    track.appendChild(handle);
    wrap.appendChild(track);
    var on = true;
    setInterval(function() {
      on = !on;
      track.style.background = on ? "#012169" : "#cbced4";
      handle.style.transform = on ? "translateX(16.37px)" : "translateX(0)";
      if (handle.animate) {
        handle.animate(
          [{scaleX:1,scaleY:1},{scaleX:1.06,scaleY:0.96},{scaleX:1,scaleY:1}],
          {duration:320, easing:"cubic-bezier(0.34,1.56,0.64,1)", fill:"none"}
        );
      }
    }, 2400);
    canvas.appendChild(wrap);
  })();

  // ── Skeleton Loader ───────────────────────────────────────────────────────────

  (function() {
    function shimmer(delaySec) {
      return div(
        "position:absolute;inset:0;" +
        "background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.5) 50%,transparent 100%);" +
        "background-size:200% 100%;" +
        "animation:sc-shimmer 3.2s " + (delaySec||"0s") + " linear infinite;"
      );
    }
    // Image rect
    var imgRect = div(
      "position:absolute;left:183px;top:37.68px;width:90.103px;height:55.666px;" +
      "border-radius:3.089px;overflow:hidden;background:rgba(0,0,0,0.1);"
    );
    imgRect.appendChild(shimmer("0s"));
    var photoWrap = div(
      "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" +
      "width:35.499px;height:27.892px;opacity:0.35;"
    );
    var photoSvg = makeSvg("0 0 35.4988 27.8919","100%","100%",[
      pth(P.photos,{"clip-rule":"evenodd",fill:"#6D7782","fill-rule":"evenodd"})
    ]);
    photoSvg.style.cssText = "width:100%;height:100%;";
    photoWrap.appendChild(photoSvg);
    imgRect.appendChild(photoWrap);
    canvas.appendChild(imgRect);
    // Text bars
    [
      {left:280.21, top:37.68,  width:86.822, delay:"0.15s"},
      {left:280.21, top:58.9,   width:83.084, delay:"0.30s"},
      {left:280.21, top:80.13,  width:96.792, delay:"0.45s"},
    ].forEach(function(b) {
      var bar = div(
        "position:absolute;left:" + b.left + "px;top:" + b.top + "px;" +
        "width:" + b.width + "px;height:13.293px;border-radius:3.089px;" +
        "overflow:hidden;background:rgba(0,0,0,0.1);"
      );
      bar.appendChild(shimmer(b.delay));
      canvas.appendChild(bar);
    });
  })();

  // ── Range Slider ── centered, top 129, width 351 ──────────────────────────────

  (function() {
    var sliderLeft = (CANVAS_W - 351) / 2; // 19.5px
    var wrap = div(
      "position:absolute;left:" + sliderLeft + "px;top:129px;width:351px;" +
      "display:flex;flex-direction:column;gap:6.548px;"
    );

    function makeField(initVal) {
      var fw = div("flex:1 0 0;min-width:1px;");
      var field = div(
        "height:39.289px;background:white;border-radius:3.274px;" +
        "border:0.819px solid rgba(0,0,0,0.2);position:relative;"
      );
      var lbl = span("Label",
        "font-family:'DM Sans',sans-serif;font-size:9.82px;color:#59636e;" +
        "position:absolute;top:3.5px;left:13.1px;"
      );
      var val = span(String(initVal),
        "font-family:'DM Sans',sans-serif;font-size:13.1px;color:#2d363e;font-weight:400;" +
        "position:absolute;bottom:6.548px;left:13.1px;"
      );
      field.appendChild(lbl);
      field.appendChild(val);
      fw.appendChild(field);
      return {fw: fw, val: val};
    }

    var minF = makeField(250), maxF = makeField(710);
    var inputRow = div("display:flex;align-items:center;gap:9.822px;");
    inputRow.appendChild(minF.fw);
    var sep = div("height:39.289px;display:flex;align-items:flex-end;padding-bottom:6.548px;flex-shrink:0;");
    sep.appendChild(span("–","font-family:Roboto,sans-serif;font-size:13.1px;color:#59636e;line-height:1.5;"));
    inputRow.appendChild(sep);
    inputRow.appendChild(maxF.fw);
    wrap.appendChild(inputRow);

    var TX = "0.8s " + E.slider;
    var trackArea = div("display:flex;flex-direction:column;gap:3.274px;");
    var trackWrap = div("position:relative;height:26.193px;");
    trackWrap.appendChild(div(
      "position:absolute;top:50%;transform:translateY(-50%);" +
      "left:0;right:0;height:3.274px;background:#e1e4e8;border-radius:9999px;"
    ));
    var trackActive = div(
      "position:absolute;top:50%;transform:translateY(-50%);" +
      "height:3.274px;background:#012169;border-radius:9999px;" +
      "left:4%;right:29%;transition:left " + TX + ",right " + TX + ";"
    );
    function mkHandle(pct) {
      return div(
        "position:absolute;top:50%;transform:translateY(-50%) translateX(-50%);" +
        "width:19.644px;height:19.644px;background:white;border:1.637px solid #012169;" +
        "border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.2);" +
        "left:" + pct + "%;transition:left " + TX + ";"
      );
    }
    var minH = mkHandle(4), maxH = mkHandle(71);
    trackWrap.appendChild(trackActive);
    trackWrap.appendChild(minH);
    trackWrap.appendChild(maxH);
    var minMax = div("display:flex;justify-content:space-between;");
    minMax.appendChild(span("0","font-family:'DM Sans',sans-serif;font-size:9.82px;color:#59636e;"));
    minMax.appendChild(span("1,000","font-family:'DM Sans',sans-serif;font-size:9.82px;color:#59636e;"));
    trackArea.appendChild(trackWrap);
    trackArea.appendChild(minMax);
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

  // ── Toast ── left 16, top 272, width 223 ─────────────────────────────────────

  (function() {
    var wrap = div("position:absolute;left:16px;top:272px;width:223px;");
    var toast = null, alive = true;

    function show() {
      if (toast) toast.remove();
      toast = div(
        "border-radius:3.274px;display:flex;align-items:flex-start;position:relative;" +
        "background:#2d363e;padding:13.096px 6.548px;gap:6.548px;" +
        "box-shadow:0 3px 16px rgba(0,0,0,0.18);" +
        "animation:sc-toast-in 0.5s " + E.toast + " forwards;"
      );
      var iconSvg = makeSvg("0 0 21.2814 21.2814","26.193","26.193",[
        pth(P.checkCircle,{"clip-rule":"evenodd",fill:"white","fill-rule":"evenodd"}),
        pth(P.checkTick,  {"clip-rule":"evenodd",fill:"white","fill-rule":"evenodd"}),
      ]);
      iconSvg.style.flexShrink = "0";
      var textWrap = div("flex:1;min-width:0;padding-right:26.193px;");
      var title = document.createElement("p");
      title.style.cssText = "font-family:'DM Sans',sans-serif;font-weight:800;font-size:13.1px;color:white;line-height:1.2;margin:0 0 3.274px;";
      title.textContent = "Title";
      var body = document.createElement("p");
      body.style.cssText = "font-family:'DM Sans',sans-serif;font-size:11.46px;color:white;line-height:1.5;margin:0;";
      body.textContent = "Provides a brief feedback that an action has been completed. ";
      body.appendChild(span("Undo","text-decoration:underline;font-size:11.46px;"));
      textWrap.appendChild(title);
      textWrap.appendChild(body);
      var closeBtn = document.createElement("button");
      closeBtn.style.cssText = "position:absolute;top:6.55px;right:6.55px;width:26.193px;height:26.193px;" +
        "display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;border:none;padding:0;";
      closeBtn.appendChild(makeSvg("0 0 11.05 11.05","11.05","11.05",[
        pth(P.xClose,{"clip-rule":"evenodd",fill:"white","fill-opacity":"0.6","fill-rule":"evenodd"})
      ]));
      toast.appendChild(iconSvg);
      toast.appendChild(textWrap);
      toast.appendChild(closeBtn);
      wrap.appendChild(toast);
    }

    function hide(cb) {
      if (!toast) { cb && cb(); return; }
      toast.style.transition = "opacity 0.2s,transform 0.2s";
      toast.style.opacity = "0"; toast.style.transform = "translateY(-5px) scale(0.96)";
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

  // ── Progress Bar ── left 16, top 397, width 220 ───────────────────────────────

  (function() {
    var wrap = div(
      "position:absolute;left:16px;top:397px;width:220px;" +
      "display:flex;flex-direction:column;gap:1.637px;"
    );
    wrap.appendChild(span("Label","font-family:'DM Sans',sans-serif;font-size:13.1px;color:#2d363e;font-weight:400;"));
    var row = div("display:flex;align-items:center;gap:6.548px;");
    var trackOuter = div(
      "position:relative;flex:1;height:13.096px;border-radius:9999px;" +
      "overflow:hidden;background:rgba(0,0,0,0.2);"
    );
    var fill = div(
      "position:absolute;left:0;top:0;height:100%;border-radius:9999px;" +
      "background:#ed6500;width:88%;transition:width 1.4s " + E.progress + ";"
    );
    trackOuter.appendChild(fill);
    var pctLbl = span("88%","font-family:'DM Sans',sans-serif;font-size:13.1px;color:#2d363e;font-weight:400;min-width:26px;text-align:right;flex-shrink:0;");
    row.appendChild(trackOuter);
    row.appendChild(pctLbl);
    wrap.appendChild(row);
    var VALS=[88,32,46,95,3,71,58,14,79,41], vi=0;
    function next() {
      setTimeout(function() {
        vi=(vi+1)%VALS.length;
        fill.style.width=VALS[vi]+"%";
        pctLbl.textContent=VALS[vi]+"%";
        next();
      }, 2400+Math.random()*600);
    }
    next();
    canvas.appendChild(wrap);
  })();

  // ── Listbox ── left 252, top 252, width 125 ───────────────────────────────────

  (function() {
    var SELECTED_ROW = 4;
    var HOVER_SEQ    = [0,1,2,3,4];
    var HOVER_HOLDS  = [300,260,230,210,480];
    var OPT_LABELS   = ["Option 1","Option 2","Option 3","Option 4","Option 5","Option 6"];

    var wrap = div("position:absolute;left:252px;top:252px;width:125px;");

    var inputBox = div(
      "position:relative;border-radius:2.5px;display:flex;align-items:center;" +
      "height:30px;background:white;box-shadow:0 0 0 0.625px rgba(0,0,0,0.2);" +
      "transition:box-shadow 0.2s;"
    );
    var inputInner = div("flex:1;padding:0 10px;overflow:hidden;");
    var inputSpan = span("Label","font-family:'DM Sans',sans-serif;font-size:10px;color:#59636e;display:block;");
    inputInner.appendChild(inputSpan);
    inputBox.appendChild(inputInner);

    var chevWrap = div(
      "position:absolute;right:6px;top:50%;transform:translateY(-50%);" +
      "transition:transform 0.3s " + E.snappy + ";transform-origin:center;"
    );
    chevWrap.appendChild(makeSvg("0 0 6.25174 3.75087","6.252","3.751",[
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
      selectedRow = ri;
      rowEls.forEach(function(r,i){
        var sel = i===ri;
        r.style.background = sel ? "rgba(1,33,105,0.04)" : "rgba(0,0,0,0)";
        var lbl = r.querySelector(".sc-opt");
        if(lbl){ lbl.style.color=sel?"#012169":"#2d363e"; lbl.style.fontWeight=sel?"600":"400"; }
        if(ckEls[i]){ ckEls[i].style.transform=sel?"scale(1)":"scale(0)"; ckEls[i].style.opacity=sel?"1":"0"; }
      });
      inputSpan.textContent = OPT_LABELS[ri-1]||"Label";
      inputSpan.style.color = "#2d363e";
    }

    function openDropdown() {
      if(popover) return;
      inputBox.style.boxShadow = "0 0 0 1px #012169";
      chevWrap.style.transform = "translateY(-50%) rotate(180deg)";

      popover = div(
        "position:relative;border-radius:5px;margin-top:2.5px;background:white;overflow:hidden;" +
        "box-shadow:0 0 0 1px rgba(0,0,0,0.05),0 2.5px 10px rgba(0,0,0,0.1);" +
        "height:0;opacity:0.6;transition:height 0.45s " + E.dropdown + ",opacity 0.3s;"
      );
      var inner = div("padding:10px;");
      rowEls=[]; ckEls=[];

      // Placeholder row
      var ph = div(
        "display:flex;align-items:center;border-radius:3.125px;height:25px;" +
        "padding:0 6.25px;background:rgba(0,0,0,0);transition:background 0.12s;" +
        "opacity:0;animation:sc-row-in 0.25s 0.04s ease forwards;"
      );
      ph.appendChild(div("width:18px;flex-shrink:0;"));
      ph.appendChild(span("Option","font-family:'DM Sans',sans-serif;font-size:12.5px;color:#6d7782;"));
      inner.appendChild(ph); rowEls.push(ph); ckEls.push(null);

      // Option rows
      OPT_LABELS.forEach(function(label,i){
        var delay = (0.06+i*0.045).toFixed(3)+"s";
        var row = div(
          "display:flex;align-items:center;border-radius:3.125px;height:25px;" +
          "padding:0 6.25px;background:rgba(0,0,0,0);transition:background 0.12s;" +
          "opacity:0;animation:sc-row-in 0.3s "+delay+" "+E.dropdown+" forwards;"
        );
        var ckSlot = div("width:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center;");
        var ckSvg = makeSvg("0 0 9 7","9","7");
        var ckPath = svgNS("path",{d:"M0.5 3.5L3.25 6.25L8.5 0.5",stroke:"#012169","stroke-width":"1.1","stroke-linecap":"round","stroke-linejoin":"round"});
        ckSvg.appendChild(ckPath);
        ckSvg.style.cssText = "display:block;transform:scale(0);opacity:0;transform-origin:center;transition:transform 0.25s "+E.snappy+",opacity 0.25s;";
        ckSlot.appendChild(ckSvg);
        row.appendChild(ckSlot);
        var lbl = span(label,"font-family:'DM Sans',sans-serif;font-size:12.5px;color:#2d363e;");
        lbl.className = "sc-opt";
        row.appendChild(lbl);
        inner.appendChild(row); rowEls.push(row); ckEls.push(ckSvg);
        if(selectedRow===i+1){
          lbl.style.color="#012169"; lbl.style.fontWeight="600";
          row.style.background="rgba(1,33,105,0.04)";
          ckSvg.style.transform="scale(1)"; ckSvg.style.opacity="1";
        }
      });

      // Overflow fade
      var fade = div(
        "position:absolute;bottom:0;left:0;right:0;height:30px;" +
        "background:linear-gradient(to top,white 20%,transparent 100%);" +
        "display:flex;flex-direction:column;align-items:center;justify-content:flex-end;" +
        "padding-bottom:4px;pointer-events:none;"
      );
      fade.appendChild(makeSvg("0 0 6.25174 3.75087","6.252","3.751",[
        pth(P.chevron,{"clip-rule":"evenodd",fill:"#6D7782","fill-rule":"evenodd"})
      ]));
      popover.appendChild(inner);
      popover.appendChild(fade);
      wrap.appendChild(popover);
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        popover.style.height="166.25px"; popover.style.opacity="1";
      }); });
    }

    function closeDropdown(cb) {
      if(!popover){ cb&&cb(); return; }
      inputBox.style.boxShadow = "0 0 0 0.625px rgba(0,0,0,0.2)";
      chevWrap.style.transform = "translateY(-50%) rotate(0deg)";
      popover.style.height="0"; popover.style.opacity="0";
      setTimeout(function(){ if(popover){popover.remove();popover=null;rowEls=[];ckEls=[];} cb&&cb(); }, 280);
    }

    function cycle(startDelay) {
      var ids=[];
      ids.push(setTimeout(function(){
        openDropdown();
        var t=480;
        HOVER_SEQ.forEach(function(ri,si){
          ids.push(setTimeout(function(){ setHovered(ri); }, t));
          t+=HOVER_HOLDS[si];
        });
        ids.push(setTimeout(function(){
          setSelected(SELECTED_ROW); setHovered(-1);
          ids.push(setTimeout(function(){
            closeDropdown(function(){ if(alive) ids.push(setTimeout(function(){ cycle(0); }, 2200)); });
          }, 600));
        }, t));
      }, startDelay||0));
    }

    cycle(800);
    canvas.appendChild(wrap);
  })();

})();