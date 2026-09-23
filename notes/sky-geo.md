# Sky, space & geo data: notes

Catalog: [catalog/sky-geo.md](../catalog/sky-geo.md). Checked 2026-09-23.

This category makes the "was it a plane, a satellite, a star or a balloon?" deductions **computable** from real data.

## Deduction → data → library

| Explanation | Check | Library / data |
|---|---|---|
| Venus, Jupiter, the Moon | Planet positions for a date, place and time; altitude and azimuth | `cosinekitty/astronomy` (MIT), `suncalc` for twilight |
| A bright star | Star catalogue plus the observer's horizon | `HYG-Database` (CC BY-SA 4.0 data), `BSC5P-JSON-XYZ` (CC BY 4.0), `d3-celestial` GeoJSON |
| Starlink train or other satellite | TLE propagated to the sighting time; is the satellite sunlit while the observer is in darkness? | `satellite.js` (MIT), `tle.js`, CelesTrak TLEs (credit CelesTrak); `starlink-viz` is a Next.js + R3F example |
| An aircraft | Historical ADS-B tracks near the site | ADSB.lol (`adsblol/api`, ODbL data), `xoolive/traffic` for cleaning; `tar1090`/`readsb` for formats |
| Weather balloon | Radiosonde launches, winds aloft, drift path | SondeHub (via `radiosonde_auto_rx`), `tawhiri` predictor, `Unidata/siphon` + `MetPy` for soundings |
| Cloud, mirage, radar ducting | Historical cloud cover, winds and inversions | Open-Meteo historical reanalysis, METAR (`metar-taf-parser`) |

**Nimitz, 14 Nov 2004, off San Diego:** Astronomy Engine gives the sky; Siphon pulls the upper-air sounding from San Diego (station NKX) for inversion layers; Open-Meteo gives cloud and wind. Every in-game "debunk" can be checked against the real conditions.

## Maps, globes, timelines

- **Sighting maps:**
  - `maplibre-gl-js` + `deck.gl` (TripsLayer for time-scrubbed paths, heatmaps), wrapped by `react-map-gl`.
  - `openfreemap` or `PMTiles` give free, self-hosted base tiles. OSM data is ODbL, so attribution is required.
- **Globe:** `react-globe.gl` / `three-globe` (MIT) drop straight into R3F.
- **3D terrain for site recreations:** AWS Terrain Tiles (see `tilezen/joerd` for the format) turned into meshes with `mapbox/martini`.
- **Conspiracy timeline:** `vis-timeline` (Apache/MIT) with a swimlane per agency; `react-chrono` for evidence entries.
- **Knowledge graph:**
  - `graphology` for the data and "connect the dots" checks;
  - `sigma.js` for 2D;
  - `3d-force-graph` or `reagraph` (R3F) for 3D. Check reagraph works with React 19.

## Licence traps

- **Stellarium web engine, keeptrack and ootk (AGPL), and the Stellarium desktop app (GPL):** use them as references or tools only, never bundle them into the game.
- **OpenSky:** its terms forbid commercial use of the data without an agreement, and it may block cloud IPs. Pre-bake small cleared datasets instead.
- **adsb.fi:** personal, non-commercial use only. **ADSB.lol:** ODbL, so share-alike applies to derived databases.
- **Open-Meteo:** the free API is non-commercial, so a shipped game needs a paid plan or self-hosting. Its data is CC BY 4.0.
- **`ClickHouse/adsb.exposed`:** code is CC BY-NC-SA, so read it but don't copy it.
- **HYG star data:** CC BY-SA 4.0, so a star file we derive from it inherits share-alike.
