import React from 'react';
import { Check, X, Loader2, Lock, AlertTriangle } from 'lucide-react';
import { formatValue } from '../../lib/exec';

/**
 * TestResultsPanel — renders judge output: a summary header + per-case rows.
 * Hidden cases show pass/fail but not their data.
 */
export default function TestResultsPanel({ run }) {
    if (!run) {
        return (
            <div className="h-full flex items-center justify-center px-6 text-center">
                <p className="text-[13px] text-muted-foreground">
                    Run the sample tests or Submit to check your solution against all cases.
                </p>
            </div>
        );
    }

    const { results, passed, total, allPassed, running } = run;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-3 space-y-2">
            {/* Summary */}
            <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                    running ? 'bg-secondary/60' : allPassed ? 'bg-fabric-sage' : 'bg-[#9C2A1F]/8'
                }`}
            >
                {running ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : allPassed ? (
                    <Check className="w-4 h-4 text-[#0E334F]" />
                ) : (
                    <AlertTriangle className="w-4 h-4 text-[#9C2A1F]" />
                )}
                <span className={`text-[13px] font-semibold ${allPassed && !running ? 'text-[#0E334F]' : running ? 'text-foreground' : 'text-[#9C2A1F]'}`}>
                    {running ? 'Running tests…' : allPassed ? 'All tests passed' : `${passed} / ${total} passed`}
                </span>
            </div>

            {results.map((r) => (
                <div key={r.index} className="rounded-lg border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--hair))' }}>
                    <div className="flex items-center gap-2 px-3 py-2">
                        <span
                            className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                                r.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-[#9C2A1F]/12 text-[#9C2A1F]'
                            }`}
                        >
                            {r.passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </span>
                        <span className="text-[12.5px] font-medium text-foreground">{r.name}</span>
                        {r.hidden && <Lock className="w-3 h-3 text-muted-foreground/60" />}
                        {r.timeMs != null && <span className="ml-auto text-[11px] tabular text-muted-foreground/70">{Math.round(r.timeMs)}ms</span>}
                    </div>

                    {!r.passed && !r.hidden && (
                        <div className="px-3 pb-2.5 pt-0 space-y-1 font-mono text-[11.5px]">
                            {r.error ? (
                                <Row label="error" value={r.error} tone="error" />
                            ) : (
                                <>
                                    <Row label="input" value={formatValue(r.input, { max: 200 })} />
                                    <Row label="expected" value={formatValue(r.expected, { max: 200 })} />
                                    <Row label="got" value={formatValue(r.actual, { max: 200 })} tone="error" />
                                </>
                            )}
                        </div>
                    )}
                    {!r.passed && r.hidden && (
                        <div className="px-3 pb-2.5 text-[11.5px] text-muted-foreground">Hidden test — {r.error ? 'runtime error' : 'wrong answer'}.</div>
                    )}
                </div>
            ))}
        </div>
    );
}

function Row({ label, value, tone }) {
    return (
        <div className="flex gap-2">
            <span className="shrink-0 w-16 text-muted-foreground/60">{label}</span>
            <span className={`min-w-0 break-words whitespace-pre-wrap ${tone === 'error' ? 'text-[#9C2A1F]' : 'text-foreground/90'}`}>{value}</span>
        </div>
    );
}
