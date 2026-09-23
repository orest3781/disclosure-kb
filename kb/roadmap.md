# Roadmap: experiments that validate the picks

Ordered so each spike de-risks the next. Each has a pass condition; a failed spike downgrades its sources to "Reference" in `REVIEW.md`.

## Phase 0: make the knowledge base queryable — done

**disclosure-kb MCP server** lives in `mcp/` (see [mcp/README.md](../mcp/README.md)): seven `kb_*` tools and `kb://docs/…` resources over stdio, with a smoke test against the built server. Pass condition met: any Claude session in any repo can answer "what do we use for X?" from the KB.

## Phase 1: the two riskiest bets (1 week)

1. **Jev spike.** A scripted `DecisionEngine` plus a Jev adapter, one guard, four batched questions, logged latency and cost from our region. Pass: p95 latency under 600 ms from a Vercel route; the guard's decisions read as sensible in a Decision Lens. Also benchmark Laya locally on the same questions.
2. **R3F + Next 16 canvas.** The `react-three-next` pattern with Rapier + ecctrl and the postprocessing stack, at the 375×812, 4× CPU, ≤16.7 ms median gate. Pass: the gate holds with one instanced interior and bloom on. Fallback: BVH controller, no Rapier.

## Phase 2: content pipelines (1 week)

3. **Case-file pipeline.** Ten PURSUE pages: docling → verify against scans → Dexie → searchable in an xterm.js terminal with os-gui chrome. Pass: search finds the pages; every page cites its record ID.
4. **Sky recreation.** Nimitz, 14 Nov 2004, 30°N 118°W: astronomy-engine + satellite.js on Space-Track TLEs + three-geospatial sky. Pass: the planets and any satellite passes match Stellarium desktop for the same time and place.
5. **Prop pipeline.** One concept → TRELLIS → autoremesher → MaterialAnything → gltfjsx. Pass: a textured GLB under 2 MB loads as a typed component.

## Phase 3: the investigation loop (2 weeks)

6. **Conspiracy board** in xyflow with graphology grading and the "lock in three" rule.
7. **Interrogation** in ink/inkjs where Jev selects knots on presented evidence; Decision Lens shows its reasoning.
8. **One complete case** end to end: archive search → board → interrogation → reveal, with xstate driving chapters and zustand `persist` saving progress.

## Phase 4: feel and reach (ongoing)

9. FLIR / night-vision / radar Effects (the gap nobody filled).
10. Voice mode spike: vad → whisper → Jev addressee detection → kokoro, measured on a mid-range phone.
11. Component tests (happy-dom + Testing Library) and Playwright screenshot baselines; wire umami, GlitchTip and OpenFeature flags.
12. First ARG drop: a CyberChef chain that Ciphey can't auto-solve, hidden in a spectrogram, announced by the discord.js bot.

## Decisions to make along the way

| When | Decision | Inputs |
|---|---|---|
| After spike 1 | Jev vs local decision model, or scripted only | latency, cost, quality |
| After spike 2 | Rapier vs BVH controller; WebGL only | perf gate |
| After spike 4 | BSC5P vs HYG stars | visual density vs share-alike |
| Before content at scale | Open-Meteo paid vs self-host; ADS-B source | terms and cost |
| Before accounts | Better Auth + Neon vs Supabase | scope of cloud saves and co-op |
| Before sale | Paddle vs Lemon Squeezy vs Stripe | merchant-of-record needs |
