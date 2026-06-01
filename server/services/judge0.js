/**
 * judge0 — optional server-side code execution via a self-hosted Judge0 instance.
 *
 * The in-browser harness (@tracecode/harness) is the default, always-on judge for
 * Python/JS/TS. Judge0 is an OPTIONAL upgrade that adds many more languages and a
 * hardened sandbox (the `isolate` runtime) with real CPU/memory limits — the path
 * for a LeetCode-grade authoritative judge.
 *
 * Enable by setting JUDGE0_URL (e.g. http://localhost:2358). See server/JUDGE0.md.
 */

const JUDGE0_URL = (process.env.JUDGE0_URL || '').replace(/\/$/, '');
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || ''; // optional (RapidAPI-hosted Judge0)
const JUDGE0_HOST = process.env.JUDGE0_RAPIDAPI_HOST || ''; // optional

// Judge0 CE language IDs (stable across recent releases).
export const JUDGE0_LANGUAGE_IDS = {
    python: 71, // Python 3.8
    javascript: 63, // Node.js 12
    typescript: 74, // TypeScript 3.7
    cpp: 54, // C++ (GCC 9)
    c: 50, // C (GCC 9)
    java: 62, // Java (OpenJDK 13)
    csharp: 51, // C# (Mono)
    go: 60, // Go
    rust: 73, // Rust
    ruby: 72, // Ruby
    kotlin: 78, // Kotlin
    swift: 83, // Swift
    php: 68, // PHP
};

export const isJudge0Enabled = () => Boolean(JUDGE0_URL);
export const judge0Languages = () => Object.keys(JUDGE0_LANGUAGE_IDS);

/**
 * Run source code on Judge0 and wait for the verdict.
 * @returns {Promise<{stdout:string, stderr:string, status:string, timeMs:number|null, memoryKb:number|null}>}
 */
export async function runOnJudge0({ language, code, stdin = '', cpuTimeLimit = 5, memoryLimitKb = 256000 }) {
    if (!JUDGE0_URL) {
        const e = new Error('Server judge is not configured (set JUDGE0_URL).');


// TODO: Complete implementation in subsequent commits (Stage 1/2)
