import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowUpRight, Clock, Network, Database, Cpu, Target, BookOpen, Mail, Check } from 'lucide-react';
import { TintedSurface, Surface } from '../ui/AppPrimitives';

/**
 * Upcoming sheet stubs — shown after the active sheets to communicate roadmap.
 * Each card has a "Notify me" toggle that reveals an email-capture (in-memory only;
 * a real waitlist hook can be wired later).
 */
const UPCOMING = [
    {
        id: 'blind75',
        name: 'Blind 75',
        meta: '75 problems · industry standard',
        description: 'The legendary Blind 75 — every essential pattern you must own before any FAANG loop.',
        icon: Target,
        tone: 'sage',
    },
    {
        id: 'striver79',
        name: 'Striver 79',
        meta: '79 problems · last-minute prep',
        description: 'A 7-day intensive sprint. Designed for the week before your interview.',
        icon: Clock,
        tone: 'peach',
    },
    {
        id: 'quick-revision',
        name: 'DSA Quick Revision',
        meta: 'Pattern-wise · 1 hour',
        description: 'Re-solve one representative problem per pattern. Built for night-before nerves.',
        icon: BookOpen,
        tone: 'mist',
    },
];

const CORE_CS = [
    { id: 'cn', name: 'Computer Networks', meta: '50 questions', icon: Network, tone: 'mist' },
    { id: 'dbms', name: 'DBMS', meta: '60 questions', icon: Database, tone: 'sage' },
    { id: 'os', name: 'Operating Systems', meta: '55 questions', icon: Cpu, tone: 'sand' },
    { id: 'system-design', name: 'System Design', meta: 'HLD + LLD', icon: Target, tone: 'peach' },
];

const UpcomingSheets = () => {
    const [openId, setOpenId] = useState(null);
    const [notifiedIds, setNotifiedIds] = useState({});

    const handleNotify = (id, e) => {
        e?.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get('email') || '').trim();
        if (!email) return;
        // Persist locally so the user sees their action stuck across reloads.
        try {
            const stored = JSON.parse(localStorage.getItem('axiom-waitlist') || '{}');
            stored[id] = { email, at: new Date().toISOString() };
            localStorage.setItem('axiom-waitlist', JSON.stringify(stored));
        } catch { /* swallow */ }
        setNotifiedIds((prev) => ({ ...prev, [id]: true }));
        setOpenId(null);
    };

    return (
        <div className="space-y-12">
            {/* Coming soon — sheet expansion */}
            <div>
                <div className="flex items-baseline justify-between gap-3 mb-5">
                    <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-1.5">
                            Roadmap
                        </p>
                        <h2 className="font-display font-semibold text-[18px] tracking-[-0.018em] text-foreground">
                            Coming soon
                            <span className="italic-accent text-foreground/70"> — three more sheets in queue.</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {UPCOMING.map((s) => {
                        const Icon = s.icon;
                        const notified = notifiedIds[s.id];
                        return (
                            <TintedSurface key={s.id} tone={s.tone} className="p-5 relative overflow-hidden">
                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/55 text-[9.5px] font-mono uppercase tracking-[0.12em] text-foreground/65">
                                    <Lock className="w-2.5 h-2.5" /> Soon
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-white/65 flex items-center justify-center mb-4">
                                    <Icon className="w-[18px] h-[18px] text-foreground" strokeWidth={1.7} />
                                </div>
                                <p className="font-display font-semibold text-[16px] tracking-[-0.012em] text-foreground">
                                    {s.name}
                                </p>
                                <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-foreground/55 mt-1">
                                    {s.meta}
                                </p>
                                <p className="text-[12.5px] text-foreground/70 leading-relaxed mt-3">
                                    {s.description}
                                </p>

                                {notified ? (
                                    <div className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0E334F]">
                                        <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
                                        On the waitlist.
                                    </div>
                                ) : openId === s.id ? (
                                    <form
                                        onSubmit={(e) => handleNotify(s.id, e)}
                                        className="mt-5 flex items-center gap-2"
                                        data-testid={`waitlist-form-${s.id}`}
                                    >
                                        <div className="relative flex-1">
                                            <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/55" />
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="you@email.com"
                                                required
                                                autoFocus
                                                className="w-full bg-white/65 border border-foreground/10 rounded-full pl-8 pr-3 h-8 text-[12px] focus:outline-none focus:ring-2 focus:ring-foreground/15"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="h-8 px-3 rounded-full bg-foreground text-background text-[11.5px] font-semibold hover:opacity-90 transition-opacity"
                                        >
                                            Notify
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setOpenId(s.id)}
                                        data-testid={`waitlist-cta-${s.id}`}
                                        className="mt-5 inline-flex items-center gap-1 text-[12px] font-semibold text-foreground hover:opacity-70 transition-opacity"
                                    >
                                        Notify me <ArrowUpRight className="w-3 h-3" />
                                    </button>
                                )}
                            </TintedSurface>
                        );
                    })}
                </div>
            </div>

            {/* Core CS hub — 4 quick-link cards */}
            <div>
                <div className="flex items-baseline justify-between gap-3 mb-5">
                    <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-1.5">
                            Beyond DSA
                        </p>
                        <h2 className="font-display font-semibold text-[18px] tracking-[-0.018em] text-foreground">
                            Core CS subjects
                            <span className="italic-accent text-foreground/70"> — what they also ask.</span>
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {CORE_CS.map((c) => {
                        const Icon = c.icon;
                        return (
                            <Surface key={c.id} lift className="p-5 cursor-pointer">
                                <div className="w-9 h-9 rounded-xl bg-fabric-mist flex items-center justify-center mb-4">
                                    <Icon className="w-[18px] h-[18px] text-[#0E334F]" strokeWidth={1.7} />
                                </div>
                                <p className="font-display font-semibold text-[15px] tracking-[-0.012em] text-foreground">
                                    {c.name}
                                </p>
                                <p className="text-[11.5px] text-muted-foreground mt-1">
                                    {c.meta}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[9.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground">
                                    <Lock className="w-2.5 h-2.5" /> Soon
                                </span>
                            </Surface>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UpcomingSheets;
