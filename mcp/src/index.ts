#!/usr/bin/env node
/**
 * disclosure-kb MCP server (stdio).
 *
 * Lets any MCP client (Claude Code, Claude Desktop, other agents) query the
 * knowledge base: search the catalogued sources with their verdicts and
 * licence risk, read the kb/ decisions and notes, and grep synced vendor code.
 * Read-only; no network access.
 */

import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./kb.js";
import { registerAll } from "./tools.js";

const INSTRUCTIONS = `disclosure-kb: the knowledge base behind a 3D UFO-disclosure mystery game (Next.js + React Three Fiber).
Answer questions in this order: kb_read_doc on kb/ (stack decisions, features, pipelines, data sources, licensing, risks, roadmap) → notes/<category>.md (findings) → kb_search_sources / kb_get_source (per-source facts and verdicts).
Verdicts: Adopt = recommended pick; Trial = permissive and relevant, unproven if under 100 stars; Tool only = GPL/AGPL, run but never bundle; Reference = read only; Prototype only = non-commercial weights; Avoid = legal/ethical problem.
Stars and licences were checked on the date kb_list_categories reports; nothing has been installed or tested. Never treat a mirror repo's OCR as a verified quote.`;

if (process.argv.includes("--help")) {
  console.log(`disclosure-kb-mcp: MCP server over stdio for ${ROOT}\nTools: kb_list_categories, kb_search_sources, kb_get_source, kb_read_doc, kb_search_docs, kb_vendor_status, kb_search_vendor\nUsage: node dist/index.js   (add to Claude Code via the repo's .mcp.json)`);
  process.exit(0);
}

if (!existsSync(join(ROOT, "sources.json"))) {
  console.error(`ERROR: sources.json not found at ${ROOT}. Run the server from the disclosure-kb repo (mcp/dist/index.js).`);
  process.exit(1);
}

serveStdio(() => {
  const server = new McpServer(
    { name: "disclosure-kb-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {}, resources: {} }, instructions: INSTRUCTIONS },
  );
  registerAll(server);
  return server;
});
console.error(`disclosure-kb MCP server running via stdio (root: ${ROOT})`);
