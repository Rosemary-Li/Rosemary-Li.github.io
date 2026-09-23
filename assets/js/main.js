/* ============================================================
   main.js — page wiring for index.html.

   landing  ->  typewriter dialog  ->  home view
   Arriving at #home directly (a bookmark, or a reload after OK)
   skips straight past the intro.
   ============================================================ */
(function () {
  var ok = document.getElementById('ok');

  var typewriter = RL.typewriter.init();
  var home = RL.home.init({ stopIntro: typewriter.stop });
  var landing = RL.landing.init({ onEnter: typewriter.play });

  ok.addEventListener('click', function (e) { e.preventDefault(); home.show(); });

  function start() {
    if (location.hash === '#home') { home.show(true); return; }
    landing.start();
  }
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load('700 100px "IBM Plex Mono"'), document.fonts.load('500 12px "IBM Plex Mono"')]).then(start, start);
  } else start();
})();
