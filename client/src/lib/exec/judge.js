/**
 * judge — run a user's solution against a problem's test cases and report pass/fail.
 *
 * Each test case is { input: { argName: value, ... }, expected }. We call the user's
 * `functionName(...input)` via the engine and structurally compare its return value
 * to `expected`. Engine-agnostic beyond the runCode() boundary.
 */

import { runCode } from './engine';
import { makeComparator } from './value';

/**
 * @param {{ language: string, code: string, functionName: string,
 *           tests: Array<{name?:string, input:object, expected:unknown, hidden?:boolean}>,
 *           compare?: string|((a:unknown,b:unknown)=>boolean),
 *           onProgress?: (i:number, result:object) => void, stopOnFail?: boolean }} opts
 */
export async function runAgainstTests({ language, code, functionName, tests, compare = 'deep', onProgress, stopOnFail = false }) {
    const eq = makeComparator(compare);
    const results = [];
    for (let i = 0; i < tests.length; i += 1) {
        const tc = tests[i];
        const res = await runCode({ language, code, functionName, inputs: tc.input || {} });

        let passed = false;
        let error = null;
        if (!res.ok) {
            error = res.error || 'Runtime error';
        } else {
            passed = eq(res.output, tc.expected);
        }

        const result = {
            index: i,
            name: tc.name || `Case ${i + 1}`,
            hidden: Boolean(tc.hidden),
            passed,
            error,
            errorLine: res.errorLine ?? null,
            timeoutReason: res.timeoutReason ?? null,
            input: tc.input || {},
            expected: tc.expected,
            actual: res.ok ? res.output : undefined,
            stdout: res.stdout || [],
            timeMs: res.timings?.totalMs ?? null,
        };
        results.push(result);
        if (onProgress) onProgress(i, result);
        if (stopOnFail && !passed) break;
    }

    const passedCount = results.filter((r) => r.passed).length;
    return {
        results,
        passed: passedCount,
        total: tests.length,
        ran: results.length,
        allPassed: results.length === tests.length && passedCount === tests.length,
    };
}
