/* ============================================================
   landing.js — the first screen.

   "ROSEMARY LI" is drawn off-screen, sampled on a grid, and each lit
   sample becomes a tiny letter that springs toward its home position
   and is shoved around by the pointer. Clicking (or Enter/Space) blows
   the letters outward and hands over to whatever runs next.

   RL.landing.init(options) -> { start, reset }
     options.onEnter  called once the landing has faded out
   ============================================================ */
(function () {
  var SEQ = 'rosemaryli', BEIGE = '#E9E1D2';

  window.RL = window.RL || {};

  RL.landing = {
    init: function (options) {
      options = options || {};
      var onEnter = options.onEnter || function () { };

      var landing = document.getElementById('landing'), cv = document.getElementById('dots'), ctx = cv.getContext('2d');
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      var P = [], glyphs = {}, W = 0, H = 0, dpr = 1, mouse = { x: -1e4, y: -1e4, on: false }, mode = 'live', exitT = 0, raf = null, done = false;

      function makeGlyphs(size) {
        glyphs = {};
        for (var i = 0; i < SEQ.length; i++) {
          var ch = SEQ[i]; if (glyphs[ch]) continue;
          var g = document.createElement('canvas'), w = Math.ceil(size * 0.7) + 2, h = Math.ceil(size * 1.3);
          g.width = w * dpr; g.height = h * dpr;
          var c = g.getContext('2d'); c.scale(dpr, dpr);
          c.fillStyle = BEIGE; c.font = '500 ' + size + 'px "IBM Plex Mono", ui-monospace, monospace';
          c.textBaseline = 'middle'; c.textAlign = 'center'; c.fillText(ch, w / 2, h / 2);
          glyphs[ch] = { img: g, w: w, h: h };
        }
      }
      function build() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var narrow = W < 700, step = narrow ? 6 : Math.max(7, Math.round(W / 200)), gsize = narrow ? 7 : step + 2;
        makeGlyphs(gsize);
        // draw the big word off-screen and sample it
        var off = document.createElement('canvas'), oc = off.getContext('2d');
        off.width = W; off.height = H;
        var lines = narrow ? ['ROSEMARY', 'LI'] : ['ROSEMARY LI'];
        var fs = narrow ? W * 0.2 : W * 0.125;
        oc.font = '700 ' + fs + 'px "IBM Plex Mono", ui-monospace, monospace';
        var widest = Math.max.apply(null, lines.map(function (l) { return oc.measureText(l).width; }));
        fs = Math.min(fs * (W * 0.86) / widest, H * (narrow ? 0.26 : 0.34));
        oc.font = '700 ' + fs + 'px "IBM Plex Mono", ui-monospace, monospace';
        oc.fillStyle = '#fff'; oc.textAlign = 'center'; oc.textBaseline = 'middle';
        var lh = fs * 1.02, top = H / 2 - (lines.length - 1) * lh / 2 - H * 0.03;
        lines.forEach(function (l, i) { oc.fillText(l, W / 2, top + i * lh); });
        var data = oc.getImageData(0, 0, W, H).data, old = P; P = [];
        var row = 0;
        for (var y = 0; y < H; y += step, row++) {
          var col = 0;
          for (var x = 0; x < W; x += step, col++) {
            if (data[(y * W + x) * 4 + 3] > 128) {
              var q = old[P.length];
              P.push({
                hx: x, hy: y, x: q ? q.x : Math.random() * W, y: q ? q.y : Math.random() * H, vx: 0, vy: 0,
                ch: SEQ[(col + row * 3) % SEQ.length], a: .55 + Math.random() * .45
              });
            }
          }
        }
        if (!raf) raf = requestAnimationFrame(tick);
      }
      function tick() {
        ctx.clearRect(0, 0, W, H);
        var R = Math.max(90, Math.min(W, H) * 0.14), R2 = R * R, fade = 1;
        if (mode === 'exit') { exitT += 1 / 60; fade = Math.max(0, 1 - exitT / 0.7); }
        for (var i = 0; i < P.length; i++) {
          var p = P[i];
          if (mode === 'live') {
            p.vx += (p.hx - p.x) * 0.045; p.vy += (p.hy - p.y) * 0.045;
            if (mouse.on) {
              var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
              if (d2 < R2 && d2 > 0.01) { var d = Math.sqrt(d2), f = (1 - d / R) * 7.5; p.vx += dx / d * f; p.vy += dy / d * f; }
            }
            p.vx *= 0.8; p.vy *= 0.8;
          } else { p.vx *= 1.04; p.vy *= 1.04; }
          p.x += p.vx; p.y += p.vy;
          var g = glyphs[p.ch];
          ctx.globalAlpha = p.a * fade;
          ctx.drawImage(g.img, p.x - g.w / 2, p.y - g.h / 2, g.w, g.h);
        }
        ctx.globalAlpha = 1;
        if (mode === 'exit' && fade <= 0) { raf = null; return; }
        raf = requestAnimationFrame(tick);
      }
      function enter() {
        if (done) return; done = true;
        if (!reduce) {
          mode = 'exit'; exitT = 0;
          var cx = mouse.on ? mouse.x : W / 2, cy = mouse.on ? mouse.y : H / 2;
          P.forEach(function (p) { var dx = p.x - cx, dy = p.y - cy, d = Math.sqrt(dx * dx + dy * dy) || 1, s = 3 + Math.random() * 6; p.vx = dx / d * s; p.vy = dy / d * s; });
        }
        landing.classList.add('gone');
        setTimeout(function () {
          landing.style.display = 'none';
          // stop drawing: without this the canvas keeps animating behind the
          // hidden element for the rest of the session
          if (raf) { cancelAnimationFrame(raf); raf = null; }
          onEnter();
        }, reduce ? 50 : 650);
      }
      function pt(e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; }
      landing.addEventListener('pointermove', pt);
      landing.addEventListener('pointerdown', pt);
      landing.addEventListener('pointerleave', function () { mouse.on = false; });
      landing.addEventListener('click', enter);
      document.addEventListener('keydown', function (e) {
        if (document.body.classList.contains('home')) return;
        if (!done && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); enter(); }
      });
      var rt; window.addEventListener('resize', function () { if (done) return; clearTimeout(rt); rt = setTimeout(build, 150); });

      function start() {
        build();
        if (reduce) { P.forEach(function (p) { p.x = p.hx; p.y = p.hy; }); }
      }

      return {
        start: start,
        // Come back from the home view. The scattered letters are still in P,
        // so rebuilding from where they landed flies them back into the name.
        reset: function () {
          done = false; mode = 'live'; exitT = 0;
          landing.style.display = '';
          landing.classList.remove('gone');
          start();   // build() restarts the animation loop
        }
      };
    }
  };
})();
