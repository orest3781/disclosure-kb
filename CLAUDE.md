# disclosure-kb

This is the knowledge base for a 3D UFO-disclosure mystery game (Next.js + React + three.js). See `README.md`.

- Answer questions in this order: `kb/` (decisions and policy), then `notes/` (findings), then `catalog/` and `REVIEW.md` (per-source facts and verdicts). Then look in `vendor/`: run `node scripts/sync.mjs --repo owner/name` if the repo you need isn't pulled yet.
- `sources.json` is the only file to edit for the catalog. Run `node scripts/build-index.mjs` and `node scripts/build-review.mjs` afterwards and commit the regenerated `INDEX.md` and `catalog/` with it.
- Star counts, licenses and descriptions must come from GitHub itself, never from memory. Update `checkedAt` when you refresh them.
- Never commit anything under `vendor/`. Never copy code from a source into this repo. The notes describe patterns in our own words and link to the source file.
- In a note, cite the source like this: `owner/repo:path/to/file.ts`.
- Before suggesting that code or data go into the game, check the license rules in `README.md`.
- A decision that affects more than one category goes in `kb/stack.md` (with alternatives and why), not in a note. New data sources also get a row in `kb/data-sources.md` and, if attribution is needed, its register.
- Never mark a source Adopt in `scripts/build-review.mjs` without a matching recommendation in `notes/` or `kb/stack.md`.
