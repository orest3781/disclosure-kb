# Licensing policy

What we may copy, bundle, run, or ship, across all 629 sources. The per-source licence is in `catalog/`; the verdict in `REVIEW.md`. This page is the rule book they follow.

## Code

| Licence class | Examples in the catalog | Bundle into the game? | Copy code? | Run as a tool or service? |
|---|---|---|---|---|
| Permissive (MIT, Apache-2.0, BSD, ISC, Zlib, Unlicense, CC0, 0BSD, OFL) | 474 sources: three.js, R3F, ink, xyflow, kokoro… | Yes, keep the notice | Yes, keep the notice | Yes |
| Weak copyleft (MPL-2.0, LGPL, EUPL) | adarkroom, WebGAL, OCRmyPDF, axe-core, bitECS, MapGenerator | Yes, as a dependency; changes to *their* files must stay open | Only into files that stay under their licence | Yes |
| GPL | ComfyUI, FFmpeg, twinejs, Nominatim, Stellarium, QRemeshify | **No** | **No** | Yes: their output is ours |
| AGPL | Stellarium web engine, keeptrack, blend-ai, Plausible, LibreTranslate, `internetarchive` lib, Overpass | **No** | **No** | Yes, as a separate service; modified and served over a network means publishing the changes |
| Source-available (FSL, PolyForm, Elastic, GSAP standard) | sentry-mcp, bugsink, GSAP | Read the terms; GSAP allows commercial use with restrictions | No | Per terms |
| Hippocratic (react-leaflet) | | Not OSI; review or use MapLibre | | |
| NOASSERTION (GitHub couldn't classify) | 45 sources | Read LICENSE first. Known: lygia, thebookofshaders, uikit, xr, tar1090 (GPL), readsb (GPL), yjs (MIT), maplibre (BSD), vis-timeline (Apache/MIT) | | |
| None | 59 sources | **No** | **No** | Read only |

**Open-core watch list:** PostHog, GrowthBook, OpenReplay and Novu are open except their `ee/` or enterprise directories; Liveblocks' server and CLI are AGPL.

## AI models

The code licence is not the weights licence. Check the model card for the exact checkpoint.

| Status | Models | Rule |
|---|---|---|
| Commercial-safe | TRELLIS, TripoSR/TripoSG, UniRig, MaterialAnything, Qwen-Image, Z-Image, FLUX.2 klein **4B**, Kokoro, Chatterbox, Dia, CosyVoice, ACE-Step, Whisper, Real-ESRGAN, rembg's BiRefNet/U2Net, Laya | Ship outputs; keep notices |
| Non-commercial weights | F5-TTS, MusicGen/AudioGen, MMAudio, YuE, FLUX.1-dev, FLUX.2 klein 9B, XTTS-v2 (verify), TangoFlux (research-only) | Prototype only; never ship outputs |
| Region-locked | Hunyuan3D 2.0 / 2.1 (no licence in the EU, UK, South Korea; 1M MAU clause) | Avoid |
| Revenue-capped | Stable Fast 3D, Stable Audio Open (free under $1M) | Usable now; re-check before scale |
| Per-model | Replicate, fal.ai, ComfyUI-3D-Pack wrappers, MV-Adapter base models, Piper voices | Check each checkpoint |
| Not cataloged on purpose | VibeVoice, fish-speech, index-tts | research or threshold licences |

**Voices:** never clone or imitate a real person, including hearing witnesses and officials. ElevenLabs' policy bans it even with permission; ours matches that for every provider.

## Data

See [data-sources.md](data-sources.md) for the ladder. In short:
- Government originals: public domain.
- CC0 / CC-BY / ODbL: ship with attribution; note share-alike on ODbL and CC BY-SA.
- Terms-restricted APIs (OpenSky, adsb.fi, Space-Track redistribution, Open-Meteo free tier, DeepL Free, Gemini free tier): use within terms, usually at build time; paid tiers for unreleased story text.
- NUFORC, MUFON, mixed-copyright compilations, unlicensed mirrors: reference only.

## Fonts

OFL fonts (TT2020, Courier Prime, IBM Plex, Server Mono, Stick No Bills, DSE Typewriter) may be bundled; keep the OFL and reserved font names. Departure Mono is MIT. Google Fonts families each carry their own licence file.

## Checklist before a dependency lands in the game

1. Licence class from the table above; NOASSERTION means read the file.
2. If it's an AI model: the weights' licence and region terms.
3. If it's data: attribution text added to the register, share-alike understood.
4. If it's a service: free tier commercial? Does it train on our inputs?
5. Notice files copied into `THIRD_PARTY_NOTICES`.
