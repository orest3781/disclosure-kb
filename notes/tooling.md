# MCP servers & CLI tools: notes

Catalog: [catalog/tooling.md](../catalog/tooling.md). Checked 2026-09-23. Install steps change often, so follow each repo's README rather than copying commands from here.

## Already connected in our Claude sessions (nothing to install)

GitHub, Vercel, Cloudflare, Figma, Hugging Face, tldraw, Mermaid, Canva and Google Drive are attached as claude.ai connectors. Only install their MCP servers for local tools outside Claude.

## Recommended setup, in order

**1. Game and site development.** Add these to Claude Code for oresth.com and the new game:
- `playwright-mcp`: Claude opens the game in a real browser, plays it and checks its own fixes. oresth.com already has a manual Playwright recipe in `scripts/sky-perf.mjs`; this makes it interactive.
- `chrome-devtools-mcp`: performance traces and console output. Use it for the Disclosure Protocol 3D perf gate (60 s auto-play at 375×812 with 4× CPU throttling, median ≤ 16.7 ms).
- `next-devtools-mcp`: live Next 16 route, build and runtime errors.
- `context7`: current docs for three.js, R3F, drei, Next 16 and Tailwind 4, all of which change faster than model training data.
- `threejs-devtools-mcp`: inspect and tweak the live scene's materials, lights and shaders. It's small (109★), so try it before relying on it.

**2. 3D asset pipeline.**
- `mcp-for-blender` (29k★, MIT) with `blender-skills`. Claude blocks out a model in Blender, you polish it, then export a GLB and run `gltfjsx --transform` (see 3d-tech).
- `mixamo-llm-mocap` turns a phone video into an animation on a Mixamo-rigged character.
- `blend-ai` has more tools but is AGPL. Running it as a tool is fine; don't copy its code.

**3. Turning case files into text.**
- `docling` (MIT) is the default for converting PURSUE and Blue Book PDFs into Markdown for notes and the in-game reading room.
- `OCRmyPDF` adds a searchable text layer to the original scans, so the game can show the real document and still search it.
- `MinerU` and `marker` are both strong converters, but check their terms first:
  - MinerU's licence adds commercial-use terms above certain thresholds.
  - marker's code is Apache, but its model weights are OpenRAIL-M.
- Always check converted text against the scan before quoting it (see ufo-data rule 3).
- `firecrawl-mcp-server` (hosted) or `Scrapling` (self-hosted) pull public government pages. Never use them to scrape NUFORC (its terms forbid it).

**4. Keeping agent sessions cheap and aware of the code.**
- `codebase-memory-mcp` or `graphify` build a code graph of oresth.com plus `vendor/`, so agents look things up instead of reading whole files.
- `rtk` and `headroom` compress command and tool output. They're worth adding once sessions get long.

## A disclosure-kb MCP server (worth building)

Use the official `typescript-sdk` and test it with `inspector`. The server would expose:
- `search_sources(query, category?)`, backed by `sources.json`;
- `get_notes(category)`;
- `search_vendor(pattern)`, which runs ripgrep over the synced repos.

Then any agent, in any repo, can ask the knowledge base directly instead of cloning it. It's about 150 lines of code. `git-mcp` already does something similar for a single repo; ours would cover the whole curated set.

## CLI tools

- **Searching `vendor/`:** `rg` (ripgrep), `fd`, `fzf` and `bat`.
- **Review and navigation:** `lazygit` and `zoxide`.
- **GitHub and HTTP:** `gh` and `httpie`, including hand-testing the Jev API and the contact route.
- **Scripts:** `zx`, the JavaScript we already use, instead of bash.
- **Video:**
  - `yt-dlp` and `ffmpeg` fetch and trim the public-domain DoD UAP videos. FFmpeg is GPL: use it as a tool and never bundle it into the game.
  - `ffmpeg.wasm` (MIT) handles in-browser "enhance the footage" effects.
- **Trailers:** `hyperframes` renders our HTML and three.js scenes to video.

## Skipped on purpose

- Anti-bot "stealth browser" MCPs (invisible_playwright_mcp, stealth-browser-mcp, SeleniumBase CDP mode). We don't need to get around bot detection, and doing so would break the no-scraping rules in ufo-data.
- OSINT person-lookup tools (sherlock, maigret). They're out of scope and invasive.
- General chat front-ends and agent platforms (open-webui, dify, n8n). They don't serve these projects.
- Watermark strippers (watermarks-remover): these remove AI provenance marks such as C2PA and SynthID. We shouldn't strip provenance from anything we publish.
- Session exporters (codex-auth-helper): these write logged-in ChatGPT credentials to a local file, which is a credential-leak risk.
- Face-swap tools that "clone any viral video". Deepfake tooling has no place in these projects.
