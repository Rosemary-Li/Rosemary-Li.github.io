/* ============================================================
   main.js — page wiring for index.html.

   landing  <->  home view
   Arriving at #home directly (a bookmark, or a reload after entering)
   skips the landing; the name in the top-left goes back to it.
   ============================================================ */
(function () {
  var landing, home;

  home = RL.home.init({ onBackToIntro: function () { landing.reset(); } });
  landing = RL.landing.init({ onEnter: function () { home.show(); } });

  function start() {
    if (location.hash === '#home') { home.show(); return; }
    landing.start();
  }
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load('700 100px "IBM Plex Mono"'), document.fonts.load('500 12px "IBM Plex Mono"')]).then(start, start);
  } else start();
})();
