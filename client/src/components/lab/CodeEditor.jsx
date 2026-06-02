import React, { useEffect, useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { axiomCodeMirror, decoratedLines, setDecoratedLines } from './editorTheme';

/**
 * CodeEditor — CodeMirror 6 wrapped for AXIOM.
 *
 * Props:
 *  - value, onChange       : controlled code text
 *  - language              : 'python' | 'javascript' | 'typescript'
 *  - readOnly              : lock editing (used during a run / for solution view)
 *  - activeLine            : 1-based line to highlight as "currently executing" (visualizer)
 *  - errorLine             : 1-based line to flag as an error
 *  - height                : CSS height (default 100%)
 *  - onMount(view)         : receive the EditorView instance
 */
function langExtension(language) {
    if (language === 'python') return python();
    if (language === 'typescript') return javascript({ jsx: false, typescript: true });
    return javascript({ jsx: false, typescript: false });
}

export default function CodeEditor({
    value,
    onChange,
    language = 'python',
    readOnly = false,
    activeLine = null,
    errorLine = null,
    height = '100%',
    onMount,
    className = '',
}) {
    const viewRef = useRef(null);

    const extensions = useMemo(
        () => [
            langExtension(language),
            ...axiomCodeMirror,
            ...decoratedLines,
            EditorView.lineWrapping,
        ],
        [language],
    );

    // Repaint line decorations whenever the active/error line changes.
    useEffect(() => {
        const view = viewRef.current;
        if (!view) return;
        const specs = [];
        if (errorLine) specs.push({ line: errorLine, className: 'cm-error-line' });
        if (activeLine) specs.push({ line: activeLine, className: 'cm-trace-active-line' });
        view.dispatch({ effects: setDecoratedLines.of(specs) });
        // Scroll the active line into view during stepping.
        if (activeLine && activeLine >= 1 && activeLine <= view.state.doc.lines) {
            const pos = view.state.doc.line(activeLine).from;
            view.dispatch({ effects: EditorView.scrollIntoView(pos, { y: 'center' }) });
        }
    }, [activeLine, errorLine]);

    return (
        <CodeMirror
            value={value}
            height={height}
            theme="light"
            extensions={extensions}
            editable={!readOnly}
            readOnly={readOnly}
            basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                highlightActiveLine: !activeLine,
                highlightActiveLineGutter: !activeLine,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                indentOnInput: true,
                tabSize: 4,
            }}
            onChange={onChange}
            onCreateEditor={(view) => {
                viewRef.current = view;
                if (onMount) onMount(view);
            }}
            className={`axiom-cm h-full ${className}`}
        />
    );
}
