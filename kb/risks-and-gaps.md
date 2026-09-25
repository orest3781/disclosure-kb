# Risks and gaps

What the knowledge base can't vouch for, what nobody has built, and what could bite us later. Each item says what would resolve it.

## Unverified claims

| Claim | Source | Status | To resolve |
|---|---|---|---|
| XTTS-v2 weights are non-commercial | agent recall | marked "verify" | Read the Hugging Face model card |
| Stable Audio Open is free under $1M revenue | agent recall | marked "verify" | Read the Stability licence page |
| Stability API pricing | search snippets (page wouldn't load) | unverified | Open platform.stability.ai/pricing |
| OpenAI output ownership | terms pages returned 403 | unchecked | Read openai.com terms |
| Smithsonian, USGS M2M, FAA, Federal Register API details | pages returned 403/503 or bot checks | partial | Retry from a browser |
| Jev: 70–500 ms, 194× faster, 445× cheaper | TypeSafe's own claims; jev-benchmark measured 0.17–0.2 s; the three.js racer saw 0.8–1 s | vendor claims | Run the roadmap spike with our own timing |
| Laya, von, kev: local Jev alternatives with sub-15 ms decisions | READMEs, about a week old at the 2026-09-23 check | unverified | Benchmark against Jev on our NPC questions |
| `uap-release-01` mirror size (agent said 338 files / 15 GB; the repo says 132 / 2.4 GB) | mismatch | dropped the numbers | Not needed: use war.gov originals |

## Unproven sources

246 sources have under 100 stars, and 24 are archived or stale. The ones our plans lean on:
- `heist-one` (7★): the NPC architecture pattern. Copy the design, not the code, until we've read it.
- `starlink-viz` (30★), `skylight` (3.3k★ but new): sky-view projection patterns.
- `threejs-devtools-mcp` (109★): try before relying on it.
- `sstv-decoder` (38★), `Conspiracy-Board` (1★), `pursue-console` (6★), `meshy-cli` (8★): small and new.
- Every Jev game (1–47★) and most PURSUE tooling (0–154★): days to months old.

Rule: anything under 100 stars gets a spike before a dependency, and "Reference" if the spike fails.

## Gaps: what exists and what's ours to write

A targeted gap scan on 2026-09-23 added 185 sources. Status per gap:

| Gap | Status | Best finds | Still ours to build |
|---|---|---|---|
| FLIR, night-vision, radar effects | Partly | `kevtoe/worldview` (Cesium GLSL for NVG/FLIR, MIT), `MirzaBeig/Post-Processing-Scan` (radar/scan, Unlicense), `KingToot14/radar_shader` | The three.js `postprocessing` Effects themselves; a gun-camera / targeting-pod HUD (SVG/HTML overlay) |
| VHS and found-footage look | Filled | `felixturner/bad-tv-shader`, `Cyanilux/URP_RetroCRTShader` (port), `libretro/glsl-shaders` (check each file's licence) | |
| Vertex animation, impostors, crowds | Mostly | `sweriko/Horde`, `zadvorsky/three.bas`, `three-octahedral-impostor`; `openvat` bakes VATs (GPL, tool only) | A proven three.js VAT decoder (`three-vat` is brand new) and an animation blend tree |
| A 3D web mystery game to learn from | Partly | Design refs: `escoria-demo-game`, `popochiu`, COGITO (`r2d2m/Cogito` copy), `xesf/agrippa` (X-Files Game engine, reference) | Nothing polished in three.js/R3F; architecture still comes from `racing-game` + `heist-one` |
| Scene details | Partly | Decals (drei `Decal`), `threex.volumetricspotlight`, `threejs-volumetric-beam` (tractor beam), grass fields to flatten for crop circles, `SpaceshipGenerator` | Crop-circle generator, saucer shaders (glow, cloak) |
| Free CC0 3D assets | Filled | KayKit packs (confirm LICENSE), `KenneyNL/Starter-Kit-Basic-Scene`, Quaternius mirrors, `madjin/awesome-cc0`, `ToxSam/open-source-3D-assets` | |
| Quests, inventory, achievements, saves | Partly | `json-rules-engine`, `json-logic-js`, `mitt`, `superjson`/`devalue` + `lz-string`, `dnd-kit` | The quest, inventory and achievement systems (on zustand + xstate); Godot `quest-system`/`questify` for the data model |
| Deduction mechanics | Partly | `meteor/logic-solver` (prove each case has one solution), `tau-prolog` (testimony contradictions), `minisearch` (Her Story-style archive search), `talktown` (rumour spread) | The deduction board itself; no Obra Dinn / Her Story / Golden Idol clones exist |
| Evidence UI | Filled except redaction | `lookscanned.io`, `jquery.terminal`, `React95`, `zen-fs/core`, `ExifReader`, `img-encode` + `spectrology` | Redaction tool, numbers-station generator |
| Narrative tooling | Filled | wildwinter's `Ink-Localiser`, `Ink-Tester`, `Ink-Explorer`, `dink`, `screenplay-tools`; `vidstack/captions`; `YarnClassic` | A barks system (storylets + rule matching) |
| Accessibility and input | Partly | `hotkeys-js`, `contro`, `joymap`, `libDaltonLens` (port as a shader) | A gamepad remapping screen and options framework |
| Writing corpora | Partly | `dariusk/corpora` (CC0 per README), Standard Ebooks (War of the Worlds, Lovecraft: check each story), `gutendex` | Every UFO-mystery line of dialogue. SCP wiki is CC BY-SA (share-alike); X-Files scripts and TV Tropes are off-limits |
| Hearing transcripts, Disclosure Act | Partly | `unitedstates/congress` (CC0, bills not hearings), `usgpo/bulk-data`, `datamade/govinfo`, `selkind/chrg_tools` | Speaker-by-speaker transcripts: fetch the congress.gov/govinfo PDFs and split them |
| CIA CREST, FBI Vault | Partly | `history-lab/history-lab-mcp` (FOIArchive incl. CREST), `wretcher207/the-ufo-files` (FBI flying-discs OCR), MuckRock tools | A maintained CREST index. cia.gov is behind a bot wall: fetch slowly, by hand |
| Other official archives | Partly (thin) | GEIPAN loader, `uap-events-dataset` (CC BY 4.0 per README), `uk-ufo-map` | Blue Book index, AARO case data, Chile/Australia/Canada. Use GEIPAN CSVs, UK National Archives, archive.org |
| Explanations: meteors, launches, satellites, balloons, aurora | Mostly | `CroatianMeteorNetwork/RMS` (GPL tool; data CC BY), `WesternMeteorPyLib`, `launch-stats`, `satvis`, `findStarlink` (GPL tool), `glmtools`, `pysondehub`, `auroramaps`, adsb.lol history (ODbL, 2024+) | AMS API client; ADS-B history before 2023. Blitzortung lightning is non-commercial: don't ship it |
| Newspapers and declassified OCR | Filled | `AmericanStories` + `newswire` (CC BY 4.0 on HF), `chroniclingamerica.py`, `trove-newspaper-harvester`, `freelawproject/x-ray` (bad-redaction detector) | Redaction detection on image-only scans |

Details per finding are in the notes for each category and in [REVIEW.md](../REVIEW.md).

## Vendor and platform risks

| Risk | Exposure | Mitigation |
|---|---|---|
| Jev launched 2026-09-15; pricing and API may change | NPC judgment, triage, contact form | `DecisionEngine` interface with a scripted adapter first; local fallbacks (Laya) benchmarked |
| PURSUE mirrors disappear or change | Case-file text | Pull originals from war.gov; keep CC0 atlas text versioned in our repo |
| OpenSky blocks cloud IPs; Open-Meteo free tier is non-commercial | "Was it a plane / the weather?" | Build-time datasets; paid plan or self-host before release |
| Hosted voice/auth vendors keep our data (ElevenLabs agents, Clerk, Pusher, UploadThing) | Lock-in | Prefer LiveKit, Better Auth, R2, PartyKit-on-Workers |
| Lemon Squeezy is transitioning to Stripe Managed Payments | Sales | Decide late; Paddle is the alternative |
| GSAP and tldraw have non-OSS licences | UI animation, canvas | motion/anime.js and xyflow/excalidraw are the permissive routes |
| Google Photorealistic tiles and similar map providers have their own terms (gods-eye-view) | Globe visuals | openfreemap / PMTiles for anything shipped |

## Technical unknowns

- **R3F v9 + React 19 compatibility** of `react-three-offscreen`, `reagraph` and older R3F helpers: check on first use.
- **Rapier WASM on low-end mobile:** the 375×812 perf gate must hold; the BVH controller is the fallback.
- **WebGPU:** tooling is ready, coverage isn't. Ship WebGL.
- **In-browser TTS/STT memory:** Kokoro and Whisper on WebGPU compete with the 3D scene for GPU; measure before committing to voice mode on mobile.
- **Screenshot tests of WebGL** are only stable with a fixed seed, camera and clock, and the same GPU path in CI (SwiftShader or a pinned runner).
- **rrweb session replay** doesn't capture canvas content well; log game events alongside it.

## Open decisions (see stack.md)

Star catalogue (BSC5P vs HYG), saves (Dexie vs tinybase sync), co-op in scope or not, payments provider, WebGPU timing, entity system, and whether the new game lives inside oresth.com or as its own site.

## Ethics guardrails already in place

- No real people's voices or likenesses; fictional witnesses only.
- No scraping NUFORC/MUFON; no anti-bot tooling; no OSINT people lookups.
- No stripping provenance watermarks from anything we publish.
- Fictional paperwork must not pass as real government documents outside the game (no real seals, forms or IDs reproduced to deceive).
