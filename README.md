# Amlendu Shekhar — portfolio

Source for the portfolio at **<https://vasu021.github.io/AmlenduWeb/>**.

A static site: three files and two images, no build step, no dependencies to
install. Open `index.html` in a browser and it works.

## Layout

```
index.html            the whole page
404.html              not-found page
assets/styles.css     one neutral stone palette, defined as custom properties
assets/main.js        mobile nav, scroll-spy, project archive, copy-to-clipboard
assets/portrait.jpg   profile photo (460px, with a 920px @2x)
assets/favicon.svg
Amlendu_s_Resume.pdf   linked from the nav and the contact block
```

## Editing

- **Colours** — every surface and ink tone is a custom property in the `:root`
  block at the top of `assets/styles.css`. The palette is deliberately a single
  neutral: no light/dark toggle.
- **Projects** — the four featured cards are `.card` elements in
  `#projects`; everything below the fold lives in `#archive-panel` as `.mini`
  links. The toggle counts the cards itself, so adding one needs no JS change.
- **Experience** — each role is an `<article class="job">` in the timeline.
  Add `data-now="true"` to mark the current one.

## Running it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes

- The page works with JavaScript disabled: the nav falls back to an inline row
  and nothing is hidden behind a scroll animation.
- Fonts come from Google Fonts (Fraunces + Inter) with full system fallbacks.
