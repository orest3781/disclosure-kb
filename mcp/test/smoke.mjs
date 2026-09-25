// End-to-end smoke test: starts the built server over stdio with the official
// client and exercises every tool. Run: npm test (from mcp/).

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { reviewSource } from "../../scripts/lib/review.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const client = new Client({ name: "smoke", version: "0.0.0" });
await client.connect(new StdioClientTransport({ command: "node", args: [join(here, "..", "dist", "index.js")], stderr: "pipe" }));

const call = async (name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  assert.ok(!r.isError, `${name} returned isError: ${JSON.stringify(r.content)}`);
  return r.content.map((c) => c.text ?? "").join("\n");
};

const tools = (await client.listTools()).tools.map((t) => t.name).sort();
assert.deepEqual(tools, [
  "kb_get_source",
  "kb_list_categories",
  "kb_read_doc",
  "kb_search_docs",
  "kb_search_sources",
  "kb_search_vendor",
  "kb_vendor_status",
]);

const cats = await call("kb_list_categories");
assert.match(cats, /## 3d-tech/);
assert.match(cats, /## apis/);

const sat = await call("kb_search_sources", { query: "satellite tle", category: "sky-geo" });
assert.match(sat, /shashwatak\/satellite-js/);
assert.match(sat, /Adopt/);

const avoid = await call("kb_search_sources", { verdict: "Avoid", response_format: "json" });
const avoidJson = JSON.parse(avoid);
const { sources } = JSON.parse(readFileSync(join(here, "..", "..", "sources.json"), "utf8"));
const expectedAvoid = sources.filter((s) => reviewSource(s).verdict === "Avoid").length;
assert.ok(expectedAvoid > 0);
assert.equal(avoidJson.total, expectedAvoid);
assert.ok(avoidJson.sources.every((s) => s.verdict === "Avoid"));

const bad = await call("kb_search_sources", { category: "nope" });
assert.match(bad, /unknown category/);

const drei = await call("kb_get_source", { repo: "drei" });
assert.match(drei, /pmndrs\/drei — Adopt/);
assert.match(drei, /Synced in vendor\//);

const miss = await call("kb_get_source", { repo: "pmndrs/does-not-exist" });
assert.match(miss, /Not in the catalogue/);

const list = await call("kb_read_doc", {});
assert.match(list, /kb\/stack\.md/);

const stack = await call("kb_read_doc", { path: "kb/stack.md", section: "State, story, AI" });
assert.match(stack, /^## State, story, AI/m);
assert.doesNotMatch(stack, /## Investigation UI/);

const traversal = await call("kb_read_doc", { path: "../../etc/passwd" });
assert.match(traversal, /not a readable document/);

const hits = await call("kb_search_docs", { query: "NUFORC", max_hits: 5 });
assert.match(hits, /notes\/ufo-data\.md:\d+|kb\/data-sources\.md:\d+/);

const status = await call("kb_vendor_status");
assert.match(status, /synced of/);

const vendor = await call("kb_search_vendor", { pattern: "ZZZ_no_such_token_ZZZ", fixed_strings: true });
assert.match(vendor, /No matches|Nothing is synced/);

const resources = await client.listResources();
assert.ok(resources.resources.some((r) => r.uri === "kb://docs/kb/stack.md"));
const res = await client.readResource({ uri: "kb://docs/kb/glossary.md" });
assert.match(res.contents[0].text, /^# Glossary/);

await client.close();
console.log(`smoke test passed: ${tools.length} tools, ${resources.resources.length} resources`);
