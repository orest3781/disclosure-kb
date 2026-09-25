# AI decision models (Jev): notes

Catalog: [catalog/ai-decisions.md](../catalog/ai-decisions.md). Checked 2026-09-23. Jev launched on 2026-09-15, so everything here is about a week old.

## What Jev is

Jev is TypeSafe AI's first "System One" model. You send it **state** (JSON) and typed **questions**. It returns **typed answers with calibrated probabilities**. It never generates free text.

| Primitive | Use it for |
|---|---|
| `choice` | Pick one option from a defined set (up to 255 options) |
| `noul` | Probability that a condition is true |
| `score` | Position along an ordered scale whose levels you describe |

```ts
import { choice, TypeSafeClient } from "@typesafe-ai/sdk"; // Node 20+, TYPESAFE_API_KEY
const client = new TypeSafeClient();
const res = await client.systemOne({
  state: { document: "I was charged twice. Please fix this ASAP." },
  questions: { category: choice("What is this ticket about?", { billing: null, technical: null, other: null }) },
});
res.answers.category.choice;
```

(Taken from the `typesafe-ai/typesafe-sdk-js` README. The live docs are the source of truth: https://docs.typesafe.ai/llms.txt)

- **Claimed:** 70–500 ms per call, input at $0.042 per million tokens, output free.
- **Measured by others:** `jev-benchmark` saw a median of 0.17–0.2 s with 8–40 options and ~1.7–2.1k input tokens per call. That's roughly **$0.00008 per call**, or **under $1 per 10,000 NPC decisions**.
- `3d-Game-with-jev` saw ~0.8–1 s end to end from a browser over the internet. Budget for that, not for 70 ms.

## Lessons from projects already built on it

1. **Jev judges; code runs the world** (`heist-one`). Jev *proposes* a threat level, a suspicion score, an intent chosen from a list of *legal* actions, and an attention target. The deterministic simulation checks each proposal and rejects illegal or stale ones before applying it. Jev is never the game engine.
2. **Compute facts in code, then ask for judgment** (`jev-benchmark`). Given a raw chess board, Jev played *worse than random*. Given code-computed facts ("this move loses 2 points of material") it reached about 950 Elo. Phrase facts as the *changes* an option causes, and lead with the verdict.
3. **Ask every question in one call.** Questions in the same request run in parallel and can't see each other's answers. `heist-one` sends one batched request covering all four judgments for all six guards.
4. **Never call it per frame** (`3d-Game-with-jev`). Use two layers:
   - a slow "tactical brain" (Jev, event-driven, about 1 s);
   - a 60 FPS "reflex governor" in code that vetoes advice the world has moved past.
5. **Always ship a scripted fallback adapter** (`heist-one`). It gives offline play, CI tests and deterministic replays, and the game still works if the API is down.
6. **Show the decision** (`heist-one`'s Decision Lens). Show players what the NPC *believes*, with its probabilities. "Outplay what they believe" becomes the mechanic.
7. **It's strong at language judgments, weak at calculation.** Deciding which NPC the player is talking to scored F1 0.96. Mate-in-one puzzles were solved only 24% of the time.

## Use cases for our projects

### New 3D UFO-disclosure mystery game

| Feature | Jev questions | Code owns | Modelled on |
|---|---|---|---|
| **Agents-in-black patrols**: guards react to what they *believe* | `noul` "does this evidence suggest an intruder?" · `score` suspicion 0–4 · `choice` intent from {patrol, investigate noise, check badge, call it in} · `choice` which observed entity to look at | Vision cones (yuka), navmesh, alarms, legal actions, stale-response rejection | heist-one |
| **Interrogations without hallucination**: witnesses pick from *pre-written* ink lines | `noul` "does the presented evidence contradict the witness's statement?" · `score` witness composure · `choice` which ink knot to take next (deflect, partial admission, confess, lawyer up) | All dialogue text is authored in ink; Jev only selects | "select instead of generate" (TypeSafe skill), objection_engine |
| **Free-text theories**: the player types a deduction on the conspiracy board | `choice` which case hypothesis the theory matches (plus "none") · `noul` per key fact: "does the theory account for fact X?" | The answer key, scoring and unlocks | component-charades, the Obra Dinn "3 correct lock in" rule |
| **Her Story-style archive search** over real PURSUE and Blue Book pages | Rerank code-retrieved candidate pages by relevance to the player's query | Full-text retrieval, access gating by clearance level | TypeSafe rerank cookbook |
| **The phenomenon reacts to being watched** | `choice` UFO manoeuvre from a legal set, based on player behaviour (filming, approaching, hiding, signalling) · `score` how "aware" it is | Flight paths, physics, the Sitrec-style geometry | clash-jev, jev-plays-doom |
| **Voice mode**: speak to NPCs | `noul` per NPC: "is the player addressing this character?" | Speech-to-text, then routing to the chosen NPC | jev-benchmark (F1 0.93 on messy transcripts) |
| **Adaptive hints** | `score` how stuck the player is, from their recent action log · `choice` hint tier | Hint text, cooldowns | |

### Disclosure Protocol (oresth.com, already live)

- **A human-like play-test bot.** `engine/loadAutoPlayer.ts` plays greedily today. A Jev player given code-computed facts, as in `jev-benchmark` and the Tetris and Flappy Bird bots, gives a second, more "human" difficulty curve. That helps tune `PITY_DROP_THRESHOLD` and the L1–L5 move budgets listed in STATUS.md.
- **Radio chatter in the Nimitz sky view.** `choice` picks which pre-recorded pilot or controller callout fits the current board and sky state. Nothing is generated, so nothing can go off-script.

### oresth.com site

- **Contact form triage** (`src/app/api/contact/route.ts`): before Resend sends the message, `noul` spam and `choice` topic (work enquiry, game feedback, press, other). This is the SDK README's own example, almost word for word.
- **Citation checks** on the research and archive pages (`src/lib/citation-snapshots.ts` already snapshots every URL). For each claim, a `noul` asks whether the archived source supports the sentence that cites it. Run it at build time and flag weak citations. See the TypeSafe citation-check cookbook.

### disclosure-kb (this repo)

- **Auto-triage new repos.** For each candidate from a GitHub search:
  - `choice` a category;
  - `score` relevance to the game;
  - `noul` "is this actually about UFOs/UAP, not the font format or X-COM?";
  - licence risk comes from the SPDX id, in code.

  The plain "ufo" search noise we hit becomes a filter. `kydlikebtc/awesome-jev` runs a verified catalog in a similar way.

## Rules for using it here

- **Keep the API key server-side.** Call Jev from Next.js route handlers or server actions, never from the browser.
- **Build the scripted adapter first**, then the Jev one, behind a single `DecisionEngine` interface as `heist-one` does. Tests use the scripted adapter.
- **Event-driven, batched, timestamped.** Drop any answer whose state revision is older than the world's current revision.
- **Local fallback candidates** (unverified claims, test before relying on them): `laya` (Apache-2.0), `von`, `openJev-verdict-2.0` (151M parameters, ONNX/WebGPU, possibly small enough for the browser).
- **Vendor risk.** The model launched 2026-09-15 and pricing may change, so keep the adapter boundary.
