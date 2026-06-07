# Optional server-side judge (Judge0)

AXIOM runs code **in the browser** by default via `@tracecode/harness` (Python/JS/TS) —
that powers Run, the test judge, and the visualizer with zero backend infra.

**Judge0** is an optional upgrade that adds **many more languages** (C, C++, Java, Go,
Rust, C#, Ruby, …) and a **hardened `isolate` sandbox** with real CPU/memory limits —
the path to a LeetCode-grade authoritative judge. When it's not configured, the API
returns `503 { fallback: true }` and the client stays on the in-browser harness.

## Enable it

1. **Run Judge0** (self-hosted, recommended) from `server/judge0/`:

   ```bash
   cd server/judge0
   docker compose up -d
   # Judge0 API is now on http://localhost:2358
   ```

   (Or use a hosted Judge0 via RapidAPI and set `JUDGE0_API_KEY` + `JUDGE0_RAPIDAPI_HOST`.)

2. **Point AXIOM at it** — in the server environment:

   ```bash
   JUDGE0_URL=http://localhost:2358
   # JUDGE0_API_KEY=...        # only for RapidAPI-hosted Judge0
   # JUDGE0_RAPIDAPI_HOST=...  # only for RapidAPI-hosted Judge0
   ```

3. Verify: `GET /api/judge/status` → `{ "enabled": true, "languages": [...] }`.
   Run code: `POST /api/judge/run { language, code, stdin }`.

## How it fits the product

- **Run + Visualize** stay in-browser (instant, free, and the harness emits the trace
  the visualizer needs — Judge0 does not produce step traces).
- **Submit / authoritative grading + extra languages** can route to Judge0.

## Wiring Judge0 into the *function-based* test judge (next step)

AXIOM problems are function+inputs (`twoSum(nums, target)`), while Judge0 runs a whole
program over `stdin`. To grade those on Judge0 you generate a small per-language
**driver** that: reads JSON inputs from stdin → calls the user's function → prints the
result as JSON, then compare to `expected`. That's the standard online-judge pattern;
the in-browser harness already does this for Python/JS/TS today.

## License note

Judge0 is **GPLv3**, run here as a **separate service over HTTP** — that does not impose
GPL on the AXIOM application (separate process, not linked). Safe for a closed-source
product. (Contrast with `@tracecode/harness`, which is AGPL and bundled — see
`client/vendor/tracecode-harness/README.md`.)

