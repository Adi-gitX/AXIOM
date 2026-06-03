import React from 'react';
import { AlertTriangle, CornerDownRight } from 'lucide-react';
import { getLanguage } from '../../lib/exec';

/**
 * ConsolePanel — renders a run/trace result: stdout lines, the returned value,
 * and any runtime/compile error (with the offending line when known).
 */
export default function ConsolePanel({ result, language }) {
    if (!result) {
        return (
            <div className="h-full flex items-center justify-center px-6 text-center">
                <div>
                    <p className="text-[13.5px] text-muted-foreground">Run your code to see output.</p>
                    <p className="mt-1.5 text-[12px] text-muted-foreground/70">
                        Press <kbd className="px-1 rounded bg-secondary border text-[10px] font-mono" style={{ borderColor: 'hsl(var(--hair))' }}>⌘↵</kbd> or hit Run.
                    </p>
                </div>
            </div>
        );
    }

    const lang = getLanguage(language);
    const stdout = result.stdout || [];
    const hasOutput = result.output !== undefined;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar px-4 py-3 font-mono text-[12.5px] leading-relaxed">
            {!result.ok && result.error && (
                <div className="mb-3 rounded-lg border bg-[#9C2A1F]/5 px-3 py-2.5" style={{ borderColor: 'rgba(156,42,31,0.25)' }}>
                    <div className="flex items-center gap-1.5 text-[#9C2A1F] font-semibold text-[12px] mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {result.diagnosticStage === 'compile' ? 'Compile error' : 'Runtime error'}
                        {result.errorLine ? <span className="font-normal opacity-80">· line {result.errorLine}</span> : null}
                    </div>
                    <pre className="whitespace-pre-wrap text-[#7a2018] text-[12px]">{result.error}</pre>
                </div>
            )}

            {result.timeoutReason && (
                <div className="mb-3 rounded-lg border bg-fabric-peach px-3 py-2 text-[#7A4A1F] text-[12px]" style={{ borderColor: 'rgba(122,74,31,0.2)' }}>
                    Execution stopped early: {prettyTimeout(result.timeoutReason)}.
                </div>
            )}

            {stdout.length > 0 && (
                <div className="mb-3">
                    <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 mb-1">stdout</p>
                    {stdout.map((line, i) => (
                        <div key={i} className="text-foreground/90 whitespace-pre-wrap break-words">
                            {String(line)}
                        </div>
                    ))}
                </div>
            )}

            {result.ok && hasOutput && (
                <div>
                    <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 mb-1">
                        return value
                    </p>
                    <div className="flex items-start gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 mt-0.5 text-[#2E7D7A] shrink-0" />
                        <pre className="whitespace-pre-wrap break-words text-foreground">{renderValue(result.output)}</pre>
                    </div>
                </div>
            )}

            {result.ok && !hasOutput && stdout.length === 0 && (
                <p className="text-muted-foreground">
                    Ran with no output. Make sure <span className="text-foreground">{lang.label}</span> function returns a value or prints to stdout.
                </p>
            )}
        </div>
    );
}

function renderValue(value) {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'string') return value;
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
}

function prettyTimeout(reason) {
    const map = {
        'trace-limit': 'trace step limit reached',
        'line-limit': 'line event limit reached',
        'single-line-limit': 'a single line ran too many times (possible infinite loop)',
        'recursion-limit': 'recursion limit reached',
        'memory-limit': 'memory limit reached',
        'client-timeout': 'timed out',
    };
    return map[reason] || reason;
}
