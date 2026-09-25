// The verdict rules decide what is safe to ship, so each rule gets a test.
// Rows use made-up repo names so the rules are tested, not the current lists.
import assert from "node:assert/strict";
import { test } from "node:test";
import { ADOPT, AVOID, licenseRisk, OVERRIDE, PROTOTYPE_ONLY, reviewSource } from "./review.mjs";

const row = (over = {}) => ({
  repo: "example/unlisted",
  category: "3d-tech",
  stars: 5000,
  license: "MIT",
  sync: "docs",
  what: "A thing.",
  use: "We use it.",
  ...over,
});
const first = (collection) => [...collection.keys()][0];

test("a popular permissive source defaults to Trial with no caveats", () => {
  assert.deepEqual(reviewSource(row()), { verdict: "Trial", risk: "low", licText: "MIT", reasons: [] });
});

test("a source under 100 stars is Trial, flagged as unproven", () => {
  const r = reviewSource(row({ stars: 42 }));
  assert.equal(r.verdict, "Trial");
  assert.match(r.reasons.join(), /unproven \(42★\)/);
});

test("GPL and AGPL sources are Tool only with high risk", () => {
  for (const license of ["GPL-2.0", "GPL-3.0", "AGPL-3.0"]) {
    const r = reviewSource(row({ license }));
    assert.equal(r.verdict, "Tool only", license);
    assert.equal(r.risk, "high", license);
  }
});

test("a source with no licence is Reference: read, don't copy", () => {
  const r = reviewSource(row({ license: "none" }));
  assert.equal(r.verdict, "Reference");
  assert.equal(r.risk, "high");
  assert.match(r.reasons.join(), /no licence/);
});

test("an archived source is Reference even with a permissive licence", () => {
  const r = reviewSource(row({ archived: true }));
  assert.equal(r.verdict, "Reference");
  assert.deepEqual(r.reasons, ["archived"]);
});

test("an index-only source is Reference, except APIs and tooling", () => {
  assert.equal(reviewSource(row({ sync: "none" })).verdict, "Reference");
  assert.equal(reviewSource(row({ sync: "none", category: "apis" })).verdict, "Trial");
  assert.equal(reviewSource(row({ sync: "none", category: "tooling" })).verdict, "Trial");
});

test("an Adopt pick under a copyleft licence becomes Adopt (tool)", () => {
  const repo = first(ADOPT);
  assert.equal(reviewSource(row({ repo })).verdict, "Adopt");
  assert.equal(reviewSource(row({ repo, license: "AGPL-3.0" })).verdict, "Adopt (tool)");
});

test("Avoid and Prototype only win over a permissive licence and give the reason", () => {
  const avoid = first(AVOID);
  assert.deepEqual(reviewSource(row({ repo: avoid })).reasons, [AVOID.get(avoid)]);
  assert.equal(reviewSource(row({ repo: avoid })).verdict, "Avoid");
  const proto = first(PROTOTYPE_ONLY);
  assert.equal(reviewSource(row({ repo: proto })).verdict, "Prototype only");
});

test("an override beats every other rule", () => {
  const repo = first(OVERRIDE);
  const [verdict, why] = OVERRIDE.get(repo);
  const r = reviewSource(row({ repo, license: "GPL-3.0", archived: true }));
  assert.equal(r.verdict, verdict);
  assert.equal(r.reasons[0], why);
});

test("a risky note is surfaced as a caveat, trimmed when long", () => {
  const short = reviewSource(row({ note: "Weights are non-commercial." }));
  assert.ok(short.reasons.includes("Weights are non-commercial."));
  const long = reviewSource(row({ note: `Non-commercial terms. ${"x".repeat(300)}` }));
  assert.ok(long.reasons.at(-1).endsWith("…"));
  assert.ok(long.reasons.at(-1).length <= 218);
  assert.deepEqual(reviewSource(row({ note: "Nice docs." })).reasons, []);
});

test("licence risk: permissive low, weak copyleft medium, unclassified check", () => {
  assert.equal(licenseRisk("Apache-2.0")[0], "low");
  assert.equal(licenseRisk("MPL-2.0")[0], "medium");
  assert.equal(licenseRisk("FSL-1.1")[0], "medium");
  assert.equal(licenseRisk("NOASSERTION")[0], "check");
  assert.equal(licenseRisk("none")[0], "high");
});

test("an adopted API with no open licence says to call it, not copy it", () => {
  const repo = first(ADOPT);
  for (const license of ["none", "NOASSERTION"]) {
    const r = reviewSource(row({ repo, category: "apis", license }));
    assert.equal(r.verdict, "Adopt", license);
    assert.match(r.reasons.join(), /adopt the API, not the code/, license);
  }
  assert.doesNotMatch(reviewSource(row({ repo, category: "apis" })).reasons.join(), /not the code/);
  assert.doesNotMatch(reviewSource(row({ repo, category: "3d-tech", license: "none" })).reasons.join(), /not the code/);
});

test("an unclassified licence adds a caveat to read the LICENSE", () => {
  assert.match(reviewSource(row({ license: "NOASSERTION" })).reasons.join(), /unclassified by GitHub/);
});
