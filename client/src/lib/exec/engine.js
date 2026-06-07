/**
 * AXIOM execution-engine adapter.
 *
 * This module is the ONLY place in the app that imports `@tracecode/harness`.
 * Everything else talks to the normalized API below. That isolation is deliberate:
 * the harness is AGPL-3.0, so keeping it behind one boundary lets us swap it for a
 * differently-licensed runtime (or a commercial license) later without touching the UI.
 *
 * Normalized result shapes returned from here are AXIOM-owned, not harness types.
 *
 *   runCode()   -> RunResult   { ok, output, stdout, error, errorLine, timeoutReason, timings }
 *   traceCode() -> TraceResult { ...RunResult, trace: { events, language, steps, lineEvents, truncated } }
 */

import { createBrowserHarness } from '@tracecode/harness/browser';
import { getLanguage } from './languages';

/** Where the synced worker assets live (see client/public/workers). */
const ASSET_BASE_URL = '/workers';

/** Sensible trace budget for interactive DSA-sized programs. */
const DEFAULT_TRACE_BUDGET = {
    maxTraceSteps: 1500,
    maxLineEvents: 2000,
    maxSingleLineHits: 250,
    maxStoredEvents: 6000,
};

let _harness = null;
/** language id -> Promise<initResult> so we only init each runtime once. */
const _initPromises = new Map();

function isBrowser() {
    return typeof window !== 'undefined' && typeof Worker !== 'undefined';
}

function harness() {
    if (!isBrowser()) {
        throw new Error('The code engine is only available in the browser.');
    }
    if (!_harness) {
        _harness = createBrowserHarness({ assetBaseUrl: ASSET_BASE_URL });
    }
    return _harness;
}

function clientFor(languageId) {
    const lang = getLanguage(languageId);
    return { lang, client: harness().getClient(lang.engineId) };
}

/** Idempotent runtime init, deduped per language. */
async function ensureInit(languageId) {
    const lang = getLanguage(languageId);
    if (!_initPromises.has(lang.id)) {
        const { client } = clientFor(lang.id);
        const p = client.init().catch((err) => {
            // Allow a later retry if init failed (e.g. CDN hiccup loading Pyodide).
            _initPromises.delete(lang.id);
            throw err;
        });
        _initPromises.set(lang.id, p);
    }
    return _initPromises.get(lang.id);
}

/**
 * Warm a runtime in the background (call when the user picks a language) so the
 * first real run feels instant.
 * @returns {Promise<{ ok: boolean, loadTimeMs: number }>}
 */
export async function warmLanguage(languageId) {
    try {
        const res = await ensureInit(languageId);
        return { ok: Boolean(res?.success ?? true), loadTimeMs: res?.loadTimeMs ?? 0 };
    } catch (err) {
        return { ok: false, loadTimeMs: 0, error: errMessage(err) };
    }
}

/** Release a runtime's worker (call when leaving the editor). */
export function disposeLanguage(languageId) {
    try {
        const lang = getLanguage(languageId);
        _initPromises.delete(lang.id);
        harness().disposeLanguage(lang.engineId);
    } catch {
        /* best-effort */
    }
}

/** Tear the whole engine down. */
export function disposeEngine() {
    try {
        _initPromises.clear();
        _harness?.dispose();
    } catch {
        /* best-effort */
    } finally {
        _harness = null;
    }
}

function errMessage(err) {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

function normalizeRun(res) {
    return {
        ok: Boolean(res?.success),
        output: res?.output,
        stdout: Array.isArray(res?.consoleOutput) ? res.consoleOutput : [],
        error: res?.error || null,
        errorLine: typeof res?.errorLine === 'number' ? res.errorLine : null,
        timeoutReason: res?.timeoutReason || null,
        diagnosticStage: res?.diagnosticStage || null,
        timings: res?.timings || null,
    };
}

function normalizeTrace(res, languageId) {
    const base = normalizeRun(res);
    const trace = res?.trace || {};
    return {
        ...base,
        executionTimeMs: res?.executionTimeMs ?? null,
        trace: {
            language: trace.language || getLanguage(languageId).engineId,
            events: Array.isArray(trace.events) ? trace.events : [],
            steps: trace.traceStepCount ?? res?.traceStepCount ?? null,
            lineEvents: trace.lineEventCount ?? res?.lineEventCount ?? null,
            truncated: Boolean(res?.traceLimitExceeded),
        },
    };
}

/**
 * Execute code and return its function output + stdout (no trace).
 * @param {{language: string, code: string, functionName?: string|null,
 *          inputs?: Record<string, unknown>, executionStyle?: 'function'|'solution-method'|'ops-class'}} opts
 * @returns {Promise<ReturnType<typeof normalizeRun>>}
 */
export async function runCode(opts) {
    const { language, code, functionName, inputs = {}, executionStyle = 'function' } = opts;
    const lang = getLanguage(language);
    const fnName = functionName ?? lang.defaultFunctionName ?? 'solve';
    try {
        await ensureInit(lang.id);
        const { client } = clientFor(lang.id);
        const res = await client.executeCode(code, fnName, inputs, executionStyle);
        return normalizeRun(res);
    } catch (err) {
        return { ok: false, output: undefined, stdout: [], error: errMessage(err), errorLine: null, timeoutReason: null, diagnosticStage: 'runtime', timings: null };
    }
}

/**
 * Execute code with full step tracing for the algorithm visualizer.
 * @param {{language: string, code: string, functionName?: string|null,
 *          inputs?: Record<string, unknown>, executionStyle?: 'function'|'solution-method'|'ops-class',
 *          budget?: object}} opts
 */
export async function traceCode(opts) {
    const { language, code, functionName, inputs = {}, executionStyle = 'function', budget } = opts;
    const lang = getLanguage(language);
    const fnName = functionName ?? lang.defaultFunctionName ?? 'solve';
    try {
        await ensureInit(lang.id);
        const { client } = clientFor(lang.id);
        const res = await client.executeWithTracing(
            code,
            fnName,
            inputs,
            { ...DEFAULT_TRACE_BUDGET, ...(budget || {}) },
            executionStyle,
        );
        return normalizeTrace(res, lang.id);
    } catch (err) {
        return {
            ok: false,
            output: undefined,
            stdout: [],
            error: errMessage(err),
            errorLine: null,
            timeoutReason: null,
            diagnosticStage: 'trace',
            timings: null,
            executionTimeMs: null,
            trace: { language: lang.engineId, events: [], steps: 0, lineEvents: 0, truncated: false },
        };
    }
}

/**
 * Whether the engine supports step tracing for a language (drives the Visualize tab).
 */
export function supportsTracing(languageId) {
    try {
        const lang = getLanguage(languageId);
        const profile = harness().getProfile(lang.engineId);
        return Boolean(profile?.capabilities?.tracing?.supported);
    } catch {
        // Python/JS/TS all support tracing; assume true when the profile isn't reachable (SSR).
        return true;
    }
}

export { isBrowser };
