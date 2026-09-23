# Web game engineering: notes

Catalog: [catalog/game-engineering.md](../catalog/game-engineering.md). Checked 2026-09-23.

These are the pieces between "cool demo" and "shipped game", matched to our stack: Next 16, R3F, Vitest, Vercel for hosting, Cloudflare for the domain.

## Recommended picks

| Need | Pick | Notes |
|---|---|---|
| Frame budget HUD | `stats-gl` | GPU timing on WebGL and WebGPU. Complements `r3f-perf` |
| Frame capture | `Spector.js` (WebGL), `webgpu_inspector` (WebGPU) | Find redundant draw calls and oversized textures |
| Keep the UI thread free | `react-three-offscreen` | R3F in a Web Worker. Check it works with R3F v9 and React 19 |
| Many props, clickable | `agargaro/instanced-mesh` (InstancedMesh2) | Per-instance culling, BVH raycast and LOD |
| Procedural sites | `FastNoiseLite` (matching CPU and GLSL noise), `ez-tree`, `rot.js` (bunker layouts, line of sight), `seedrandom` (reproducible cases) | `MapGenerator` for towns is LGPL, so keep it a separate module |
| Co-op investigation | `cloudflare/partykit` (Workers + Durable Objects) + `yjs` for the shared evidence board | Fits our Cloudflare domain. `colyseus` if we want a Node server; `trystero` for a zero-backend prototype |
| Analytics | `umami` (MIT, cookie-free) for the site; `PostHog` for funnels and flags | PostHog is MIT except `ee/`, and heavy to self-host |
| Error tracking | `GlitchTip` (MIT, Sentry-compatible) | `bugsink` is source-available (PolyForm Shield) |
| Feature flags | `open-feature/js-sdk` in front of `Flagsmith` (BSD) or `GrowthBook` | We can switch providers later |
| Component tests | `happy-dom` + `react-testing-library` in Vitest; `vitest-canvas-mock` | Fills the STATUS.md gap: "vitest is node only, no component harness" |
| 3D visual regression | `microsoft/playwright` `toHaveScreenshot` with a fixed seed, fixed camera and paused clock; `odiff` for diffs; `argos` or `reg-suit` to review baselines | `lost-pixel` is archived |
| Accessibility | `react-three-a11y` (focusable 3D evidence), `axe-core` in Playwright | |
| i18n | `next-intl` for the site shell, `i18next` for dialogue (a namespace per chapter) | |
| Offline / PWA | `serwist` | Cache GLB, KTX2 and audio so chapters replay offline |
| Saves | `tinybase` (local store plus sync), `idb-keyval` for simple save slots | `automerge` / `yjs` if saves must merge across devices |
| Input | `tinykeys`, `gamecontroller.js` | |
| Animation and game feel | `motion` (already in oresth.com), `tween.js` inside `useFrame`, `theatre` for cutscenes, `LittleJS` as a reference for camera shake and hit-stop | GSAP is free but **not open source** (its own licence) |
| Dev menus | `tweakpane`, `eruda` (on-device console behind `?debug`) | |

## Licence traps

- **AGPL:** Plausible, Unleash, OpenPanel and Rybbit are fine to self-host unmodified; if we modify them and serve them over a network, we must publish our changes.
- **Mixed or source-available:**
  - PostHog, GrowthBook and OpenReplay: MIT or AGPL except their `ee/` folders, which are proprietary.
  - Liveblocks: its server and CLI are AGPL.
  - bugsink: PolyForm Shield (not open source).
- **GSAP:** free "standard no-charge license", including commercial use, but with restrictions.
- **Theatre studio package:** check its licence before shipping it (historically AGPL).
