# Mystery game design: notes

Catalog: [catalog/mystery-design.md](../catalog/mystery-design.md)

## Recommended stack

| Need | Pick | Why |
|---|---|---|
| Dialogue and interrogations | `ink` + `inkjs` (edit in `inky`) | MIT, writer-friendly, and `story.state.toJson()` slots straight into saves. External functions can call into React or three.js |
| Leads that open up as evidence arrives | storylets: `ink-storylets` (built on inkjs) or the `tiny-qbn` pattern | Leads appear because of what the player holds, not because of a fixed script order |
| Case and chapter flow | `xstate` (see 3d-tech) | A case is a statechart: locked → investigating → contradiction found → revealed |
| Conspiracy board | `xyflow` (React Flow) | Evidence as nodes and links as edges. We can check the player's links against the answer |
| Board look | `excalidraw` hand-drawn style, or custom React Flow nodes | `tldraw` does this best, but its licence needs checking before production |
| In-world computer | `xterm.js` terminal + `os-gui` windows (see `daedalOS` for a whole desktop) | Her Story-style keyword search over the archive |
| Procedural text | `tracery` / `Rantjs` (seeded) | Witness reports, redacted memos, radio chatter, and a daily case everyone plays with the same seed |
| Saves | zustand `persist` + `Dexie` | IndexedDB holds a large document archive and player notes |

## Mechanics worth stealing

- **Search the dump** (`clmystery`, `sql-mysteries`, Her Story): hand the player a large archive and a search box instead of a trail of breadcrumbs. PURSUE and Blue Book are real dumps like this (see ufo-data).
- **Lock in N correct answers** (Obra Dinn via `ObraDinn-HintsAndCheck`): answers are confirmed only in batches of three. This stops brute-forcing without making the game punishing.
- **Present the contradiction** (`objection_engine`, Ace Attorney): confront a witness with a piece of evidence. This is the payoff that turns a claim into a lie.
- **UI that reveals itself** (`adarkroom`): new panels, tools and view modes (FLIR, radar, night vision) unlock as clearance rises. The interface itself is the disclosure.
- **The fake OS** (`sql98detective`, `daedalOS`): the investigation takes place on a leaked government laptop. It's cheap to build and very atmospheric.
- **Generate the incident, then derive the clues** (`mysterious-murder`, `mystery-o-matic`, `viv`): simulate what actually happened, then produce the evidence from that event log. Every case is then solvable by construction. Check solvability with a solver in the same way `mystery-o-matic` does.
- **LLM witnesses** (`ai-murder-mystery-hackathon`, `grontown`): suspects backed by a language model with guardrails that protect their secrets. Give each witness a fixed fact sheet so their story stays consistent.

## License cautions

- GPL/AGPL (take ideas, not code): `twinejs`, `mystery-o-matic`, `gitstery-generator`.
- MPL-2.0 (fine as a dependency): `WebGAL`, `adarkroom`.
- No license: `renpy`, `inky`, `untrusted`, `gitstery`, `98`, `grontown`. Read them, don't copy them.
