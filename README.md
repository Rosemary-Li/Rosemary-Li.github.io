# Rosemary Li — personal website

My personal website: a single-page static site. No build step and no
framework — open `index.html` in a browser, or serve the folder with
anything (`python3 -m http.server`). The only external request is the
IBM Plex font pair from Google Fonts.

## The two views

One HTML file, two views, switched by JavaScript rather than navigation:

1. **Landing** — "ROSEMARY LI" drawn on a canvas out of hundreds of tiny
   letters that spring into place and scatter away from the cursor. Click
   anywhere (or press Enter/Space) to enter.
2. **Home** — the site itself: profile header, About, News, Publications,
   Research Experience, Education, Selected Projects.

The footer's "run intro again" button returns to the landing; the letters
fly back from wherever they landed instead of restarting.
`index.html#home` skips the intro and lands on the content directly.
`prefers-reduced-motion` is honoured — the letters are placed at their
final positions and the exit scatter is skipped.

## Layout

```
.
├── index.html            all content lives here, as plain HTML
└── assets/
    ├── css/
    │   ├── base.css      design tokens, reset, site-wide primitives
    │   ├── landing.css   the dark opening screen
    │   └── home.css      the light content page
    ├── js/
    │   ├── landing.js    the canvas intro
    │   ├── home.js       view hand-off, sticky-TOC scroll spy
    │   └── main.js       wires the two together
    └── img/              portrait, project and figure images
```

Load order matters: CSS goes `base` → `landing` → `home`, since `home.css`
overrides the dark landing palette with the light one. The two JS modules
register on a `window.RL` namespace and `main.js` connects them.

## Editing

- **Content** — edit `index.html`. Every section is plain HTML: News is a
  `<ul class="news">` of dated lines, Publications and Selected Projects are
  `<article class="item">` blocks, and Research Experience and Education are
  `<div class="xrow">` entries — Education keeps a left-hand date column,
  while `xrow-plain` drops it and folds the dates into the line below.
- **Colours** — dark landing palette in `:root` at the top of
  `assets/css/base.css`; light content palette on `body.home` at the top of
  `assets/css/home.css` (declared there so the page background and every
  descendant inherit it). The content page stays light in both colour
  schemes; it does not follow system dark mode.
- **Nav** — the sticky table of contents beside the text is the nav. Each
  link carries `data-s="<section id>"`, and the scroll spy highlights
  whichever section you are in, so a new section needs a link added.
