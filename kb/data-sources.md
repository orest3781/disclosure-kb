# Real-world data sources

Everything factual the game can draw on, ranked by how safe it is to ship, with the rule for each. "Ship" means the data appears in the released game; "reference" means we read it while designing.

## Provenance ladder

1. **US government originals** (public domain, 17 U.S.C. §105): war.gov PURSUE files, NARA (Blue Book, RG 341), FBI Vault, govinfo hearings, Congress.gov, Federal Register, NASA, NOAA, USGS, FAA. Ship freely; keep the source URL and ID on every document.
2. **CC0 / CC-BY re-extractions and datasets:** `ufo-pursue-open-atlas` (CC0 text and captions), `pursue-uap-documents-dataset` (CC-BY: attribute), Wikidata (CC0), Smithsonian Open Access items flagged CC0, Europeana metadata (CC0). Ship with attribution where required.
3. **Open-licensed community data:** ADSB.lol history (ODbL: attribute, share-alike on derived databases), OpenStreetMap via Nominatim/Overpass/openfreemap (ODbL), HYG stars (CC BY-SA), BSC5P JSON (CC BY), CelesTrak TLEs (credit CelesTrak), Open-Meteo data (CC BY 4.0; its free API is non-commercial). Ship with attribution; avoid share-alike where we can (BSC5P over HYG).
4. **Terms-restricted:** OpenSky (no commercial use without agreement; may block cloud IPs), adsb.fi (personal use, 1 req/s), Space-Track (redistribute only basic TLE/SATCAT with attribution), Open-Meteo free API, N2YO (limited free), Launch Library 2 free tier (15/h). Use at build time within the terms; pre-bake small cleared datasets.
5. **Reference only:** NUFORC scrapes (terms forbid redistribution; every NUFORC repo is a scrape), MUFON data (proprietary), Hatch UFOCAT and the Eberhart timeline via `ufo_data` (third-party copyright; ask before commercial use), `uap_resources` (mixed), The Black Vault dump (re-hosting someone's curation), any mirror's own OCR/annotations without a licence, Wikipedia text (CC BY-SA: fine with attribution, but share-alike spreads).

## By subject

| Subject | Best source | Alternatives | Rules |
|---|---|---|---|
| Modern UAP records (2026 PURSUE) | war.gov originals via `toor11/ufo` downloader | `uap-release-01` mirror (LFS, no licence), `UFO-USA` page Markdown (Gemini OCR) | Verify any LLM-OCR quote against the scan |
| Historical (1947–69) | Blue Book OCR corrections (57k pages) checked against NARA | `blue-book-phenomenology` witness clusters | Public-domain source; the correction repo has no licence |
| FOIA (FBI, NSA, CIA) | FBI Vault, nsa.gov originals | `nsa-foia-umbra-ufo-markdown` (licence unchecked) | No API for the CIA Reading Room or FBI Vault |
| Hearings and law | govinfo, Congress.gov, aaro.mil | | Nothing on GitHub has the transcripts |
| People, programs, events graph | `UFOlogyNet` (MIT) | `veil` ledger (MIT), `rr0.org` (Europe; check terms) | |
| Sightings map density | Aggregate patterns only | `ufosint-explorer` (573k merged; no licence) as a model | Never raw NUFORC rows; write fictional reports modelled on real ones |
| Stars | BSC5P JSON (CC BY) | HYG (CC BY-SA), d3-celestial GeoJSON | Filter to magnitude ≤ 6.5 |
| Planets, Moon, Sun | `astronomy` (MIT, offline) | JPL Horizons at build time | |
| Satellites | CelesTrak (current), Space-Track (historical) | N2YO passes | Space-Track: server-side, 30 req/min |
| Aircraft | ADSB.lol history | OpenSky (non-commercial), readsb trace format docs | FAA registry: aircraft type only, never owners |
| Launches, fireballs, space weather | Launch Library 2, CNEOS, NOAA SWPC | | Cache; 15/h on LL2 free tier |
| Weather at incident time | IEM (METARs, radar archive), Open-Meteo reanalysis, NCEI | aviationweather.gov (30 days only, no CORS) | Open-Meteo paid plan or self-host for release |
| Balloons | SondeHub via `radiosonde_auto_rx` | `tawhiri` predictor | Check SondeHub terms |
| Maps and terrain | openfreemap / PMTiles tiles, AWS Terrain Tiles, USGS EarthExplorer aerials | Cesium | ODbL attribution on OSM |
| Newspapers | Chronicling America (loc.gov) | `newspaper-navigator` extracted images | 20 req/min; copyright is per item |
| Images | NASA Image Library, Smithsonian CC0, Wikimedia Commons (per-file), Europeana | APOD (often photographer-copyrighted) | Read `extmetadata` for Commons attribution |
| Knowledge | Wikidata SPARQL (CC0) | Wikipedia REST (CC BY-SA) | |

## The four rules

1. **Originals over mirrors.** A mirror's code, OCR and notes carry the mirror's licence, which is usually none.
2. **Never ship NUFORC or MUFON rows.** Use densities, or fiction modelled on them.
3. **Build time, not runtime.** Fetch once, attribute, version the JSON in the repo. Runtime calls only through a cached, rate-limited route.
4. **Verify before quoting.** LLM OCR invents text; check every in-game "real document" against its scan.

## Attribution register (to maintain as data is added)

| Data | Licence | Attribution text | Where shown |
|---|---|---|---|
| OpenStreetMap tiles/data | ODbL | © OpenStreetMap contributors | map corner, credits |
| CelesTrak elements | free, credit | Orbital elements courtesy CelesTrak | credits |
| BSC5P JSON | CC BY 4.0 | (repo's stated attribution) | credits |
| PURSUE atlas text | CC0 | none required; cite record IDs anyway | document footer |
| PURSUE index | CC BY 4.0 | Zenodo DOI 10.5281/zenodo.21605258 | credits |
| Open-Meteo data | CC BY 4.0 | Weather data by Open-Meteo.com | credits |
| ADSB.lol history | ODbL | (per ADSB.lol) | credits |
