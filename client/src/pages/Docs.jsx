import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import {
    ArrowUpRight,
    Code2,
    GitBranch,
    Trophy,
    GraduationCap,
    Layers,
    Briefcase,
    MessagesSquare,
    Newspaper,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import PublicNavbar from '../components/PublicNavbar';
import skyClouds from '../assets/figma/sky-clouds.webp';
import footerLandscape from '../assets/figma/footer-landscape.webp';

const FOUNDATIONAL_DOCS = [
    {
        icon: Code2,
        title: 'DSA Tracker',
        description: '1,096 problems across 3 curated sheets — Babbar 450, Striver SDE, Striver A2Z. Heatmaps, streaks, spaced review.',
        href: '/app/dsa',
    },
    {
        icon: GitBranch,
        title: 'OSS Engine',
        description: 'Connect GitHub. Sync PR history. Get matched to good-first-issues that fit your stack and experience level.',
        href: '/app/oss',
    },
    {
        icon: Trophy,
        title: 'GSOC Accelerator',
        description: 'Timeline reminders, target organizations, readiness score, and a proposal builder for Google Summer of Code.',
        href: '/app/gsoc',
    },
    {
        icon: GraduationCap,
        title: 'Education Hub',
        description: 'Topic-driven learning across systems, web, ML, and theory. Video progress sync and curated reading lists.',
        href: '/app/education',
    },
    {
        icon: Layers,
        title: 'Interview Prep',
        description: 'Behavioral, system design, and DSA resources. Curated by category, tracked by completion.',
        href: '/app/interview',
    },
    {
        icon: MessagesSquare,
        title: 'Dev Connect',
        description: 'Real-time channels, member directory, project rooms — built for engineering students.',
        href: '/app/connect',
    },
    {
        icon: Briefcase,
        title: 'Jobs',
        description: 'Curated roles from Google, Meta, Stripe, Airbnb, Netflix, and more — refreshed daily.',
        href: '/app/jobs',
    },
    {
        icon: Newspaper,
        title: 'Posts',
        description: 'HN, Dev.to, Reddit, and AXIOM community feed in one developer-native stream.',
        href: '/app/posts',
    },
];

const TESTIMONIALS = [
    {
        quote: 'AXIOM replaced my Notion + LeetCode + Excel + Trello stack. Streaks alone changed my consistency for good.',
        name: 'Aarav Kumar',
        role: 'CS undergrad · IIT Bombay',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    },
    {
        quote: 'The OSS Engine matched me to a docs PR on day one. Three months later I had a GSOC offer from PostgreSQL.',
        name: 'Priya Iyer',
        role: 'GSOC \'25 · PostgreSQL',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    },
    {
        quote: 'Finally, a portfolio + ATS score that hiring managers actually take seriously. My response rate doubled.',
        name: 'Marcus Chen',
        role: 'SWE · Stripe (former IIIT)',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    },
];

const OPEN_ROLES = [
    {
        category: 'Engineering',
        items: [
            { title: 'Senior Full-stack Engineer', loc: 'Remote' },
            { title: 'Staff Backend Engineer', loc: 'Remote' },
            { title: 'Engineering Manager', loc: 'Onsite · Bangalore' },
        ],
    },
    {
        category: 'Design',
        items: [
            { title: 'Senior Product Designer', loc: 'Remote' },
            { title: 'Brand Designer', loc: 'Onsite · Bangalore' },
        ],
    },
    {
        category: 'Growth',
        items: [
            { title: 'Founding Growth Lead', loc: 'Remote' },
            { title: 'Developer Advocate', loc: 'Remote' },
        ],
    },
    {
        category: 'Other',
        items: [
            { title: 'Open application — anything else', loc: 'Remote · Onsite' },
        ],
    },
];

const Footer = () => {
    const cols = [
        { label: 'Product', items: [['Dashboard', '/app'], ['Pricing', '/pricing'], ['Documentation', '/docs']] },
        { label: 'Platform', items: [['DSA Tracker', '/app/dsa'], ['OSS Engine', '/app/oss'], ['GSOC', '/app/gsoc'], ['Education', '/app/education']] },
        { label: 'Career', items: [['Interview Prep', '/app/interview'], ['Jobs', '/app/jobs'], ['Profile', '/app/profile']] },
        { label: 'Community', items: [['Dev Connect', '/app/connect'], ['Posts', '/app/posts']] },
        { label: 'Company', items: [['About', '/docs'], ['Careers', '/docs#open-roles'], ['Contact', '#']] },
        { label: 'Resources', items: [['Documentation', '/docs'], ['Status', '#'], ['GitHub', 'https://github.com/Adi-gitX/AXIOM']] },
    ];
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
                        <div className="flex items-center gap-2 text-white">
                            <span className="font-display font-semibold text-[26px] tracking-[-0.02em]">axiom</span>
                            <span className="text-[18px]">✦</span>
                        </div>
                        <p className="mt-4 max-w-[280px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)', fontSize: '14px' }}>
                            The developer-native command center — built by students, for students.
                        </p>
                    </div>
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
                            {cols.map((col) => (
                                <div key={col.label}>
                                    <div className="text-white font-normal mb-4" style={{ fontSize: '18px', lineHeight: '28px', letterSpacing: '-0.005em' }}>
                                        {col.label}
                                    </div>
                                    <ul className="space-y-2.5">
                                        {col.items.map(([label, href]) => {
                                            const isExternal = href.startsWith('http');
                                            return (
                                                <li key={label}>
                                                    <a
                                                        href={href}
                                                        target={isExternal ? '_blank' : undefined}
                                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                                        className="hover:text-white transition-colors"
                                                        style={{ color: 'rgba(255,255,255,0.82)', fontSize: '14.5px', lineHeight: '22px' }}
                                                    >
                                                        {label}
                                                    </a>
                                                </li>
                                            );
                                        })}
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
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                        <a href="#" className="hover:text-white">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const Docs = () => {
    const navigate = useNavigate();

    return (
        <ReactLenis root options={{ lerp: 0.05 }}>
            <div className="min-h-screen bg-[#FAF8F2] font-sans text-[#0F1419]">
                <SEOHead
                    title="Documentation"
                    description="AXIOM documentation — the developer-native career platform. Learn how DSA Tracker, OSS Engine, GSOC Accelerator, and Education Hub work together."
                    path="/docs"
                />
                <PublicNavbar />

                {/* HERO */}
                <section className="relative w-full overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={skyClouds}
                            alt=""
                            aria-hidden
                            className="w-full h-full object-cover object-center select-none pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF8F2]" />
                    </div>

                    <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24 md:pb-32">
                        <p className="font-serif italic font-light text-[#0F1419]/75 text-[18px] md:text-[20px] mb-5">
                            A letter from our founders
                        </p>
                        <h1 className="font-display font-semibold text-[44px] md:text-[68px] lg:text-[84px] leading-[0.98] tracking-[-0.03em] text-[#0F1419] max-w-[900px]">
                            Building a unique
                            <br />
                            <span className="font-serif italic font-light">company.</span>
                        </h1>

                        <div className="mt-12 max-w-[640px] space-y-5 text-[15.5px] md:text-[16px] leading-[1.7] text-[#0F1419]/85">
                            <p className="font-serif italic">Dear future colleague, or other readers,</p>
                            <p>
                                We started AXIOM because we lived through the pain ourselves. As CS students juggling
                                LeetCode in one tab, GitHub in another, Notion for notes, and a spreadsheet for jobs,
                                we wasted more time switching context than actually building anything.
                            </p>
                            <p>
                                AXIOM is the <span className="font-semibold">command center we wished existed</span> —
                                a single workspace where DSA, open-source, GSOC, education, interviews, and career
                                moves live together. Tracked. Connected. Yours.
                            </p>
                            <p>
                                We are deliberate about <span className="font-semibold">restraint</span>. Every screen
                                here is rendered in milliseconds. Every keystroke matters. Every feature exists because
                                a real student needed it. There is no fluff.
                            </p>
                            <p>
                                If this resonates, we&apos;d love your help — as a user, contributor, or future colleague.
                            </p>
                            <p className="font-serif italic text-[#0F1419]/75">— Aditya & the AXIOM team</p>
                        </div>
                    </div>
                </section>

                {/* FOUNDATIONAL DOCUMENTS */}
                <section className="relative w-full bg-[#FAF8F2]">
                    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-28">
                        <div className="mb-12 max-w-[700px]">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0F1419]/55 mb-4">
                                Foundational documents
                            </p>
                            <h2 className="font-display font-semibold text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.025em] text-[#0F1419]">
                                The eight pillars of <span className="font-serif italic font-light">AXIOM.</span>
                            </h2>
                            <p className="mt-5 text-[15px] text-[#0F1419]/65 leading-relaxed">
                                Everything below is shipping today. Built thoughtfully, tested by real students,
                                and tied together by a single source of truth — your AXIOM workspace.
                            </p>
                        </div>

                        <div className="border-t border-[#0F1419]/10">
                            {FOUNDATIONAL_DOCS.map((doc) => {
                                const Icon = doc.icon;
                                return (
                                    <button
                                        key={doc.title}
                                        type="button"
                                        onClick={() => navigate(doc.href)}
                                        data-testid={`doc-card-${doc.title.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="w-full group flex items-center gap-6 py-6 md:py-7 border-b border-[#0F1419]/10 hover:bg-[#F2EFE7] transition-colors text-left px-2 md:px-4"
                                    >
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                                            style={{ backgroundColor: 'hsl(var(--paper-soft))', borderColor: 'rgba(15,20,25,0.08)' }}
                                        >
                                            <Icon className="w-[18px] h-[18px] text-[#0F1419]" strokeWidth={1.7} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-display font-semibold text-[18px] md:text-[19px] tracking-[-0.012em] text-[#0F1419]">
                                                {doc.title}
                                            </p>
                                            <p className="mt-1 text-[13.5px] md:text-[14px] text-[#0F1419]/65 leading-relaxed">
                                                {doc.description}
                                            </p>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-[#0F1419]/40 group-hover:text-[#0F1419] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* SOCIAL PROOF */}
                <section className="bg-[#FAF8F2]">
                    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-12 md:py-16 border-t border-[#0F1419]/10">
                        <p className="text-[14px] text-[#0F1419]/65 max-w-[680px]">
                            Built and used by students from <span className="font-semibold text-[#0F1419]">IIT Bombay, IIIT Hyderabad, NIT Trichy, BITS Pilani, IIT Madras</span> — and engineers shipping at Stripe, Linear, Vercel, and beyond.
                        </p>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="bg-[#FAF8F2]">
                    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-28">
                        <div className="mb-12 max-w-[700px]">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0F1419]/55 mb-4">
                                Voices from the community
                            </p>
                            <h2 className="font-display font-semibold text-[34px] md:text-[42px] leading-[1.05] tracking-[-0.025em] text-[#0F1419]">
                                Real engineers,
                                <span className="font-serif italic font-light"> real momentum.</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {TESTIMONIALS.map((t) => (
                                <div
                                    key={t.name}
                                    className="rounded-2xl bg-card border p-7 flex flex-col"
                                    style={{ borderColor: 'rgba(15,20,25,0.08)' }}
                                >
                                    <p className="font-serif text-[18px] leading-[1.45] text-[#0F1419]/90 flex-1">
                                        &quot;{t.quote}&quot;
                                    </p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <div
                                            className="w-9 h-9 rounded-full overflow-hidden border shrink-0 bg-[#F2EFE7]"
                                            style={{ borderColor: 'rgba(15,20,25,0.08)' }}
                                        >
                                            <img src={t.avatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[13.5px] font-semibold text-[#0F1419]">{t.name}</p>
                                            <p className="text-[12px] text-[#0F1419]/60">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* OPEN ROLES */}
                <section id="open-roles" className="bg-[#FAF8F2]">
                    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-28 border-t border-[#0F1419]/10">
                        <div className="mb-12 max-w-[700px]">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0F1419]/55 mb-4">
                                Open positions
                            </p>
                            <h2 className="font-display font-semibold text-[34px] md:text-[42px] leading-[1.05] tracking-[-0.025em] text-[#0F1419]">
                                Come build with us — <span className="font-serif italic font-light">we&apos;d love your help.</span>
                            </h2>
                        </div>

                        <div className="space-y-12">
                            {OPEN_ROLES.map((cat) => (
                                <div key={cat.category}>
                                    <div className="mb-3 pb-3 border-b border-[#0F1419]/10">
                                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0F1419]/55">
                                            {cat.category}
                                        </p>
                                    </div>
                                    <div>
                                        {cat.items.map((role) => (
                                            <a
                                                key={role.title}
                                                href="mailto:hello@axiom.dev"
                                                className="flex items-center justify-between gap-4 py-4 border-b border-[#0F1419]/8 group hover:px-2 transition-all"
                                            >
                                                <p className="text-[15px] md:text-[16px] text-[#0F1419] group-hover:opacity-70 transition-opacity">
                                                    {role.title}
                                                </p>
                                                <span className="text-[12px] font-mono uppercase tracking-[0.08em] text-[#0F1419]/55 shrink-0">
                                                    {role.loc}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEEDBACK */}
                <section className="bg-[#FAF8F2]">
                    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-24 border-t border-[#0F1419]/10">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0F1419]/55 mb-4">
                            Feedback
                        </p>
                        <h2 className="font-display font-semibold text-[28px] md:text-[34px] leading-[1.1] tracking-[-0.02em] text-[#0F1419] max-w-[760px]">
                            Have thoughts on AXIOM, found a bug, or want to share your story?
                        </h2>
                        <p className="mt-5 text-[15px] text-[#0F1419]/70 max-w-[640px] leading-relaxed">
                            We read every message.{' '}
                            <a
                                href="mailto:hello@axiom.dev"
                                className="text-[#0F1419] underline underline-offset-4 decoration-[#0F1419]/30 hover:decoration-[#0F1419]"
                            >
                                hello@axiom.dev
                            </a>
                            {' '}— or open an issue on{' '}
                            <a
                                href="https://github.com/Adi-gitX/AXIOM"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0F1419] underline underline-offset-4 decoration-[#0F1419]/30 hover:decoration-[#0F1419]"
                            >
                                GitHub
                            </a>
                            .
                        </p>
                    </div>
                </section>

                {/* FOOTER */}
                <Footer />
            </div>
        </ReactLenis>
    );
};

export default Docs;
