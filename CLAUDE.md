# disclosure-kb

This is the knowledge base for a 3D UFO-disclosure mystery game (Next.js + React + three.js). See `README.md`.

- Answer questions from `notes/` first, then `catalog/`. Then look in `vendor/`: run `node scripts/sync.mjs --repo owner/name` if the repo you need isn't pulled yet.
- `sources.json` is the only file to edit for the catalog. Run `node scripts/build-index.mjs` afterwards and commit the regenerated `INDEX.md` and `catalog/` with it.
- Star counts, licenses and descriptions must come from GitHub itself, never from memory. Update `checkedAt` when you refresh them.
- Never commit anything under `vendor/`. Never copy code from a source into this repo. The notes describe patterns in our own words and link to the source file.
- In a note, cite the source like this: `owner/repo:path/to/file.ts`.
- Before suggesting that code or data go into the game, check the license rules in `README.md`.
