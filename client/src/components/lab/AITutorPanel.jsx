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


// TODO: Complete implementation in subsequent commits (Stage 1/2)
