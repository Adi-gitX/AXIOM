# Vendored: `@tracecode/harness`

This folder is a **vendored, pre-built copy** of the [`@tracecode/harness`](https://tracecode.app)
browser code-execution + tracing engine. It powers the AXIOM **Code Lab** (in-browser
running of Python/JS/TS and the algorithm visualizer).

It is consumed via a `file:` dependency in `client/package.json`:

```json
"@tracecode/harness": "file:./vendor/tracecode-harness"
```

## ⚠️ License — read before shipping commercially

`@tracecode/harness` is **AGPL-3.0-only** (see `LICENSE`). AGPL is a *network* copyleft:
if you serve an application that uses this engine over a network, you must offer that
application's complete corresponding source under AGPL-3.0 — **unless** you obtain a
separate commercial license from the engine's authors.

If AXIOM is to be a closed-source commercial product, you must either:

1. obtain a commercial license for `@tracecode/harness`, or
2. swap this engine for a differently-licensed runtime.

To make (2) cheap, **the entire app only touches this engine through one adapter**:
[`client/src/lib/exec/engine.js`](../../src/lib/exec/engine.js). Nothing else in the app
imports `@tracecode/harness`. Replacing the engine means re-implementing that one file
(`runCode`, `traceCode`, `warmLanguage`, …) against a new runtime — the UI, judge,
visualizer, and problems are all engine-agnostic.

## What's here

- `dist/` — the built ESM/CJS bundles + types (self-contained; no extra npm deps needed).
- `LICENSE`, `THIRD_PARTY_NOTICES.md` — keep these with any redistribution (AGPL + runtime notices).

The browser **worker assets** (Pyodide worker, JS/TS worker, the TypeScript compiler)
live separately in [`client/public/workers/`](../../public/workers) and are loaded at
runtime from `/workers`. Python loads the Pyodide runtime from a CDN on first run.

## Rebuilding / updating from source

```bash
# in the upstream @tracecode/harness checkout
pnpm install && pnpm build

# copy the built engine here
cp -R dist <this-folder>/dist
cp LICENSE THIRD_PARTY_NOTICES.md <this-folder>/

# re-sync only the Python + JavaScript/TypeScript worker assets into the app
node dist/cli.cjs sync-assets <axiom>/client/public/workers --languages python,javascript
```

Only `python` + `javascript` assets are synced (the JS lane also covers TypeScript).
Java/C#/C++ lanes are intentionally excluded to keep the asset payload small.
