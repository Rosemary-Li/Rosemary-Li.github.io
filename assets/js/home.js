/* ============================================================
   home.js — behaviour of the site proper (index.html only).

   Handles the hand-off from the landing to the home view and back, the
   sticky nav's solid/active states, and the News "show all" toggle.

   RL.home.init(options) -> { show }
     options.onBackToIntro  called after the home view is torn down, so
                            the landing can bring itself back
   ============================================================ */
(function () {
  window.RL = window.RL || {};

  RL.home = {
    init: function (options) {
      options = options || {};
      var onBackToIntro = options.onBackToIntro || function () { };

      var topbar = document.getElementById('top'), navs = [].slice.call(document.querySelectorAll('.top-in nav a[data-s]'));

      // ---------- landing -> home ----------
      function goHome() {
        document.getElementById('landing').style.display = 'none';
        document.body.classList.add('home'); window.scrollTo(0, 0);
        if (location.hash !== '#home') history.replaceState(null, '', '#home');
        var h = document.querySelector('.profile h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
        spy();
      }

      // ---------- home -> landing ----------
      function goIntro() {
        document.body.classList.remove('home');
        window.scrollTo(0, 0);
        history.replaceState(null, '', location.pathname + location.search);
        onBackToIntro();
      }

      // ---------- sticky nav: solid on scroll, section highlighting ----------
      function spy() {
        if (!document.body.classList.contains('home')) return;
        topbar.classList.toggle('solid', window.scrollY > 8);
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
        tog.setAttribute('aria-expanded', o); tog.textContent = o ? '– show less' : '+ show all 7';
      });

      // ---------- back to the intro: the name in the top-left, and the footer link ----------
      ['tointro', 'rerun'].forEach(function (id) {
        document.getElementById(id).addEventListener('click', function (e) { e.preventDefault(); goIntro(); });
      });

      return { show: goHome };
    }
  };
})();
