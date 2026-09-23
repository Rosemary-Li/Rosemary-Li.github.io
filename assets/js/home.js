/* ============================================================
   home.js — behaviour of the site proper (index.html only).

   Handles the hand-off from the intro to the home view, the sticky
   nav's solid/active states, the News "show all" toggle, and the
   footer link that replays the intro.

   RL.home.init(options) -> { show }
     options.stopIntro  called before the hand-off so the intro
                        animation stops mid-flight
   ============================================================ */
(function () {
  window.RL = window.RL || {};

  RL.home = {
    init: function (options) {
      options = options || {};
      var stopIntro = options.stopIntro || function () { };

      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      var win = document.getElementById('win'), ptr = document.getElementById('ptr');
      var topbar = document.getElementById('top'), navs = [].slice.call(document.querySelectorAll('.top-in nav a[data-s]'));

      // ---------- OK -> home ----------
      function goHome(instant) {
        stopIntro();
        document.getElementById('landing').style.display = 'none';
        var show = function () {
          document.body.classList.add('home'); window.scrollTo(0, 0);
          if (location.hash !== '#home') history.replaceState(null, '', '#home');
          var h = document.querySelector('.cover-name'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
          spy();
        };
        if (instant || reduce) { show(); return; }
        ptr.style.opacity = '0'; win.classList.add('closing'); setTimeout(show, 380);
      }

      // ---------- sticky nav: solid on scroll, section highlighting ----------
      function spy() {
        if (!document.body.classList.contains('home')) return;
        topbar.classList.toggle('solid', window.scrollY > window.innerHeight * 0.6);
        var cur = 'hero';
        navs.forEach(function (a) { var el = document.getElementById(a.dataset.s); if (el && el.getBoundingClientRect().top <= 120) cur = a.dataset.s; });
        navs.forEach(function (a) { a.classList.toggle('on', a.dataset.s === cur); });
      }
      window.addEventListener('scroll', spy, { passive: true });
      window.addEventListener('resize', spy);

      // ---------- News: show all / show less ----------
      var tog = document.getElementById('newstog');
      tog.addEventListener('click', function () {
        var l = document.getElementById('newslist'), o = l.classList.toggle('open');
        tog.setAttribute('aria-expanded', o); tog.textContent = o ? '– show less' : '+ show all 8';
      });

      // ---------- footer: replay the intro from the top ----------
      document.getElementById('rerun').addEventListener('click', function () {
        history.replaceState(null, '', location.pathname + location.search); location.reload();
      });

      return { show: goHome };
    }
  };
})();
