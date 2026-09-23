/* ============================================================
   typewriter.js — the "Input Window Properties" dialog.

   A fake pointer walks in, clicks the text field, types the greeting
   (with one deliberate typo it backspaces over), then settles on OK.
   The real cursor takes over as soon as the sequence is done.

   OK stays clickable throughout, so you can skip ahead at any point.

   RL.typewriter.init() -> { play, stop }
   ============================================================ */
(function () {
  var FINAL = "Hello, World!\nI am Rosemary Li.\nWelcome to my website.";
  // Script of keystrokes: strings are typed, numbers are pauses (ms), {bs:n} is backspace
  var SCRIPT = ["Hello, World!", 380, "\n", 140, "I am Rosemary Li.", 420, "\n", 140, "Welcome to my websi", "et", 260, { bs: 2 }, 110, "te.", 0];

  window.RL = window.RL || {};

  RL.typewriter = {
    init: function () {
      var win = document.getElementById('win'), field = document.getElementById('field'), out = document.getElementById('out'),
          caret = document.getElementById('caret'), ptr = document.getElementById('ptr'), ok = document.getElementById('ok'),
          status = document.getElementById('status');
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      var run = 0, pos = { x: 0, y: 0 };

      function wait(ms, id) { return new Promise(function (res, rej) { setTimeout(function () { id === run ? res() : rej('stop') }, ms) }); }
      function setPtr(x, y) { pos.x = x; pos.y = y; ptr.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }
      function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
      function move(x, y, dur, id) {
        var sx = pos.x, sy = pos.y, cx = (sx + x) / 2 + (Math.random() - .5) * 120, cy = Math.min(sy, y) - 40 - Math.random() * 60, t0 = null;
        return new Promise(function (res, rej) {
          function f(ts) {
            if (id !== run) return rej('stop');
            if (t0 === null) t0 = ts;
            var t = Math.min(1, (ts - t0) / dur), e = ease(t), u = 1 - e;
            setPtr(u * u * sx + 2 * u * e * cx + e * e * x, u * u * sy + 2 * u * e * cy + e * e * y);
            t < 1 ? requestAnimationFrame(f) : res();
          }
          requestAnimationFrame(f);
        });
      }
      function center(el, dx, dy) { var r = el.getBoundingClientRect(); return { x: r.left + r.width * (dx || .5), y: r.top + r.height * (dy || .5) }; }
      function delay(ch) {
        if (ch === ' ') return 30 + Math.random() * 35;
        if (/[,.!]/.test(ch)) return 80 + Math.random() * 70;
        return 22 + Math.random() * 38;
      }
      async function play() {
        var id = ++run;
        out.textContent = ''; field.classList.remove('focus'); caret.classList.add('blink'); caret.style.visibility = 'hidden';
        ok.classList.remove('ready', 'hover', 'press');
        status.innerHTML = 'Ready.';
        ptr.className = 'ptr';
        if (reduce) {
          win.classList.add('on'); out.textContent = FINAL; caret.style.visibility = 'visible';
          ok.classList.add('ready'); status.innerHTML = 'Done. Press <b>Enter</b> to continue.';
          return;
        }
        try {
          win.classList.add('on');
          setPtr(window.innerWidth * .82, window.innerHeight * .86);
          await wait(500, id);
          ptr.style.opacity = '1';
          await wait(250, id);
          var f = center(field, .18, .35);
          status.innerHTML = 'Select input field…';
          await move(f.x, f.y, 1100, id);
          ptr.classList.add('ibeam');
          await wait(160, id);
          ptr.classList.add('click'); await wait(110, id); ptr.classList.remove('click');
          field.classList.add('focus'); caret.style.visibility = 'visible';
          status.innerHTML = 'Input active. Typing…';
          await wait(250, id);
          await move(f.x + 26, f.y + 64, 700, id);  // nudge the pointer out of the way
          await wait(450, id);

          caret.classList.remove('blink');
          for (var i = 0; i < SCRIPT.length; i++) {
            var s = SCRIPT[i];
            if (typeof s === 'number') { caret.classList.add('blink'); await wait(s, id); caret.classList.remove('blink'); continue; }
            if (s.bs) { for (var k = 0; k < s.bs; k++) { out.textContent = out.textContent.slice(0, -1); await wait(65, id); } continue; }
            for (var j = 0; j < s.length; j++) { out.textContent += s[j]; await wait(delay(s[j]), id); }
          }
          caret.classList.add('blink');
          status.innerHTML = '3 lines entered. Executing function…';
          await wait(700, id);

          var b = center(ok, .55, .6);
          ptr.classList.remove('ibeam');
          await move(b.x, b.y, 900, id);
          ok.classList.add('hover');
          ok.classList.add('ready');
          status.innerHTML = 'Done. Press <b>Enter</b> or click <b>OK</b> to continue.';
        } catch (e) { }
      }

      // Real mouse takes over: hide the fake pointer once the animation has finished
      window.addEventListener('pointermove', function () {
        if (ok.classList.contains('ready')) { ptr.style.opacity = '0'; ok.classList.remove('hover'); }
      }, { passive: true });
      document.addEventListener('keydown', function (e) {
        // Enter confirms whenever the dialog is up and we have not left for the home view
        if (e.key === 'Enter' && win.classList.contains('on') && !document.body.classList.contains('home')) {
          ok.classList.add('press'); setTimeout(function () { ok.click(); }, 120);
        }
      });
      window.addEventListener('resize', function () { if (ok.classList.contains('ready')) { ptr.style.opacity = '0'; } });

      return {
        play: play,
        // abandon whatever the sequence is doing right now (every await checks `run`)
        stop: function () { run++; }
      };
    }
  };
})();
