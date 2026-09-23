/**
 * Data layer for the disclosure-kb MCP server: loads sources.json, applies the
 * shared verdict logic, reads the written docs, and searches synced vendor code.
 * Everything is read-only and rooted at the repo directory (two levels up from
 * mcp/dist), never elsewhere on disk.
 */

import { execFile } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const VENDOR_DIR = join(ROOT, "vendor");
export const CHARACTER_LIMIT = 25_000;

export interface Category { id: string; title: string; description: string }
export interface Source {
  repo: string; category: string; group?: string; stars: number; license: string;
  sync: "docs" | "full" | "none"; what: string; use: string; note?: string;
  archived?: boolean; stale?: boolean;
}
export interface Review { verdict: string; risk: string; licText: string; reasons: string[] }
export type ReviewedSource = Source & Review & { url: string };

interface ReviewModule { reviewSource(s: Source): Review; ORDER: string[] }

// ---- sources.json, cached on mtime -----------------------------------------
let cache: { mtime: number; categories: Category[]; sources: ReviewedSource[]; checkedAt: string } | null = null;
let reviewModule: ReviewModule | null = null;

async function loadReview(): Promise<ReviewModule> {
  // Shared with scripts/build-review.mjs so both produce identical verdicts.
  reviewModule ??= (await import(pathToFileURL(join(ROOT, "scripts", "lib", "review.mjs")).href)) as ReviewModule;
  return reviewModule;
}

export async function loadKb(): Promise<NonNullable<typeof cache>> {
  const file = join(ROOT, "sources.json");
  const mtime = statSync(file).mtimeMs;
  if (cache && cache.mtime === mtime) return cache;
  const raw = JSON.parse(readFileSync(file, "utf8")) as { categories: Category[]; sources: Source[]; checkedAt: string };
  const { reviewSource } = await loadReview();
  const sources = raw.sources.map((s) => ({ ...s, ...reviewSource(s), url: `https://github.com/${s.repo}` }));
  cache = { mtime, categories: raw.categories, sources, checkedAt: raw.checkedAt };
  return cache;
}

// ---- search ---------------------------------------------------------------
export interface SearchFilters {
  query?: string; category?: string; group?: string; verdict?: string;
  license_risk?: string; min_stars?: number;
}

/** Token match with field weights; repo name and group count most. */
export function searchSources(all: ReviewedSource[], f: SearchFilters): ReviewedSource[] {
  const terms = (f.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const scored: [number, ReviewedSource][] = [];
  for (const s of all) {
    if (f.category && s.category !== f.category) continue;
    if (f.group && (s.group ?? "").toLowerCase() !== f.group.toLowerCase()) continue;
    if (f.verdict && s.verdict.toLowerCase() !== f.verdict.toLowerCase()) continue;
    if (f.license_risk && s.risk !== f.license_risk) continue;
    if (f.min_stars !== undefined && s.stars < f.min_stars) continue;
    let score = 0;
    if (terms.length) {
      const fields: [string, number][] = [
        [s.repo.toLowerCase(), 3], [(s.group ?? "").toLowerCase(), 2],
        [s.what.toLowerCase(), 1], [s.use.toLowerCase(), 1], [(s.note ?? "").toLowerCase(), 0.5],
      ];
      for (const t of terms) {
        let hit = 0;
        for (const [text, w] of fields) if (text.includes(t)) hit += w;
        if (hit === 0) { score = -1; break; } // every term must match somewhere
        score += hit;
      }
      if (score < 0) continue;
    }
    scored.push([score, s]);
  }
  return scored.sort((a, b) => b[0] - a[0] || b[1].stars - a[1].stars).map(([, s]) => s);
}

export function findSource(all: ReviewedSource[], repo: string): ReviewedSource | undefined {
  const key = repo.toLowerCase().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").replace(/\/$/, "");
  return all.find((s) => s.repo.toLowerCase() === key) ?? all.find((s) => s.repo.toLowerCase().endsWith(`/${key}`));
}

// ---- written docs ---------------------------------------------------------
const DOC_DIRS = ["kb", "notes", "catalog"];
const DOC_FILES = ["README.md", "INDEX.md", "REVIEW.md", "CLAUDE.md"];

/** Resolve a doc path safely inside the repo; returns null if not allowed. */
export function resolveDoc(path: string): string | null {
  const clean = normalize(path).replace(/^([/\\])+/, "");
  if (clean.includes("..")) return null;
  const abs = join(ROOT, clean);
  const rel = relative(ROOT, abs);
  const top = rel.split(sep)[0];
  const allowed = DOC_FILES.includes(rel) || (DOC_DIRS.includes(top) && rel.endsWith(".md"));
  return allowed && existsSync(abs) ? abs : null;
}

export function listDocs(): { path: string; bytes: number }[] {
  // Written layers first (kb/, notes/), generated ones last, so searches hit decisions before catalogue rows.
  const out: { path: string; bytes: number }[] = [];
  for (const d of DOC_DIRS) {
    const dir = join(ROOT, d);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".md")).sort()) out.push({ path: `${d}/${f}`, bytes: statSync(join(dir, f)).size });
  }
  for (const f of DOC_FILES) if (existsSync(join(ROOT, f))) out.push({ path: f, bytes: statSync(join(ROOT, f)).size });
  return out;
}

/** Return one markdown section (heading match, case-insensitive) or the whole file. */
export function readDoc(abs: string, section?: string): { text: string; sections: string[] } {
  const text = readFileSync(abs, "utf8");
  const lines = text.split("\n");
  const headings = lines.map((l, i) => ({ i, m: /^(#{1,6})\s+(.*)$/.exec(l) })).filter((h) => h.m) as { i: number; m: RegExpExecArray }[];
  const sections = headings.map((h) => h.m[2].trim());
  if (!section) return { text, sections };
  const want = section.toLowerCase();
  const idx = headings.findIndex((h) => h.m[2].trim().toLowerCase().includes(want));
  if (idx < 0) return { text: "", sections };
  const level = headings[idx].m[1].length;
  const next = headings.slice(idx + 1).find((h) => h.m[1].length <= level);
  return { text: lines.slice(headings[idx].i, next ? next.i : lines.length).join("\n"), sections };
}

export function searchDocs(query: string, context: number, maxHits: number): { path: string; line: number; excerpt: string }[] {
  const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const hits: { path: string; line: number; excerpt: string }[] = [];
  for (const d of listDocs()) {
    const lines = readFileSync(join(ROOT, d.path), "utf8").split("\n");
    for (let i = 0; i < lines.length && hits.length < maxHits; i++) {
      if (!re.test(lines[i])) continue;
      const from = Math.max(0, i - context);
      const to = Math.min(lines.length, i + context + 1);
      hits.push({ path: d.path, line: i + 1, excerpt: lines.slice(from, to).join("\n") });
    }
    if (hits.length >= maxHits) break;
  }
  return hits;
}

// ---- vendor/ (synced source repos) ----------------------------------------
export interface VendorRepo { repo: string; category: string; dir: string }

export function listVendor(): VendorRepo[] {
  if (!existsSync(VENDOR_DIR)) return [];
  const out: VendorRepo[] = [];
  for (const cat of readdirSync(VENDOR_DIR)) {
    const catDir = join(VENDOR_DIR, cat);
    if (!statSync(catDir).isDirectory()) continue;
    for (const d of readdirSync(catDir)) {
      if (!existsSync(join(catDir, d, ".git"))) continue;
      out.push({ repo: d.replace("__", "/"), category: cat, dir: join(catDir, d) });
    }
  }
  return out.sort((a, b) => a.repo.localeCompare(b.repo));
}

export interface VendorSearch { pattern: string; repo?: string; glob?: string; max_results: number; fixed_strings: boolean }

/** ripgrep over vendor/ (falls back to grep -rn). Output is capped by the caller. */
export async function searchVendor(p: VendorSearch): Promise<{ stdout: string; searched: string[]; tool: string }> {
  const repos = listVendor().filter((v) => !p.repo || v.repo.toLowerCase() === p.repo.toLowerCase() || v.repo.toLowerCase().endsWith(`/${p.repo.toLowerCase()}`));
  if (repos.length === 0) return { stdout: "", searched: [], tool: "none" };
  const dirs = repos.map((r) => r.dir);
  let tool = "rg";
  let args = ["-n", "--no-heading", "--color", "never", "--max-count", "5", "--max-columns", "240", "-m", String(p.max_results)];
  if (p.fixed_strings) args.push("-F");
  if (p.glob) args.push("--glob", p.glob);
  args.push("-e", p.pattern, ...dirs);
  try {
    const { stdout } = await run("rg", args, { maxBuffer: 4 * 1024 * 1024, timeout: 20_000 });
    return { stdout: trimVendorPaths(stdout), searched: repos.map((r) => r.repo), tool };
  } catch (err) {
    const e = err as { code?: number | string; stdout?: string };
    if (e.code === 1) return { stdout: "", searched: repos.map((r) => r.repo), tool }; // rg: no matches
    if (e.code !== "ENOENT") throw err;
  }
  tool = "grep";
  args = ["-rn", "-I", "--exclude-dir=.git", p.fixed_strings ? "-F" : "-E", "-e", p.pattern, ...dirs];
  try {
    const { stdout } = await run("grep", args, { maxBuffer: 4 * 1024 * 1024, timeout: 20_000 });
    return { stdout: trimVendorPaths(stdout), searched: repos.map((r) => r.repo), tool };
  } catch (err) {
    const e = err as { code?: number };
    if (e.code === 1) return { stdout: "", searched: repos.map((r) => r.repo), tool };
    throw err;
  }
}

function trimVendorPaths(s: string): string {
  return s.split("\n").map((l) => (l.startsWith(VENDOR_DIR) ? l.slice(VENDOR_DIR.length + 1) : l)).join("\n");
}

// ---- output helpers ---------------------------------------------------------
export function truncate(text: string, hint: string): string {
  if (text.length <= CHARACTER_LIMIT) return text;
  return `${text.slice(0, CHARACTER_LIMIT)}\n\n[Truncated at ${CHARACTER_LIMIT} characters. ${hint}]`;
}

export const fmtStars = (n: number): string => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(n));

export function sourceToMarkdown(s: ReviewedSource, full: boolean): string {
  const head = `### ${s.repo} — ${s.verdict} · ${fmtStars(s.stars)}★ · ${s.licText} (${s.risk} risk)`;
  const lines = [head, `- **Category/group:** ${s.category} / ${s.group ?? "-"}`, `- **What:** ${s.what}`, `- **Use:** ${s.use}`];
  if (s.reasons.length) lines.push(`- **Caveats:** ${s.reasons.join("; ")}`);
  if (full) {
    if (s.note) lines.push(`- **Note:** ${s.note}`);
    lines.push(`- **Sync mode:** ${s.sync}${s.archived ? " · archived" : ""}${s.stale ? " · stale" : ""}`, `- **URL:** ${s.url}`);
  }
  return lines.join("\n");
}
