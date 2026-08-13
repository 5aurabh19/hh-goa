# HH Goa 2026 — Builder ID Generator (v2)

Two-screen builder flow with optional Vercel server routes for public X sharing.

## Setup

```bash
npm install
npm run dev
```

Open the printed `localhost` URL.

## Structure

```
src/
  components/
    IntroScreen.jsx       Screen 1 — intro + upload
    BuilderWorkspace.jsx  Screen 2 — wires every section together
    PhotoEditor.jsx        drag (Pointer Events) + zoom slider + reset
    BuilderForm.jsx         name/handle/role, inline validation, role chips
    TechStackInput.jsx      tag input, validated against a predefined tech list
    PersonalitySelector.jsx max-3 trait chips
    BuilderTagDisplay.jsx   shows + shuffles the generated Builder Tag
    ThemeSelector.jsx       5 swatch cards
    BuilderPreview.jsx      live canvas preview
    ResultActions.jsx       generate / share / download / reset
  utils/
    titleGenerator.js   rule-based Builder Tag + Builder Type engine
    techSuggestions.js  predefined tech/role lists + prefix matching
    themes.js            5 theme color objects (not CSS — read by canvas)
    imageUtils.js        validation, HEIC conversion, crop/pan/zoom math
    canvasGenerator.js   draws + exports the 1200x1200 PNG
    shareUtils.js         public-share upload + X intent flow
  ../api/
    share.js              uploads the generated pass PNG to public Vercel Blob
    collectible.js        returns per-pass Open Graph / X card metadata
  App.jsx     2-screen state machine
  main.jsx
  styles.css  <- the ONE stylesheet, CSS variables at the top
```

## Key implementation notes

- **Photo editor ↔ canvas parity**: `PhotoEditor.jsx` renders the crop
  using the exact same math as the PNG export (`getTransformedCropRect`
  in `imageUtils.js`), converting on-screen drag pixels into source-image
  pixels at drag time. What you see while dragging is what gets exported.
- **Themes are data, not CSS.** `utils/themes.js` holds plain hex values
  the canvas reads directly — the page UI (buttons, cards) stays on the
  `styles.css` variables regardless of which card theme is picked.
- **Tech stack validation**: only exact matches (case-insensitive) against
  `TECH_LIST` become chips; free text alone shows the inline error.
- **Builder Tag** always resolves to something — specific role+trait rule
  → role-only fallback → generic fallback, so it can never come back empty.

## Testing checklist

- [ ] Upload JPG / PNG / HEIC
- [ ] Drag photo — preview and later export match
- [ ] Zoom slider — face stays visible, no gap around the circle
- [ ] Reset — returns to centered, scale 1
- [ ] Name: reject numbers/symbols, accept apostrophes/hyphens
- [ ] Handle: accepts with/without `@`, normalized on the card
- [ ] Role: typing filters chips; picking a chip fills the field
- [ ] Tech stack: typing filters suggestions; only list items become chips; Enter doesn't submit anything else
- [ ] Personality: blocked at 3 selections, counter updates
- [ ] Builder Tag updates when role/traits change; Shuffle cycles to a different valid tag
- [ ] Theme switch updates live preview immediately
- [ ] Generate → Download PNG opens in portrait pass proportions
- [ ] POST TO X: opens a populated X composer with a public collectible URL
- [ ] Mobile viewport (375–430px): no horizontal scroll, single column
- [ ] Desktop (900px+): two-column layout, preview sticky on scroll
- [ ] Make Another resets fully

## Deploy

For basic static use:

```bash
npm run build
```

For public X image previews, deploy on Vercel: `vercel` in the project root
(Vite preset, output `dist`). Create a **Public** Vercel Blob store and connect
it to the project; Vercel provides `BLOB_READ_WRITE_TOKEN` automatically. If
using a custom domain, set `PUBLIC_SITE_URL` to that canonical URL.

The exact generated PNG is uploaded once to public Blob storage. `/api/share`
returns a unique share URL; `/api/collectible` serves dynamic Open Graph and X
Card metadata pointing at that same PNG. A plain local Vite preview does not
have public storage, so sharing returns a friendly retryable error there.

### Required Vercel configuration

- `BLOB_READ_WRITE_TOKEN` — added automatically when a **Public** Vercel Blob
  store is connected to the project.
- `PUBLIC_SITE_URL` — optional but recommended: the canonical deployed URL,
  such as `https://your-domain.com`.
- `VITE_SHARE_API_ORIGIN` — optional local-development override. By default,
  local Vite uploads to `https://hacker-house-goa-chi.vercel.app`; set this to
  your canonical deployed URL if it differs.
- `VITE_PUBLIC_APP_URL` — optional local-development override for the public
  app URL. A `/share/<id>` URL is included only after its PNG and metadata
  upload succeeds, preventing broken individual Builder ID links.
