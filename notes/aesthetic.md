# Aesthetic & ARG tooling: notes

Catalog: [catalog/aesthetic.md](../catalog/aesthetic.md), plus the ARG cipher, stego, code and puzzle entries in [catalog/mystery-design.md](../catalog/mystery-design.md). Checked 2026-09-23.

All paperwork tooling here is for **fictional in-game documents only**. We never recreate real IDs, forms or seals in a way that could pass as genuine.

## The look, by era

The same "agency workstation" can age through the story:

- **1940s–70s paper:** `TT2020` (a typewriter font that varies each glyph and shows ink wear), `Courier Prime` for long transcripts, and `Stick No Bills` for stencilled crate and TOP SECRET lettering. All are OFL.
- **Terminals:** `Departure Mono` (MIT, pixel), `Server Mono` (OFL) and `IBM Plex Mono` (OFL). Google Fonts supplies Special Elite, VT323, Share Tech Mono and Stardos Stencil; check each family's licence file.
- **Desktop skins:** `98.css`, then `XP.css`, then `7.css` (all MIT), on top of `1j01/os-gui` (already in mystery-design).
- **The "neon classified" layer:** `augmented-ui` (pure-CSS clipped panels) and `arwes` (animated sci-fi frames with sound; pin its version, as the next branch is in flux).
- **Dither and grain:** `paper-design/shaders` (Apache, React bindings for dither, halftone and grain) and `as-dithered-image` (Atkinson 1-bit fax look).

## Documents players can download

- `react-pdf` or `pagedjs` lay out multi-page dossiers with classification footers.
- `pdf-lib` stamps pages, adds redaction overlays and hides puzzle payloads in attachments or metadata.
- `takumi` renders scans and OG cards on the server without a headless browser.
- `DocCreator` (LGPL desktop tool) ages our own pages into photocopied scans offline.

## Signals: puzzles hidden in audio

| Mechanic | Tools |
|---|---|
| Image hidden in the spectrogram of a radio intercept | Make it with any spectrogram painter; players find it with `wavesurfer.js` (spectrogram plugin) or `spectro` (live WebGL) |
| Data chirps decoded through the player's microphone | `ggwave` (MIT, WASM) |
| SSTV picture inside "numbers station" audio | Players use `robot36` on a phone, or our in-browser `sstv-decoder` (0BSD); check with `colaclanth/sstv` |
| RTTY / teletype bursts | Encode offline with `minimodem` (GPL tool) |
| VHS found footage | Pre-render with `ntsc-rs` |

## ARG puzzle QA

- Design cipher chains in `CyberChef` (Apache, can be self-hosted as an in-world decoder).
- Then run `Ciphey` against the puzzle. **If Ciphey solves it automatically, it's too easy.**
- Check image-stego clues with `AperiSolve` and `StegOnline`, the tools real ARG players use.
- `steganography.js` (browser) and `ragibson/Steganography` (build scripts) hide the clues.
- `node-qrcode`, `bwip-js` and `zxing-js` make and scan QR codes and barcodes on in-world objects.
- `Phil` is for building crosswords, `exolve` embeds them in in-world newspapers, and `PuzzleScript` covers logic-puzzle "terminal programs".

## Storytelling

- `scrollama` or `basementstudio/scrollytelling` for scroll-driven redaction reveals.
- NUKnightLab `juxtapose` for "enhance" before/after sliders.
- TimelineJS and StoryMapJS for case chronologies (both also listed in sky-geo).

## Licence traps

- `cool-retro-term` and `minimodem` are GPL: use them as references or tools only.
- `react-leaflet` uses the Hippocratic License (not OSI-approved): review it before use, or use MapLibre.
- `CSSGlitchEffect` has no licence file, but its README allows commercial use under Codrops terms.
- `Image-to-Braille`, `cyberchef-recipes`, `stego-toolkit` and `detectiveboard` have no licence: read only.
- `google/fonts`: the licence differs per family folder.
