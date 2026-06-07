import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Activity, Loader2, RotateCcw, ChevronDown, AlertTriangle, Terminal, Eye } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import CodeEditor from '../components/lab/CodeEditor';
import Visualizer from '../components/lab/Visualizer';
import ConsolePanel from '../components/lab/ConsolePanel';
import { LANGUAGES, DEFAULT_LANGUAGE, getLanguage, getStarter, runCode, traceCode, warmLanguage } from '../lib/exec';

const LS_KEY = 'axiom-lab-v1';

function loadDraft() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {};
    } catch {
        return {};
    }
}

export default function CodeLab() {
    const draftRef = useRef(loadDraft());
    const [language, setLanguage] = useState(draftRef.current.language || DEFAULT_LANGUAGE);
    const [codeByLang, setCodeByLang] = useState(() => {
        const saved = draftRef.current.codeByLang || {};
        const seed = {};
        for (const l of LANGUAGES) seed[l.id] = saved[l.id] ?? getStarter(l.id).code;
        return seed;
    });
    const [functionName, setFunctionName] = useState(draftRef.current.functionName || getStarter(language).functionName);
    const [inputsText, setInputsText] = useState(
        draftRef.current.inputsText || JSON.stringify(getStarter(language).inputs, null, 2),
    );
    const [showInputs, setShowInputs] = useState(false);
    const [tab, setTab] = useState('console'); // 'console' | 'visualize'
    const [status, setStatus] = useState({ state: 'idle', label: 'Ready' });
    const [result, setResult] = useState(null); // run result
    const [trace, setTrace] = useState(null); // trace result
    const [vizLine, setVizLine] = useState(null); // active line reported by the visualizer
    const [busy, setBusy] = useState(false);

    const code = codeByLang[language];
    const lang = getLanguage(language);

    // Persist draft.
    useEffect(() => {
        const draft = { language, codeByLang, functionName, inputsText };
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(draft));
        } catch {
            /* ignore quota */
        }
    }, [language, codeByLang, functionName, inputsText]);

    // Warm the runtime when the language changes.
    useEffect(() => {
        let alive = true;
        setStatus({ state: 'loading', label: `Loading ${lang.label} runtime…` });
        warmLanguage(language).then((r) => {
            if (!alive) return;
            setStatus(r.ok ? { state: 'idle', label: 'Ready' } : { state: 'error', label: 'Runtime failed to load' });
        });
        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const setCode = useCallback(
        (next) => setCodeByLang((prev) => ({ ...prev, [language]: next })),
        [language],
    );

    const parseInputs = useCallback(() => {
        const text = inputsText.trim();
        if (!text) return {};
        const parsed = JSON.parse(text);
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error('Inputs must be a JSON object mapping argument names to values.');
        }
        return parsed;
    }, [inputsText]);

    const handleRun = useCallback(async () => {
        setBusy(true);
        setTab('console');
        setStatus({ state: 'running', label: 'Running…' });
        try {
            const inputs = parseInputs();
            const res = await runCode({ language, code, functionName, inputs });
            setResult(res);
            setStatus(
                res.ok
                    ? { state: 'success', label: `Done${res.timings?.totalMs ? ` · ${Math.round(res.timings.totalMs)}ms` : ''}` }
                    : { state: 'error', label: 'Runtime error' },
            );
        } catch (err) {
            setResult({ ok: false, error: err.message, stdout: [], output: undefined, errorLine: null });
            setStatus({ state: 'error', label: 'Invalid inputs' });
        } finally {
            setBusy(false);
        }
    }, [language, code, functionName, parseInputs]);

    const handleVisualize = useCallback(async () => {
        setBusy(true);
        setTab('visualize');
        setStatus({ state: 'running', label: 'Tracing…' });
        try {
            const inputs = parseInputs();
            const res = await traceCode({ language, code, functionName, inputs });
            setTrace(res);
            setResult(res);
            setStatus(
                res.ok || res.trace.events.length
                    ? { state: 'success', label: `Traced · ${res.trace.steps ?? res.trace.events.length} steps${res.trace.truncated ? ' (truncated)' : ''}` }
                    : { state: 'error', label: res.error ? 'Trace error' : 'No trace' },
            );
        } catch (err) {
            setTrace(null);
            setResult({ ok: false, error: err.message, stdout: [], output: undefined, errorLine: null });
            setStatus({ state: 'error', label: 'Invalid inputs' });
        } finally {
            setBusy(false);
        }
    }, [language, code, functionName, parseInputs]);

    const handleReset = useCallback(() => {
        const s = getStarter(language);
        setCode(s.code);
        setFunctionName(s.functionName);
        setInputsText(JSON.stringify(s.inputs, null, 2));
        setResult(null);
        setTrace(null);
        setStatus({ state: 'idle', label: 'Ready' });
    }, [language, setCode]);

    // Keyboard: Cmd/Ctrl+Enter = run.
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleRun]);

    const errorLine = result && !result.ok ? result.errorLine : null;

    return (
        <div className="h-full flex flex-col">
            <SEOHead title="Code Lab — AXIOM" description="Write, run, and visualize algorithms in Python, JavaScript, and TypeScript — right in your browser." />

            {/* Toolbar */}
            <div
                className="shrink-0 flex flex-wrap items-center gap-2 px-4 sm:px-6 py-2.5 border-b bg-card/60 backdrop-blur"
                style={{ borderColor: 'hsl(var(--hair))' }}
            >
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/70">
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.id}
                            type="button"
                            onClick={() => setLanguage(l.id)}
                            className={`px-3 h-7 rounded-md text-[12.5px] font-medium transition-colors ${
                                language === l.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>

                <label className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <span className="hidden sm:inline">fn</span>
                    <input
                        value={functionName}
                        onChange={(e) => setFunctionName(e.target.value)}
                        spellCheck={false}
                        className="w-28 h-7 px-2 rounded-md bg-card border text-[12.5px] font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-[#0E334F]/15"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    />
                </label>

                <button
                    type="button"
                    onClick={() => setShowInputs((v) => !v)}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >


// TODO: Complete implementation in subsequent commits (Stage 3/5)
