# impress.js Portfolio Conversion Plan

## Summary

Convert the existing vanilla JS portfolio site to use [impress.js](http://impress.js.org/) for a 3D guided-tour presentation. Hub-and-spoke navigation with the overview slide at center, section slides radiating outward, and dynamic content loading preserved.

## Design Decisions (Locked)

| Decision | Choice |
|---|---|
| Three.js background | Remove entirely, replace with CSS animated mesh |
| Project detail views | Hybrid inline expand on overview slide + dedicated slides |
| Navigation | Hub-and-spoke with clickable cards + mini-map |
| Data loading | Keep dynamic: `projects.json`, GitHub API, template fetch |
| Slide transitions | impress.js 3D transforms (rotate, scale, translate) |

## Slide Map

Each slide has 3D coordinates for impress.js positioning. The overview is at origin; other slides are positioned with rotations and translations for dramatic transitions.

| # | Slide | Position | Rotation |
|---|---|---|---|
| 1 | **Overview** (Hub) | `data-x="0" data-y="0"` | `data-scale="2"` |
| 2 | **Profile** | `data-x="1000" data-y="0"` | `data-rotate-y="90" data-scale="1"` |
| 3 | **Competencies** | `data-x="2000" data-y="0"` | `data-rotate-y="180" data-scale="1"` |
| 4 | **GitHub Stats** | `data-x="0" data-y="1000"` | `data-rotate-X="90" data-scale="1"` |
| 5 | **Projects Overview** | `data-x="-1000" data-y="0"` | `data-rotate-y="-90" data-scale="1"` |
| 6-N | **Individual Projects** | `data-x="-2000" data-y="N*500"` | `data-rotate-y="-180" data-scale="1"` |

Project slides (6-N) are generated dynamically from `projects.json`.

## Task List

### 1. Add impress.js dependency

- Download `impress.js` and `impress.min.js` to `libs/`
- Add `<link>` for `impressTheme.css` (or create custom theme CSS)

### 2. Replace Three.js background with CSS animated mesh

- Remove `script/three-background.js` and the Three.js CDN script tag
- Remove `FloatingTextBackground` initialization from `script.js`
- Create CSS background in `style.css`:
  - Dark gradient base (`#0a0a1a` to match existing)
  - CSS-animated grid/mesh overlay using `background-image` with `repeating-linear-gradient` and `@keyframes` for subtle movement
  - Optional: lightweight CSS particle dots using `::before`/`::after` pseudo-elements

### 3. Restructure `index.html` for impress.js

- Wrap all content in `<div id="impress">` with `<div class="step">` elements for each slide
- Add `impress()` initialization script at bottom of body
- Structure:
  ```html
  <div id="impress">
    <div id="overview" class="step" data-x="0" data-y="0" data-scale="2">
      <!-- Hub slide with clickable cards -->
    </div>
    <div id="profile" class="step" data-x="1000" data-y="0" data-rotate-y="90">
      <!-- Profile info -->
    </div>
    <div id="competencies" class="step" data-x="2000" data-y="0" data-rotate-y="180">
      <!-- Competencies list -->
    </div>
    <div id="github-stats" class="step" data-x="0" data-y="1000" data-rotate-X="90">
      <!-- Dynamic GitHub contributions -->
    </div>
    <div id="projects-hub" class="step" data-x="-1000" data-y="0" data-rotate-y="-90">
      <!-- Projects overview with expandable cards -->
    </div>
    <!-- Individual project steps injected dynamically -->
  </div>
  ```

### 4. Build the Overview (Hub) slide

- Static slide with clickable navigation cards for: Profile, Competencies, GitHub Stats, Projects
- Each card has `data-goto` attribute pointing to target slide ID
- Add mini-map: a small overlay showing all slide positions as dots, clickable to navigate
- Mini-map implementation:
  - Fixed-position panel in corner of slide
  - Dots positioned proportionally to actual slide coordinates
  - Click handler calls `impress().goto(id)`

### 5. Build Profile slide

- Migrate existing profile card content: profile image, name, title, location, intro paragraphs
- Keep LinkedIn link on profile image
- Preserve existing CSS classes (`.profile-card`, `.profile-img`, etc.)

### 6. Build Competencies slide

- Migrate existing competencies list into its own step
- Preserve `.competencies-card` styling

### 7. Build GitHub Stats slide

- Adapt `script/github-contributions.js` to render into the GitHub stats slide
- The `.contributions-grid` container moves into the `#github-stats` step
- Keep dynamic API fetch behavior unchanged

### 8. Build Projects Overview slide with inline expand

- Migrate the projects grid from `script.js` into `#projects-hub` step
- **Inline expand behavior:**
  - Clicking a project card toggles an `.expanded` class on that card
  - CSS transition expands the card in place (height grows, content fades in)
  - Content loaded via `fetch()` from the project's `template` URL (same as current modal flow)
  - If `.html` template, inject raw HTML; if `.md`, render with `marked.parse()`
  - A close/collapse button inside the expanded content retracts the card
  - Only one card expands at a time (collapsing one opens another)
- Add a "View Full Slide" button inside expanded content that navigates to the dedicated project slide via `impress().goto()`

### 9. Dynamically generate individual project slides

- After loading `projects.json`, create a `<div class="step">` for each project
- Each gets unique `data-x`/`data-y` coordinates spreading vertically from `(-2000, 0)`, `(-2000, 500)`, etc.
- Project title and thumbnail image rendered immediately
- Full content lazy-loaded when the slide becomes active (listen for `impress:stepenter` event)
- Include back navigation link to `#projects-hub`
- Call `impress().refresh()` after adding new steps

### 10. Wire up navigation

- Keyboard navigation (arrow keys) works by default with impress.js
- Click handlers on overview cards: `element.addEventListener('click', () => impress().goto(targetId))`
- Mini-map dot click handlers
- Hash-based navigation: `impress.js` supports `#slide-id` in URL
- Add `impress:initialized` handler to go to overview slide

### 11. Style adjustments for impress.js

- Update `style.css`:
  - `.step` base styles (width, max-width, centering)
  - `.step.active` styles for current slide highlight
  - Inline expand CSS: `.project-card.expanded` with `transition: max-height 0.4s ease`, `overflow: hidden`
  - Mini-map styles
  - Remove `.modal` styles (no longer needed)
  - Preserve existing `.card` and `.project-card` styles
  - Ensure `body.impress-enabled` styles work with the new background

### 12. Clean up

- Remove modal HTML from `index.html`
- Remove modal-related code from `script.js`
- Remove Three.js script tag and initialization
- Remove `libs/three.js` dependency references
- Remove unused CSS (`.modal`, `.modal-content`, `.close`, `.close-holder`)

## Data Flow

```
Page load
  ├─ Load projects.json → build project cards on overview + generate project slides
  ├─ Fetch GitHub contributions → render on GitHub stats slide
  ├─ Initialize impress.js → navigate to overview slide
  └─ impress:stepenter events → lazy-load project template content
```

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| impress.js doesn't support dynamic step addition well | Call `impress().refresh()` after injecting project slides; test thoroughly |
| Project templates contain full HTML with `<html>`, `<body>` tags | Strip outer tags when injecting; only use `<body>` content |
| Template CSS conflicts with main styles | Scope template styles or use shadow DOM for injected content |
| Mobile responsiveness with 3D transforms | Add `@media` queries to disable rotations on narrow screens; fall back to linear scroll |
| impress.js is unmaintained (last release 2014) | It's stable and spec-compliant; CSS3 transforms are universally supported. Acceptable for a portfolio site. |

## Validation

- [ ] All slides navigate correctly via keyboard arrows
- [ ] Overview cards click to correct slides
- [ ] Mini-map dots navigate correctly
- [ ] Project cards expand/collapse inline without navigation
- [ ] Project templates load and render correctly (both `.html` and `.md`)
- [ ] GitHub contributions count loads on GitHub stats slide
- [ ] Three.js background is fully removed (no console errors, no canvas element)
- [ ] CSS mesh background animates smoothly
- [ ] Hash-based navigation works (`#profile`, `#projects-hub`, etc.)
- [ ] No broken image paths in project templates (relative paths resolve correctly)
