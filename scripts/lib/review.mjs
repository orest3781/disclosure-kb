// Verdict logic shared by scripts/build-review.mjs and the MCP server.
// Change a verdict here: the explicit lists first, then the rules in reviewSource().

// Recommended picks from notes/*.md and kb/stack.md: the first thing to reach for in each area.
export const ADOPT = new Set(
  `
mrdoob/three.js pmndrs/react-three-fiber pmndrs/drei pmndrs/react-three-next pmndrs/react-three-rapier pmndrs/ecctrl
pmndrs/postprocessing pmndrs/react-postprocessing statelyai/xstate goldfire/howler.js Tonejs/Tone.js pmndrs/gltfjsx
donmccurdy/glTF-Transform pmndrs/detect-gpu pmndrs/leva utsuboco/r3f-perf gkjohnson/three-mesh-bvh Mugen87/yuka
takram-design-engineering/three-geospatial Alchemist0823/three.quarks ashima/webgl-noise zeux/meshoptimizer
inkle/ink y-lohse/inkjs xyflow/xyflow xtermjs/xterm.js galaxykate/tracery dexie/Dexie.js floriancargoet/ink-storylets
gchq/CyberChef bee-san/Ciphey soldair/node-qrcode 1j01/os-gui
AlexZhangji/ufo-pursue-open-atlas Starmadebydata/pursue-uap-documents-dataset noahkarsky/UFOlogyNet rizzleroc/pursue-console
vercel/next.js shadcn-ui/ui pmndrs/zustand
microsoft/playwright-mcp ChromeDevTools/chrome-devtools-mcp vercel/next-devtools-mcp upstash/context7 ahujasid/mcp-for-blender
docling-project/docling ocrmypdf/OCRmyPDF modelcontextprotocol/typescript-sdk modelcontextprotocol/inspector BurntSushi/ripgrep cli/cli yt-dlp/yt-dlp
cosinekitty/astronomy shashwatak/satellite-js visgl/deck.gl maplibre/maplibre-gl-js visgl/react-map-gl vasturiano/react-globe.gl
graphology/graphology visjs/vis-timeline protomaps/PMTiles hyperknot/openfreemap mapbox/martini mourner/suncalc
RenaudRohlinger/stats-gl agargaro/instanced-mesh Auburn/FastNoiseLite davidbau/seedrandom capricorn86/happy-dom
testing-library/react-testing-library microsoft/playwright dequelabs/axe-core pmndrs/react-three-a11y serwist/serwist amannn/next-intl
i18next/i18next umami-software/umami yjs/yjs cloudflare/partykit tinyplex/tinybase motiondivision/motion cocopon/tweakpane
microsoft/TRELLIS VAST-AI-Research/TripoSR VAST-AI-Research/UniRig Comfy-Org/ComfyUI QwenLM/Qwen-Image hexgrad/kokoro
resemble-ai/chatterbox ace-step/ACE-Step-1.5 ggml-org/whisper.cpp huggingface/transformers.js ricky0123/vad xinntao/Real-ESRGAN danielgatis/rembg
ctrlcctrlv/TT2020 quoteunquoteapps/CourierPrime IBM/plex jdan/98.css propjockey/augmented-ui paper-design/shaders diegomura/react-pdf
Hopding/pdf-lib katspaugh/wavesurfer.js ggerganov/ggwave russellsamora/scrollama NUKnightLab/juxtapose
anthropics/anthropic-sdk-typescript usnationalarchives/Catalog-API LibraryOfCongress/data-exploration usgpo/api LibraryOfCongress/api.congress.gov
GSA/api.data.gov better-auth/better-auth upstash/ratelimit-js upstash/redis-js neondatabase/serverless cloudflare/workers-sdk resend/react-email
livekit/agents-js akrherz/iem wikimedia/wikidata-query-rdf
developit/mitt clauderic/dnd-kit lucaong/minisearch CacheControl/json-rules-engine unitedstates/congress freelawproject/x-ray
yoannmoinet/nipplejs protectwise/troika KhronosGroup/glTF-Validator isaac-mason/recast-navigation-js
`
    .split(/\s+/)
    .filter(Boolean),
);

// Weights or data are non-commercial or research-only: fine for prototyping, never ship the output.
export const PROTOTYPE_ONLY = new Map([
  ["SWivid/F5-TTS", "pretrained weights are CC-BY-NC"],
  ["facebookresearch/audiocraft", "MusicGen/AudioGen weights are CC-BY-NC 4.0"],
  ["multimodal-art-projection/YuE", "weights are CC BY-NC 4.0"],
  ["hkchengrex/MMAudio", "checkpoints are CC-BY-NC 4.0"],
  ["declare-lab/TangoFlux", "research-only licence"],
  ["coqui-ai/TTS", "unmaintained; XTTS-v2 weights non-commercial (verify)"],
]);

// Don't use: legal, ethical or provenance problems for this project.
export const AVOID = new Map([
  ["Tencent-Hunyuan/Hunyuan3D-2.1", "no licence granted in the EU, UK or South Korea; 1M MAU clause"],
  ["Tencent-Hunyuan/Hunyuan3D-2", "no licence granted in the EU, UK or South Korea; 1M MAU clause"],
  ["kijai/ComfyUI-Hunyuan3DWrapper", "ships the Hunyuan licence (EU/UK/South Korea excluded)"],
  ["planetsig/ufo-reports", "NUFORC scrape: NUFORC terms forbid redistribution, and there's no licence"],
  ["sboghossian/blueport", "ingests a private 'leak set' of unverifiable provenance; use Brazil's SIAN originals instead"],
  ["YetAnotherMorty/The-Black-Vault-File-Dump", "bulk re-hosting of The Black Vault; fetch FOIA originals instead"],
]);

// Explicit verdicts where the rules would mislabel an entry.
export const OVERRIDE = new Map([
  ["ClickHouse/adsb.exposed", ["Reference", "code is CC BY-NC-SA 4.0 (non-commercial): read, don't copy"]],
  ["greensock/GSAP", ["Trial", "not open source: GSAP's free 'standard no-charge license' allows commercial use with restrictions"]],
  ["ShanonPearce/ASH-IR-Dataset", ["Reference", "impulse responses are CC BY-NC-SA: non-commercial, don't ship them"]],
  ["rameshvarun/feedvid-live", ["Reference", "custom non-commercial licence: study the game, don't copy"]],
  ["pmndrs/triplex", ["Tool only", "editor app is AGPL-licensed (no licence detected at repo root): run it as a dev tool, never bundle"]],
  ["mrk-its/homeassistant-blitzortung", ["Reference", "code is MIT, but Blitzortung lightning data is private, non-commercial use only"]],
  ["standardebooks/tools", ["Tool only", "GPL-3.0 per the project (GitHub reports NOASSERTION): run it, never bundle"]],
  ["xesf/agrippa", ["Reference", "needs the original X-Files Game data, which is copyrighted: study the engine only"]],
  ["dariusk/corpora", ["Trial", "GitHub detects no licence, but the README dedicates the data to CC0: confirm per file"]],
  ["brunosimon/my-room-in-3d", ["Reference", "no licence: study the baked-lighting workflow, don't copy code or assets"]],
]);

// Tools we run but never bundle or link into the game (copyleft or heavy apps).
export const TOOL_ONLY_LICENSES = new Set(["GPL-2.0", "GPL-3.0", "AGPL-3.0"]);

const PERMISSIVE = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "Zlib",
  "Unlicense",
  "CC0-1.0",
  "0BSD",
  "BSL-1.0",
  "WTFPL",
  "OFL-1.1",
  "CC-BY-4.0",
]);
const WEAK_COPYLEFT = new Set(["MPL-2.0", "LGPL-2.1", "LGPL-3.0", "EUPL-1.2", "CC-BY-SA-4.0", "ODbL-1.0"]);

export const ORDER = ["Adopt", "Adopt (tool)", "Trial", "Tool only", "Reference", "Prototype only", "Avoid"];

export function licenseRisk(l) {
  if (PERMISSIVE.has(l)) return ["low", l];
  if (WEAK_COPYLEFT.has(l)) return ["medium", `${l} (weak copyleft)`];
  if (l === "GPL-2.0" || l === "GPL-3.0") return ["high", `${l} (copyleft)`];
  if (l === "AGPL-3.0") return ["high", "AGPL-3.0 (network copyleft)"];
  if (l === "FSL-1.1") return ["medium", "FSL-1.1 (source-available)"];
  if (l === "NOASSERTION") return ["check", "unclassified: read LICENSE"];
  return ["high", "none: all rights reserved"];
}

const NOTE_FLAGS =
  /non-commercial|not open source|source-available|polyform|\$1m|revenue|lock-in|unmaintained|research|share-alike|odbl|mau|verify|unverified|not verified|must be published|archived|terms of use/i;

/** Returns { verdict, risk, licText, reasons } for one source row. */
export function reviewSource(s) {
  const [risk, licText] = licenseRisk(s.license);
  const reasons = [];
  let verdict;
  if (OVERRIDE.has(s.repo)) {
    const [v, why] = OVERRIDE.get(s.repo);
    verdict = v;
    reasons.push(why);
  } else if (AVOID.has(s.repo)) {
    verdict = "Avoid";
    reasons.push(AVOID.get(s.repo));
  } else if (PROTOTYPE_ONLY.has(s.repo)) {
    verdict = "Prototype only";
    reasons.push(PROTOTYPE_ONLY.get(s.repo));
  } else if (ADOPT.has(s.repo)) {
    verdict = TOOL_ONLY_LICENSES.has(s.license) ? "Adopt (tool)" : "Adopt";
  } else if (s.archived) {
    verdict = "Reference";
    reasons.push("archived");
  } else if (TOOL_ONLY_LICENSES.has(s.license)) {
    verdict = "Tool only";
    reasons.push("copyleft: run it, don't bundle or copy it");
  } else if (s.license === "none" || s.license === "unknown") {
    verdict = "Reference";
    reasons.push("no licence: read, don't copy");
  } else if (s.sync === "none" && s.category !== "apis" && s.category !== "tooling") {
    verdict = "Reference";
  } else if (s.stars < 100) {
    verdict = "Trial";
    reasons.push(`unproven (${s.stars}★): check quality first`);
  } else {
    verdict = "Trial";
  }
  if (s.stale && !reasons.includes("archived")) reasons.push("stale");
  if (risk === "check") reasons.push("licence unclassified by GitHub");
  // An API is adopted as a service to call; its repo's own licence doesn't make the code copyable.
  if (s.category === "apis" && verdict.startsWith("Adopt") && (risk === "high" || risk === "check")) {
    reasons.push("adopt the API, not the code: call the service, but don't copy this repo's code or docs (no open licence)");
  }
  const note = s.note ?? "";
  if (note && NOTE_FLAGS.test(note) && !AVOID.has(s.repo) && !PROTOTYPE_ONLY.has(s.repo) && !OVERRIDE.has(s.repo)) {
    reasons.push(note.length > 220 ? `${note.slice(0, 217).trimEnd()}…` : note);
  }
  return { verdict, risk, licText, reasons };
}
