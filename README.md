# Rosemary Li — personal website

A single-page static site. No build step, no dependencies, no framework:
open `index.html` in a browser, or serve the folder with anything
(`python3 -m http.server`).

## How the page works

One HTML file, three stages, driven by JavaScript rather than navigation:

1. **Landing** — "ROSEMARY LI" is drawn on a canvas out of hundreds of tiny
   letters that spring into place and scatter away from your cursor.
   Click anywhere (or press Enter/Space) to continue.
2. **Dialog** — a retro "Input Window Properties" window opens and a fake
   pointer walks over, clicks the text field and types the greeting,
   typo and backspace included, then settles on **OK**.
3. **Home** — pressing OK reveals the site: cover, About, News, Research,
   Experience, Education, Projects, Skills.

`index.html#home` skips straight to stage 3 — use that link when you want
someone to land on the content directly. The footer's "replay" link drops
the hash and reloads to watch the intro again.

## Layout

```
.
├── index.html
└── assets/
    ├── css/
    │   ├── base.css    design tokens, reset, primitives used site-wide
    │   ├── intro.css   landing canvas, retro dialog, fake pointer
    │   └── home.css    the site proper — nav, cover, sections, footer
    ├── js/
    │   ├── landing.js      "ROSEMARY LI" built from tiny letters on canvas
    │   ├── typewriter.js   fake pointer + typing inside the dialog
    │   ├── home.js         hand-off to home, scroll spy, News toggle, replay
    │   └── main.js         wires the three together
    └── img/
        ├── portrait.jpg
        └── triangulate-audit-framework.jpg
```

Load order matters. CSS goes `base` → `intro` → `home`, because `home.css`
deliberately overrides the two before it (and its own cover layer overrides
its section layout). In JS, the three modules register themselves on a
`window.RL` namespace and `main.js` initialises and connects them.

## Editing

- **Colours and type** live in `:root` at the top of `assets/css/base.css`.
- **Content** — News, Research, Experience, Projects and Skills are plain
  HTML in `index.html`. The News list shows the first three; `<li class="more">`
  entries are revealed by the toggle. If you add or remove entries, update the
  button's `+ show all 7` label in `assets/js/home.js`.
- **The typed greeting** is the `SCRIPT` array at the top of
  `assets/js/typewriter.js`: strings are typed, numbers are pauses in ms,
  and `{bs:n}` backspaces `n` characters.
- **Images** are ordinary files in `assets/img/`. `portrait.jpg` is 794×954;
  replacing it with the higher-resolution original is still worth doing.
- **Nav** — the Education and Skills sections have no nav link on purpose;
  they're reached by scrolling. To add one, copy an existing
  `<a href="#…" data-s="…">` in the header and the scroll spy picks it up.

The page honours `prefers-reduced-motion`: the landing, the pointer and the
typing are all skipped and the final state is shown immediately.
