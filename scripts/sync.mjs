#!/usr/bin/env node
// Pull the source repos listed in sources.json into vendor/ (gitignored) so
// every source can be read and grepped from one place. Clones are shallow and
// read-only: local edits under vendor/ are thrown away on the next sync.
//
//   node scripts/sync.mjs                      every source with sync != "none"
//   node scripts/sync.mjs --category 3d-tech   one category (repeatable)
//   node scripts/sync.mjs --repo pmndrs/drei   one repo (repeatable)
//   node scripts/sync.mjs --mode full          override each source's mode
//   node scripts/sync.mjs --dry-run            print what would happen
//   node scripts/sync.mjs --jobs 8             parallel clones (default 4)
//
// Modes: "docs" checks out root files plus docs/, doc/, examples/ (sparse);
// "full" checks out the whole default branch; "none" is index-only.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { sources } = JSON.parse(readFileSync(join(root, "sources.json"), "utf8"));

const args = process.argv.slice(2);
const pick = (flag) => args.flatMap((a, i) => (a === flag && args[i + 1] ? [args[i + 1]] : []));
const categories = pick("--category");
const repos = pick("--repo");
const [modeOverride] = pick("--mode");
const dryRun = args.includes("--dry-run");
const concurrency = Number(pick("--jobs")[0] ?? 4);
if (!Number.isInteger(concurrency) || concurrency < 1) {
  console.error(`--jobs must be a positive whole number, got "${pick("--jobs")[0]}"`);
  process.exit(1);
}

const DOCS_PATTERNS = ["/*", "!/*/", "/docs/", "/doc/", "/examples/"];

const selected = sources.filter(
  (s) =>
    (categories.length === 0 || categories.includes(s.category)) &&
    (repos.length === 0 || repos.includes(s.repo)) &&
    (modeOverride ?? s.sync) !== "none",
);

if (selected.length === 0) {
  console.log("Nothing to sync. Check --category / --repo against sources.json.");
  process.exit(0);
}

const run = promisify(execFile);
const git = async (argv, cwd) => (await run("git", argv, { cwd })).stdout;

async function syncOne(source) {
  const mode = modeOverride ?? source.sync;
  const dir = join(root, "vendor", source.category, source.repo.replace("/", "__"));
  const url = `https://github.com/${source.repo}.git`;
  if (dryRun) return `${existsSync(dir) ? "update" : "clone "} ${mode.padEnd(4)} ${source.repo}`;

  if (!existsSync(join(dir, ".git"))) {
    mkdirSync(dirname(dir), { recursive: true });
    const sparse = mode === "docs" ? ["--filter=blob:none", "--sparse"] : [];
    await git(["clone", "--depth", "1", "--single-branch", ...sparse, url, dir]);
  } else {
    await git(["fetch", "--depth", "1", "origin"], dir);
    await git(["reset", "--hard", "FETCH_HEAD"], dir);
  }
  if (mode === "docs") await git(["sparse-checkout", "set", "--no-cone", ...DOCS_PATTERNS], dir);
  else await git(["sparse-checkout", "disable"], dir);
  const sha = (await git(["rev-parse", "--short", "HEAD"], dir)).trim();
  return `ok     ${mode.padEnd(4)} ${source.repo} @ ${sha}`;
}

const queue = [...selected];
const failures = [];
await Promise.all(
  Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    for (let s = queue.shift(); s; s = queue.shift()) {
      try {
        console.log(await syncOne(s));
      } catch (err) {
        failures.push(s.repo);
        console.error(`FAIL   ${s.repo}: ${(err.stderr ?? err.message).toString().trim().split("\n").pop()}`);
      }
    }
  }),
);

console.log(`\n${selected.length - failures.length}/${selected.length} ${dryRun ? "would sync" : "synced into vendor/"}`);
process.exit(failures.length ? 1 : 0);
