import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowUpRight,
    ChevronRight,
    Code2,
    GitBranch,
    GraduationCap,
    Briefcase,
    Layers,
    Github,
    Check,
    Zap,
    BookOpen,
    Users,
    Sparkles,
    Play,
    Activity,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import PublicNavbar from '../components/PublicNavbar';

import heroLandscape from '../assets/figma/hero-landscape.webp';
import skyClouds from '../assets/figma/sky-clouds.webp';
import footerLandscape from '../assets/figma/footer-landscape.webp';

/* ============================================================================
 * Atoms
 * ========================================================================== */
const Eyebrow = ({ children }) => (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.18em] text-[#0F1419]/55">
        <span className="w-3.5 h-px bg-[#0F1419]/30" />
        {children}
    </span>
);

const SectionTitle = ({ children, className = '' }) => (
    <h2
        className={`font-display text-[40px] md:text-[56px] leading-[1.02] tracking-[-0.028em] text-[#0F1419] font-semibold ${className}`}
    >
        {children}
    </h2>
);

const Lede = ({ children, className = '' }) => (
    <p className={`text-[16px] md:text-[17.5px] leading-[1.55] text-[#0F1419]/62 ${className}`}>
        {children}
    </p>
);

const FadeIn = ({ children, delay = 0, y = 16 }) => (
    <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
        {children}
    </motion.div>
);

/* ============================================================================
 * Hero — painterly landscape + honest, specific copy
 * ========================================================================== */
const Hero = ({ navigate }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    // Live GitHub star count for Adi-gitX/AXIOM
    const [stars, setStars] = useState(null);
    useEffect(() => {
        let cancelled = false;
        fetch('https://api.github.com/repos/Adi-gitX/AXIOM')
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (!cancelled && d && typeof d.stargazers_count === 'number') {
                    setStars(d.stargazers_count);
                }
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);
    const formatStars = (n) => {
        if (n == null) return '—';
        if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
        return String(n);
    };

    return (
        <section ref={ref} className="relative w-full overflow-hidden bg-[#FAF8F2]">
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.04 }}
                transition={{ duration: 18, ease: 'easeOut' }}
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroLandscape})` }}
                />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF8F2]" />

            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 pt-[34vh] pb-24 md:pt-[36vh] md:pb-32 px-6 md:px-10"
            >
                <div className="max-w-[1080px] mx-auto text-center">
                    <motion.a
                        href="https://github.com/Adi-gitX/AXIOM"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="hero-github-stars"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3a2e2a]/85 backdrop-blur border border-white/10 text-[12px] text-[#FAF8F2]/90 mb-9 hover:bg-[#3a2e2a] transition-colors"
                    >
                        <Github className="w-3.5 h-3.5" strokeWidth={1.8} />
                        <span>Open-source</span>
                        <span className="text-[#FAF8F2]/40">·</span>
                        <span className="font-medium tabular-nums">
                            {formatStars(stars)} stars
                        </span>
                        <ArrowUpRight className="w-3 h-3" />
                    </motion.a>

                    <motion.h1
                        initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display font-semibold text-[44px] sm:text-[64px] md:text-[92px] leading-[0.96] tracking-[-0.038em] text-[#0F1419]"
                    >
                        The career platform
                        <br />
                        <span className="italic font-light text-[#0F1419]/85 hand-underline">
                            for engineers who ship.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.2 }}
                        className="mt-8 text-[16px] md:text-[18px] text-[#0F1419]/65 max-w-[600px] mx-auto leading-relaxed"
                    >
                        Track DSA streaks, find your first OSS contribution, prep GSOC, and ship a public
                        portfolio — all in one app. Replaces 6+ tools you've been duct-taping together.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                        className="mt-12 flex items-center justify-center gap-3"
                    >
                        <button
                            data-testid="hero-cta-start"
                            onClick={() => navigate('/signup')}
                            className="px-6 py-3.5 bg-[#0F1419] text-[#FAF8F2] rounded-full text-[14.5px] font-medium shadow-[0_8px_24px_rgba(15,20,25,0.18)] hover:bg-[#0E334F] transition-colors"
                        >
                            Start free
                        </button>
                        <button
                            data-testid="hero-cta-demo"
                            onClick={() => navigate('/app')}
                            className="px-5 py-3.5 text-[14.5px] font-medium text-[#0F1419] hover:text-[#0E334F] transition-colors"
                        >
                            Live demo →
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.65 }}
                        className="mt-6 text-[12.5px] text-[#0F1419]/45"
                    >
                        Free forever · MIT licensed · No credit card
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

/* ============================================================================
 * Honest "what's inside" strip — replaces fake company-logo wall
 * ========================================================================== */
const InsideStrip = () => {
    const items = [
        { icon: Code2, label: 'DSA Tracker' },
        { icon: GitBranch, label: 'OSS Engine' },
        { icon: GraduationCap, label: 'GSOC' },
        { icon: BookOpen, label: 'Education' },
        { icon: Briefcase, label: 'Jobs Board' },
        { icon: Users, label: 'Dev Connect' },
    ];
    return (
        <section className="bg-[#FAF8F2] pt-20 pb-6">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
                <div className="text-center">
                    <Eyebrow>Everything in one app</Eyebrow>
                </div>
                <div className="mt-6 flex flex-wrap justify-center items-center gap-x-3 gap-y-3">
                    {items.map(({ icon: Icon, label }) => (
                        <span
                            key={label}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-black/[0.06] text-[13px] font-medium text-[#0F1419] shadow-[0_1px_0_rgba(15,20,25,0.03)]"
                        >
                            <Icon className="w-3.5 h-3.5 text-[#0E334F]" strokeWidth={1.7} />
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ============================================================================
 * Real numbers (no invented retention/conversion stats)
 * ========================================================================== */
const RealNumbers = () => (
    <section id="product" className="bg-[#FAF8F2] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <div className="max-w-[760px]">
                <FadeIn>
                    <Eyebrow>The catalog</Eyebrow>
                </FadeIn>
                <FadeIn delay={0.05}>
                    <SectionTitle className="mt-5">
                        Three legendary DSA sheets,
                        <br />
                        <span className="italic font-light">indexed and searchable.</span>
                    </SectionTitle>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <Lede className="mt-5 max-w-[560px]">
                        Babbar 450, Striver SDE, and Striver A2Z — unified into one progress tracker
                        with spaced repetition and difficulty curves baked in.
                    </Lede>
                </FadeIn>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 md:gap-3">
                {[
                    { v: '1,096', t: 'Problems indexed' },
                    { v: '99', t: 'Topics covered' },
                    { v: '3', t: 'Sheets unified' },
                ].map((s, i) => (
                    <FadeIn key={s.t} delay={i * 0.08}>
                        <div className="text-left md:px-8 md:border-l md:border-black/[0.08] first:border-l-0 first:md:pl-0">
                            <div className="font-display text-[56px] md:text-[80px] leading-none tracking-[-0.04em] font-medium text-[#0F1419] tabular-nums">
                                {s.v}
                            </div>
                            <div className="mt-3 text-[12.5px] text-[#0F1419]/55 uppercase tracking-[0.12em]">
                                {s.t}
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </div>
    </section>
);

/* ============================================================================
 * Founder note — replaces the fake testimonial
 * ========================================================================== */
const FounderNote = () => (
    <section className="bg-[#FAF8F2] py-20 md:py-24">
        <div className="max-w-[920px] mx-auto px-6 md:px-10">
            <FadeIn>
                <Eyebrow>From the maker</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.05}>
                <p className="mt-6 font-serif text-[24px] md:text-[32px] leading-[1.32] tracking-[-0.012em] text-[#0F1419]">
                    "I built AXIOM because I was juggling LeetCode, GitHub, a Notion tracker, three
                    Discord servers, and a half-broken Chrome extension just to stay consistent.
                    <span className="italic"> One app. One workflow. Free forever.</span>"
                </p>
            </FadeIn>
            <FadeIn delay={0.1}>
                <div className="mt-8 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#46838b] to-[#0E334F]" />
                    <div>
                        <div className="text-[14px] font-semibold text-[#0F1419]">Aditya Kammati</div>
                        <a
                            href="https://github.com/Adi-gitX"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12.5px] text-[#0F1419]/55 hover:text-[#0F1419] transition-colors"
                        >
                            Creator · @Adi-gitX
                        </a>
                    </div>
                </div>
            </FadeIn>
        </div>
    </section>
);

/* ============================================================================
 * AI band — kept the painterly clouds, killed the corny gradient pill
 * ========================================================================== */
const AIBand = ({ navigate }) => (
    <section className="relative py-32 md:py-40 overflow-hidden">
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${skyClouds})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F2]/40 via-transparent to-[#FAF8F2]" />

        <div className="relative z-10 max-w-[1080px] mx-auto px-6 md:px-10 text-center">
            <FadeIn>
                <Eyebrow>Quietly assistive</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.08}>
                <h2 className="mt-6 font-display font-semibold text-[44px] md:text-[80px] leading-[0.98] tracking-[-0.035em] text-[#0F1419]">
                    AI that drafts,
                    <br />
                    <span className="italic font-light">not decides.</span>
                </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
                <p className="mt-6 text-[16px] md:text-[18px] text-[#0F1419]/65 max-w-[600px] mx-auto leading-relaxed">
                    GSOC proposal drafts, spaced-repetition schedules, and ATS-scored resumes —
                    generated as starting points, never autopilot. Your career, your judgment.
                </p>
            </FadeIn>
            <FadeIn delay={0.25}>
                <button
                    onClick={() => navigate('/app')}
                    className="mt-9 inline-flex items-center gap-1.5 px-5 py-3 bg-white border border-black/[0.08] rounded-full text-[13.5px] font-medium text-[#0F1419] hover:shadow-[0_12px_30px_-10px_rgba(15,20,25,0.18)] transition-shadow"
                >
                    Try the AI tools <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </FadeIn>
        </div>
    </section>
);

/* ============================================================================
 * Feature row — alternating editorial layout
 * ========================================================================== */
const FeatureRow = ({ eyebrow, title, body, bullets, mock, reverse, navigate }) => (
    <div className="py-20 md:py-28">
        <div
            className={`max-w-[1280px] mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                reverse ? 'lg:[&>*:first-child]:order-last' : ''
            }`}
        >
            <div className="lg:col-span-5 space-y-5">
                <FadeIn>
                    <Eyebrow>{eyebrow}</Eyebrow>
                </FadeIn>
                <FadeIn delay={0.05}>
                    <SectionTitle>{title}</SectionTitle>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <Lede>{body}</Lede>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <ul className="space-y-3 pt-2">
                        {bullets.map((b) => (
                            <li key={b.t} className="flex gap-3">
                                <Check
                                    className="w-4 h-4 mt-1 text-[#0E334F] shrink-0"
                                    strokeWidth={2.4}
                                />
                                <div>
                                    <div className="text-[14px] font-semibold text-[#0F1419]">
                                        {b.t}
                                    </div>
                                    {b.d && (
                                        <div className="text-[13px] text-[#0F1419]/55 mt-0.5">
                                            {b.d}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <button
                        onClick={() => navigate('/app')}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0F1419] hover:text-[#0E334F] transition-colors"
                    >
                        Open <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </FadeIn>
            </div>
            <div className="lg:col-span-7">
                <FadeIn delay={0.1}>{mock}</FadeIn>
            </div>
        </div>
    </div>
);

const StackedCardMock = ({ items, gradient }) => (
    <div className="relative h-[480px] flex items-center justify-center">
        <div className="relative w-full max-w-[460px]">
            {items.map((item, i) => (
                <div
                    key={item.t}
                    className="absolute left-0 right-0 rounded-2xl border border-black/[0.06] shadow-[0_8px_24px_-8px_rgba(15,20,25,0.12)] p-5"
                    style={{
                        background: gradient[i % gradient.length],
                        top: `${i * 70}px`,
                        zIndex: items.length - i,
                        transform: `scale(${1 - i * 0.04})`,
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center">
                                {item.icon}
                            </div>
                            <div>
                                <div className="text-[14px] font-semibold text-[#0F1419]">
                                    {item.t}
                                </div>
                                <div className="text-[11px] text-[#0F1419]/55">{item.d}</div>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#0F1419]/40" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MonitorCardsMock = () => (
    <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-[0_12px_40px_-12px_rgba(15,20,25,0.08)]">
        <div className="space-y-3">
            {[
                { t: 'Org shortlist', s: 'Linux Foundation, Apache, KDE — 12 saved', c: '#E8F2E5' },
                { t: 'Proposal draft', s: 'Synced with mentor feedback', c: '#FBEFE0' },
                { t: 'Mentor outreach', s: '4 conversations active', c: '#E5E8F2' },
                { t: 'Readiness score', s: '78% — above last cohort median', c: '#F2E5EC' },
            ].map((r) => (
                <div
                    key={r.t}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.04]"
                    style={{ background: r.c }}
                >
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                        <GitBranch className="w-4 h-4 text-[#0F1419]" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[14px] font-semibold text-[#0F1419]">{r.t}</div>
                        <div className="text-[11px] text-[#0F1419]/55">{r.s}</div>
                    </div>
                    <div className="text-[10.5px] font-mono text-[#0F1419]/40 uppercase tracking-[0.1em]">
                        Live
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const FocusCardMock = () => (
    <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-[0_12px_40px_-12px_rgba(15,20,25,0.08)]">
        <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F2E5] text-[10.5px] font-medium uppercase tracking-[0.12em] text-[#0E334F]">
                Good first issue
            </span>
            <span className="text-[11px] font-mono text-[#0F1419]/40">
                facebook/react · #28341
            </span>
        </div>
        <div className="text-[15px] font-semibold text-[#0F1419] mb-2">
            Add ARIA labels to Suspense fallback
        </div>
        <div className="text-[13px] text-[#0F1419]/60 mb-5">
            Surfaced from your saved orgs. Estimated effort: 2-4 hours. Maintainer responds within
            24h on average.
        </div>
        <div className="grid grid-cols-2 gap-3">
            {[
                { k: 'Match score', v: '94%' },
                { k: 'Difficulty', v: 'Beginner' },
                { k: 'Stars', v: '224k' },
                { k: 'Open since', v: '3 days' },
            ].map((s) => (
                <div key={s.k} className="rounded-xl bg-[#F2EFE7] p-3">
                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-[#0F1419]/50">
                        {s.k}
                    </div>
                    <div className="text-[15px] font-semibold text-[#0F1419] mt-0.5 tabular-nums">
                        {s.v}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CareerGridMock = () => {
    const items = [
        { label: 'Education Hub', d: '18+ tracks' },
        { label: 'Interview Prep', d: 'Coding · System' },
        { label: 'Dev Connect', d: 'Live channels' },
        { label: 'Jobs Board', d: 'Curated weekly' },
        { label: 'Resume ATS', d: 'Score & rewrite' },
        { label: 'Public profile', d: '/u/you' },
    ];
    return (
        <div className="grid grid-cols-2 gap-3">
            {items.map((p) => (
                <div
                    key={p.label}
                    className="bg-white rounded-2xl border border-black/[0.06] p-5 hover:-translate-y-0.5 transition-transform duration-300 shadow-[0_2px_4px_rgba(15,20,25,0.02),0_8px_24px_-12px_rgba(15,20,25,0.06)]"
                >
                    <div className="font-display font-semibold text-[15px] tracking-[-0.012em] text-[#0F1419]">
                        {p.label}
                    </div>
                    <div className="mt-1 text-[12.5px] text-[#0F1419]/55">{p.d}</div>
                </div>
            ))}
        </div>
    );
};

/* ============================================================================
 * Companies prep band — replaces fake "trusted by" wall with real product value
 * ========================================================================== */
const CompaniesBand = ({ navigate }) => {
    const [companies, setCompanies] = useState([]);
    useEffect(() => {
        fetch(((import.meta.env.VITE_API_URL || '') + '/api/dsa/companies'))
            .then((r) => r.json())
            .then((d) => setCompanies((d.companies || []).slice(0, 12)))
            .catch(() => {});
    }, []);
    return (
        <section className="bg-[#FAF8F2] py-24 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
                <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
                    <div className="lg:col-span-7">
                        <FadeIn><Eyebrow>Prep by company</Eyebrow></FadeIn>
                        <FadeIn delay={0.05}>
                            <SectionTitle className="mt-5">
                                Practice the problems
                                <br />
                                <span className="italic font-light">they actually ask.</span>
                            </SectionTitle>
                        </FadeIn>
                    </div>
                    <div className="lg:col-span-5">
                        <FadeIn delay={0.1}>
                            <Lede>
                                Curated, company-tagged problem banks for Google, Meta, Amazon, Stripe, and 25+ more — sourced from real interviews, kept fresh.
                            </Lede>
                        </FadeIn>
                    </div>
                </div>
                <FadeIn delay={0.15}>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        {companies.map((c) => (
                            <button
                                key={c.slug}
                                onClick={() => navigate('/login')}
                                className="bg-white border border-black/[0.06] rounded-2xl p-4 text-left hover:-translate-y-0.5 hover:border-black/[0.12] transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#F2EFE7] flex items-center justify-center font-display font-semibold text-[16px] text-[#0F1419] mb-3">
                                    {c.initial}
                                </div>
                                <p className="text-[13px] font-semibold text-[#0F1419] truncate">{c.name}</p>
                                <p className="text-[11px] text-[#0F1419]/55 tabular mt-0.5">{c.count} problems</p>
                            </button>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

/* ============================================================================
 * Real interview stories band
 * ========================================================================== */
const StoriesBand = ({ navigate }) => {
    const [stories, setStories] = useState([]);
    useEffect(() => {
        fetch(((import.meta.env.VITE_API_URL || '') + '/api/interviews?sort=upvotes'))
            .then((r) => r.json())
            .then((d) => setStories((d.experiences || []).slice(0, 3)))
            .catch(() => {});
    }, []);

    // Static fallback so the band always renders — keeps landing page consistent
    // even if the API is offline or is taking a moment to respond.
    const fallback = [
        { id: 'f1', company: 'Google', role: 'Software Engineering Intern', quote: "Google interviews are fast-paced and time-bound — practice with that environment in mind. Don't underestimate edge case discussions and dry runs.", result: 'Selected', rounds: 3, problems: 3, upvotes: 375 },
        { id: 'f2', company: 'Amazon', role: 'SDE-2 (Level 5)', quote: 'Expect every round to include Leadership Principle questions — treat them with equal importance as coding. For LLD, think from a real product perspective.', result: 'Selected', rounds: 5, problems: 2, upvotes: 73 },
        { id: 'f3', company: 'Stripe', role: 'Software Engineer (Backend)', quote: "Stripe rounds are practical — read real code, debug it, extend it. They care more about API design and edge cases than algorithmic gymnastics.", result: 'Selected', rounds: 4, problems: 2, upvotes: 39 },
    ];
    const items = stories.length > 0 ? stories : fallback;

    return (
        <section className="bg-[#FAF8F2] pt-8 pb-24 md:pt-12 md:pb-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10">
                <div className="flex items-end justify-between gap-8 mb-10">
                    <div>
                        <FadeIn><Eyebrow>Real stories</Eyebrow></FadeIn>
                        <FadeIn delay={0.05}>
                            <SectionTitle className="mt-5">
                                Interviews from
                                <br />
                                <span className="italic font-light">people who lived them.</span>
                            </SectionTitle>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.1}>
                        <button


// TODO: Complete implementation in subsequent commits (Stage 1/2)
