/**
 * Value helpers shared by the engine consumers (judge comparison + visualizer rendering).
 * Engine-agnostic — operates only on plain JS values decoded from runtime output.
 */

/**
 * Order-insensitive-where-it-matters structural equality for judging outputs.
 * Handles the common DSA return shapes: numbers, strings, booleans, null, arrays
 * (incl. nested), and plain objects. Numbers compare with a tiny epsilon for floats.
 */
export function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a === b;

    const ta = typeof a;
    const tb = typeof b;
    if (ta === 'number' && tb === 'number') {
        if (Number.isNaN(a) && Number.isNaN(b)) return true;
        return Math.abs(a - b) < 1e-9;
    }
    if (ta !== 'object' || tb !== 'object') return a === b;

    const aArr = Array.isArray(a);
    const bArr = Array.isArray(b);
    if (aArr !== bArr) return false;

    if (aArr) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i += 1) {
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }

    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) {
        if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
        if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
}

/** Order-insensitive array equality (multiset): same elements, any order. */
export function unorderedEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return deepEqual(a, b);
    if (a.length !== b.length) return false;
    const used = new Array(b.length).fill(false);
    for (const x of a) {
        let found = -1;
        for (let j = 0; j < b.length; j += 1) {
            if (!used[j] && deepEqual(x, b[j])) { found = j; break; }
        }
        if (found === -1) return false;
        used[found] = true;
    }
    return true;
}

/**
 * Build a comparator for a problem's expected outputs.
 *   'deep'      — exact structural equality (default)
 *   'unordered' — arrays compare as multisets (order doesn't matter)
 *   'set'       — arrays compare as sets (order + duplicates don't matter)
 *   'boolean'   — truthiness only
 */
export function makeComparator(mode = 'deep') {
    if (typeof mode === 'function') return mode;
    switch (mode) {
        case 'unordered':
            return unorderedEqual;
        case 'set':
            return (a, b) => unorderedEqual(uniq(a), uniq(b));
        case 'boolean':
            return (a, b) => Boolean(a) === Boolean(b);
        case 'deep':
        default:
            return deepEqual;
    }
}

function uniq(arr) {
    if (!Array.isArray(arr)) return arr;
    const out = [];
    for (const x of arr) if (!out.some((y) => deepEqual(x, y))) out.push(x);
    return out;
}

/** Compact, stable string rendering of a runtime value for chips/badges/cells. */
export function formatValue(value, { max = 120 } = {}) {
    let out;
    if (value === undefined) out = 'undefined';
    else if (value === null) out = 'null';
    else if (typeof value === 'string') out = JSON.stringify(value);
    else if (typeof value === 'number' || typeof value === 'boolean') out = String(value);
    else {
        try {
            out = JSON.stringify(value);
        } catch {
            out = String(value);
        }
    }
    if (out.length > max) out = `${out.slice(0, max - 1)}…`;
    return out;
}
