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


// TODO: Complete implementation in subsequent commits (Stage 1/5)
