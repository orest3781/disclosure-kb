#!/usr/bin/env node
// Generate REVIEW.md: one verdict and short review per source in sources.json.
//   node scripts/build-review.mjs          write REVIEW.md
//   node scripts/build-review.mjs --check  exit 1 if REVIEW.md is out of date
//
// Verdicts come from two places: the explicit picks below (taken from the
// recommendations in notes/*.md), and rules on licence, status and stars for
// everything else. Change a verdict by editing the lists here, not REVIEW.md.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { categories, sources, checkedAt } = JSON.parse(readFileSync(join(root, "sources.json"), "utf8"));

// Recommended picks from notes/*.md: the first thing to reach for in each area.
const ADOPT = new Set(`
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
`.split(/\s+/).filter(Boolean));

// Weights or data are non-commercial or research-only: fine for prototyping, never ship the output.
const PROTOTYPE_ONLY = new Map([
  ["SWivid/F5-TTS", "pretrained weights are CC-BY-NC"],
  ["facebookresearch/audiocraft", "MusicGen/AudioGen weights are CC-BY-NC 4.0"],
  ["multimodal-art-projection/YuE", "weights are CC BY-NC 4.0"],
  ["hkchengrex/MMAudio", "checkpoints are CC-BY-NC 4.0"],
  ["declare-lab/TangoFlux", "research-only licence"],
  ["coqui-ai/TTS", "unmaintained; XTTS-v2 weights non-commercial (verify)"],
]);

// Don't use: legal, ethical or provenance problems for this project.
const AVOID = new Map([
  ["Tencent-Hunyuan/Hunyuan3D-2.1", "no licence granted in the EU, UK or South Korea; 1M MAU clause"],
  ["Tencent-Hunyuan/Hunyuan3D-2", "no licence granted in the EU, UK or South Korea; 1M MAU clause"],
  ["kijai/ComfyUI-Hunyuan3DWrapper", "ships the Hunyuan licence (EU/UK/South Korea excluded)"],
  ["planetsig/ufo-reports", "NUFORC scrape: NUFORC terms forbid redistribution, and there's no licence"],
  ["YetAnotherMorty/The-Black-Vault-File-Dump", "bulk re-hosting of The Black Vault; fetch FOIA originals instead"],
]);

// Explicit verdicts where the rules would mislabel an entry.
const OVERRIDE = new Map([
  ["ClickHouse/adsb.exposed", ["Reference", "code is CC BY-NC-SA 4.0 (non-commercial): read, don't copy"]],
  ["greensock/GSAP", ["Trial", "not open source: GSAP's free 'standard no-charge license' allows commercial use with restrictions"]],
]);

// Tools we run but never bundle or link into the game (copyleft or heavy apps).
const TOOL_ONLY_LICENSES = new Set(["GPL-2.0", "GPL-3.0", "AGPL-3.0"]);

const PERMISSIVE = new Set(["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "Zlib", "Unlicense", "CC0-1.0", "0BSD", "BSL-1.0", "WTFPL", "OFL-1.1", "CC-BY-4.0"]);
const WEAK_COPYLEFT = new Set(["MPL-2.0", "LGPL-3.0", "EUPL-1.2", "CC-BY-SA-4.0"]);

function licenseRisk(l) {
  if (PERMISSIVE.has(l)) return ["low", l];
  if (WEAK_COPYLEFT.has(l)) return ["medium", `${l} (weak copyleft)`];
  if (l === "GPL-2.0" || l === "GPL-3.0") return ["high", `${l} (copyleft)`];
  if (l === "AGPL-3.0") return ["high", "AGPL-3.0 (network copyleft)"];
  if (l === "FSL-1.1") return ["medium", "FSL-1.1 (source-available)"];
  if (l === "NOASSERTION") return ["check", "unclassified: read LICENSE"];
  return ["high", "none: all rights reserved"];
}

const NOTE_FLAGS = /non-commercial|not open source|source-available|polyform|\$1m|revenue|lock-in|unmaintained|research|share-alike|odbl|mau|verify|unverified|not verified|must be published|archived|terms of use/i;

function review(s) {
  const [risk, licText] = licenseRisk(s.license);
  const reasons = [];
  let verdict;
  if (OVERRIDE.has(s.repo)) { const [v, why] = OVERRIDE.get(s.repo); verdict = v; reasons.push(why); }
  else if (AVOID.has(s.repo)) { verdict = "Avoid"; reasons.push(AVOID.get(s.repo)); }
  else if (PROTOTYPE_ONLY.has(s.repo)) { verdict = "Prototype only"; reasons.push(PROTOTYPE_ONLY.get(s.repo)); }
  else if (ADOPT.has(s.repo)) { verdict = TOOL_ONLY_LICENSES.has(s.license) ? "Adopt (tool)" : "Adopt"; }
  else if (s.archived) { verdict = "Reference"; reasons.push("archived"); }
  else if (TOOL_ONLY_LICENSES.has(s.license)) { verdict = "Tool only"; reasons.push("copyleft: run it, don't bundle or copy it"); }
  else if (s.license === "none" || s.license === "unknown") { verdict = "Reference"; reasons.push("no licence: read, don't copy"); }
  else if (s.sync === "none" && s.category !== "apis" && s.category !== "tooling") { verdict = "Reference"; }
  else if (s.stars < 100) { verdict = "Trial"; reasons.push(`unproven (${s.stars}★): check quality first`); }
  else { verdict = "Trial"; }
  if (s.stale && !reasons.includes("archived")) reasons.push("stale");
  if (risk === "check") reasons.push("licence unclassified by GitHub");
  const note = s.note ?? "";
  if (note && NOTE_FLAGS.test(note) && !AVOID.has(s.repo) && !PROTOTYPE_ONLY.has(s.repo) && !OVERRIDE.has(s.repo)) {
    reasons.push(note.length > 220 ? `${note.slice(0, 217).trimEnd()}…` : note);
  }
  return { verdict, risk, licText, reasons };
}

const ORDER = ["Adopt", "Adopt (tool)", "Trial", "Tool only", "Reference", "Prototype only", "Avoid"];
const cell = (t) => String(t).replaceAll("|", "\\|").replaceAll("\n", " ");
const fmtStars = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(n));

const reviewed = sources.map((s) => ({ ...s, ...review(s) }));
const count = (rows) => Object.fromEntries(ORDER.map((v) => [v, rows.filter((r) => r.verdict === v).length]));

let md = `<!-- Generated by scripts/build-review.mjs from sources.json. Do not edit by hand; change verdicts in the script. -->

# Review: every source, one verdict

${reviewed.length} entries across ${categories.length} categories, reviewed ${checkedAt}. Each row gives a verdict, licence risk and a short review: what it is, what we'd use it for, and any caveat. Full details are in [\`catalog/\`](catalog/), and the reasoning behind the picks is in [\`notes/\`](notes/).

**How this was reviewed:** from the catalog data (stars, licence and status checked against GitHub on ${checkedAt}), the provider terms recorded in the notes column, and the recommendations in \`notes/*.md\`. **Nothing here has been installed or tested.** Verdicts are desk reviews to decide what to try first.

## Verdicts

| Verdict | Meaning |
|---|---|
| **Adopt** | Recommended pick for its job; start here |
| **Adopt (tool)** | Recommended, but copyleft: run it as a tool, never bundle it into the game |
| **Trial** | Permissive and relevant; try it when the need comes up |
| **Tool only** | GPL/AGPL: fine to run as a separate tool or service; don't copy or link its code |
| **Reference** | Read and learn from it: no licence, archived, or not something we'd install |
| **Prototype only** | Non-commercial or research-only weights: never ship its output |
| **Avoid** | Legal, ethical or provenance problem for this project |

Licence risk: **low** = permissive · **medium** = weak copyleft or source-available · **high** = GPL/AGPL or no licence · **check** = GitHub couldn't classify it, so read the LICENSE file.

## Summary

| Category | ${ORDER.join(" | ")} | Total |
|---|${ORDER.map(() => "---:").join("|")}|---:|
`;
for (const c of categories) {
  const rows = reviewed.filter((r) => r.category === c.id);
  const k = count(rows);
  md += `| [${c.title}](#${c.id}) | ${ORDER.map((v) => k[v] || "").join(" | ")} | ${rows.length} |\n`;
}
const all = count(reviewed);
md += `| **All** | ${ORDER.map((v) => `**${all[v]}**`).join(" | ")} | **${reviewed.length}** |\n`;

md += `\n## Avoid and prototype-only\n\n`;
for (const r of reviewed.filter((x) => x.verdict === "Avoid" || x.verdict === "Prototype only")) {
  md += `- **${r.verdict}:** [${r.repo}](https://github.com/${r.repo}): ${r.reasons[0]}.\n`;
}

for (const c of categories) {
  const rows = reviewed
    .filter((r) => r.category === c.id)
    .sort((a, b) => ORDER.indexOf(a.verdict) - ORDER.indexOf(b.verdict) || b.stars - a.stars);
  md += `\n<a id="${c.id}"></a>\n## ${c.title}\n\n${c.description} Notes: [notes/${c.id}.md](notes/${c.id}.md).\n\n`;
  md += `| Repo | Verdict | ★ | Licence risk | Review |\n|---|---|---:|---|---|\n`;
  for (const r of rows) {
    const extra = r.reasons.length ? ` **Caveat:** ${r.reasons.join("; ")}.` : "";
    const what = r.what.replace(/\.?$/, ".");
    const use = r.use.replace(/\.?$/, ".");
    md += `| [${r.repo}](https://github.com/${r.repo}) | ${r.verdict} | ${fmtStars(r.stars)} | ${r.risk}: ${cell(r.licText)} | ${cell(`${what} **Use:** ${use}${extra}`)} |\n`;
  }
}

const out = join(root, "REVIEW.md");
if (process.argv.includes("--check")) {
  const cur = existsSync(out) ? readFileSync(out, "utf8") : "";
  if (cur !== md) { console.error("out of date: REVIEW.md"); process.exit(1); }
  console.log("review up to date");
} else {
  writeFileSync(out, md);
  console.log(`wrote REVIEW.md (${reviewed.length} entries)`, all);
}
