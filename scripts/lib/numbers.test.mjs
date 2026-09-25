import assert from "node:assert/strict";
import { test } from "node:test";
import { END, renderCorpusNumbers, replaceBlock, START } from "./numbers.mjs";
import { reviewSource } from "./review.mjs";

let seq = 0;
const row = (over = {}) => {
  const s = {
    repo: `example/r${++seq}`,
    category: "3d-tech",
    stars: 5000,
    license: "MIT",
    sync: "docs",
    what: "A thing.",
    use: "We use it.",
    ...over,
  };
  return { ...s, ...reviewSource(s) };
};
const countFor = (block, label) =>
  block
    .split("\n")
    .find((l) => l.startsWith(`| ${label} |`))
    ?.split(" | ")[1];

test("counts each row from the reviewed sources", () => {
  const reviewed = [
    row(),
    row({ license: "none", stars: 12 }),
    row({ license: "NOASSERTION", stars: 20000 }),
    row({ license: "AGPL-3.0", archived: true }),
    row({ note: "Pricing unverified." }),
  ];
  const block = renderCorpusNumbers(reviewed, 3, "2026-01-01");
  assert.match(block, /^5 sources in 3 categories, checked against GitHub on 2026-01-01\.$/m);
  assert.equal(countFor(block, "Permissive licence (MIT, Apache, BSD, ISC, CC0, OFL…)"), "2 (40%)");
  assert.equal(countFor(block, "No licence at all"), "1");
  assert.equal(countFor(block, "GitHub couldn't classify the licence"), "1");
  assert.equal(countFor(block, "GPL / AGPL"), "1");
  assert.equal(countFor(block, "Under 100 stars"), "1");
  assert.equal(countFor(block, "10k stars or more"), "1");
  assert.equal(countFor(block, "Archived or stale"), "1");
  assert.equal(countFor(block, 'Marked "verify" or "unverified" in the notes'), "1");
});

test("the block starts and ends with the markers", () => {
  const block = renderCorpusNumbers([row()], 1, "2026-01-01");
  assert.ok(block.startsWith(START));
  assert.ok(block.endsWith(END));
});

test("replaceBlock swaps only the text between the markers", () => {
  const doc = `before\n${START}\nold\n${END}\nafter\n`;
  assert.equal(replaceBlock(doc, `${START}\nnew\n${END}`), `before\n${START}\nnew\n${END}\nafter\n`);
});

test("replaceBlock fails loudly when the markers are missing", () => {
  assert.throws(() => replaceBlock("no markers here", "x"), /markers not found/);
});
