# disclosure-kb MCP server

An MCP server that lets any agent query this knowledge base: search the catalogued sources with their verdicts and licence risk, read the `kb/` decisions and `notes/`, and grep the synced source repos in `vendor/`. Read-only, stdio transport, no network.

## Setup

Needs Node 20+. From the repo root:

```bash
cd mcp
npm install
npm run build      # compiles src/ to dist/
npm test           # builds, then runs test/smoke.mjs against the built server
```

**Claude Code** picks the server up automatically from the repo's `.mcp.json` when you open the disclosure-kb directory (it runs `node mcp/dist/index.js`). For another project, add it with an absolute path:

```bash
claude mcp add disclosure-kb -- node /path/to/disclosure-kb/mcp/dist/index.js
```

**Claude Desktop** and other clients: point a stdio server at the same command. The server finds `sources.json` two directories up from `dist/`, so keep it inside the repo.

## Tools

| Tool | What it answers |
|---|---|
| `kb_list_categories` | What categories, groups and verdict counts exist (call first to learn filter values) |
| `kb_search_sources` | "What do we use for X?" Keyword search over 600+ sources with filters: category, group, verdict, licence risk, min stars; paginated; markdown or JSON |
| `kb_get_source` | One source in full: verdict, caveats, the API note (auth, limits, terms), sync state, which notes file covers it |
| `kb_read_doc` | Read `kb/*.md`, `notes/*.md`, `catalog/*.md`, `REVIEW.md`, `README.md`, `INDEX.md`, `CLAUDE.md`, whole or one section; lists documents when called without a path |
| `kb_search_docs` | "What did we decide about NUFORC?" Text search across the written documents with context; kb/ and notes/ are searched before generated files |
| `kb_vendor_status` | Which repos are synced into `vendor/` and the command to sync more |
| `kb_search_vendor` | ripgrep over synced source code, optionally limited to one repo or a file glob |

Resources: every readable document is also exposed as `kb://docs/<path>` (for example `kb://docs/kb/stack.md`).

The server's instructions tell the client to answer in the order `kb/` → `notes/` → per-source rows, and what each verdict means.

## How verdicts stay consistent

Verdict logic lives in `scripts/lib/review.mjs`, shared by `scripts/build-review.mjs` (which writes `REVIEW.md`) and this server. Change a verdict there; both outputs follow.

## Limits

- Responses are capped at 25,000 characters with a note on how to page or narrow.
- `kb_search_vendor` only sees repos already synced (`node scripts/sync.mjs --repo owner/name`); per-file matches are capped at 5 and total lines at `max_results`.
- Document paths are restricted to the repo's markdown layers; anything else is refused.
- Nothing here has been installed or tested by the server itself: it reports what the catalogue says.

## Evaluation

`evals/evaluation.xml` holds ten read-only questions with verified answers for testing whether an agent can use the tools well. See `evals/README.md`.
