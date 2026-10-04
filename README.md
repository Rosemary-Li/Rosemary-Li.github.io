# Rosemary Li — personal website

A single-page static site. No build step, no dependencies, no framework:
open `index.html` in a browser, or serve the folder with anything
(`python3 -m http.server`).

## How the page works

One HTML file, two views, driven by JavaScript rather than navigation:

1. **Landing** — "ROSEMARY LI" is drawn on a canvas out of hundreds of tiny
   letters that spring into place and scatter away from your cursor.
   Click anywhere (or press Enter/Space) to enter.
2. **Home** — the site: profile header, About, News, Research, Experience,
   Education, Projects, Skills.

You can go back: clicking **Rosemary Li** in the top-left (or "run intro
again" in the footer) tears down the home view and replays the landing. The
scattered letters fly back in from wherever they landed rather than starting
over, so it reads as one continuous animation.

The landing is dark on purpose; the content page is light. The content layout
follows the academic convention of [zhihanjiang.com](https://zhihanjiang.com/)
and [lsl.zone](https://lsl.zone/): one centred column about 880px wide,
sans-serif body text at 17px/1.72, sections separated by hairline rules, and
a profile header of avatar + name + affiliation + contact.

`index.html#home` skips straight to stage 3 — use that link when you want
someone to land on the content directly. The footer's "replay" link drops
the hash and reloads to watch the intro again.

## Layout

```
.
├── index.html
└── assets/
    ├── css/
    │   ├── base.css     design tokens, reset, primitives used site-wide
    │   ├── landing.css  the dark opening screen
    │   └── home.css     the site proper — light academic layout
    ├── js/
    │   ├── landing.js   "ROSEMARY LI" built from tiny letters on canvas
    │   ├── home.js      hand-off both ways, scroll spy, News toggle
    │   └── main.js      wires the two together
    └── img/
        ├── portrait.jpg
        └── triangulate-audit-framework.jpg
```

Load order matters. CSS goes `base` → `landing` → `home`: `base.css` sets the
dark landing palette, and `home.css` overrides it with the light one. Those
light custom properties are declared on `body.home`, not on `.home-wrap` —
custom properties inherit downward, so the page background could not see them
if they lived on a child. In JS, the two modules register themselves on a
`window.RL` namespace and `main.js` initialises and connects them:
`landing.onEnter` calls `home.show()`, `home.onBackToIntro` calls
`landing.reset()`.

## Editing

- **Colours** — the dark landing palette is in `:root` at the top of
  `assets/css/base.css`; the light content palette is the `--paper` / `--ink` /
  `--soft` / `--rule` / `--accent` block at the top of `assets/css/home.css`.
- **Measure and rhythm** — content width (`880px`), body size and line height
  are set on `.home-main` / `body.home .home-wrap` in `assets/css/home.css`.
- **Content** — News, Research, Experience, Projects and Skills are plain
  HTML in `index.html`. The News list shows the first three; `<li class="more">`
  entries are revealed by the toggle. If you add or remove entries, update the
  button's `+ show all 7` label in `assets/js/home.js`.
- **Images** are ordinary files in `assets/img/`. `portrait.jpg` is 794×954
  and is cropped to a circle by `.avatar`; replacing it with the
  higher-resolution original is still worth doing.
- **Nav** — each link carries `data-s="<section id>"` and the scroll spy
  highlights whichever section you are in. Skills has no link (it is the last
  section); add one by copying an existing `<a href="#…" data-s="…">`.
  `class="hide-s"` hides a link on narrow screens.

The page honours `prefers-reduced-motion`: the letters are placed directly at
their final positions and the scatter-on-exit is skipped.

The content page is light in both colour schemes — it does not follow the
system dark-mode preference. To change that, add a
`@media (prefers-color-scheme: dark)` block overriding the palette on
`body.home`.
