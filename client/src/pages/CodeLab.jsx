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


// TODO: Complete implementation in subsequent commits (Stage 2/5)
