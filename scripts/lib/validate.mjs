// Validation for sources.json, used by scripts/build-index.mjs.

/** Returns a list of error strings; empty means the catalog is valid. */
export function validateSources({ categories, sources }) {
  const errors = [];
  const catIds = new Set(categories.map((c) => c.id));
  const seen = new Set();
  for (const [i, s] of sources.entries()) {
    const at = `sources[${i}] ${s.repo ?? "?"}`;
    if (!/^[\w.-]+\/[\w.-]+$/.test(s.repo ?? "")) errors.push(`${at}: repo must be owner/name`);
    if (seen.has(`${s.category}:${s.repo}`)) errors.push(`${at}: duplicate in ${s.category}`);
    seen.add(`${s.category}:${s.repo}`);
    if (!catIds.has(s.category)) errors.push(`${at}: unknown category "${s.category}"`);
    if (!["docs", "full", "none"].includes(s.sync)) errors.push(`${at}: sync must be docs|full|none`);
    for (const k of ["license", "what", "use"]) if (!s[k]) errors.push(`${at}: missing ${k}`);
    if (typeof s.stars !== "number") errors.push(`${at}: stars must be a number`);
  }
  return errors;
}
