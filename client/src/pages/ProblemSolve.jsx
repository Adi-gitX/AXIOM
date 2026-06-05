import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Play, Send, RotateCcw, Loader2, Activity, Terminal, Eye, ListChecks, Sparkles, Check, History,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import CodeEditor from '../components/lab/CodeEditor';
import ConsolePanel from '../components/lab/ConsolePanel';
import Visualizer from '../components/lab/Visualizer';
import TestResultsPanel from '../components/lab/TestResultsPanel';
import AITutorPanel from '../components/lab/AITutorPanel';
import Markdownish from '../components/lab/Markdownish';
import { LANGUAGES, getLanguage, runCode, traceCode, runAgainstTests, warmLanguage } from '../lib/exec';
import { getProblem, visibleTests, DIFFICULTY_ORDER } from '../data/problems';
import { useAuth } from '../contexts/AuthContext';
import { submissionsApi } from '../lib/api';

const DIFF_COLOR = { Easy: '#0E334F', Medium: '#7A4A1F', Hard: '#9C2A1F' };

function solveKey(problemId) {
    return `axiom-solve-${problemId}`;
}

export default function ProblemSolve() {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const problem = useMemo(() => getProblem(problemId), [problemId]);

    const [language, setLanguage] = useState('python');
    const [codeByLang, setCodeByLang] = useState({});
    const [leftTab, setLeftTab] = useState('description'); // description | submissions
    const [panelTab, setPanelTab] = useState('tests'); // tests | console | visualize | tutor
    const [run, setRun] = useState(null); // { results, passed, total, allPassed, running }
    const [consoleResult, setConsoleResult] = useState(null);
    const [customInput, setCustomInput] = useState('');
    const [trace, setTrace] = useState(null);
    const [vizLine, setVizLine] = useState(null);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState({ state: 'idle', label: 'Ready' });
    const [submissions, setSubmissions] = useState([]);
    const seededRef = useRef(false);

    // Seed editor code from saved draft or starter.
    useEffect(() => {
        if (!problem) return;
        let saved = {};
        try {
            saved = JSON.parse(localStorage.getItem(solveKey(problem.id)) || '{}') || {};
        } catch {
            saved = {};
        }
        const seed = {};
        for (const l of LANGUAGES) seed[l.id] = saved.codeByLang?.[l.id] ?? problem.starter[l.id] ?? '';
        setCodeByLang(seed);
        setLanguage(saved.language || 'python');
        const sample = visibleTests(problem)[0];
        setCustomInput(JSON.stringify(sample?.input ?? {}, null, 2));
        seededRef.current = true;
    }, [problem]);

    // Persist on user actions only — NOT via an effect (a persist-effect clobbers the
    // freshly-seeded draft under React 18 StrictMode double-invocation).
    const persistDraft = useCallback((nextLanguage, nextCodeByLang) => {
        if (!problem) return;
        try {
            localStorage.setItem(solveKey(problem.id), JSON.stringify({ language: nextLanguage, codeByLang: nextCodeByLang }));
        } catch {
            /* ignore */
        }
    }, [problem]);



// TODO: Complete implementation in subsequent commits (Stage 1/6)
