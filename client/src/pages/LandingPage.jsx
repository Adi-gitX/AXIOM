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
                        portfolio — all in one app. Replaces 6+ tools you&apos;ve been duct-taping together.
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
                    &quot;I built AXIOM because I was juggling LeetCode, GitHub, a Notion tracker, three
                    Discord servers, and a half-broken Chrome extension just to stay consistent.
                    <span className="italic"> One app. One workflow. Free forever.</span>&quot;
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
                            onClick={() => navigate('/login')}
                            className="hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0F1419] hover:text-[#0E334F] transition-colors"
                        >
                            All stories →
                        </button>
                    </FadeIn>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                    {items.map((s) => (
                        <FadeIn key={s.id} delay={0.1}>
                            <div className="bg-white border border-black/[0.06] rounded-2xl p-5 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#F2EFE7] flex items-center justify-center font-display font-semibold text-[16px] text-[#0F1419]">
                                        {s.company.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-display font-semibold text-[14px] tracking-[-0.01em] text-[#0F1419] truncate">{s.company}</p>
                                        <p className="text-[11.5px] text-[#0F1419]/55 truncate">{s.role}</p>
                                    </div>
                                </div>
                                <p className="text-[13px] text-[#0F1419]/75 leading-relaxed line-clamp-4 flex-1">&quot;{s.quote}&quot;</p>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/[0.06]">
                                    <span className={`text-[10.5px] font-semibold uppercase tracking-[0.1em] ${s.result === 'Selected' ? 'text-[#0E334F]' : s.result === 'Rejected' ? 'text-[#9C2A1F]' : 'text-[#0F1419]/60'}`}>
                                        {s.result} · {s.rounds}r · {s.problems}p
                                    </span>
                                    <span className="text-[11px] text-[#0F1419]/55 tabular">▲ {s.upvotes}</span>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ============================================================================
 * Open-source band
 * ========================================================================== */
const OpenSourceBand = ({ navigate }) => (
    <section className="bg-[#FAF8F2] py-24 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
                <FadeIn>
                    <Eyebrow>Open by default</Eyebrow>
                </FadeIn>
                <FadeIn delay={0.05}>
                    <SectionTitle className="mt-5">
                        MIT licensed. <span className="italic font-light">Yours forever.</span>
                    </SectionTitle>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <Lede className="mt-5 max-w-[480px]">
                        Source on GitHub. Self-host on your own server. Export your data any time.
                        No telemetry, no dark patterns, no premium-tier paywalls hiding the good stuff.
                    </Lede>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <div className="mt-7 flex items-center gap-3">
                        <a
                            href="https://github.com/Adi-gitX/AXIOM"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0F1419] text-[#FAF8F2] rounded-full text-[13.5px] font-medium hover:bg-[#0E334F] transition-colors"
                        >
                            <Github className="w-4 h-4" strokeWidth={1.7} />
                            View source
                        </a>
                        <button
                            onClick={() => navigate('/docs')}
                            className="inline-flex items-center gap-1 px-4 py-2.5 text-[13.5px] font-medium text-[#0F1419] hover:text-[#0E334F] transition-colors"
                        >
                            Self-host guide →
                        </button>
                    </div>
                </FadeIn>
            </div>
            <div className="md:col-span-5 grid grid-cols-3 gap-3">
                {[
                    { t: 'MIT', d: 'Licensed' },
                    { t: 'Self', d: 'Hostable' },
                    { t: 'No', d: 'Tracking' },
                ].map((c) => (
                    <FadeIn key={c.t} delay={0.1}>
                        <div className="bg-white rounded-2xl border border-black/[0.05] aspect-square flex flex-col items-center justify-center text-center px-3 shadow-[0_2px_4px_rgba(15,20,25,0.02)] hover:-translate-y-1 transition-transform duration-500">
                            <div className="font-display font-semibold text-[28px] tracking-[-0.025em] text-[#0F1419] leading-none">
                                {c.t}
                            </div>
                            <div className="mt-1.5 text-[11.5px] uppercase tracking-[0.14em] text-[#0F1419]/55">
                                {c.d}
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </div>
    </section>
);

/* ============================================================================
 * Changelog teaser — anchor target for nav
 * ========================================================================== */
const ChangelogTeaser = ({ navigate }) => {
    const entries = [
        { date: 'Feb 2026', tag: 'New', t: 'Command palette (⌘K)', d: 'Jump anywhere with a single shortcut.' },
        { date: 'Feb 2026', tag: 'Improved', t: 'Painterly editorial theme', d: 'Light, paper-warm aesthetic across every page.' },
        { date: 'Jan 2026', tag: 'New', t: 'GSOC Accelerator', d: 'Org explorer, proposal drafts, and a live readiness score.' },
    ];
    return (
        <section id="changelog" className="bg-[#FAF8F2] py-24">
            <div className="max-w-[1080px] mx-auto px-6 md:px-10">
                <div className="flex items-end justify-between gap-8 mb-12">
                    <div>
                        <FadeIn>
                            <Eyebrow>Changelog</Eyebrow>
                        </FadeIn>
                        <FadeIn delay={0.05}>
                            <SectionTitle className="mt-4">Shipping every week.</SectionTitle>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.1}>
                        <button
                            onClick={() => navigate('/docs')}
                            className="hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0F1419] hover:text-[#0E334F] transition-colors"
                        >
                            All updates <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </FadeIn>
                </div>
                <ul className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
                    {entries.map((e, i) => (
                        <FadeIn key={e.t} delay={i * 0.06}>
                            <li className="py-5 grid grid-cols-12 gap-4 items-baseline">
                                <div className="col-span-3 sm:col-span-2 text-[12px] font-mono uppercase tracking-[0.1em] text-[#0F1419]/50 tabular-nums">
                                    {e.date}
                                </div>
                                <div className="col-span-2 sm:col-span-2">
                                    <span
                                        className={`inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-medium uppercase tracking-[0.1em] ${
                                            e.tag === 'New'
                                                ? 'bg-[#E8F2E5] text-[#0E334F]'
                                                : 'bg-[#F2EFE7] text-[#0F1419]/65'
                                        }`}
                                    >
                                        {e.tag}
                                    </span>
                                </div>
                                <div className="col-span-7 sm:col-span-8">
                                    <div className="font-display font-semibold text-[16.5px] tracking-[-0.015em] text-[#0F1419]">
                                        {e.t}
                                    </div>
                                    <div className="mt-0.5 text-[13px] text-[#0F1419]/60">
                                        {e.d}
                                    </div>
                                </div>
                            </li>
                        </FadeIn>
                    ))}
                </ul>
            </div>
        </section>
    );
};

/* ============================================================================
 * Final CTA
 * ========================================================================== */
const FinalCTA = ({ navigate }) => (
    <section className="bg-[#FAF8F2] pt-8 pb-28">
        <div className="max-w-[920px] mx-auto px-6 md:px-10 text-center">
            <FadeIn>
                <SectionTitle>
                    Ship something real.
                    <br />
                    <span className="italic font-light">Starting tonight.</span>
                </SectionTitle>
            </FadeIn>
            <FadeIn delay={0.1}>
                <p className="mt-6 text-[15.5px] text-[#0F1419]/60 max-w-[480px] mx-auto">
                    Free forever. No credit card. Sign in with email or GitHub and pick up where
                    your last unfinished side project left off.
                </p>
            </FadeIn>
            <FadeIn delay={0.18}>
                <button
                    onClick={() => navigate('/signup')}
                    className="mt-9 px-7 py-3.5 bg-[#0F1419] text-[#FAF8F2] rounded-full text-[14.5px] font-medium hover:bg-[#0E334F] transition-colors shadow-[0_8px_24px_rgba(15,20,25,0.16)]"
                >
                    Create your account
                </button>
            </FadeIn>
        </div>
    </section>
);

/* ============================================================================
 * Footer (with painterly landscape) — kept as-is, polished naming
 * ========================================================================== */
const Footer = ({ navigate }) => {
    const cols = [
        {
            label: 'Product',
            items: [
                { label: 'Dashboard', to: '/app' },
                { label: 'DSA Tracker', to: '/app/dsa' },
                { label: 'OSS Engine', to: '/app/oss' },
                { label: 'GSOC', to: '/app/gsoc' },
            ],
        },
        {
            label: 'Career',
            items: [
                { label: 'Education Hub', to: '/app/education' },
                { label: 'Interview Prep', to: '/app/interview' },
                { label: 'Jobs Board', to: '/app/jobs' },
                { label: 'Posts Feed', to: '/app/posts' },
            ],
        },
        {
            label: 'Community',
            items: [
                { label: 'Dev Connect', to: '/app/connect' },
                { label: 'Public profiles', to: '/app/profile' },
                { label: 'Discord', to: '#' },
            ],
        },
        {
            label: 'Resources',
            items: [
                { label: 'Documentation', to: '/docs' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'Changelog', to: '/#changelog' },
                { label: 'Status', to: '#' },
            ],
        },
        {
            label: 'Company',
            items: [
                { label: 'About', to: '#' },
                { label: 'Contact', to: '#' },
                { label: 'Press kit', to: '#' },
            ],
        },
        {
            label: 'Open source',
            items: [
                { label: 'GitHub', to: 'https://github.com/Adi-gitX/AXIOM', external: true },
                { label: 'License (MIT)', to: '#' },
                { label: 'Self-host', to: '/docs' },
                { label: 'Contribute', to: '#' },
            ],
        },
    ];
    const handleClick = (e, to, external) => {
        if (external || to.startsWith('http')) return;
        if (to.startsWith('/#')) {
            e.preventDefault();
            const id = to.slice(2);
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (to.startsWith('#')) return;
        e.preventDefault();
        navigate(to);
    };
    return (
        <footer
            className="relative w-full overflow-hidden bg-[#46838b]"
            style={{ aspectRatio: '1920 / 720', minHeight: '560px' }}
        >
            <img
                src={footerLandscape}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                style={{ objectPosition: 'center 28%' }}
            />

            <div
                className="absolute top-0 left-6 right-6 md:left-10 md:right-10 z-10 pointer-events-none"
                style={{ height: '1px', background: 'rgba(255,255,255,0.18)' }}
            />

            <div className="absolute inset-x-0 top-0 z-10 px-6 md:px-10 lg:px-16 pt-14 md:pt-16 lg:pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-12">
                    <div className="lg:col-span-3 lg:pr-6">
                        <div className="flex items-baseline gap-1.5 text-white">
                            <span className="font-display font-semibold text-[26px] tracking-[-0.025em]">
                                axiom
                            </span>
                            <span className="font-serif italic text-[14px] text-white/60">/dev</span>
                        </div>
                        <p
                            className="mt-4 max-w-[280px] leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.78)', fontSize: '14px' }}
                        >
                            The career platform for engineers who ship — built by students, for
                            students, open-source forever.
                        </p>
                    </div>

                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
                            {cols.map((col) => (
                                <div key={col.label}>
                                    <div
                                        className="text-white font-normal mb-4"
                                        style={{
                                            fontSize: '17px',
                                            lineHeight: '24px',
                                            letterSpacing: '-0.005em',
                                        }}
                                    >
                                        {col.label}
                                    </div>
                                    <ul className="space-y-2.5">
                                        {col.items.map((it) => (
                                            <li key={it.label}>
                                                <a
                                                    href={it.to}
                                                    onClick={(e) =>
                                                        handleClick(e, it.to, it.external)
                                                    }
                                                    target={it.external ? '_blank' : undefined}
                                                    rel={
                                                        it.external
                                                            ? 'noopener noreferrer'
                                                            : undefined
                                                    }
                                                    className="hover:text-white transition-colors"
                                                    style={{
                                                        color: 'rgba(255,255,255,0.82)',
                                                        fontSize: '14px',
                                                        lineHeight: '22px',
                                                    }}
                                                >
                                                    {it.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 md:bottom-7 left-6 right-6 md:left-10 md:right-10 lg:left-16 lg:right-16 z-10">
                <div
                    className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-5 border-t"
                    style={{
                        borderColor: 'rgba(255,255,255,0.18)',
                        color: 'rgba(255,255,255,0.78)',
                        fontSize: '13.5px',
                        lineHeight: '20px',
                    }}
                >
                    <span>© AXIOM 2026 — All rights reserved.</span>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="hover:text-white" data-testid="footer-privacy">
                            Privacy
                        </a>
                        <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="hover:text-white" data-testid="footer-terms">
                            Terms
                        </a>
                        <a href="#" className="hover:text-white" data-testid="footer-security">
                            Security
                        </a>
                        <a
                            href="https://github.com/Adi-gitX/AXIOM"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white inline-flex items-center gap-1.5"
                            data-testid="footer-github"
                        >
                            <Github className="w-3.5 h-3.5" />
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

/* ============================================================================
 * Page
 * ========================================================================== */
const CodeLabMock = () => (
    <div className="bg-[#FCFBF7] rounded-3xl border border-black/[0.06] overflow-hidden shadow-[0_12px_40px_-12px_rgba(15,20,25,0.10)]">
        {/* toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/[0.05] bg-white/60">
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-black/[0.04]">
                <span className="px-2 py-0.5 rounded bg-white text-[11px] font-medium text-[#0F1419] shadow-sm">Python</span>
                <span className="px-2 py-0.5 text-[11px] text-[#0F1419]/50">JS</span>
                <span className="px-2 py-0.5 text-[11px] text-[#0F1419]/50">TS</span>
            </div>
            <div className="flex-1" />
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#E8F2E5] text-[10.5px] font-medium text-[#0E334F]">
                <Activity className="w-3 h-3" /> Visualize
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0E334F] text-[10.5px] font-semibold text-white">
                <Play className="w-3 h-3" /> Run
            </span>
        </div>
        <div className="grid grid-cols-2">
            {/* editor */}
            <div className="p-4 font-mono text-[11px] leading-[1.7] border-r border-black/[0.05]">
                {[
                    <span key="1"><span className="text-[#0E5A6B]">def</span> <span className="text-[#0E334F] font-semibold">solve</span>(nums, target):</span>,
                    <span key="2">    seen = {'{}'}</span>,
                    <span key="3"><span className="text-[#0E5A6B]">for</span> i, v <span className="text-[#0E5A6B]">in</span> <span className="text-[#0E334F]">enumerate</span>(nums):</span>,
                    <span key="4">        c = target - v</span>,
                    <span key="5"><span className="text-[#0E5A6B]">if</span> c <span className="text-[#0E5A6B]">in</span> seen:</span>,
                    <span key="6"><span className="text-[#0E5A6B]">return</span> [seen[c], i]</span>,
                ].map((line, i) => (
                    <div key={i} className={`flex gap-3 -mx-1 px-1 rounded ${i === 2 ? 'bg-[#2E7D7A]/14 shadow-[inset_2px_0_0_#2E7D7A]' : ''}`}>
                        <span className="text-[#0F1419]/25 w-3 text-right select-none">{i + 1}</span>
                        <span className="text-[#16263a] whitespace-pre">{line}</span>
                    </div>
                ))}
            </div>
            {/* visualizer */}
            <div className="p-4 bg-white/40">
                <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0F1419]/45 mb-1.5">L3 · executing</div>
                <div className="text-[10px] font-mono text-[#7A1F4A] mb-1">nums</div>
                <div className="flex gap-px mb-3">
                    {[2, 7, 11, 15].map((n, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className={`min-w-[26px] px-1.5 py-1 text-center font-mono text-[11px] border ${i === 1 ? 'bg-[#E8F2E5] border-[#2E7D7A]' : 'bg-white border-black/[0.08]'}`}>{n}</div>
                            <span className="text-[8px] font-mono text-[#0F1419]/35 mt-0.5">{i}</span>
                        </div>
                    ))}
                </div>
                <div className="text-[10px] font-mono text-[#7A1F4A] mb-1">seen</div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] mb-3">
                    <span className="px-1.5 py-0.5 rounded bg-black/[0.05] text-[#7A4A1F]">2</span>
                    <span className="text-[#0F1419]/40">→</span>
                    <span className="text-[#16263a]">0</span>
                </div>
                <div className="text-[10px] font-mono"><span className="text-[#7A1F4A]">i</span> <span className="text-[#0F1419]/40">=</span> <span className="text-[#7A4A1F]">1</span></div>
            </div>
        </div>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div
            data-testid="landing-page"
            className="bg-[#FAF8F2] text-[#0F1419] font-sans antialiased selection:bg-[#0E334F] selection:text-[#FAF8F2]"
        >
            <SEOHead
                title="AXIOM — The career platform for engineers who ship."
                description="Track DSA streaks, find your first OSS contribution, prep GSOC, and ship a public portfolio — all in one open-source app."
                path="/"
            />
            <PublicNavbar />
            <Hero navigate={navigate} />
            <InsideStrip />
            <RealNumbers />
            <FounderNote />
            <AIBand navigate={navigate} />

            <FeatureRow
                navigate={navigate}
                eyebrow="DSA Engine"
                title={
                    <>
                        Master 1,096 problems
                        <br />
                        <span className="italic font-light">across three legendary sheets.</span>
                    </>
                }
                body="Babbar 450, Striver SDE, and Striver A2Z — unified into one searchable index with spaced repetition baked in."
                bullets={[
                    {
                        t: '99 distinct topics',
                        d: 'From arrays and graphs to dynamic programming and system design — every track from beginner to FAANG-ready.',
                    },
                    { t: 'Spaced-repetition scheduling' },
                    { t: 'Difficulty progression curves' },
                    { t: 'Custom practice plans' },
                ]}
                mock={
                    <StackedCardMock
                        gradient={['#EFE6FF', '#FFE6E6', '#E6F4FF', '#FFF4E6', '#E6FFE6']}
                        items={[
                            {
                                t: 'Daily streak',
                                d: '47 days active',
                                icon: <Code2 className="w-4 h-4 text-[#0F1419]" />,
                            },
                            {
                                t: 'Striver SDE Sheet',
                                d: '142 / 191 solved',
                                icon: <Layers className="w-4 h-4 text-[#0F1419]" />,
                            },
                            {
                                t: 'Babbar 450',
                                d: '88 / 450 solved',
                                icon: <Briefcase className="w-4 h-4 text-[#0F1419]" />,
                            },
                            {
                                t: 'GitHub commits',
                                d: '14 this week',
                                icon: <GitBranch className="w-4 h-4 text-[#0F1419]" />,
                            },
                            {
                                t: 'Public profile',
                                d: 'axiom.dev/u/you',
                                icon: <GraduationCap className="w-4 h-4 text-[#0F1419]" />,
                            },
                        ]}
                    />
                }
            />

            <FeatureRow
                navigate={navigate}
                reverse
                eyebrow="Code Lab"
                title={
                    <>
                        Don’t just track problems —
                        <br />
                        <span className="italic font-light">solve and see them run.</span>
                    </>
                }
                body="A full code editor in your browser. Write Python, JavaScript, or TypeScript, run against real test cases, and watch your algorithm execute step by step — arrays, variables, and the call stack, animated."
                bullets={[
                    {
                        t: 'Runs entirely in your browser',
                        d: 'Python, JS, and TS execute in a sandboxed Web Worker — no setup, no servers, instant.',
                    },
                    { t: 'Algorithm visualizer with step-through' },
                    { t: 'Curated problems with hidden test cases' },
                    { t: 'Built-in AI tutor: hints, explain, debug' },
                ]}
                mock={<CodeLabMock />}
            />

            <FeatureRow
                navigate={navigate}
                eyebrow="OSS Engine"
                title={
                    <>
                        Turn GitHub activity
                        <br />
                        <span className="italic font-light">into career momentum.</span>
                    </>
                }
                body="OAuth-sync your contributions, surface beginner-friendly issues across 200+ orgs, and watch the heatmap fill itself."
                bullets={[
                    {
                        t: 'Contribution graph',
                        d: 'Real-time sync from your GitHub — no manual tracking, ever.',
                    },
                    { t: 'Issue finder across 200+ orgs' },
                    { t: 'PR review tracker' },
                    { t: 'Maintainer outreach' },
                ]}
                mock={<FocusCardMock />}
            />

            <FeatureRow
                navigate={navigate}
                reverse
                eyebrow="GSOC Accelerator"
                title={
                    <>
                        Know exactly
                        <br />
                        <span className="italic font-light">where you stand.</span>
                    </>
                }
                body="Org explorer, proposal drafts, mentor-outreach tracker, and a readiness score that updates with every commit you push."
                bullets={[
                    {
                        t: 'Timeline tracker',
                        d: 'From org shortlist through coding period — never miss a deadline.',
                    },
                    { t: 'Proposal review against past acceptances' },
                    { t: 'Mentor outreach pipeline' },
                    { t: 'Live readiness score' },
                ]}
                mock={<MonitorCardsMock />}
            />

            <FeatureRow
                navigate={navigate}
                eyebrow="Career Platform"
                title={
                    <>
                        From practice
                        <br />
                        <span className="italic font-light">to your first offer.</span>
                    </>
                }
                body="Education Hub, Interview Prep, Dev Connect, Jobs Board, and a public portfolio — every stage of your career, one platform."
                bullets={[
                    {
                        t: '18+ curated education tracks',
                        d: 'React, Node, DevOps, ML, System Design — taught by the best creators only.',
                    },
                    { t: 'Interview Prep + ATS-scored resume' },
                    { t: 'Real-time Dev Connect chat' },
                    { t: 'Public portfolio at /u/you' },
                ]}
                mock={<CareerGridMock />}
            />

            <ChangelogTeaser navigate={navigate} />
            <CompaniesBand navigate={navigate} />
            <StoriesBand navigate={navigate} />
            <OpenSourceBand navigate={navigate} />
            <FinalCTA navigate={navigate} />
            <Footer navigate={navigate} />
        </div>
    );
};

export default LandingPage;
