# Knowledge base: start here

This folder is the **analysis layer** of disclosure-kb. The rest of the repo lists sources; this folder says what they add up to. It's organized by what we're building, not by where each source came from.

| Read | When |
|---|---|
| [stack.md](stack.md) | You need to pick a library, service or tool: one decision per layer, with the alternatives and why |
| [features.md](features.md) | You're building a game feature: which tools, data, patterns and reference projects it maps to |
| [pipelines.md](pipelines.md) | You're producing assets, documents, data or voices: the step-by-step pipelines |
| [data-sources.md](data-sources.md) | You want real-world material (case files, sky, weather, flights): where it comes from and the rules for each source |
| [licensing.md](licensing.md) | Before copying code, shipping a model's output, or redistributing data |
| [risks-and-gaps.md](risks-and-gaps.md) | What's unverified, unproven, missing, or a vendor risk |
| [roadmap.md](roadmap.md) | What to try first: ordered experiments that validate the top picks |
| [glossary.md](glossary.md) | Terms from UFO research, aerospace data and our stack |

## How the layers fit together

```
sources.json ──► catalog/*.md   one row per source (generated)
      │
      ├───────► REVIEW.md       one verdict per source (generated)
      │
notes/*.md ───► per-category findings and recommendations (written)
      │
kb/*.md ──────► cross-cutting analysis: stack, features, pipelines, policy (written)
```

Edit `sources.json` for facts about a source. Edit `notes/` for findings within one area. Edit `kb/` for decisions that cut across areas. `REVIEW.md`'s verdicts live in `scripts/build-review.mjs`.

## The corpus in numbers

629 sources in 11 categories, checked against GitHub on 2026-09-23.

| | Count | What it tells us |
|---|---:|---|
| Permissive licence (MIT, Apache, BSD, ISC, CC0, OFL…) | 474 (75%) | Most of what we need can go straight into the game |
| No licence at all | 59 | Read-only: all rights reserved by default |
| GitHub couldn't classify the licence | 45 | We read the LICENSE file for the ones that matter; the rest need a look before use |
| GPL / AGPL | 35 | Tools and services to run, never code to bundle |
| Under 100 stars | 101 | Unproven; a fifth of the sky, Jev and API entries |
| 10k stars or more | 157 | The mature core of the stack |
| Archived or stale | 14 | Reference only |
| Marked "verify" or "unverified" in the notes | 4 | Two model licences, two pricing pages that wouldn't load |
| Verdict: Adopt | 122 | The recommended pick for each job |
| Verdict: Avoid / Prototype only | 11 | Region-locked or non-commercial models, and two data dumps |

Three things the numbers hide:

1. **The niche is empty where it matters most.** No well-known open-source UFO mystery game, no 3D web mystery game, no FLIR/night-vision/radar shaders for three.js. Those are ours to build (see [risks-and-gaps.md](risks-and-gaps.md)).
2. **The hard constraints are on data, not code.** The code is 75% permissive. The data (NUFORC, OpenSky, star catalogues, model weights) is where the "never ship this" rules live (see [licensing.md](licensing.md)).
3. **The newest things are the least proven.** Jev (one week old), the PURSUE mirrors (four months old) and most AI 3D generators have small, fast-moving repos. The roadmap validates them before anything depends on them.
