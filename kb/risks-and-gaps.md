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
| Laya, von, kev: local Jev alternatives with sub-15 ms decisions | READMEs, one week old | unverified | Benchmark against Jev on our NPC questions |
| `uap-release-01` mirror size (agent said 338 files / 15 GB; the repo says 132 / 2.4 GB) | mismatch | dropped the numbers | Not needed: use war.gov originals |

## Unproven sources

101 sources have under 100 stars, and 14 are archived or stale. The ones our plans lean on:
- `heist-one` (7★): the NPC architecture pattern. Copy the design, not the code, until we've read it.
- `starlink-viz` (30★), `skylight` (3.3k★ but new): sky-view projection patterns.
- `threejs-devtools-mcp` (109★): try before relying on it.
- `sstv-decoder` (38★), `Conspiracy-Board` (1★), `pursue-console` (6★), `meshy-cli` (8★): small and new.
- Every Jev game (1–47★) and most PURSUE tooling (0–154★): days to months old.

Rule: anything under 100 stars gets a spike before a dependency, and "Reference" if the spike fails.

## Nobody has built these (ours to write)

1. **FLIR, night-vision and radar post-effects for three.js.** Only tiny Unity repos exist. Plan: custom `postprocessing` Effects (heat LUT, phosphor + noise, polar sweep SDF).
2. **A 3D web mystery game to learn from.** The closest are 2D (`sql98detective`, `clmystery`) or adventure engines (`lba2remake`). Architecture comes from `racing-game` plus `heist-one`.
3. **Hearing transcripts and the UAP Disclosure Act text on GitHub.** Take them from govinfo and congress.gov.
4. **A CIA Reading Room / FBI Vault API.** Manual download only.
5. **A JS/TS quest system library.** Compose xstate + zustand + Dexie + ink state.
6. **An open UFO-mystery dialogue corpus.** Everything narrative is ours to write; procedural text (tracery, Rantjs) fills gaps.

## Vendor and platform risks

| Risk | Exposure | Mitigation |
|---|---|---|
| Jev is one week old; pricing and API may change | NPC judgment, triage, contact form | `DecisionEngine` interface with a scripted adapter first; local fallbacks (Laya) benchmarked |
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
