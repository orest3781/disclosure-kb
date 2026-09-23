# Stack decisions

One pick per layer, the alternatives considered, and why. Status: **decided** means the notes and review agree and nothing better turned up; **proposed** means it's the best candidate but unvalidated; **open** means a real choice remains.

Ground rules that shaped every pick: we run Next.js 16, React 19, Tailwind 4 and Vitest on Vercel, with the domain on Cloudflare. oresth.com's existing sky view uses plain three.js; a new game would use React Three Fiber.

## Rendering and game core

| Layer | Pick | Alternatives | Why | Status |
|---|---|---|---|---|
| Renderer | three.js + `@react-three/fiber` + `drei` | Babylon.js, PlayCanvas | drei already ships Sky, Stars, Cloud, PointerLockControls and useGLTF; the whole ecosystem below assumes R3F | decided |
| Next.js wiring | the `react-three-next` pattern | ad-hoc dynamic import | One persistent canvas across App Router routes; tunnel-rat renders DOM into the scene | decided |
| Physics and movement | `@react-three/rapier` + `ecctrl` | `three-mesh-bvh` + a physics-free controller | Sensors double as clue-zone triggers; ecctrl is a ready first-person capsule. Fall back to the BVH controller if Rapier's WASM is too heavy on mobile | decided |
| Post effects | `postprocessing` via `@react-three/postprocessing` | three.js `examples/jsm` passes | Bloom, noise, vignette, scanline, glitch; effect stacks switch by game state | decided |
| Sky | drei `Sky`/`Stars` first, `three-geospatial` for realism | Stellarium web engine (AGPL) | Physically based twilight and volumetric clouds under a permissive licence | proposed |
| Star data | HYG (CC BY-SA) or BSC5P JSON (CC BY) filtered to magnitude 6.5 | d3-celestial GeoJSON | ~9k naked-eye stars; BSC5P avoids share-alike | open: BSC5P unless we need HYG's depth |
| Particles | `three.quarks` | three-nebula | Has an editor for authoring beams and trails | proposed |
| Instancing | `agargaro/instanced-mesh` | raw InstancedMesh | Per-instance culling, BVH raycast and LOD, and instances stay clickable | proposed |
| Noise | `FastNoiseLite` (CPU + GLSL ports), `webgl-noise` in shaders | simplex-noise | The same noise on CPU and GPU keeps terrain collision and visuals aligned | decided |
| WebGPU | Not yet. Ship WebGL; keep TSL effects (`tslfx`) as an experiment | | Tooling (`webgpu_inspector`, `stats-gl`) is ready, but mobile coverage isn't | open |

## State, story, AI

| Layer | Pick | Alternatives | Why | Status |
|---|---|---|---|---|
| Game state | `zustand` | jotai, valtio | Readable inside `useFrame` without re-renders; `persist` handles saves | decided |
| Case and chapter flow | `xstate` | hand-rolled reducers | A case is a statechart: locked → investigating → contradiction found → revealed | decided |
| Dialogue | `ink` + `inkjs`, authored in `inky` | Yarn Spinner + bondage.js, Twine | MIT, writer-friendly, `story.state.toJson()` fits saves, external functions call into React | decided |
| Leads that unlock | storylets: `ink-storylets` | tiny-qbn pattern | Leads surface from what the player holds, not script order | proposed |
| NPC judgment | Jev (TypeSafe) behind a `DecisionEngine` interface, scripted adapter first | laya / von / kev (local) | Typed decisions in ~200 ms; the adapter boundary protects us if the vendor changes | proposed: see risks |
| NPC movement and senses | `yuka` | custom | Steering, FSM, vision cones, navmesh pathfinding | proposed |
| Entities | none until needed; then `koota` or `miniplex` | bitECS | Only worth it at high entity counts | open |
| Audio | `howler` for SFX and ambience, `Tone.js` for procedural drones and static | pizzicato | Spatial audio plus generative radio noise | decided |

## Investigation UI

| Layer | Pick | Alternatives | Why | Status |
|---|---|---|---|---|
| Conspiracy board | `xyflow` (React Flow) | tldraw (licence check), excalidraw | Evidence as nodes, links as edges; we can grade the player's graph. `graphology` holds the data model | decided |
| In-world computer | `xterm.js` + `os-gui` windows, skins from `98.css` → `XP.css` → `7.css` | daedalOS (whole desktop) | Her Story-style archive search with era-appropriate chrome | decided |
| Timeline | `vis-timeline` (swimlane per agency), `react-chrono` for evidence entries | TimelineJS | | proposed |
| Maps | `maplibre-gl-js` + `deck.gl` via `react-map-gl`; tiles from `openfreemap`/`PMTiles` | Leaflet (react-leaflet has a non-OSI licence) | Time-scrubbed paths and heatmaps, free self-hosted tiles | decided |
| Globe | `react-globe.gl` / `three-globe` | Cesium | Drops into the same three.js world | proposed |
| Documents | `react-pdf` / `pagedjs` for dossiers, `pdf-lib` for stamps and hidden payloads | takumi | Downloadable fictional case files | proposed |
| Fonts | `TT2020`, `Courier Prime`, `IBM Plex Mono`, `Departure Mono`, `Stick No Bills` | Google Fonts families | All OFL or MIT | decided |
| HUD framing | `augmented-ui`, `arwes` for animated reveals | | The "neon classified" layer with no images | proposed |

## Assets and content

| Layer | Pick | Alternatives | Why | Status |
|---|---|---|---|---|
| 3D generation | `TRELLIS` / `TRELLIS.2`, `TripoSR` / `TripoSG` | Hunyuan3D (avoid: region-locked), SF3D (revenue cap) | MIT code and weights | proposed |
| Mesh cleanup and rig | `autoremesher` → `UniRig` → `MaterialAnything` | Blender by hand | | proposed |
| Model pipeline | Blender (via `mcp-for-blender`) → `gltfjsx --transform` / `glTF-Transform` → KTX2 + meshopt | | Typed R3F components, small GLBs | decided |
| Images | ComfyUI (tool) with `Qwen-Image` / `Z-Image` / FLUX.2 klein 4B; `IC-Light` relighting; ControlNet from our own scene depth | Fooocus, Invoke | Apache models; readable in-image text for posters and stamps | proposed |
| Voices | `kokoro` (browser or offline) and `chatterbox` (expressive) | ElevenLabs paid, Cartesia paid, `dia` for two-person tapes | Apache/MIT weights; no real people's voices | decided |
| Music | `ACE-Step-1.5` | MusicGen, YuE (non-commercial) | MIT | proposed |
| Speech-to-text | `whisper.cpp` / `faster-whisper`; `transformers.js` + `ricky0123/vad` in-browser | Deepgram (hosted) | Local first, hosted for scale | proposed |
| Document text | `docling`, `OCRmyPDF` for searchable scans | MinerU, marker (licence terms) | MIT/MPL and accurate enough | decided |

## Production

| Layer | Pick | Alternatives | Why | Status |
|---|---|---|---|---|
| Component tests | `happy-dom` + Testing Library in Vitest; `@react-three/test-renderer` for scenes | jsdom | Fills oresth.com's "no component harness" gap | decided |
| 3D visual regression | Playwright `toHaveScreenshot` with fixed seed, camera and clock; `odiff`; `argos` or `reg-suit` for baselines | lost-pixel (archived) | | proposed |
| Accessibility | `react-three-a11y`, `axe-core` in Playwright | | | decided |
| i18n | `next-intl` (site shell) + `i18next` (dialogue, namespace per chapter); DeepL Pro for translation | Lingui | | proposed |
| Offline / PWA | `serwist` | Workbox directly | Cache GLB, KTX2 and audio | proposed |
| Saves | zustand `persist` + `Dexie`; `tinybase` if saves must sync | automerge | | open |
| Co-op | `cloudflare/partykit` + `yjs` | colyseus, trystero | Fits the Cloudflare domain; CRDT evidence board | open: only if co-op is in scope |
| Analytics | `umami` (site), PostHog (funnels and flags) | Plausible (AGPL) | Cookie-free, MIT | proposed |
| Errors | `GlitchTip` (Sentry-compatible, MIT) | Sentry (FSL), bugsink (source-available) | | proposed |
| Feature flags | `open-feature/js-sdk` over Flagsmith or GrowthBook | Vercel Flags | Swappable | proposed |
| Auth | `better-auth` | Clerk (hosted), Supabase | Users in our own DB; Auth.js merged into it | decided |
| Data | Neon (Postgres) or Cloudflare D1; Upstash Redis + `ratelimit-js` for leaderboards and rate limits | Turso, Supabase | Serverless-friendly; rate limits protect LLM and voice spend | proposed |
| Big assets | Cloudflare R2 | Vercel Blob | Free egress, S3-compatible | decided |
| LLM | Claude via the Vercel AI SDK; OpenRouter for A/B and fallback; Mistral Moderation for player text | OpenAI, Gemini | Output ownership and no-training terms; cached case-file prompt | decided |
| Payments | Paddle or Lemon Squeezy (merchant of record) | Stripe | Tax handled for us | open |
| Email and community | `react-email` on the existing Resend account; `discord.js` bot | Novu | | decided |

## Dev tooling

Claude Code MCPs in this order: `playwright-mcp`, `chrome-devtools-mcp`, `next-devtools-mcp`, `context7`; then `mcp-for-blender` for assets; then `codebase-memory-mcp` or `graphify` plus `rtk`/`headroom` once sessions get long. CLI: `rg`, `fd`, `fzf`, `bat`, `lazygit`, `gh`, `httpie`, `yt-dlp`, `ffmpeg` (tool only). A disclosure-kb MCP server (see [roadmap.md](roadmap.md)) would let any agent query this repo.
