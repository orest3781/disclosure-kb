# Status

Knowledge base for the 3D UFO-disclosure mystery game: 945 sources in 11 categories, stars and licences checked 2026-09-23. `npm run check` is green.

## Now

| Item | Status |
|---|---|
| Catalog, REVIEW.md verdicts, kb/ analysis layer, notes/ | ✅ Done |
| MCP server (`mcp/`, 7 `kb_*` tools) | ✅ Done |
| Review fixes on branch `fix/review-findings`: LF line endings, `sync --jobs` check, ripgrep per-file cap, stale docs | ✅ Done |
| `npm run check` (Biome, unit tests, generated-file checks, MCP smoke test), wired into CI | ✅ Done |
| Merge `fix/review-findings` to `main` and confirm CI passes on GitHub | ⬜ Not started |

## Next

- [ ] Nine Adopt sources show a licence of `none` or `NOASSERTION` (mostly APIs you call, not code you copy, such as `usnationalarchives/Catalog-API`). Decide whether REVIEW.md should say "call the API; don't copy the code" so readers don't take Adopt as permission to copy.
- [ ] `kb/README.md` "The corpus in numbers" is hand-written and will drift from `sources.json`. Generate it, or drop it and point at `INDEX.md`.

## Dead ends

| Tried | Why it failed |
|---|---|
| Running `--check` on a Windows checkout with `core.autocrlf=true` and no `.gitattributes` | Files came out CRLF, scripts write LF, so every check said "out of date". Fixed with `.gitattributes` (`eol=lf`). A clone made before that fix needs `git rm -r --cached .` then `git reset --hard HEAD` once. |
