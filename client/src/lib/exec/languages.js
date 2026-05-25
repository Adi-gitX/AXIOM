/**
 * Language registry for the AXIOM code engine.
 *
 * This is the ONLY place the app names the languages it ships. It is intentionally
 * decoupled from the underlying execution engine (`@tracecode/harness`) so the engine
 * can be swapped without touching the UI. The `engineId` field is the only value that
 * crosses the adapter boundary into the engine.
 */

/**
 * @typedef {'python'|'javascript'|'typescript'} LanguageId
 */

export const LANGUAGES = [
    {
        id: 'python',
        engineId: 'python',
        label: 'Python',
        short: 'Py',
        ext: 'py',
        cm: 'python',
        defaultFunctionName: 'solve',
        maturity: 'stable',
        note: 'Pyodide 0.29 (CPython in WebAssembly). Loads from CDN on first run.',
    },
    {
        id: 'javascript',
        engineId: 'javascript',
        label: 'JavaScript',
        short: 'JS',
        ext: 'js',
        cm: 'javascript',
        defaultFunctionName: 'solve',
        maturity: 'stable',
        note: 'Runs locally in a sandboxed Web Worker. No network needed.',
    },
    {
        id: 'typescript',
        engineId: 'typescript',
        label: 'TypeScript',
        short: 'TS',
        ext: 'ts',
        cm: 'typescript',
        defaultFunctionName: 'solve',
        maturity: 'stable',
        note: 'Type-checked & transpiled in-browser, then run in a Web Worker.',
    },
];

export const DEFAULT_LANGUAGE = 'python';

export const LANGUAGE_IDS = LANGUAGES.map((l) => l.id);

/** @param {string} id @returns {typeof LANGUAGES[number]} */
export function getLanguage(id) {
    return LANGUAGES.find((l) => l.id === id) || LANGUAGES[0];
}

export function isLanguageId(id) {
    return LANGUAGES.some((l) => l.id === id);
}

/**
 * Freeform playground starters — a classic Two Sum to show off the engine + visualizer.
 * Each defines a `solve(...)` function and matching default inputs.
 */
export const PLAYGROUND_STARTERS = {
    python: {
        functionName: 'solve',
        inputs: { nums: [2, 7, 11, 15], target: 9 },
        code: `def solve(nums, target):
    seen = {}
    for i, value in enumerate(nums):
        complement = target - value
        if complement in seen:
            return [seen[complement], i]
        seen[value] = i
    return []
`,
    },
    javascript: {
        functionName: 'solve',
        inputs: { nums: [2, 7, 11, 15], target: 9 },
        code: `function solve(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const value = nums[i];
    const complement = target - value;
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(value, i);
  }
  return [];
}
`,
    },
    typescript: {
        functionName: 'solve',
        inputs: { nums: [2, 7, 11, 15], target: 9 },
        code: `function solve(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i += 1) {
    const value = nums[i];
    const complement = target - value;
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(value, i);
  }
  return [];
}
`,
    },
};

export function getStarter(languageId) {
    return PLAYGROUND_STARTERS[languageId] || PLAYGROUND_STARTERS.python;
}
