# Pipelines

Repeatable step-by-step flows. Each step names the tool and the licence check it needs. Commercially safe choices only; alternatives with restrictions are in the notes.

## 1. 3D prop: concept → game-ready model

```
concept image (ComfyUI, Qwen-Image / Z-Image)
   → mesh          TRELLIS / TRELLIS.2 or TripoSR / TripoSG (MIT)
   → clean topology autoremesher (MIT) → meshoptimizer / gltfpack
   → rig (chars)   UniRig (MIT); animation via mixamo-llm-mocap or Mixamo
   → materials     MaterialAnything (MIT), or MV-Adapter (check the base model's licence)
   → polish        Blender via mcp-for-blender + blender-skills
   → export        gltfjsx --transform  (KTX2 textures, meshopt compression, typed R3F component)
   → QA            three-gltf-viewer; detect-gpu tiers decide LOD
```
Check: Hunyuan3D is not in this pipeline (no licence in the EU/UK/South Korea). SF3D only under $1M revenue. TRELLIS.2 rendering uses nvdiffrast, which has NVIDIA's own licence.

## 2. Case file: declassified PDF → searchable in-game document

```
original       war.gov / NARA / FBI Vault (public domain)   ← always keep the source URL
   → text      docling (MIT) → Markdown per page
   → scan      OCRmyPDF (MPL) adds a text layer so the real scan stays searchable
   → verify    compare quotes against the scan (LLM OCR invents text)
   → index     Dexie in the browser (or Postgres on the server)
   → cite      NARA ID / PURSUE record ID on every in-game document
```
Check: mirror repos' OCR text has the mirror's licence (often none). Use CC0 re-extractions (`ufo-pursue-open-atlas`) or make our own from the originals. Never NUFORC.

## 3. Real-world data: fetch at build time, bake to JSON

```
build script (Python: skyfield / astroquery / traffic / siphon; or JS)
   → sky state per incident     astronomy-engine + satellite.js on Space-Track TLEs
   → weather per incident       Open-Meteo reanalysis (paid/self-host for a shipped game), IEM METARs, NCEI
   → nearby sites               Overpass (airbases, radar, observatories), geocode once via Nominatim
   → flights                    ADSB.lol history (ODbL attribution), FAA registry for type only
   → launches / fireballs       Launch Library 2, CNEOS
   → clippings                  loc.gov Chronicling America (20 req/min; cache)
   → JSON in the repo           versioned, attributed, never refetched at runtime
```
Runtime calls are the exception: a cached Vercel route for live widgets (tonight's sky, current passes), rate-limited with `ratelimit-js`.

## 4. Voice lines

```
script in ink → line IDs
   → pre-recorded    kokoro (Apache) for bulk; chatterbox (MIT) for expressive leads; dia for two-person tapes
   → tapes/radio     Tone.js static and band-limiting, pizzicato effects, ntsc-rs for video
   → subtitles       whisperX word timestamps
   → live (optional) LiveKit Agents worker: vad → STT → Jev/Claude → kokoro; not on Vercel functions
```
Check: no cloned voices of real people. ElevenLabs bans impersonating officials even with permission; our own rule is the same for every provider.

## 5. Images and posters

```
prompt → ComfyUI (GPL tool, outputs are ours) with Apache models
   → consistency   ControlNet depth/lineart rendered from our own R3F scene
   → lighting      IC-Light
   → ageing        chaiNNer: grain, JPEG artefacts, colour shift; as-dithered-image for 1-bit fax
   → cut-outs      rembg
   → upscale       Real-ESRGAN
   → textures      KTX2 via glTF-Transform
```

## 6. Puzzle QA

```
design cipher chain in CyberChef
   → run Ciphey: auto-solved? too easy, add a layer
   → hide payloads: steganography.js (image), spectrogram / ggwave / SSTV (audio), pdf-lib (metadata)
   → attack it with AperiSolve + StegOnline (what real ARG players use)
   → unlock graph and hints modelled on gph-site; answers checked server-side
```

## 7. Play-testing and release

```
unit    Vitest + happy-dom + Testing Library (engine and UI)
scene   @react-three/test-renderer
visual  Playwright toHaveScreenshot (fixed seed, camera, clock) → odiff → argos/reg-suit baselines
perf    stats-gl in dev; chrome-devtools-mcp traces; the 375×812, 4× CPU, ≤16.7 ms gate
a11y    axe-core in Playwright; react-three-a11y on 3D interactables
telemetry umami (site), PostHog funnels for "where do players get stuck"; GlitchTip for errors
release  itch.io butler for builds; Paddle/Lemon Squeezy for sales; react-email drops
```

## 8. Knowledge-base upkeep

```
new candidate repo
   → search GitHub for stars, licence, status (never from memory)
   → Jev triage: category, relevance score, "is this about UAP or the font format?"
   → add to sources.json → build-index → build-review → CI check
   → write the finding in notes/<category>.md; decisions that cross areas go in kb/
```
