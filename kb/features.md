# Features → tools, data and patterns

Each game feature, with what the knowledge base offers for it. "Pattern" names the reference project whose design we'd copy. Sources are in `catalog/`; the reasoning is in `notes/`.

## The investigation loop

| Feature | Build with | Real data | Pattern to copy |
|---|---|---|---|
| **Search the dump.** The player gets a large archive and a search box | `xterm.js` terminal, `os-gui` windows, `Dexie` for the local archive; Jev reranks code-retrieved pages | PURSUE pages (`ufo-pursue-open-atlas`, CC0), Blue Book OCR, Chronicling America clippings | `clmystery`, `sql-mysteries`, Her Story |
| **Conspiracy board.** Pin evidence, draw links, submit a theory | `xyflow` nodes and edges, `graphology` to grade the graph; Jev matches a typed theory to a hypothesis | `UFOlogyNet` people/program/event graph | `pursue-console`, `Conspiracy-Board` |
| **Lock in answers in threes** so guessing doesn't work | xstate case machine | | Obra Dinn (`ObraDinn-HintsAndCheck`) |
| **Present the contradiction** to a witness | ink knots selected by Jev (`noul`: does this evidence contradict statement X?) | | `objection_engine` / Ace Attorney |
| **UI that unlocks with clearance.** New panels, view modes and tools appear as the player rises | zustand flags, `arwes` reveal animations | | `adarkroom` |
| **Leads surface from evidence** rather than script order | `ink-storylets` | | quality-based narrative (`tiny-qbn`) |
| **Timeline** from Roswell to the hearings | `vis-timeline` swimlanes per agency | `ufo_data` chronologies (permission for commercial use), `veil` disclosure ledger, Congress.gov | |

## Characters

| Feature | Build with | Pattern |
|---|---|---|
| **Agents in black** who react to what they believe | Jev per-guard batch: `noul` threat, `score` suspicion, `choice` intent from legal actions, `choice` attention target; `yuka` vision cones and navmesh; Rapier sensors; a Decision Lens that shows the guard's beliefs | `heist-one` |
| **Witness interrogation** with no hallucination | All lines authored in ink; Jev only chooses the next knot; `score` composure | "select instead of generate" (TypeSafe skill) |
| **LLM witnesses** as an experiment | Claude via Vercel AI SDK with a fixed fact sheet per witness; Mistral Moderation on player input; `ratelimit-js` | `ai-murder-mystery-hackathon`, `grontown` |
| **Voice mode** | `ricky0123/vad` → `whisper.cpp`/`transformers.js` → Jev `noul` per NPC "is the player addressing this character?" → `kokoro` reply | `jev-benchmark` (F1 0.96 on addressee detection) |
| **Pre-recorded voices and tapes** | `chatterbox` (emotion), `dia` (two-person leaked recordings). Never real people | ElevenLabs policy on impersonation |
| **Human-like play-test bot** for Disclosure Protocol | Jev given code-computed board facts | `jev-benchmark` chess lesson: compute facts in code first |

## The phenomenon

| Feature | Build with | Data |
|---|---|---|
| **The UFO reacts to being watched** | Jev `choice` of manoeuvre from a legal set, given whether the player is filming, approaching, hiding or signalling; `three.quarks` beams | |
| **Sky recreation of a real incident** (Nimitz, 14 Nov 2004) | `astronomy` for planets and Moon, `satellite.js` on historical TLEs, `three-geospatial` sky, `suncalc` twilight; Sitrec's camera/jet/target geometry | Space-Track TLEs, `tic-tac-math` kinematics, Siphon upper-air sounding from NKX, Open-Meteo reanalysis |
| **"Was it a plane?"** | Historical ADS-B tracks near the site, `deck.gl` TripsLayer, N-number → type via the FAA registry (type only, no owners) | ADSB.lol (ODbL), IEM METARs for visibility |
| **"Was it Starlink / a satellite?"** | `satellite.js` + `tle.js`: is it sunlit while the observer is dark? | CelesTrak, Space-Track |
| **"Was it Venus / a fireball / a launch?"** | `astronomy`, CNEOS fireball API, Launch Library 2 | JPL, NASA |
| **"Was it a balloon?"** | Drift from launch site with winds aloft (`tawhiri` idea), radiosonde launch history | SondeHub, NCEI |
| **"Was it the weather?"** | Cloud cover, inversions, radar ducting | Open-Meteo, MetPy soundings |
| **Camera modes** (FLIR, night vision, radar) | Custom `postprocessing` Effects: luminance→heat LUT; green phosphor + noise + vignette; polar sweep SDF. `Cathode-Retro` / `webgl-crt-shader` for CRT | Nobody has built these for three.js; ours to write |
| **Mundane-explanation classifier** | `UFO-Detector` TF.js model (Starlink, lanterns, balloons) in the browser | |

## Places

| Feature | Build with |
|---|---|
| Crash sites and desert | `THREE.Terrain` or `ProceduralTerrains`, `FastNoiseLite`, `ez-tree`; AWS Terrain Tiles via `martini` for real terrain |
| Bunkers and labs | `rot.js` room-and-corridor layouts, `threejs-procedural-dungeon` for the 3D step, `pascalorg/editor` for floor plans |
| Towns for period sightings | `MapGenerator` (LGPL: separate module) |
| Props | AI pipeline: TRELLIS → autoremesher → MaterialAnything → gltfjsx; CC0 from Poly Haven and pmndrs market |
| Interiors that stay fast | `instanced-mesh` with clickable instances; `detect-gpu` quality tiers; `react-three-offscreen` if the UI thread suffers |

## Documents and props

| Feature | Build with |
|---|---|
| Fictional dossiers to download | `react-pdf` / `pagedjs` layout; `pdf-lib` stamps, redaction overlays and hidden payloads; `DocCreator` to age scans offline |
| Period newspapers | Chronicling America OCR and images; `exolve` crosswords inside them |
| Evidence photos | ComfyUI with `Qwen-Image` (readable text), ControlNet depth from our own scene so photos match the world, `IC-Light` relighting, then `chaiNNer` to age them |
| Enhance reveals | `juxtapose` before/after slider; `ffmpeg.wasm` in-browser processing |
| Found footage | `ntsc-rs` VHS pre-render, `Cathode-Retro` live |

## ARG layer

| Feature | Build with |
|---|---|
| Cipher chains | `CyberChef` (also self-hostable as the in-world decoder); test with `Ciphey`: if it auto-solves, it's too easy |
| Hidden in images | `steganography.js`; check with `AperiSolve` and `StegOnline` |
| Hidden in audio | Spectrogram pictures (`wavesurfer.js`, `spectro`), `ggwave` chirps, SSTV via `sstv-decoder`, RTTY via `minimodem` |
| Codes on props | `node-qrcode`, `bwip-js`; `zxing-js` scanner |
| Community | `discord.js` bot: timed drops, answer checks, clearance roles; `gph-site` model for unlock graphs |
| Daily case with a shared seed | `seedrandom`, `Rantjs`, `tracery`; solvability proven by construction (`mysterious-murder` idea) |

## Site and meta

| Feature | Build with |
|---|---|
| Contact-form triage | Jev `noul` spam + `choice` topic before Resend (the SDK README's own example) |
| Citation checks on research pages | Jev `noul` per claim against the archived snapshot (`citation-snapshots.ts` already exists) |
| Newsletter drops | `react-email` on Resend |
| Trailers and devlog videos | `hyperframes`, `yt-dlp` + `ffmpeg` for public-domain footage |
| Knowledge base upkeep | Jev triage of new repos (category, relevance, "is this really UAP?"); the planned disclosure-kb MCP server |
