# 3D game tech: notes

Catalog: [catalog/3d-tech.md](../catalog/3d-tech.md)

## Recommended stack

| Layer | Pick | Why |
|---|---|---|
| Renderer | three + `@react-three/fiber` + `drei` | React 19 components, and drei already ships Sky, Stars, Cloud, Sparkles, PointerLockControls and useGLTF |
| Next.js wiring | Follow `pmndrs/react-three-next` | One persistent canvas across App Router routes, SSR-safe dynamic import, tunnel-rat to render DOM into the scene |
| Physics and movement | `@react-three/rapier` + `ecctrl` | Rapier sensors work as clue-zone triggers, and ecctrl gives a ready first-person capsule |
| Lightweight alternative | `three-mesh-bvh` (+ `hh-hang/three-player-controller`) | Interact raycasts and walking without a physics engine, if Rapier's WASM is too heavy |
| Post effects | `postprocessing` via `@react-three/postprocessing` | Bloom, noise, vignette, scanline, glitch, chromatic aberration and god rays, switched by game state |
| Sky | drei `Sky`/`Stars`, then `three-geospatial` for realism | Physically based twilight and night sky with volumetric clouds |
| Particles | `three.quarks` | Tractor beams, smoke and trails, authored in its editor |
| Game state | `zustand` (clues, inventory, flags), `xstate` (chapter and puzzle flow) | zustand can be read inside `useFrame` without re-renders |
| Entities | `koota` or `miniplex` | Only once there are many NPCs or drones |
| NPC behaviour | `yuka` | Patrols, vision cones, navmesh pathfinding |
| Audio | `howler` (SFX and ambience), `Tone.js` (procedural drones and radio static) | |
| Assets | Blender → `gltfjsx --transform` / `glTF-Transform` → KTX2 + meshopt | Small GLBs that load as typed components |
| Quality tiers | `detect-gpu` | Turn off volumetrics and SSAO on weak GPUs |
| Dev tooling | `leva`, `r3f-perf` | Tuning panel and perf overlay, both left out of production builds |

**Decision to make:** the oresth.com sky view uses three.js directly, without R3F. For a new game, R3F pays for itself: drei, rapier, ecctrl and the postprocessing wrapper all assume it. For Disclosure Protocol, stay on plain three.js and use the non-React versions: `postprocessing`, `three-mesh-bvh`, `three-stdlib`.

## Architecture to copy

- `pmndrs/racing-game` is the best full R3F game to read. It uses one zustand store, keeps levels and the HUD separate, and has settings with quality levels.
- `LBALab/lba2remake` is an adventure game in React + three. It has dialogue, inventory and scripted scenes, which are the systems a mystery game needs.
- `brunosimon/folio-2019` and `folio-2025` show a loading screen, interaction zones, and a day/night cycle and atmosphere.

## Gaps we'll have to build ourselves

- **FLIR, thermal, night-vision and radar views.** No usable three.js versions exist on GitHub. Build them as custom `postprocessing` Effects:
  - thermal: luminance mapped through a heat LUT
  - night vision: green phosphor with noise and vignette
  - radar: polar sweep SDF with decaying blips
  - For the noise, use `ashima/webgl-noise`. For CRT/NTSC, use `Cathode-Retro` or `webgl-crt-shader`.
- **A UFO or mystery 3D web game to learn from.** None with a meaningful star count showed up in the searches, so this niche is open.

## License cautions

- No license (reference only, don't copy): `lettier/3d-game-shaders-for-beginners`, `pmndrs/threejs-journey`, `pmndrs/use-cannon`.
- NOASSERTION (read the LICENSE file before reusing code): `lygia`, `thebookofshaders`, `pmndrs/uikit`, `pmndrs/xr`, `KTX-Software`.
- Copyleft: `bitECS` is MPL-2.0 (fine as a dependency; changes to its own files must stay open). `polyhavenassets` is GPL, but that covers the add-on only; Poly Haven assets are CC0.
