# disclosure-kb

Everything we know that's useful for building a **3D UFO-disclosure mystery game**, in one place.
It collects the GitHub repos worth learning from or building on, what each one is good for, and
the notes we've pulled out of them. It feeds the Disclosure Protocol game on
[oresth.com](https://oresth.com) and any new game we start.

## What's here

| Path | What it is |
|---|---|
| [`kb/`](kb/README.md) | **Start here.** The analysis layer: stack decisions, feature→tool map, pipelines, data sources, licensing policy, risks, roadmap, glossary |
| [`INDEX.md`](INDEX.md) | Every category, with counts |
| [`REVIEW.md`](REVIEW.md) | Every source with a verdict (Adopt / Trial / Tool only / Reference / Prototype only / Avoid), licence risk and a short review |
| [`catalog/`](catalog/) | One page per category: repo, stars, license, what it is, what we take from it |
| [`notes/`](notes/) | Findings per category: patterns, recommendations, gotchas |
| `sources.json` | The single source of truth for the catalog. Edit this, not `catalog/` |
| `vendor/` | Local copies of the source repos, pulled by the sync script. Gitignored |
| [`scripts/sync.mjs`](scripts/sync.mjs) | Pulls source repos into `vendor/` |
| [`mcp/`](mcp/README.md) | MCP server: any agent can search the catalog, read kb/ and notes/, and grep synced code. `cd mcp && npm install && npm run build` |
| [`scripts/build-index.mjs`](scripts/build-index.mjs) | Validates `sources.json`, regenerates `INDEX.md` and `catalog/` |

## Why we don't copy other repos in

This repo holds **pointers and our own notes, not other people's code**. Copying repos wholesale
would make it huge, go stale right away, and break licenses. That matters most for repos with no
license, which are all rights reserved. Instead, `sync.mjs` pulls fresh shallow copies into
`vendor/` whenever you need them. That way you (and Claude) can read and search every source in
one place.

## How it's layered

```
sources.json ──► catalog/*.md   one row per source (generated)
      ├───────► REVIEW.md       one verdict per source (generated)
notes/*.md ───► findings within one category (written)
kb/*.md ──────► decisions across categories: stack, features, pipelines, policy (written)
```

Facts about a source go in `sources.json`. Findings within an area go in `notes/`. Decisions that cut across areas go in `kb/`.

## Use it

Needs Node 22+ and git.

```bash
node scripts/sync.mjs --dry-run              # see what would be pulled
node scripts/sync.mjs --category 3d-tech     # pull one category
node scripts/sync.mjs --repo pmndrs/drei     # pull one repo
node scripts/sync.mjs                        # pull everything with sync != none
grep -rn "EffectComposer" vendor/            # search across all of it
```

Each source has a `sync` mode:
- `docs`: root files plus `docs/`, `doc/` and `examples/` only (sparse, small). This is the default for most.
- `full`: the whole default branch, for code we actually study.
- `none`: listed in the index only (data dumps, huge repos, or repos with no license).

Pass `--mode full` to override the mode for a single run.

## Ask it from any agent

The `mcp/` server exposes the knowledge base over MCP. Claude Code loads it automatically from `.mcp.json` when opened in this repo; see [mcp/README.md](mcp/README.md) for other projects and clients.

## Add a source

1. Add an entry to `sources.json`:
   ```json
   { "repo": "owner/name", "category": "3d-tech", "group": "Effects", "stars": 1234,
     "license": "MIT", "sync": "docs",
     "what": "One line: what it is.", "use": "One line: what we take from it." }
   ```
   Optional fields: `note`, `archived: true`, `stale: true`.
2. Run `node scripts/build-index.mjs` and `node scripts/build-review.mjs`. To give it a verdict other than the default, add it to the lists at the top of `build-review.mjs`.
3. Write what you learned in `notes/<category>.md`.

CI runs `build-index.mjs --check`. It fails if `sources.json` is invalid or `catalog/` wasn't regenerated.

## License rules for using sources in the game

- **MIT / BSD / Apache-2.0 / ISC / Zlib / CC0**: fine to use in the game. Keep the notice.
- **GPL / AGPL / LGPL / MPL**: read the license before copying any code into the game. The reading and learning is fine.
- **CC-BY / CC-BY-SA** (usually data or art): credit the source. SA means derived data must stay SA.
- **none**: all rights reserved. Learn from it, link to it, but don't copy it.
- **Real UFO case data**: government records (Blue Book, AARO, NARA) are generally public domain.
  Scraped databases such as NUFORC come with their own terms. Check before shipping any of it in the game.
