# AI asset generation: notes

Catalog: [catalog/ai-assets.md](../catalog/ai-assets.md). Checked 2026-09-23.

**The rule for this category: the code licence is not the model licence.** Many repos have MIT or Apache code but ship weights that are non-commercial or region-restricted. The `note` column in the catalog records each case. When in doubt, read the Hugging Face model card for the exact checkpoint you use.

## Safe to use commercially

| Need | Pick | Why |
|---|---|---|
| Image → 3D prop | `microsoft/TRELLIS` / `TRELLIS.2` (MIT), `VAST-AI-Research/TripoSR` / `TripoSG` (MIT) | Clean licences. TripoSR has MIT code and weights |
| Clean up generated meshes | `autoremesher` (quads) → `meshoptimizer` / `glTF-Transform` (see 3d-tech) | AI meshes are triangle soup |
| Rig characters | `VAST-AI-Research/UniRig` (MIT) | Auto skeleton and skin weights for NPCs and creatures |
| PBR materials | `3DTopia/MaterialAnything` (MIT), `MV-Adapter` (Apache; the base model's licence also applies) | |
| Images: evidence photos, posters | `ComfyUI` + `Qwen-Image` (Apache, strong at readable in-image text) or `Z-Image` (Apache); `FLUX.2 [klein] 4B` only | Qwen-Image suits newspaper pages and stamped documents |
| Restyle our own 3D scenes as "photos" | ControlNet depth/lineart (`comfyui_controlnet_aux`) + `IC-Light` relighting | Photos of the same location stay consistent with the game world |
| Upscale, cut out, age | `Real-ESRGAN` (BSD), `rembg` (MIT), `chaiNNer` (GPL tool) | |
| NPC voices | `hexgrad/kokoro` (Apache; runs in the browser through kokoro.js), `resemble-ai/chatterbox` (MIT, emotion control, watermarked output) | Best balance of quality and licence |
| Multi-speaker "leaked tapes" | `nari-labs/dia` (Apache) | Two-person conversations with coughs and laughs in one pass |
| Music | `ace-step/ACE-Step-1.5` (MIT) | The most permissive strong music model |
| Speech-to-text | `whisper.cpp` / `faster-whisper` (MIT), `whisperX` (word timestamps) | |
| ML in the browser | `transformers.js`, `ricky0123/vad` (voice activity), `web-llm` / `wllama` (local LLM), MediaPipe (webcam head-tracking) | Voice mode and on-device NPC chat with no server |

## Avoid for anything we ship

- **Non-commercial weights:**
  - F5-TTS, MusicGen/AudioGen (audiocraft), MMAudio and YuE are CC-BY-NC.
  - TangoFlux is research-only.
  - FLUX.2 klein 9B and FLUX.1-dev are non-commercial.
  - XTTS-v2 (coqui) is non-commercial, and Coqui itself has shut down.
- **Region-restricted:** Hunyuan3D 2.0 and 2.1 grant no licence in the EU, UK or South Korea, and have a 1M monthly-active-user clause.
- **Revenue-capped:** Stable Fast 3D and Stable Audio Open are free only under $1M revenue.
- **Left out of the catalog:** VibeVoice (research-only), fish-speech (research licence), index-tts (MAU and revenue thresholds).

## Pipeline sketch

1. Concept art in ComfyUI.
2. TRELLIS or TripoSG turns it into a mesh.
3. autoremesher cleans the topology; UniRig rigs it if it's a character.
4. MaterialAnything adds PBR materials.
5. `gltfjsx --transform` with KTX2 and meshopt compression.
6. The model loads in R3F.

Blender (via mcp-for-blender, in tooling) is where a person polishes the result between steps.
