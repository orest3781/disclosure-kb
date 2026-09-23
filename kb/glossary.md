# Glossary

**UFO research**
- **UAP:** unidentified anomalous phenomena, the official term that replaced UFO.
- **AARO:** the US All-domain Anomaly Resolution Office (aaro.mil), which publishes the official historical record report.
- **PURSUE:** Presidential Unsealing and Reporting System for UAP Encounters; the May 2026 declassified release at war.gov/UFO, in numbered tranches (Release 01–04).
- **Project Blue Book:** the US Air Force UFO investigation, 1947–69; its files are at NARA in Record Group 341.
- **NARA:** the US National Archives; its Catalog API serves scanned records with citable IDs.
- **FBI Vault, CIA Reading Room:** FOIA document libraries; neither has a public API.
- **FOIA:** Freedom of Information Act, the route most UFO documents were released through.
- **NUFORC / MUFON:** civilian sighting databases; both have terms that forbid redistribution.
- **Nimitz / Tic Tac:** the 14 Nov 2004 encounter off San Diego (USS Nimitz group, Cmdr. Fravor); source of the FLIR1 video.
- **Gimbal, GoFast, FLIR1:** the three Navy videos released by the DoD; public domain.
- **Sitrec:** Metabunk's 3D "situation recreation" tool for those videos.
- **The Black Vault:** John Greenewald's FOIA document archive; a curated site, not a data source to re-host.
- **Loose Threads:** the anonymous 2023 timeline that `UFOlogyNet` turns into a graph.

**Aerospace data**
- **TLE / OMM:** two-line element sets (and their modern JSON form) describing a satellite's orbit; propagated with SGP4 (`satellite.js`).
- **CelesTrak, Space-Track:** the public and the official (USSF) sources of TLEs.
- **ADS-B:** aircraft position broadcasts; archived by ADSB.lol, adsb.fi, OpenSky; decoded by readsb, shown by tar1090.
- **METAR / TAF:** airport weather reports and forecasts; historic METARs live at the Iowa Environmental Mesonet.
- **Radiosonde / sounding:** weather-balloon profiles of the atmosphere (SondeHub, NCEI, Wyoming); show inversions behind mirages and radar ducting.
- **Reanalysis:** a model's reconstruction of past weather (Open-Meteo historical) for any date and place.
- **Kp, SWPC:** geomagnetic activity index and NOAA's Space Weather Prediction Center; aurora explanations.
- **CNEOS fireballs:** JPL's database of bright meteors with location, time and energy.
- **HYG, BSC5P:** merged star catalogue (Hipparcos + Yale + Gliese) and the Yale Bright Star Catalogue.
- **DEM / Terrain Tiles:** elevation data; AWS Terrain Tiles in "terrarium" encoding, meshed by `martini`.

**Our stack**
- **R3F:** React Three Fiber, the React renderer for three.js; **drei** is its helper library; **pmndrs** the collective behind both.
- **Rapier, ecctrl:** the physics engine (WASM) and the character controller built on it.
- **postprocessing:** the effect library (bloom, noise, vignette…) with an R3F wrapper.
- **TSL / WebGPU:** three.js's shading language and the newer GPU API; not yet our shipping path.
- **glTF / GLB, KTX2, meshopt, Draco:** the model format, GPU-compressed textures, and two mesh compressions; `gltfjsx --transform` applies them.
- **ink / inkjs / inky:** the narrative language, its JS runtime, and its editor; **storylets** are self-selecting story fragments.
- **xstate, zustand, Dexie:** statecharts, the state store, and IndexedDB storage.
- **xyflow, graphology:** the node-graph UI and the graph data library behind the conspiracy board.
- **MCP:** Model Context Protocol, how tools plug into Claude and other agents; **connector** is claude.ai's hosted form.
- **Jev / System One:** TypeSafe AI's decision model returning typed answers with probabilities; **choice / noul / score** are its three question types; **Laya, von, kev** are open alternatives.
- **Decision Lens:** heist-one's panel showing an NPC's evidence, probabilities and chosen intent.
- **CRDT:** conflict-free replicated data type (Yjs, Automerge) for shared state without a lock.
- **Merchant of record:** a payment provider that handles sales tax for you (Paddle, Lemon Squeezy).

**Licences**
- **Permissive:** MIT, Apache-2.0, BSD, ISC, CC0, OFL — use, copy, bundle with notice.
- **Weak copyleft:** MPL, LGPL — bundle as a dependency; changes to their files stay open.
- **GPL / AGPL:** copyleft / network copyleft — run as tools or services, never bundle.
- **NOASSERTION:** GitHub found a licence file it couldn't classify.
- **ODbL:** Open Database License (OpenStreetMap, ADSB.lol): attribution plus share-alike on derived databases.
- **CC BY / CC BY-SA / CC BY-NC:** attribution / plus share-alike / non-commercial.
- **OFL:** SIL Open Font License.
- **OpenRAIL-M, Community License:** model licences with use restrictions (marker weights; Stability's revenue cap).
