import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { PageHeader, TintedSurface, Surface, EmptyState } from '../components/ui/AppPrimitives';

const API = (import.meta.env.VITE_API_URL || '') + '/api';

const Companies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | product | service
    const [q, setQ] = useState('');

    useEffect(() => {
        let cancelled = false;
        fetch(`${API}/dsa/companies`)
            .then((r) => r.json())
            .then((d) => { if (!cancelled) setCompanies(d.companies || []); })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        return companies.filter((c) => {
            if (filter === 'product' && c.segment !== 'Product Based') return false;
            if (filter === 'service' && c.segment !== 'Service Based') return false;
            if (needle && !c.name.toLowerCase().includes(needle)) return false;
            return true;
        });
    }, [companies, filter, q]);

    const totalProblems = useMemo(() => companies.reduce((sum, c) => sum + (c.count || 0), 0), [companies]);
    const top = filtered.slice(0, 4);
    const rest = filtered.slice(4);

    return (
        <div className="px-5 sm:px-8 lg:px-14 py-8 lg:py-14">
            <div className="max-w-[1200px] mx-auto">
                <PageHeader
                    eyebrow="Engineering · Companies"
                    title="Prep by company,"
                    tail="not by sheet."
                    meta={`${companies.length} companies · ${totalProblems} curated problems · refreshed continuously`}
                />

                {/* Search + segment filter */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                data-testid="companies-search"
                                placeholder="Search companies — Google, Stripe, Amazon…"
                                className="w-full bg-card border rounded-full pl-10 pr-4 h-10 text-[13px] focus:outline-none focus:ring-2 focus:ring-foreground/15 transition-colors"
                                style={{ borderColor: 'hsl(var(--hair))' }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-card border rounded-full p-1" style={{ borderColor: 'hsl(var(--hair))' }}>
                        {[['all', 'All'], ['product', 'Product'], ['service', 'Service']].map(([k, label]) => (
                            <button
                                key={k}
                                onClick={() => setFilter(k)}
                                data-testid={`companies-filter-${k}`}
                                className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors ${filter === k ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured strip — top 4 companies */}
                {!loading && top.length > 0 && (
                    <div className="mb-12">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-4">
                            Most asked
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {top.map((c) => (
                                <CompanyCard key={c.slug} c={c} onClick={() => navigate(`/app/dsa/companies/${c.slug}`)} featured />
                            ))}
                        </div>
                    </div>
                )}

                {/* Full list */}
                <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-4">
                        All companies
                    </p>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="h-24 rounded-2xl bg-secondary animate-pulse" />
                            ))}
                        </div>
                    ) : rest.length === 0 && top.length === 0 ? (
                        <Surface className="py-12">
                            <EmptyState title="No companies match" description="Try a different filter or search term." />
                        </Surface>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {rest.map((c) => (
                                <CompanyCard key={c.slug} c={c} onClick={() => navigate(`/app/dsa/companies/${c.slug}`)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CompanyCard = ({ c, onClick, featured = false }) => {
    const Wrapper = featured ? TintedSurface : Surface;
    return (
        <Wrapper
            tone={featured ? c.tone : undefined}
            lift
            className="cursor-pointer p-5"
            onClick={onClick}
            data-testid={`company-card-${c.slug}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-semibold text-[18px] tracking-[-0.025em] shrink-0 ${featured ? 'bg-white/70' : 'bg-secondary'}`}>
                        {c.initial}
                    </div>
                    <div className="min-w-0">
                        <p className="font-display font-semibold text-[16px] tracking-[-0.012em] text-foreground truncate">
                            {c.name}
                        </p>
                        <p className="text-[11.5px] text-muted-foreground/85 mt-0.5">
                            {c.segment} · {c.count} problems
                        </p>
                    </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
            </div>
            <div className="mt-4 flex items-center gap-3 text-[10.5px] tabular text-muted-foreground/80 font-mono">
                {c.counts.Easy > 0 && <span><span className="text-[#0E334F] font-semibold">{c.counts.Easy}</span> Easy</span>}
                {c.counts.Medium > 0 && <span><span className="text-[#7A4A1F] font-semibold">{c.counts.Medium}</span> Med</span>}
                {c.counts.Hard > 0 && <span><span className="text-[#9C2A1F] font-semibold">{c.counts.Hard}</span> Hard</span>}
            </div>
        </Wrapper>
    );
};

export default Companies;
