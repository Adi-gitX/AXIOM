/**
 * CodeMirror 6 theme + line-decoration plumbing for the AXIOM Code Lab.
 *
 * - `axiomCodeMirror`  : editor chrome + syntax colours in the painterly light palette.
 * - line decorations   : `setDecoratedLines` effect lets React paint the currently
 *                        executing trace line and any error line from outside CM.
 */

import { EditorView, Decoration } from '@codemirror/view';
import { StateField, StateEffect, RangeSetBuilder } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

/* ── Chrome ────────────────────────────────────────────────────────────── */
export const axiomEditorChrome = EditorView.theme(
    {
        '&': {
            color: '#16263a',
            backgroundColor: '#FCFBF7',
            fontSize: '13.5px',
            height: '100%',
        },
        '.cm-content': {
            fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
            caretColor: '#0E334F',
            padding: '12px 0',
        },
        '.cm-scroller': {
            fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
            lineHeight: '1.6',
        },
        '&.cm-focused': { outline: 'none' },
        '.cm-gutters': {
            backgroundColor: '#FCFBF7',
            color: '#b3ad9e',
            border: 'none',
            paddingRight: '4px',
        },
        '.cm-lineNumbers .cm-gutterElement': { padding: '0 8px 0 12px', minWidth: '28px' },
        '.cm-activeLine': { backgroundColor: 'rgba(14, 51, 79, 0.035)' },
        '.cm-activeLineGutter': { backgroundColor: 'rgba(14, 51, 79, 0.05)', color: '#0E334F' },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: 'rgba(14, 51, 79, 0.14)',
        },
        '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#0E334F' },
        '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
            backgroundColor: 'rgba(46, 125, 122, 0.18)',
            outline: 'none',
        },
        // Trace / error line decorations (line-level)
        '.cm-trace-active-line': {
            backgroundColor: 'rgba(46, 125, 122, 0.16)',
            boxShadow: 'inset 3px 0 0 #2E7D7A',
        },
        '.cm-error-line': {
            backgroundColor: 'rgba(156, 42, 31, 0.12)',
            boxShadow: 'inset 3px 0 0 #9C2A1F',
        },
        '.cm-tooltip': {
            border: '1px solid rgba(14,51,79,0.12)',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
        },
    },
    { dark: false },
);

/* ── Syntax colours ────────────────────────────────────────────────────── */
export const axiomHighlight = HighlightStyle.define([
    { tag: t.comment, color: '#9b9484', fontStyle: 'italic' },
    { tag: [t.keyword, t.controlKeyword, t.moduleKeyword], color: '#0E5A6B' },
    { tag: [t.definitionKeyword, t.operatorKeyword], color: '#0E5A6B' },
    { tag: [t.string, t.special(t.string)], color: '#3f6e3a' },
    { tag: [t.number, t.bool, t.null, t.atom], color: '#7A4A1F' },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#0E334F', fontWeight: '600' },
    { tag: [t.definition(t.variableName), t.definition(t.propertyName)], color: '#16263a' },
    { tag: [t.variableName, t.propertyName], color: '#16263a' },
    { tag: [t.typeName, t.className, t.namespace], color: '#7A1F4A' },
    { tag: [t.operator, t.derefOperator, t.punctuation, t.separator, t.bracket], color: '#6b6457' },
    { tag: [t.self, t.constant(t.variableName)], color: '#7A4A1F' },
    { tag: t.meta, color: '#9b9484' },
    { tag: t.invalid, color: '#9C2A1F' },
]);

export const axiomCodeMirror = [axiomEditorChrome, syntaxHighlighting(axiomHighlight)];

/* ── Line decorations driven from React ────────────────────────────────── */
/** @type {StateEffect<Array<{line:number, className:string}>>} */
export const setDecoratedLines = StateEffect.define();

const decoratedLinesField = StateField.define({
    create() {
        return Decoration.none;
    },
    update(deco, tr) {
        let next = deco.map(tr.changes);
        for (const e of tr.effects) {
            if (e.is(setDecoratedLines)) {
                const builder = new RangeSetBuilder();
                const specs = [...(e.value || [])]
                    .filter((s) => s && s.line >= 1 && s.line <= tr.state.doc.lines)
                    .sort((a, b) => a.line - b.line);
                for (const s of specs) {
                    const line = tr.state.doc.line(s.line);
                    builder.add(line.from, line.from, Decoration.line({ class: s.className }));
                }
                next = builder.finish();
            }
        }
        return next;
    },
    provide: (f) => EditorView.decorations.from(f),
});

export const decoratedLines = [decoratedLinesField];
