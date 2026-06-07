/**
 * traceModel — folds a normalized engine trace (array of RuntimeTraceEvents) into a
 * timeline of discrete steps the visualizer can scrub through in O(1).
 *
 * Each step captures: the active source line, the call stack with each frame's
 * variables reconstructed up to that point, the variable/cell being touched
 * (for highlighting), a human-readable operation label, and accumulated stdout.
 *
 * The engine emits values on write/snapshot events, so we reconstruct state by
 * applying those rather than trying to re-execute anything.
 */

import { formatValue } from '../../lib/exec';

function clone(value) {
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(clone);
    const out = {};
    for (const k of Object.keys(value)) out[k] = clone(value[k]);
    return out;
}

function deepSet(rootContainer, path, value) {
    if (!path || path.length === 0) return value; // caller replaces whole var
    let obj = rootContainer;
    if (obj === null || typeof obj !== 'object') {
        obj = typeof path[0] === 'number' ? [] : {};
    }
    let cursor = obj;
    for (let i = 0; i < path.length - 1; i += 1) {
        const k = path[i];
        if (cursor[k] === null || typeof cursor[k] !== 'object') {
            cursor[k] = typeof path[i + 1] === 'number' ? [] : {};
        }
        cursor = cursor[k];
    }
    cursor[path[path.length - 1]] = value;
    return obj;
}

function targetVariable(target) {
    if (!target) return null;
    if ('variable' in target) return target.variable;
    return null; // objectId-only targets aren't placed into a named scope
}

function targetPath(target) {
    if (target && 'path' in target && Array.isArray(target.path)) return target.path;
    return [];
}

/** "nums[2]", "seen[complement]", "node.next.val", or "nums" */
export function targetLabel(target) {
    if (!target) return '?';
    const name = targetVariable(target) || (('objectId' in target) ? '«obj»' : '?');
    const path = targetPath(target);
    if (path.length === 0) return name;
    return name + path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${p}`)).join('');
}

function applyWrite(vars, target, value) {
    const name = targetVariable(target);
    if (name == null) return;
    const path = targetPath(target);
    if (path.length === 0) {
        vars[name] = clone(value);
    } else {
        vars[name] = deepSet(vars[name], path, clone(value));
    }
}

function applyMutate(vars, target, method, args) {
    const name = targetVariable(target);
    if (name == null) return;
    const path = targetPath(target);
    // Resolve the collection the method applies to.
    let container = vars[name];
    for (const k of path) {
        if (container == null || typeof container !== 'object') return;
        container = container[k];
    }
    if (!Array.isArray(container)) return; // only array methods are reconstructable
    const a = (args || []).map(clone);
    try {
        switch (method) {
            case 'push': case 'append': container.push(...a); break;
            case 'pop': container.pop(); break;
            case 'shift': container.shift(); break;
            case 'unshift': container.unshift(...a); break;
            case 'reverse': container.reverse(); break;
            case 'sort': container.sort(); break;
            default: break; // unknown method — a following snapshot/write will correct state
        }
    } catch {
        /* best-effort */
    }
}

function frameArgsToVars(args) {
    const vars = {};
    if (!args) return vars;
    if (Array.isArray(args)) {
        args.forEach((a, i) => {
            vars[`arg${i}`] = clone(a);
        });
    } else if (typeof args === 'object') {
        for (const k of Object.keys(args)) vars[k] = clone(args[k]);
    }
    return vars;
}

function snapshotStack(stack) {
    return stack.map((f) => ({ function: f.function, vars: clone(f.vars) }));
}

function formatArgs(args) {
    if (!args) return '';
    if (Array.isArray(args)) return args.map((a) => formatValue(a, { max: 32 })).join(', ');
    return Object.entries(args)
        .map(([k, v]) => `${k}=${formatValue(v, { max: 32 })}`)
        .join(', ');
}

/**
 * @param {{events: Array<object>}} trace
 * @returns {{ steps: Array<object>, lineHits: Record<number, number> }}
 */
export function buildTimeline(trace) {
    const events = trace?.events || [];
    const steps = [];
    const lineHits = {};
    let stack = [{ function: 'main', vars: {} }];
    const top = () => stack[stack.length - 1];

    let activeLine = null;
    let stdout = [];
    let returnValue;
    let hasReturn = false;

    for (let i = 0; i < events.length; i += 1) {
        const ev = events[i];
        if (typeof ev.line === 'number') {
            activeLine = ev.line;
            lineHits[ev.line] = (lineHits[ev.line] || 0) + 1;
        }
        let op = null;
        let highlight = null;
        let popAfter = false;

        switch (ev.kind) {
            case 'call': {
                stack.push({ function: ev.function || 'fn', vars: frameArgsToVars(ev.args) });
                op = { kind: 'call', text: `${ev.function || 'fn'}(${formatArgs(ev.args)})` };
                break;
            }
            case 'return': {
                returnValue = ev.value;
                hasReturn = true;
                op = { kind: 'return', text: `return ${formatValue(ev.value)}` };
                popAfter = stack.length > 1;
                break;
            }
            case 'write': {
                applyWrite(top().vars, ev.target, ev.value);
                highlight = { name: targetVariable(ev.target), path: targetPath(ev.target), kind: 'write' };
                op = { kind: 'write', text: `${targetLabel(ev.target)} = ${formatValue(ev.value)}` };
                break;
            }
            case 'snapshot': {
                applyWrite(top().vars, ev.target, ev.value);
                highlight = { name: targetVariable(ev.target), path: targetPath(ev.target), kind: 'write' };
                break;
            }
            case 'read': {
                highlight = { name: targetVariable(ev.target), path: targetPath(ev.target), kind: 'read' };
                op = {
                    kind: 'read',
                    text: `read ${targetLabel(ev.target)}${ev.value !== undefined ? ` → ${formatValue(ev.value)}` : ''}`,
                };
                break;
            }
            case 'mutate': {
                applyMutate(top().vars, ev.target, ev.method, ev.args);
                highlight = { name: targetVariable(ev.target), path: targetPath(ev.target), kind: 'write' };
                op = { kind: 'mutate', text: `${targetLabel(ev.target)}.${ev.method}(${(ev.args || []).map((x) => formatValue(x, { max: 24 })).join(', ')})` };
                break;
            }
            case 'stdout': {
                if (ev.text != null) stdout = [...stdout, String(ev.text)];
                op = { kind: 'stdout', text: `stdout: ${String(ev.text ?? '').replace(/\n$/, '')}` };
                break;
            }
            case 'exception': {
                op = { kind: 'exception', text: ev.message || 'exception' };
                break;
            }
            case 'timeout': {
                op = { kind: 'timeout', text: ev.message || 'execution limit reached' };
                break;
            }
            case 'line':
            default: {
                op = null;
                break;
            }
        }

        steps.push({
            i,
            line: activeLine,
            stack: snapshotStack(stack),
            depth: stack.length - 1,
            highlight,
            op,
            stdout,
            returnValue: hasReturn ? returnValue : undefined,
            hasReturn,
        });

        if (popAfter) stack.pop();
    }

    return { steps, lineHits };
}

/** Classify a value for rendering. */
export function valueKind(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    const t = typeof value;
    if (t === 'object') {
        const sp = specialType(value);
        if (sp === 'map') return 'map';
        if (sp === 'set') return 'set';
        return 'object';
    }
    return t; // 'number' | 'string' | 'boolean'
}

/**
 * The runtimes serialize rich containers with a `__type__` tag, e.g.
 *   Map  -> { __type__: 'map', entries: [[k, v], ...] }
 *   Set  -> { __type__: 'set', values: [...] }
 * Return that tag (or null for a plain object).
 */
export function specialType(value) {
    if (value && typeof value === 'object' && !Array.isArray(value) && typeof value.__type__ === 'string') {
        return value.__type__;
    }
    return null;
}

/** Normalize a serialized Map into [[key, value], ...]. */
export function mapEntries(value) {
    const entries = value?.entries;
    if (Array.isArray(entries)) {
        return entries.map((e) => (Array.isArray(e) ? [e[0], e[1]] : [e?.key, e?.value]));
    }
    return [];
}

/** Normalize a serialized Set into [v, ...]. */
export function setValues(value) {
    if (Array.isArray(value?.values)) return value.values;
    if (Array.isArray(value?.entries)) return value.entries;
    if (Array.isArray(value?.elements)) return value.elements;
    return [];
}
