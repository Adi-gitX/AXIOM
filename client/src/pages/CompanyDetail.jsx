import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { Surface, TintedSurface, EmptyState } from '../components/ui/AppPrimitives';

const API = (import.meta.env.VITE_API_URL || '') + '/api';

const DIFF_CLASS = {
    Easy: 'bg-[#E8F2E5] text-[#0E334F] border-[#0E334F]/15',
    Medium: 'bg-[#FBEFE0] text-[#7A4A1F] border-[#7A4A1F]/15',
    Hard: 'bg-[#F2E5EC] text-[#9C2A1F] border-[#9C2A1F]/20',
    Unknown: 'bg-secondary text-muted-foreground border-border',
};

const CompanyDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ company: null, problems: [] });
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [diffFilter, setDiffFilter] = useState('all');

    useEffect(() => {
        let cancelled = false;
        setLoading(true); setErr('');
        fetch(`${API}/dsa/companies/${encodeURIComponent(slug)}`)
            .then((r) => r.ok ? r.json() : Promise.reject(r.status))
            .then((d) => { if (!cancelled) setData(d); })
            .catch(() => { if (!cancelled) setErr('Could not load this company.'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [slug]);

    const c = data.company;
    const problems = useMemo(() => {
        if (!Array.isArray(data.problems)) return [];
        if (diffFilter === 'all') return data.problems;
        return data.problems.filter((p) => p.difficulty === diffFilter);
    }, [data.problems, diffFilter]);

    return (
        <div className="px-5 sm:px-8 lg:px-14 py-8 lg:py-14">
            <div className="max-w-[1200px] mx-auto">
                <button
                    onClick={() => navigate('/app/dsa/companies')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors mb-5"
                >
                    <ChevronLeft className="w-3.5 h-3.5" /> All companies
                </button>

                {err ? (
                    <Surface className="py-12">
                        <EmptyState title="Couldn't load this company" description={err} />
                    </Surface>
                ) : loading || !c ? (
                    <div className="space-y-5">
                        <div className="h-32 rounded-2xl bg-secondary animate-pulse" />
                        <div className="h-12 rounded-2xl bg-secondary animate-pulse" />
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-14 rounded-xl bg-secondary animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <TintedSurface tone={c.tone} className="p-6 lg:p-8 mb-8">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/70 flex items-center justify-center font-display font-semibold text-[28px] tracking-[-0.03em] text-[#0F1419]">
                                        {c.initial}
                                    </div>
                                    <div>
                                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0F1419]/65 mb-1.5">
                                            {c.segment}
                                        </p>
                                        <h1 className="font-display font-semibold text-[34px] md:text-[42px] leading-none tracking-[-0.028em] text-[#0F1419]">
                                            {c.name}
                                        </h1>
                                        <p className="mt-3 text-[14px] text-[#0F1419]/70">
                                            {c.count} curated problems
                                            <span className="italic-accent text-[#0F1419]/60"> — most-asked patterns this year.</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[#0F1419]">
                                    <span className="text-[12px] font-mono"><span className="text-[18px] font-semibold tabular">{c.counts.Easy}</span> Easy</span>
                                    <span className="text-[12px] font-mono"><span className="text-[18px] font-semibold tabular">{c.counts.Medium}</span> Med</span>
                                    <span className="text-[12px] font-mono"><span className="text-[18px] font-semibold tabular">{c.counts.Hard}</span> Hard</span>
                                </div>
                            </div>
                        </TintedSurface>

                        {/* Difficulty tab filter */}
                        <div className="inline-flex items-center gap-1 bg-card border rounded-full p-1 mb-5" style={{ borderColor: 'hsl(var(--hair))' }}>
                            {['all', 'Easy', 'Medium', 'Hard'].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDiffFilter(d)}
                                    data-testid={`diff-filter-${d.toLowerCase()}`}
                                    className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors ${diffFilter === d ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {d === 'all' ? `All (${c.count})` : `${d} (${c.counts[d] || 0})`}
                                </button>
                            ))}
                        </div>

                        {/* Problem list */}
                        <Surface className="overflow-hidden">
                            {problems.length === 0 ? (
                                <EmptyState title="No problems in this filter" description="Switch difficulty to see more." />
                            ) : (
                                <ul className="divide-y" style={{ borderColor: 'hsl(var(--hair))' }}>
                                    {problems.map((p, idx) => (
                                        <ProblemRow key={p.id} p={p} idx={idx} />
                                    ))}
                                </ul>
                            )}
                        </Surface>
                    </>
                )}
            </div>
        </div>
    );
};

const ProblemRow = ({ p, idx }) => {
    const [hintOpen, setHintOpen] = useState(false);
    const [hint, setHint] = useState('');
    const [loadingHint, setLoadingHint] = useState(false);
    const [hintErr, setHintErr] = useState('');

    const fetchHint = async (e) => {
        e?.preventDefault(); e?.stopPropagation();
        if (hint || loadingHint) { setHintOpen(true); return; }
        setLoadingHint(true); setHintErr('');
        try {
            const r = await fetch(`${API}/ai/problem-hint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: p.title, difficulty: p.difficulty }),
            });
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                setHintErr(err?.error || 'Hint unavailable.');
                return;
            }
            const d = await r.json();
            setHint(d.hint || '');
            setHintOpen(true);
        } catch {
            setHintErr('Network error.');
        } finally {
            setLoadingHint(false);
        }
    };

    return (
        <li>
            <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary transition-colors group">
                <span className="font-mono text-[10.5px] text-muted-foreground/55 w-7 tabular shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                </span>
                <a
                    href={p.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`company-problem-${p.id}`}
                    className="flex-1 min-w-0 flex items-center gap-3"
                >
                    <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] text-foreground truncate group-hover:text-[#0E334F] transition-colors">
                            {p.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {p.sheetName} · {p.topicName}
                        </p>
                    </div>
                    <span
                        className={`hidden sm:inline-flex shrink-0 px-2 py-0.5 rounded-full text-[10.5px] font-medium border tabular ${DIFF_CLASS[p.difficulty] || DIFF_CLASS.Unknown}`}
                    >
                        {p.difficulty}
                    </span>
                </a>
                <button
                    type="button"
                    onClick={fetchHint}
                    disabled={loadingHint}
                    data-testid={`hint-${p.id}`}
                    className="inline-flex items-center gap-1 h-7 px-2 rounded-full bg-card border text-[10.5px] font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/15 transition-colors disabled:opacity-50 shrink-0"
                    style={{ borderColor: 'hsl(var(--hair))' }}
                    title="Get an AI-generated hint"
                >
                    {loadingHint ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Hint
                </button>
                <a
                    href={p.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors"
                    aria-label="Open problem"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
            {hintOpen && (
                <div className="px-5 pb-4 -mt-1">
                    <div className="ml-9 rounded-xl bg-fabric-mist p-3.5 border border-[#0E334F]/10">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#0E334F] shrink-0 mt-0.5" strokeWidth={2} />
                            <div className="flex-1 text-[12.5px] text-[#0E334F] whitespace-pre-line leading-relaxed">
                                {hintErr || hint}
                            </div>
                            <button
                                type="button"
                                onClick={() => setHintOpen(false)}
                                className="text-[10.5px] text-[#0E334F]/60 hover:text-[#0E334F] font-semibold uppercase tracking-[0.08em]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

export default CompanyDetail;
