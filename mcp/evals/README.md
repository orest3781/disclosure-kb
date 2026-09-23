# Evaluation set

`evaluation.xml` holds ten read-only questions with single verifiable answers, for testing whether an agent equipped with this server's tools can answer real questions about the knowledge base. Each needs at least one tool call (often two: `kb_list_categories` or `kb_search_sources` to find the row, then `kb_get_source` or `kb_read_doc` to confirm).

Answers were checked directly against `sources.json` and `kb/stack.md` on 2026-09-23. Counts and star numbers are tied to that snapshot: if `sources.json` changes (new sources, refreshed stars), re-verify the answers before trusting a score.

To run: give an agent only the `kb_*` tools, ask each question independently, and compare its final answer to `<answer>` by string match (case-insensitive, whitespace-trimmed).
