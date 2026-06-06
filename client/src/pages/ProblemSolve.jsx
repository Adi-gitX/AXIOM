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

    // Warm runtime on language change.
    useEffect(() => {
        setStatus({ state: 'loading', label: `Loading ${getLanguage(language).label}…` });
        let alive = true;
        warmLanguage(language).then((r) => {
            if (alive) setStatus(r.ok ? { state: 'idle', label: 'Ready' } : { state: 'error', label: 'Runtime failed' });
        });
        return () => { alive = false; };
    }, [language]);

    // Load submissions for solved badge + history.
    const refreshSubmissions = useCallback(async () => {
        if (!currentUser?.email || !problem) return;
        try {
            const res = await submissionsApi.list(currentUser.email, problem.id);
            setSubmissions(res?.submissions || []);
        } catch {
            /* ignore */
        }
    }, [currentUser?.email, problem]);

    useEffect(() => { refreshSubmissions(); }, [refreshSubmissions]);

    const code = codeByLang[language] ?? '';
    const setCode = useCallback((next) => {
        setCodeByLang((p) => {
            const updated = { ...p, [language]: next };
            persistDraft(language, updated);
            return updated;
        });
    }, [language, persistDraft]);
    const changeLanguage = useCallback((l) => {
        setLanguage(l);
        persistDraft(l, codeByLang);
    }, [codeByLang, persistDraft]);
    const solved = submissions.some((s) => s.status === 'accepted');

    const consoleFromFirst = (results) => {
        const first = results[0];
        if (!first) return null;
        return {
            ok: !first.error,
            output: first.actual,
            stdout: first.stdout || [],
            error: first.error,
            errorLine: first.errorLine,
            timeoutReason: first.timeoutReason,
        };
    };

    const execTests = useCallback(async (tests, mode) => {
        setBusy(true);
        setPanelTab('tests');
        setRun({ results: [], passed: 0, total: tests.length, allPassed: false, running: true });
        setStatus({ state: 'running', label: mode === 'submit' ? 'Submitting…' : 'Running…' });
        const out = await runAgainstTests({ language, code, functionName: problem.functionName, tests, compare: problem.compare || 'deep' });
        setRun({ ...out, running: false });
        setConsoleResult(consoleFromFirst(out.results));
        setStatus(out.allPassed ? { state: 'success', label: 'Accepted' } : { state: 'error', label: `${out.passed}/${out.total} passed` });
        setBusy(false);
        return out;
    }, [language, code, problem]);

    const handleRun = useCallback(() => {
        if (!problem) return;
        execTests(visibleTests(problem), 'run');
    }, [problem, execTests]);

    const handleSubmit = useCallback(async () => {
        if (!problem) return;
        const out = await execTests(problem.tests, 'submit');
        // Record the submission.
        const status = out.allPassed
            ? 'accepted'
            : out.results.some((r) => r.error)
                ? 'runtime_error'
                : 'wrong_answer';
        const runtimeMs = out.results.reduce((sum, r) => sum + (r.timeMs || 0), 0);
        if (currentUser?.email) {
            try {
                await submissionsApi.create({
                    email: currentUser.email,
                    problemId: problem.id,
                    language,
                    code,
                    status,
                    passed: out.passed,
                    total: out.total,
                    runtimeMs,
                });
                refreshSubmissions();
            } catch {
                /* non-blocking */
            }
        }
    }, [problem, execTests, currentUser?.email, language, code, refreshSubmissions]);

    const handleVisualize = useCallback(async () => {
        if (!problem) return;
        setBusy(true);
        setPanelTab('visualize');
        setStatus({ state: 'running', label: 'Tracing…' });
        const sample = visibleTests(problem)[0];
        const res = await traceCode({ language, code, functionName: problem.functionName, inputs: sample?.input || {} });
        setTrace(res);
        setStatus({ state: res.trace.events.length ? 'success' : 'error', label: res.trace.events.length ? `Traced · ${res.trace.steps ?? res.trace.events.length} steps` : 'No trace' });
        setBusy(false);
    }, [problem, language, code]);

    const handleCustomRun = useCallback(async () => {
        if (!problem) return;
        setBusy(true);
        setPanelTab('console');
        setStatus({ state: 'running', label: 'Running…' });
        try {
            const inputs = JSON.parse(customInput || '{}');
            if (inputs === null || typeof inputs !== 'object' || Array.isArray(inputs)) {
                throw new Error('Custom input must be a JSON object of arguments.');
            }
            const res = await runCode({ language, code, functionName: problem.functionName, inputs });
            setConsoleResult(res);
            setStatus(res.ok ? { state: 'success', label: 'Done' } : { state: 'error', label: 'Runtime error' });
        } catch (err) {
            setConsoleResult({ ok: false, error: err.message, stdout: [], output: undefined, errorLine: null });
            setStatus({ state: 'error', label: 'Invalid input' });
        } finally {
            setBusy(false);
        }
    }, [problem, language, code, customInput]);

    const handleReset = useCallback(() => {
        if (!problem) return;
        setCode(problem.starter[language] ?? '');
        setRun(null);
        setConsoleResult(null);
        setTrace(null);
        setStatus({ state: 'idle', label: 'Ready' });
    }, [problem, language, setCode]);

    const tutorContext = useCallback(() => {
        const failing = run?.results?.find((r) => !r.passed);
        return {
            code,
            language,
            problemTitle: problem?.title,
            statement: problem?.statement,
            failingCase: failing && !failing.hidden ? `input ${JSON.stringify(failing.input)}, expected ${JSON.stringify(failing.expected)}, got ${JSON.stringify(failing.actual)}` : undefined,
            error: consoleResult?.error || undefined,
        };
    }, [code, language, problem, run, consoleResult]);

    // Cmd/Ctrl+Enter to run.
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleRun]);

    if (!problem) {
        return (
            <div className="h-full flex items-center justify-center px-8 text-center">
                <div>
                    <p className="text-[14px] text-foreground font-medium">Problem not found</p>
                    <Link to="/app/problems" className="inline-block mt-3 text-[13px] text-[#0E334F] underline underline-offset-4">Back to Problems</Link>
                </div>
            </div>
        );
    }

    const errorLine = panelTab === 'console' && consoleResult && !consoleResult.ok ? consoleResult.errorLine : null;

    return (
        <div className="h-full flex flex-col">
            <SEOHead title={`${problem.title} — AXIOM Code Lab`} description={`Solve ${problem.title} (${problem.difficulty}) in Python, JavaScript, or TypeScript with live tests and a step-through visualizer.`} />

            {/* Toolbar */}
            <div className="shrink-0 flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 border-b bg-card/60 backdrop-blur" style={{ borderColor: 'hsl(var(--hair))' }}>
                <button type="button" onClick={() => navigate('/app/problems')} className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="All problems">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[13.5px] font-semibold text-foreground truncate">{problem.title}</span>
                    <span className="shrink-0 text-[10.5px] font-semibold px-1.5 py-0.5 rounded" style={{ color: DIFF_COLOR[problem.difficulty], background: `${DIFF_COLOR[problem.difficulty]}14` }}>
                        {problem.difficulty}
                    </span>
                    {solved && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5 rounded text-emerald-700 bg-emerald-100">
                            <Check className="w-3 h-3" /> Solved
                        </span>
                    )}
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/70">
                    {LANGUAGES.map((l) => (
                        <button key={l.id} type="button" onClick={() => changeLanguage(l.id)} className={`px-2.5 h-7 rounded-md text-[12px] font-medium transition-colors ${language === l.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                            {l.short}
                        </button>
                    ))}
                </div>

                <button type="button" onClick={handleReset} title="Reset to starter" className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={handleVisualize} disabled={busy} className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-fabric-sage text-[12px] font-medium text-[#0E334F] hover:opacity-90 transition-opacity disabled:opacity-50">
                    <Activity className="w-3.5 h-3.5" /> Visualize
                </button>
                <button type="button" data-testid="solve-run" onClick={handleRun} disabled={busy} className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-card border text-[12.5px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50" style={{ borderColor: 'hsl(var(--hair))' }}>
                    {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Run
                </button>
                <button type="button" data-testid="solve-submit" onClick={handleSubmit} disabled={busy} className="inline-flex items-center gap-1.5 h-7 px-3.5 rounded-md bg-[#0E334F] text-[12.5px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                    <Send className="w-3.5 h-3.5" /> Submit
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
                {/* Left: statement / submissions */}
                <div className="lg:w-[36%] lg:max-w-[460px] min-h-[200px] lg:min-h-0 flex flex-col border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'hsl(var(--hair))' }}>
                    <div className="shrink-0 flex items-center gap-1 px-3 h-9 border-b bg-card/40" style={{ borderColor: 'hsl(var(--hair))' }}>
                        <MiniTab active={leftTab === 'description'} onClick={() => setLeftTab('description')} icon={ListChecks} label="Description" />
                        <MiniTab active={leftTab === 'submissions'} onClick={() => setLeftTab('submissions')} icon={History} label={`Submissions${submissions.length ? ` (${submissions.length})` : ''}`} />
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4">
                        {leftTab === 'description' ? (
                            <ProblemDescription problem={problem} />
                        ) : (
                            <SubmissionsList submissions={submissions} />
                        )}
                    </div>
                </div>

                {/* Right: editor + panel */}
                <div className="flex-1 min-h-0 flex flex-col">
                    <div className="flex-1 min-h-[200px] overflow-hidden border-b" style={{ borderColor: 'hsl(var(--hair))' }}>
                        <CodeEditor
                            value={code}
                            onChange={setCode}
                            language={language}
                            errorLine={errorLine}
                            activeLine={panelTab === 'visualize' ? vizLine : null}
                        />
                    </div>

                    <div className="h-[42%] min-h-[180px] flex flex-col">
                        <div className="shrink-0 flex items-center gap-1 px-3 h-9 border-b bg-card/40" style={{ borderColor: 'hsl(var(--hair))' }}>
                            <MiniTab active={panelTab === 'tests'} onClick={() => setPanelTab('tests')} icon={ListChecks} label="Tests" />
                            <MiniTab active={panelTab === 'console'} onClick={() => setPanelTab('console')} icon={Terminal} label="Console" />
                            <MiniTab active={panelTab === 'visualize'} onClick={() => setPanelTab('visualize')} icon={Eye} label="Visualize" />
                            <MiniTab active={panelTab === 'tutor'} onClick={() => setPanelTab('tutor')} icon={Sparkles} label="Tutor" />
                            <div className="flex-1" />
                            <StatusDot status={status} />
                        </div>
                        <div className="flex-1 min-h-0 overflow-hidden">
                            {panelTab === 'tests' && <TestResultsPanel run={run} />}
                            {panelTab === 'console' && (
                                <div className="h-full flex flex-col">
                                    <div className="shrink-0 px-3 py-2 border-b bg-secondary/20" style={{ borderColor: 'hsl(var(--hair))' }}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">Custom input — JSON args for <span className="font-mono normal-case tracking-normal">{problem.functionName}(…)</span></span>
                                            <button type="button" onClick={handleCustomRun} disabled={busy} className="inline-flex items-center gap-1 h-6 px-2 rounded bg-[#0E334F] text-white text-[11px] font-medium hover:opacity-90 disabled:opacity-50">
                                                <Play className="w-3 h-3" /> Run
                                            </button>
                                        </div>
                                        <textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} spellCheck={false} rows={2} className="w-full px-2 py-1.5 rounded-md bg-card border text-[12px] font-mono text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-[#0E334F]/15" style={{ borderColor: 'hsl(var(--hair))' }} />
                                    </div>
                                    <div className="flex-1 min-h-0"><ConsolePanel result={consoleResult} language={language} /></div>
                                </div>
                            )}
                            {panelTab === 'visualize' && <Visualizer trace={trace} language={language} onActiveLineChange={setVizLine} />}
                            {panelTab === 'tutor' && <AITutorPanel getContext={tutorContext} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProblemDescription({ problem }) {
    return (
        <div>
            <Markdownish text={problem.statement} className="text-[13.5px] text-foreground/90" />

            {problem.examples?.length > 0 && (
                <div className="mt-4 space-y-2.5">
                    {problem.examples.map((ex, i) => (
                        <div key={i} className="rounded-lg border bg-secondary/30 p-3" style={{ borderColor: 'hsl(var(--hair))' }}>
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70 mb-1.5">Example {i + 1}</p>


// TODO: Complete implementation in subsequent commits (Stage 5/6)
