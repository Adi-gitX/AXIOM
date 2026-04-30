import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ChevronUp, X, Sparkles, Loader2 } from 'lucide-react';
import { PageHeader, Surface, TintedSurface, EmptyState } from '../components/ui/AppPrimitives';

const API = (import.meta.env.VITE_API_URL || '') + '/api';

const RESULT_CLASS = {
    Selected: 'bg-[#E8F2E5] text-[#0E334F] border-[#0E334F]/15',
    Rejected: 'bg-[#F2E5EC] text-[#9C2A1F] border-[#9C2A1F]/20',
    Ghosted: 'bg-secondary text-muted-foreground border-border',
};

const DIFF_TONE = {
    Easy: 'text-[#0E334F]',
    Medium: 'text-[#7A4A1F]',
    'Medium-Hard': 'text-[#7A4A1F]',
    Hard: 'text-[#9C2A1F]',
};

const InterviewExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCompany, setFilterCompany] = useState('all');
    const [filterDiff, setFilterDiff] = useState('all');
    const [sort, setSort] = useState('upvotes');
    const [showSubmit, setShowSubmit] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [refreshNonce, setRefreshNonce] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        Promise.all([
            fetch(`${API}/interviews?sort=${sort}${filterCompany !== 'all' ? `&company=${encodeURIComponent(filterCompany)}` : ''}${filterDiff !== 'all' ? `&difficulty=${encodeURIComponent(filterDiff)}` : ''}`).then(r => r.json()),
            fetch(`${API}/interviews/companies`).then(r => r.json()),
        ]).then(([data, companyData]) => {
            if (cancelled) return;
            setExperiences(data.experiences || []);
            setCompanies(companyData.companies || []);
        }).catch(() => {})
          .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [sort, filterCompany, filterDiff, refreshNonce]);

    const upvote = async (id) => {
        try {
            const r = await fetch(`${API}/interviews/${id}/upvote`, { method: 'POST' });
            if (r.ok) {
                const d = await r.json();
                setExperiences((prev) => prev.map((e) => e.id === id ? { ...e, upvotes: d.upvotes } : e));
            }
        } catch { /* swallow */ }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = Object.fromEntries(fd.entries());
        ['rounds', 'problems'].forEach((k) => { payload[k] = Number.parseInt(payload[k] || 0, 10); });
        setSubmitting(true);
        try {
            const r = await fetch(`${API}/interviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (r.ok) {
                setShowSubmit(false);
                setRefreshNonce((n) => n + 1);
                e.currentTarget.reset();
            }
        } catch { /* swallow */ }
        finally { setSubmitting(false); }
    };

    const totalCount = useMemo(() => companies.reduce((sum, c) => sum + (c.count || 0), 0), [companies]);

    return (
        <div className="px-5 sm:px-8 lg:px-14 py-8 lg:py-14">
            <div className="max-w-[1200px] mx-auto">
                <PageHeader
                    eyebrow="Career · Interviews"
                    title="Real interview stories,"
                    tail="from people who lived them."
                    meta={`${totalCount} experiences · ${companies.length} companies · upvote what helped you`}
                    action={
                        <button
                            onClick={() => setShowSubmit(true)}
                            data-testid="submit-experience-btn"
                            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-foreground text-background text-[13px] font-semibold hover:opacity-90 transition-opacity"
                        >
                            Submit yours
                        </button>
                    }
                />

                {/* Popular companies strip */}
                {!loading && companies.length > 0 && (
                    <div className="mb-10">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-4">
                            Popular companies
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilterCompany('all')}
                                data-testid="company-filter-all"
                                className={`h-8 px-3.5 rounded-full text-[12.5px] font-medium border transition-colors ${filterCompany === 'all' ? 'bg-foreground text-background border-foreground' : 'bg-card text-foreground hover:border-foreground/15'}`}
                                style={filterCompany !== 'all' ? { borderColor: 'hsl(var(--hair))' } : undefined}
                            >
                                All <span className="ml-1 tabular text-muted-foreground/70">{totalCount}</span>
                            </button>
                            {companies.map((c) => (
                                <button
                                    key={c.company}
                                    onClick={() => setFilterCompany(c.company)}
                                    data-testid={`company-filter-${c.company.toLowerCase()}`}
                                    className={`h-8 px-3.5 rounded-full text-[12.5px] font-medium border transition-colors ${filterCompany === c.company ? 'bg-foreground text-background border-foreground' : 'bg-card text-foreground hover:border-foreground/15'}`}
                                    style={filterCompany !== c.company ? { borderColor: 'hsl(var(--hair))' } : undefined}
                                >
                                    {c.company} <span className="ml-1 tabular text-muted-foreground/70">{c.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sort + difficulty filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="inline-flex items-center gap-1 bg-card border rounded-full p-1" style={{ borderColor: 'hsl(var(--hair))' }}>
                        {['all', 'Easy', 'Medium', 'Hard'].map((d) => (
                            <button
                                key={d}
                                onClick={() => setFilterDiff(d)}
                                className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors ${filterDiff === d ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {d === 'all' ? 'All difficulty' : d}
                            </button>
                        ))}
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        data-testid="experiences-sort"
                        className="h-8 px-3 rounded-full bg-card border text-[12.5px] font-medium text-foreground hover:border-foreground/15 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/15"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    >
                        <option value="upvotes">Most upvoted</option>
                        <option value="recent">Most recent</option>
                    </select>
                </div>

                {/* Experiences */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-secondary animate-pulse" />
                        ))}
                    </div>
                ) : experiences.length === 0 ? (
                    <Surface className="py-12">
                        <EmptyState title="No experiences yet" description="Be the first to share — help someone behind you." />
                    </Surface>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {experiences.map((e) => <ExperienceCard key={e.id} e={e} onUpvote={() => upvote(e.id)} />)}
                    </div>
                )}
            </div>

            {/* Submit modal */}
            {showSubmit && (
                <SubmitModal onClose={() => setShowSubmit(false)} onSubmit={handleSubmit} submitting={submitting} />
            )}
        </div>
    );
};

const ExperienceCard = ({ e, onUpvote }) => {
    const days = useMemo(() => {
        try {
            const ms = Date.now() - new Date(e.posted_at).getTime();
            const d = Math.max(0, Math.floor(ms / 86400000));
            return d === 0 ? 'today' : `${d} day${d === 1 ? '' : 's'} ago`;
        } catch { return ''; }
    }, [e.posted_at]);
    return (
        <Surface lift className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center font-display font-semibold text-[14px] text-foreground shrink-0">
                        {e.company.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="font-display font-semibold text-[15px] tracking-[-0.012em] text-foreground truncate">
                            {e.company}
                        </p>
                        <p className="text-[12px] text-muted-foreground truncate">{e.role}</p>
                    </div>
                </div>
                <button
                    onClick={onUpvote}
                    data-testid={`upvote-${e.id}`}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-secondary hover:bg-[#E5E8F2] transition-colors text-[12px] font-semibold text-foreground tabular shrink-0"
                >
                    <ChevronUp className="w-3.5 h-3.5" strokeWidth={2.4} />
                    {e.upvotes}
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3 text-[10.5px] tabular">
                <span className={`inline-flex px-2 py-0.5 rounded-full border font-medium ${RESULT_CLASS[e.result] || RESULT_CLASS.Ghosted}`}>
                    {e.result}
                </span>
                <span className={`font-mono uppercase tracking-[0.06em] ${DIFF_TONE[e.difficulty] || 'text-muted-foreground'}`}>
                    {e.difficulty}
                </span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-muted-foreground">{e.rounds} rounds · {e.problems} problems</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-muted-foreground">{e.location} · {e.experience_years}y</span>
            </div>

            <p className="text-[13.5px] text-foreground/85 leading-relaxed line-clamp-4">
                "{e.quote}"
            </p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: 'hsl(var(--hair))' }}>
                <p className="text-[12px] text-muted-foreground">
                    <span className="text-foreground font-semibold">{e.author_name}</span>
                    {e.author_role && <span> · {e.author_role}</span>}
                </p>
                <p className="text-[10.5px] font-mono uppercase tracking-[0.06em] text-muted-foreground/65">{days}</p>
            </div>
        </Surface>
    );
};

const SubmitModal = ({ onClose, onSubmit, submitting }) => {
    const formRef = useRef(null);
    const [polishing, setPolishing] = useState(false);
    const [polishError, setPolishError] = useState('');

    const handlePolish = async () => {
        setPolishError('');
        if (!formRef.current) return;
        const fd = new FormData(formRef.current);
        const quote = String(fd.get('quote') || '').trim();
        const company = String(fd.get('company') || '').trim();
        const role = String(fd.get('role') || '').trim();
        if (quote.length < 20) {
            setPolishError('Write at least 20 characters first.');
            return;
        }
        setPolishing(true);
        try {
            const r = await fetch(`${API}/ai/polish-story`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quote, company, role }),
            });
            if (!r.ok) {
                const err = await r.json().catch(() => ({}));
                setPolishError(err?.error || 'AI polish unavailable right now.');
                return;
            }
            const d = await r.json();
            const ta = formRef.current.querySelector('textarea[name="quote"]');
            if (ta && d.polished) ta.value = d.polished;
        } catch {
            setPolishError('Network error — please try again.');
        } finally {
            setPolishing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
            <TintedSurface
                tone="sand"
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar p-6 lg:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#3a2e2a]/70 mb-1.5">
                            Pay it forward
                        </p>
                        <h2 className="font-display font-semibold text-[22px] tracking-[-0.018em] text-[#3a2e2a]">
                            Share your interview
                            <span className="italic-accent text-[#3a2e2a]/75"> story.</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/40 flex items-center justify-center transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form ref={formRef} onSubmit={onSubmit} className="space-y-4" data-testid="experience-submit-form">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Company" name="company" placeholder="Google" required />
                        <Field label="Role" name="role" placeholder="SWE Intern" required />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Rounds" name="rounds" type="number" defaultValue="3" min="1" max="10" />
                        <Field label="Problems" name="problems" type="number" defaultValue="2" min="0" max="20" />
                        <Field label="Difficulty" name="difficulty" as="select" defaultValue="Medium">
                            <option>Easy</option><option>Medium</option><option>Medium-Hard</option><option>Hard</option>
                        </Field>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Result" name="result" as="select" defaultValue="Selected">
                            <option>Selected</option><option>Rejected</option><option>Ghosted</option>
                        </Field>
                        <Field label="Location" name="location" as="select" defaultValue="Remote">
                            <option>Remote</option><option>On-site</option><option>Hybrid</option>
                        </Field>
                        <Field label="Years exp" name="experience_years" as="select" defaultValue="0-1">
                            <option>0-1</option><option>1-2</option><option>2-3</option><option>3-4</option><option>4-5</option><option>5+</option>
                        </Field>
                    </div>
                    <Field label="Your name" name="author_name" placeholder="Anonymous" required />
                    <Field label="Your title (optional)" name="author_role" placeholder="Final-year B.Tech" />

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#3a2e2a]/70">What you learned</span>
                            <button
                                type="button"
                                onClick={handlePolish}
                                disabled={polishing}
                                data-testid="ai-polish-btn"
                                className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-white/65 border border-[#3a2e2a]/15 text-[10.5px] font-semibold text-[#3a2e2a] hover:border-[#3a2e2a]/30 transition-colors disabled:opacity-50"
                            >
                                {polishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                {polishing ? 'Polishing…' : 'AI polish'}
                            </button>
                        </div>
                        <textarea
                            name="quote"
                            rows={4}
                            placeholder="The one piece of advice you wish someone had told you…"
                            required
                            className="w-full bg-white/65 border border-[#3a2e2a]/10 rounded-xl px-3.5 py-3 text-[13.5px] leading-snug focus:outline-none focus:ring-2 focus:ring-[#3a2e2a]/20 transition-colors"
                        />
                        {polishError && <p className="text-[11px] text-[#9C2A1F] mt-1.5">{polishError}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        data-testid="experience-submit-btn"
                        className="w-full h-10 rounded-full bg-[#3a2e2a] text-[#FAF8F2] font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {submitting ? 'Submitting…' : 'Publish my story'}
                    </button>
                </form>
            </TintedSurface>
        </div>
    );
};

const Field = ({ label, name, as, children, ...rest }) => {
    const baseCls = 'w-full bg-white/65 border border-[#3a2e2a]/10 rounded-xl px-3.5 h-10 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#3a2e2a]/20 transition-colors';
    return (
        <label className="block">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#3a2e2a]/70 mb-1.5 block">{label}</span>
            {as === 'select' ? (
                <select name={name} className={baseCls} {...rest}>{children}</select>
            ) : as === 'textarea' ? (
                <textarea name={name} className={`${baseCls} h-auto py-3 leading-snug`} {...rest} />
            ) : (
                <input name={name} className={baseCls} {...rest} />
            )}
        </label>
    );
};

export default InterviewExperiences;
