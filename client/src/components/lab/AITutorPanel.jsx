import React, { useState } from 'react';
import { Lightbulb, BookOpen, Gauge, Bug, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { aiApi } from '../../lib/api';
import Markdownish from './Markdownish';

const ACTIONS = [
    { mode: 'hint', label: 'Hint', icon: Lightbulb, needsCode: false },
    { mode: 'explain', label: 'Explain', icon: BookOpen, needsCode: true },
    { mode: 'complexity', label: 'Complexity', icon: Gauge, needsCode: true },
    { mode: 'debug', label: 'Debug', icon: Bug, needsCode: true },
];

const MODE_LABEL = { hint: 'Hint', explain: 'Explanation', complexity: 'Complexity', debug: 'Debug' };

/**
 * AITutorPanel — Socratic in-editor coding tutor backed by the LLM gateway.
 * `getContext()` is called at request time and returns
 * { code, language, problemTitle?, statement?, error?, failingCase? }.
 */
export default function AITutorPanel({ getContext }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(null); // mode currently loading
    const [error, setError] = useState(null);

    const ask = async (mode) => {
        setError(null);
        setLoading(mode);
        try {
            const ctx = getContext ? getContext() : {};
            const res = await aiApi.tutor({ mode, ...ctx });
            const text = res?.text || '(no response)';
            setMessages((m) => [{ id: `${mode}-${m.length}`, mode, text }, ...m]);
        } catch (err) {
            setError(err?.message || 'The tutor is unavailable right now.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="shrink-0 p-3 border-b" style={{ borderColor: 'hsl(var(--hair))' }}>
                <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                    <Sparkles className="w-3.5 h-3.5 text-[#7A4A1F]" /> AI Tutor
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                    {ACTIONS.map((a) => {
                        const Icon = a.icon;
                        const isLoading = loading === a.mode;
                        return (
                            <button
                                key={a.mode}
                                type="button"
                                onClick={() => ask(a.mode)}
                                disabled={loading !== null}
                                className="inline-flex items-center justify-center gap-1.5 h-8 rounded-md bg-card border text-[12.5px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                                style={{ borderColor: 'hsl(var(--hair))' }}
                            >
                                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5 text-[#7A4A1F]" />}
                                {a.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
                {error && (
                    <div className="rounded-lg border bg-[#9C2A1F]/5 px-3 py-2 text-[12px] text-[#9C2A1F] flex items-center gap-1.5" style={{ borderColor: 'rgba(156,42,31,0.25)' }}>
                        <AlertTriangle className="w-3.5 h-3.5" /> {error}
                    </div>
                )}

                {messages.length === 0 && !error && (
                    <div className="h-full flex items-center justify-center text-center px-4">
                        <p className="text-[12.5px] text-muted-foreground leading-relaxed max-w-[260px]">
                            Stuck? Ask for a <span className="text-foreground">Hint</span>, or have the tutor
                            <span className="text-foreground"> Explain</span> your code, analyze its
                            <span className="text-foreground"> Complexity</span>, or help you
                            <span className="text-foreground"> Debug</span>.
                        </p>
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className="rounded-lg border bg-card p-3" style={{ borderColor: 'hsl(var(--hair))' }}>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7A4A1F] mb-1">{MODE_LABEL[m.mode]}</p>
                        <Markdownish text={m.text} />
                    </div>
                ))}
            </div>
        </div>
    );
}
