import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Search, ArrowUpRight, FlaskConical } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { PageShell, PageHeader, Surface, KpiTile } from '../components/ui/AppPrimitives';
import { listProblems, DIFFICULTY_ORDER } from '../data/problems';
import { useAuth } from '../contexts/AuthContext';
import { submissionsApi } from '../lib/api';

const DIFF_COLOR = { Easy: '#0E334F', Medium: '#7A4A1F', Hard: '#9C2A1F' };
const FILTERS = ['All', 'Easy', 'Medium', 'Hard'];

export default function ProblemList() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const problems = useMemo(() => listProblems(), []);
    const [filter, setFilter] = useState('All');
    const [q, setQ] = useState('');
    const [summary, setSummary] = useState({});

    useEffect(() => {
        let alive = true;
        if (currentUser?.email) {
            submissionsApi.summary(currentUser.email)
                .then((res) => { if (alive) setSummary(res?.summary || {}); })
                .catch(() => {});
        }
        return () => { alive = false; };
    }, [currentUser?.email]);

    const solvedCount = problems.filter((p) => summary[p.id]?.solved).length;
    const attemptedCount = problems.filter((p) => summary[p.id]?.attempts > 0).length;

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        return problems
            .filter((p) => (filter === 'All' ? true : p.difficulty === filter))
            .filter((p) => (needle ? `${p.title} ${p.topic} ${p.tags.join(' ')}`.toLowerCase().includes(needle) : true))
            .sort((a, b) => (DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]) || a.title.localeCompare(b.title));
    }, [problems, filter, q]);

    return (
        <PageShell>
            <SEOHead title="Problems — AXIOM Code Lab" description="Solve curated DSA problems in your browser with live test cases, an algorithm visualizer, and an AI tutor — Python, JavaScript, and TypeScript." />

            <PageHeader
                eyebrow="Code Lab"
                title="Problems"
                tail="solve them live"
                meta="Write, run, and submit solutions against real test cases — then watch them execute step by step. No setup, runs entirely in your browser."
                action={(
                    <button
                        type="button"
                        onClick={() => navigate('/app/lab')}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-card border text-[13px] font-medium text-foreground hover:bg-secondary transition-colors"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    >
                        <FlaskConical className="w-4 h-4" /> Open playground
                    </button>
                )}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                <KpiTile label="Solved" value={`${solvedCount}`} hint={`of ${problems.length} problems`} tone="sage" />
                <KpiTile label="Attempted" value={`${attemptedCount}`} hint="problems tried" tone="mist" />
                <KpiTile label="Languages" value="3" hint="Python · JS · TS" tone="peach" />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/70">
                    {FILTERS.map((f) => (
                        <button key={f} type="button" onClick={() => setFilter(f)} className={`px-3 h-8 rounded-md text-[12.5px] font-medium transition-colors ${filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex-1" />
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search problems"
                        className="h-9 w-52 pl-8 pr-3 rounded-lg bg-card border text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-[#0E334F]/15"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    />
                </div>
            </div>

            {/* List */}
            <div className="space-y-2">
                {filtered.map((p, i) => {
                    const isSolved = summary[p.id]?.solved;
                    const attempts = summary[p.id]?.attempts || 0;
                    return (
                        <Surface key={p.id} lift className="group cursor-pointer" onClick={() => navigate(`/app/problems/${p.id}`)}>
                            <div className="flex items-center gap-3 px-4 py-3">
                                <span className={`shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold ${isSolved ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                                    {isSolved ? <Check className="w-3.5 h-3.5" /> : i + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-semibold text-foreground truncate">{p.title}</span>
                                        {attempts > 0 && !isSolved && <span className="text-[10.5px] text-muted-foreground/70">· {attempts} attempt{attempts > 1 ? 's' : ''}</span>}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11.5px] text-muted-foreground">{p.topic}</span>
                                        <span className="text-muted-foreground/30">·</span>
                                        <div className="flex gap-1">
                                            {p.tags.slice(0, 2).map((t) => (
                                                <span key={t} className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-secondary/60 text-muted-foreground">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded" style={{ color: DIFF_COLOR[p.difficulty], background: `${DIFF_COLOR[p.difficulty]}14` }}>
                                    {p.difficulty}
                                </span>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" />
                            </div>
                        </Surface>
                    );
                })}
                {filtered.length === 0 && (
                    <p className="text-center text-[13px] text-muted-foreground py-12">No problems match your filter.</p>
                )}
            </div>
        </PageShell>
    );
}
