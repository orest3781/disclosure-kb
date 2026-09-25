# UFO / UAP source data: notes

Catalog: [catalog/ufo-data.md](../catalog/ufo-data.md)

## What's out there

- **The niche is small.** Only about 8 relevant repos have more than 50 stars. Plain searches for "ufo" are swamped by the UFO font format, Microsoft UFO and X-COM.
- **PURSUE is the big modern source.** On 2026-05-08 the US Department of War published declassified UAP records at war.gov/UFO under PURSUE. Mirror, OCR and dataset repos appeared within days, covering mission reports, UAP videos, the FBI 62-HQ-83894 file, NASA debriefs, CIA, NARA and State Department material.
- **Project Blue Book (1947–69)** is available as LLM-corrected OCR of 57k NARA pages. This is the historical backbone.
- **These have nothing on GitHub:**
  - transcripts of the 2022, 2023 and 2024 congressional hearings;
  - the text of the UAP Disclosure Act;
  - code from the Galileo Project.

  Get them from primary sources: congress.gov, govinfo.gov, House Oversight and aaro.mil. All are public domain.

## Best sources, by use

| Use in the game | Source | Licence |
|---|---|---|
| Real modern case files | Originals from war.gov (via `toor11/ufo` or the `uap-release-01` mirror) | Public domain |
| Clean text and image captions of those files | `AlexZhangji/ufo-pursue-open-atlas` | CC0 (LICENSE file, checked 2026-09-25; captions are AI-written, check against the page image) |
| Case-file master index | `Starmadebydata/pursue-uap-documents-dataset` | CC-BY-4.0: attribute |
| Historical case text | `Project-BlueBook-AI-OCR-Correction`, checked against NARA scans | Source is public domain; repo has no licence |
| People, programs and events graph | `noahkarsky/UFOlogyNet` | MIT |
| Long timeline | `richgel999/ufo_data` (Eberhart, Vallée, Hatch…) | Code Apache; data copyright varies, ask before commercial use |
| 3D sky-scene geometry (Gimbal, GoFast, Nimitz) | `MickWest/sitrec` (MIT, archived) / `Sitrec2` (custom licence) | |
| Mundane explanations | `NormanTUD/UFO-Detector` (Starlink, lanterns, balloons), `meteorites-ufos-detection-bias` (CC0) | |
| Evidence-board UI reference | `rizzleroc/pursue-console` | MIT |

## Data licensing rules

1. **Never ship NUFORC data.** NUFORC's terms of service forbid scraping and redistributing it, and every NUFORC repo here is a scrape. Use density patterns or aggregate counts only, write fictional reports modelled on the real ones, or ask NUFORC for permission.
2. **US government records are public domain** (17 U.S.C. §105). A mirror repo's OCR text, code and annotations are covered by the repo's own licence, and "none" means all rights reserved. Take originals from the agency, or use text released as CC0 or CC-BY.
3. **OCR done by an LLM can invent text.** Check every "real document" quote against the scan before it goes into the game.
4. **Mixed-rights collections** (`ufo_data`, `uap_resources`, the Hatch database, MUFON, The Black Vault dump) contain third-party copyrighted material. Treat them as reference only unless we get permission.
5. **The DoD UAP videos** (FLIR1, Gimbal, GoFast) are public-domain government releases.

## Game ideas this data supports

- Base each case on a real record, and let the player pull the original scan up in the in-game reading room.
- **"Was it a plane?"**: cross-check a sighting against flight or ADS-B data (see the `uap-monitor` idea and Sky360 `ads-b`). Mundane answers are part of the mystery.
- **Rebuild the scene in 3D.** Sitrec shows how to build the camera, jet and target geometry from real footage. Let the player scrub through it and find where the official explanation stops adding up.
- The **Nimitz set piece** already exists in oresth.com. `Montana/tic-tac-math` has real kinematics to tune it.
