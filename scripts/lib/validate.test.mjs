import assert from "node:assert/strict";
import { test } from "node:test";
import { validateSources } from "./validate.mjs";

const categories = [{ id: "3d-tech", title: "3D", description: "d" }];
const row = (over = {}) => ({
  repo: "owner/name", category: "3d-tech", stars: 10, license: "MIT", sync: "docs",
  what: "A thing.", use: "We use it.", ...over,
});

test("a well-formed catalog has no errors", () => {
  assert.deepEqual(validateSources({ categories, sources: [row()] }), []);
});

test("rejects a repo that is not owner/name", () => {
  const errors = validateSources({ categories, sources: [row({ repo: "https://github.com/owner/name" })] });
  assert.match(errors.join("\n"), /repo must be owner\/name/);
});

test("rejects the same repo twice in one category", () => {
  const errors = validateSources({ categories, sources: [row(), row()] });
  assert.match(errors.join("\n"), /duplicate in 3d-tech/);
});

test("rejects an unknown category", () => {
  const errors = validateSources({ categories, sources: [row({ category: "nope" })] });
  assert.match(errors.join("\n"), /unknown category "nope"/);
});

test("rejects a sync mode other than docs, full or none", () => {
  const errors = validateSources({ categories, sources: [row({ sync: "all" })] });
  assert.match(errors.join("\n"), /sync must be docs\|full\|none/);
});

test("requires license, what and use", () => {
  const errors = validateSources({ categories, sources: [row({ license: "", what: undefined, use: "" })] });
  assert.match(errors.join("\n"), /missing license/);
  assert.match(errors.join("\n"), /missing what/);
  assert.match(errors.join("\n"), /missing use/);
});

test("requires stars to be a number", () => {
  const errors = validateSources({ categories, sources: [row({ stars: "1.2k" })] });
  assert.match(errors.join("\n"), /stars must be a number/);
});
