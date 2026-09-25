// Run: node --test "scripts/**/*.test.mjs". Dry runs only: no network, no vendor/ writes.
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = join(dirname(fileURLToPath(import.meta.url)), "sync.mjs");
const sync = (...args) => spawnSync(process.execPath, [script, "--dry-run", ...args], { encoding: "utf8" });

test("rejects a --jobs value that is not a positive whole number", () => {
  for (const jobs of ["abc", "0", "-2", "1.5"]) {
    const r = sync("--jobs", jobs);
    assert.equal(r.status, 1, `--jobs ${jobs} should fail`);
    assert.match(r.stderr, /--jobs must be a positive whole number/);
  }
});

test("a dry run with a valid --jobs lists the selected repo", () => {
  const r = sync("--jobs", "2", "--repo", "pmndrs/drei");
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /pmndrs\/drei/);
  assert.match(r.stdout, /1\/1 would sync/);
});
