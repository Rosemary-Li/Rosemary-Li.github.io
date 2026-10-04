/* ============================================================
   home.js — behaviour of the site proper (index.html only).

   Handles the hand-off from the landing to the home view and back and the
   sticky table of contents' active state.

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

      var navs = [].slice.call(document.querySelectorAll('.toc a[data-s]'));

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

      // ---------- table of contents: highlight the section in view ----------
      function spy() {
        if (!document.body.classList.contains('home')) return;
        var cur = 'hero';
        navs.forEach(function (a) { var el = document.getElementById(a.dataset.s); if (el && el.getBoundingClientRect().top <= 90) cur = a.dataset.s; });
        // the last section is shorter than the viewport, so its top never
        // crosses the line: at the end of the page, highlight it anyway
        if (navs.length && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) cur = navs[navs.length - 1].dataset.s;
        navs.forEach(function (a) { a.classList.toggle('on', a.dataset.s === cur); });
      }
      window.addEventListener('scroll', spy, { passive: true });
      window.addEventListener('resize', spy);

      // ---------- back to the intro: the footer link ----------
      ['rerun'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('click', function (e) { e.preventDefault(); goIntro(); });
      });

      return { show: goHome };
    }
  };
})();
