/**
 * Tool and resource registrations for the disclosure-kb MCP server.
 * All tools are read-only; none touch the network.
 */

import { type McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import * as z from "zod";
import {
  CHARACTER_LIMIT,
  findSource,
  listDocs,
  listVendor,
  loadKb,
  readDoc,
  resolveDoc,
  searchDocs,
  searchSources,
  searchVendor,
  sourceToMarkdown,
  truncate,
} from "./kb.js";

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const VERDICTS = ["Adopt", "Adopt (tool)", "Trial", "Tool only", "Reference", "Prototype only", "Avoid"] as const;

export function registerAll(server: McpServer): void {
  // ---- kb_list_categories ---------------------------------------------------
  server.registerTool(
    "kb_list_categories",
    {
      title: "List knowledge-base categories",
      description: `List the knowledge base's categories with source counts, verdict counts and group names. Call this first to learn the category ids and group names used as filters by kb_search_sources.

Returns markdown: one section per category (id, title, description, counts by verdict, groups), plus the date the stars/licences were last checked.`,
      inputSchema: z.object({}).strict(),
      annotations: READ_ONLY,
    },
    async () => {
      const kb = await loadKb();
      const out = [`# Categories (${kb.sources.length} sources, checked ${kb.checkedAt})`, ""];
      for (const c of kb.categories) {
        const rows = kb.sources.filter((s) => s.category === c.id);
        const verdicts = VERDICTS.map((v) => [v, rows.filter((r) => r.verdict === v).length] as const).filter(([, n]) => n);
        const groups = [...new Set(rows.map((r) => r.group ?? ""))].filter(Boolean);
        out.push(
          `## ${c.id} — ${c.title} (${rows.length})`,
          c.description,
          `- Verdicts: ${verdicts.map(([v, n]) => `${v} ${n}`).join(", ")}`,
          `- Groups: ${groups.join(" · ")}`,
          "",
        );
      }
      return text(out.join("\n"));
    },
  );

  // ---- kb_search_sources ----------------------------------------------------
  server.registerTool(
    "kb_search_sources",
    {
      title: "Search catalogued sources",
      description: `Search the catalogue of GitHub repos, datasets and APIs by keywords and filters. Every term in query must match somewhere in the repo name, group, description, use or note (repo name and group weigh most). Results include the review verdict and licence risk for each source.

Args:
  - query (string, optional): keywords, e.g. "satellite tle", "tts browser", "playwright". Omit to list by filters only.
  - category (string, optional): category id from kb_list_categories, e.g. "3d-tech", "sky-geo", "apis".
  - group (string, optional): group name within a category, e.g. "Games to learn from".
  - verdict (string, optional): one of ${VERDICTS.join(" | ")}.
  - license_risk (string, optional): low | medium | high | check.
  - min_stars (number, optional): minimum GitHub stars.
  - limit / offset: pagination (default 20, max 100).
  - response_format: "markdown" (default) or "json".

Returns: total matches and a page of sources. Markdown gives repo, verdict, stars, licence, what, use, caveats. JSON gives the full rows.

Examples:
  - "What do we use for NPC voices?" -> query="tts voice", verdict="Adopt"
  - "Everything we must not ship" -> verdict="Avoid" (then verdict="Prototype only")
  - "Cheapest way to get historic flight data" -> query="ads-b", category="apis" or "sky-geo"

Errors: returns "No sources match" with the filters echoed when nothing matches; check category ids with kb_list_categories.`,
      inputSchema: z
        .object({
          query: z.string().max(200).optional().describe("Keywords; all must match"),
          category: z.string().max(40).optional().describe("Category id (see kb_list_categories)"),
          group: z.string().max(60).optional().describe("Group name within a category"),
          verdict: z.enum(VERDICTS).optional().describe("Review verdict filter"),
          license_risk: z.enum(["low", "medium", "high", "check"]).optional().describe("Licence risk filter"),
          min_stars: z.number().int().min(0).optional().describe("Minimum stars"),
          limit: z.number().int().min(1).max(100).default(20).describe("Page size"),
          offset: z.number().int().min(0).default(0).describe("Results to skip"),
          response_format: z.enum(["markdown", "json"]).default("markdown"),
        })
        .strict(),
      annotations: READ_ONLY,
    },
    async (p) => {
      const kb = await loadKb();
      if (p.category && !kb.categories.some((c) => c.id === p.category)) {
        return text(`Error: unknown category "${p.category}". Valid ids: ${kb.categories.map((c) => c.id).join(", ")}.`);
      }
      const all = searchSources(kb.sources, p);
      const page = all.slice(p.offset, p.offset + p.limit);
      if (all.length === 0) {
        return text(
          `No sources match ${JSON.stringify({ query: p.query, category: p.category, group: p.group, verdict: p.verdict, license_risk: p.license_risk, min_stars: p.min_stars })}. Try fewer terms, or kb_search_docs for the written notes.`,
        );
      }
      const hasMore = p.offset + page.length < all.length;
      const footer = hasMore
        ? `\n\n(${all.length} matches; showing ${p.offset + 1}-${p.offset + page.length}. Use offset=${p.offset + page.length} for more.)`
        : `\n\n(${all.length} matches.)`;
      if (p.response_format === "json") {
        const payload = { total: all.length, count: page.length, offset: p.offset, has_more: hasMore, sources: page };
        return text(truncate(JSON.stringify(payload, null, 2), "Lower limit or add filters."));
      }
      const body = page.map((s) => sourceToMarkdown(s, false)).join("\n\n");
      return text(truncate(`# Sources${p.query ? ` matching "${p.query}"` : ""}\n\n${body}${footer}`, "Lower limit or add filters."));
    },
  );

  // ---- kb_get_source --------------------------------------------------------
  server.registerTool(
    "kb_get_source",
    {
      title: "Get one source in full",
      description: `Get the full catalogue row for one repo: verdict, licence risk, stars, what/use, caveats, the provider note (auth, limits, terms for APIs), sync mode and URL, plus whether it's synced into vendor/ and which notes file covers its category.

Args:
  - repo (string): "owner/name", a GitHub URL, or just "name" if unambiguous (e.g. "drei", "pmndrs/drei").

Errors: "Not in the catalogue" with up to 5 near matches, so you can pick the right name.`,
      inputSchema: z.object({ repo: z.string().min(1).max(200).describe("owner/name, GitHub URL, or bare repo name") }).strict(),
      annotations: READ_ONLY,
    },
    async ({ repo }) => {
      const kb = await loadKb();
      const s = findSource(kb.sources, repo);
      if (!s) {
        const near = searchSources(kb.sources, { query: repo.split("/").pop() })
          .slice(0, 5)
          .map((x) => x.repo);
        return text(
          `Not in the catalogue: "${repo}".${near.length ? ` Near matches: ${near.join(", ")}.` : " Try kb_search_sources with keywords."}`,
        );
      }
      const synced = listVendor().some((v) => v.repo === s.repo);
      const extra = [
        `- **Synced in vendor/:** ${synced ? "yes (kb_search_vendor can grep it)" : `no (run: node scripts/sync.mjs --repo ${s.repo})`}`,
        `- **Notes:** notes/${s.category}.md · **Catalog:** catalog/${s.category}.md`,
      ];
      return text(`${sourceToMarkdown(s, true)}\n${extra.join("\n")}`);
    },
  );

  // ---- kb_read_doc ----------------------------------------------------------
  server.registerTool(
    "kb_read_doc",
    {
      title: "Read a knowledge-base document",
      description: `Read one of the written documents: kb/*.md (decisions: stack, features, pipelines, data-sources, licensing, risks-and-gaps, roadmap, glossary), notes/<category>.md (findings), catalog/<category>.md, REVIEW.md, README.md, INDEX.md or CLAUDE.md. Pass no path to list every readable document with its size.

Args:
  - path (string, optional): e.g. "kb/stack.md", "notes/ufo-data.md". Omit to list documents.
  - section (string, optional): a heading to return only that section (case-insensitive substring), e.g. "Licence traps".
  - offset (number): character offset for paging through long files (default 0).

Returns: the document (or section) text, the list of its headings, and a note if truncated at ${CHARACTER_LIMIT} characters with the offset to continue from.

Read order for questions: kb/ (decisions and policy) → notes/ (findings) → catalog/ and REVIEW.md (per-source facts).`,
      inputSchema: z
        .object({
          path: z.string().max(200).optional().describe("Relative doc path; omit to list"),
          section: z.string().max(120).optional().describe("Heading substring to return only that section"),
          offset: z.number().int().min(0).default(0).describe("Character offset"),
        })
        .strict(),
      annotations: READ_ONLY,
    },
    async ({ path, section, offset }) => {
      if (!path) {
        const docs = listDocs();
        return text(`# Readable documents\n\n${docs.map((d) => `- ${d.path} (${(d.bytes / 1024).toFixed(1)} KB)`).join("\n")}`);
      }
      const abs = resolveDoc(path);
      if (!abs) return text(`Error: "${path}" is not a readable document. Call kb_read_doc with no path to list them.`);
      const { text: body, sections } = readDoc(abs, section);
      if (section && !body) return text(`No heading in ${path} matches "${section}". Headings: ${sections.join(" | ")}`);
      const slice = body.slice(offset, offset + CHARACTER_LIMIT);
      const more =
        offset + CHARACTER_LIMIT < body.length
          ? `\n\n[${body.length - offset - CHARACTER_LIMIT} more characters; continue with offset=${offset + CHARACTER_LIMIT}]`
          : "";
      const toc = section ? "" : `\n\n---\nHeadings: ${sections.join(" | ")}`;
      return text(`${slice}${more}${toc}`);
    },
  );

  // ---- kb_search_docs -------------------------------------------------------
  server.registerTool(
    "kb_search_docs",
    {
      title: "Search the written documents",
      description: `Case-insensitive text search across all written documents (kb/, notes/, catalog/, REVIEW.md, README.md, INDEX.md, CLAUDE.md), returning matching lines with surrounding context. Use it for questions like "what did we decide about NUFORC?" or "where is Open-Meteo mentioned?".

Args:
  - query (string): plain text (not a regex), e.g. "NUFORC", "share-alike", "perf gate".
  - context (number): lines of context on each side (default 1, max 5).
  - max_hits (number): maximum matches (default 30, max 100).

Returns: markdown list of path:line with the excerpt. Follow up with kb_read_doc for the full section.`,
      inputSchema: z
        .object({
          query: z.string().min(2).max(120).describe("Plain-text search string"),
          context: z.number().int().min(0).max(5).default(1),
          max_hits: z.number().int().min(1).max(100).default(30),
        })
        .strict(),
      annotations: READ_ONLY,
    },
    async ({ query, context, max_hits }) => {
      const hits = searchDocs(query, context, max_hits);
      if (!hits.length) return text(`No document lines contain "${query}". Try kb_search_sources for catalogue rows, or a shorter term.`);
      const body = hits.map((h) => `**${h.path}:${h.line}**\n\`\`\`\n${h.excerpt}\n\`\`\``).join("\n\n");
      return text(truncate(`# ${hits.length} hit(s) for "${query}"\n\n${body}`, "Lower max_hits or context."));
    },
  );

  // ---- kb_vendor_status -----------------------------------------------------
  server.registerTool(
    "kb_vendor_status",
    {
      title: "List synced source repos",
      description: `List which catalogued repos are currently synced into vendor/ (shallow clones pulled by scripts/sync.mjs) and are therefore searchable with kb_search_vendor. Also reports how many catalogued sources are not synced and the command to sync one.`,
      inputSchema: z.object({}).strict(),
      annotations: READ_ONLY,
    },
    async () => {
      const kb = await loadKb();
      const vendor = listVendor();
      const syncable = kb.sources.filter((s) => s.sync !== "none").length;
      const lines = vendor.map((v) => `- ${v.repo} (${v.category})`);
      return text(
        `# vendor/ status\n\n${vendor.length} synced of ${syncable} syncable sources (${kb.sources.length} total).\n\n${lines.join("\n") || "(nothing synced yet)"}\n\nSync one: \`node scripts/sync.mjs --repo owner/name\` · a category: \`--category <id>\` · everything: \`node scripts/sync.mjs\`.`,
      );
    },
  );

  // ---- kb_search_vendor -----------------------------------------------------
  server.registerTool(
    "kb_search_vendor",
    {
      title: "Grep synced source code",
      description: `Search the synced source repos in vendor/ with ripgrep (grep fallback). Use it to find how a library implements something, e.g. pattern="EffectComposer" or pattern="sparse-checkout". Only repos already synced are searched: check kb_vendor_status, and sync missing ones with scripts/sync.mjs.

Args:
  - pattern (string): regex (ripgrep syntax) unless fixed_strings=true.
  - repo (string, optional): limit to one synced repo, "owner/name" or bare name.
  - glob (string, optional): file glob, e.g. "*.ts", "README.md".
  - max_results (number): per-file match cap is 5; total lines capped at this (default 50, max 200).
  - fixed_strings (boolean): treat pattern as literal text (default false).

Returns: "path:line: text" lines relative to vendor/, the repos searched, and the tool used. Empty result says so and lists what was searched.`,
      inputSchema: z
        .object({
          pattern: z.string().min(1).max(300).describe("Regex or literal pattern"),
          repo: z.string().max(200).optional().describe("Limit to one synced repo"),
          glob: z.string().max(100).optional().describe("File glob filter"),
          max_results: z.number().int().min(1).max(200).default(50),
          fixed_strings: z.boolean().default(false),
        })
        .strict(),
      annotations: READ_ONLY,
    },
    async (p) => {
      const r = await searchVendor(p);
      if (r.searched.length === 0) {
        return text(
          p.repo
            ? `"${p.repo}" is not synced into vendor/. Run: node scripts/sync.mjs --repo ${p.repo}. See kb_vendor_status for what is synced.`
            : "Nothing is synced into vendor/ yet. Run: node scripts/sync.mjs --category <id> (see kb_vendor_status).",
        );
      }
      if (!r.stdout.trim())
        return text(
          `No matches for ${p.fixed_strings ? "literal" : "regex"} "${p.pattern}" in ${r.searched.length} repo(s): ${r.searched.slice(0, 10).join(", ")}${r.searched.length > 10 ? "…" : ""}.`,
        );
      const lines = r.stdout.trimEnd().split("\n").slice(0, p.max_results);
      return text(
        truncate(
          `# ${lines.length} line(s) for "${p.pattern}" (${r.tool}, ${r.searched.length} repo(s))\n\n\`\`\`\n${lines.join("\n")}\n\`\`\``,
          "Narrow with repo or glob.",
        ),
      );
    },
  );

  // ---- resources: the written docs as kb://docs/{path} -----------------------
  server.registerResource(
    "kb-docs",
    new ResourceTemplate("kb://docs/{+path}", {
      list: async () => ({
        resources: listDocs().map((d) => ({ uri: `kb://docs/${d.path}`, name: d.path, mimeType: "text/markdown" })),
      }),
    }),
    { title: "Knowledge-base documents", description: "kb/, notes/, catalog/ and the top-level markdown files", mimeType: "text/markdown" },
    async (uri, vars) => {
      const path = String(vars.path ?? "");
      const abs = resolveDoc(path);
      if (!abs) throw new Error(`Not a readable document: ${path}`);
      return { contents: [{ uri: uri.href, mimeType: "text/markdown", text: readDoc(abs).text }] };
    },
  );
}
