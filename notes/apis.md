# APIs: notes

Catalog: [catalog/apis.md](../catalog/apis.md). Checked 2026-09-23. Each row's note records the base URL, auth, rate limits and terms **as stated on the provider's own page**, and says "not stated" where the page didn't say. Prices and limits change, so re-check before relying on one.

## Data APIs, by what they unlock

**One key covers most of it:** a free api.data.gov key works for NASA, govinfo and Congress.gov. The default limit is 1,000 requests/hour; govinfo allows 36k/h and Congress.gov 5k/h. DEMO_KEY is only good for testing (30/h, 50/day).

| Game feature | API | Watch out |
|---|---|---|
| **Real case files** | NARA Catalog API (Project Blue Book is Record Group 341, and results carry NARA IDs you can cite) | Key by email; 10,000 queries/month |
| **1947 "flying disc" newspaper clippings** | loc.gov / Chronicling America (no key); `newspaper-navigator` has 1.5M images already extracted | 20 requests/min, with a 1-hour block if you exceed it. Copyright is yours to check |
| **Hearing transcripts, UAP legislation** | govinfo (transcripts), Congress.gov (bills and timeline), Federal Register (notices) | There's no public API for the CIA Reading Room or FBI Vault |
| **Dead government pages** | Wayback Machine (`waybackpy`) | |
| **Newsreels and documentaries** | Internet Archive (`internetarchive`) | The library is AGPL: build scripts only. Copyright varies per item |
| **"It was a rocket launch"** | Launch Library 2 | 15 requests/hour free: cache hard |
| **"It was a satellite"** | CelesTrak (current), Space-Track (historical TLEs) | CelesTrak: at most one download per 2-hour update. Space-Track: redistributing anything beyond basic TLE/SATCAT data needs approval |
| **"It was Venus" / a fireball** | JPL Horizons, CNEOS fireball API (via `astroquery`) | |
| **Glowing skies** | NOAA SWPC space weather (Kp, flares) | |
| **Weather at the moment of the incident** | Iowa Environmental Mesonet (historic METARs and radar); NOAA NCEI for 1940s–90s | Throttle IEM, which is run as-is |
| **"It was a plane", with its N-number** | FAA registry (daily ZIP) | Contains owners' personal data: show aircraft type only |
| **Maps and site context** | Nominatim (geocoding), Overpass (nearby airbases, radar sites, observatories), OpenTopoData (horizon and line of sight), USGS EarthExplorer (historic aerial photos back to the 1930s) | Nominatim: 1 request/s, no bulk queries, ODbL attribution. Geocode at build time and cache |
| **Historic time zones** | `timezone-boundary-builder` (offline data) | Local-to-UTC conversion is essential for accurate historic skies |
| **Glossary and entity graph** | Wikipedia REST (text is CC BY-SA), Wikidata SPARQL (CC0), Commons (per-file licences) | Wikipedia text needs attribution and share-alike |
| **Period images** | Smithsonian Open Access (CC0 items), Europeana (metadata CC0; media rights vary), NASA Image Library | Many APOD images are photographer-copyrighted |

**Pattern:** call these at **build time** and bake the results into JSON (sky states, weather, nearby sites, clippings). Only the few live widgets hit APIs at runtime, through a Vercel route that caches responses. That keeps us inside every rate limit.

## Service APIs, recommended picks

| Need | Pick | Why |
|---|---|---|
| NPC dialogue and content tooling | Anthropic TypeScript SDK (through `vercel/ai`, already cataloged) | Its terms say the customer owns the outputs and Anthropic doesn't train on customer content. Prompt caching cuts cost on the long case-file system prompt |
| Model A/B testing and fallback | OpenRouter AI SDK provider | One key for many models |
| Screening player-typed text | Mistral Moderation (listed as free) | Runs before the main LLM |
| Pre-recorded NPC voices | ElevenLabs (paid plan) or Cartesia (paid plan) | **Free plans of both are non-commercial.** ElevenLabs bans impersonating elected officials and candidates even with their permission, so **use fictional voices, never real hearing witnesses or officials** |
| Live voice interviews | LiveKit Agents (open source, self-hostable) with Deepgram speech-to-text | Needs a long-running worker, not a Vercel function |
| Accounts | Better Auth (Auth.js is now part of it) | Users live in our own database; no per-user fees |
| Database / leaderboards | Neon (Postgres) or Cloudflare D1; Upstash Redis for leaderboards and `ratelimit-js` | **Rate-limit every LLM and voice endpoint** so costs can't run away |
| Big assets | Cloudflare R2 (free egress, S3-compatible) | The domain is already on Cloudflare |
| Selling the game | Paddle or Lemon Squeezy (they handle tax as merchant of record) vs Stripe (we handle tax) | Lemon Squeezy shows a 2026 notice about moving to Stripe Managed Payments |
| ARG community | discord.js bot for clue drops and clearance-level roles; `itch.io/butler` to publish builds | The bot needs a persistent process |
| Email drops | `react-email` with the Resend account the site already uses | |
| In-game inbox / push | Novu (open-core) or `web-push` (MPL, no vendor) | |
| Translation | DeepL **Pro** for unreleased story text | DeepL's free tier may use submitted text to train models, and so may Gemini's |

## Flags

- **The agent research couldn't verify some things:**
  - OpenAI's terms pages returned 403, so output ownership is unchecked.
  - Stability AI's pricing comes from search snippets.
  - Several government doc pages (Smithsonian, USGS M2M, FAA, Federal Register) wouldn't load; their notes say so.
- **Weak or unlicensed clients** (fine to read, or call the HTTP API directly):
  - `circuitqed/n2yo`, 6★;
  - `aviation-weather-mcp`, 7★;
  - `FAA-registry-checker`, no licence;
  - `node-steamapi`, no licence.
- **Licences:**
  - `claude-agent-sdk-typescript` has no OSS licence; Anthropic's Commercial Terms govern its use.
  - AGPL: `internetarchive`, `Overpass-API`, `LibreTranslate`. Use them in scripts or as separate services.
- **Vendor lock-in:** Clerk, UploadThing, Pusher, Ably and ElevenLabs' hosted agents keep our data on their side.
