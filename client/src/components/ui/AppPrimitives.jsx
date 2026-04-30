import React from 'react';

/**
 * AXIOM primitives — painterly editorial language.
 * Restraint, instant render, no entrance animations.
 * One signature moment per page (the page title). Hover affordances are subtle.
 */

/* ── Eyebrow / Kicker ──────────────────────────────────────────────────── */
export const Kicker = ({ children, className = '' }) => (
    <span
        className={`inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75 ${className}`}
    >
        <span className="inline-block w-3.5 h-px bg-foreground/30" />
        {children}
    </span>
);

/* ── PageHeader — eyebrow + display title with optional serif italic tail ── */
export const PageHeader = ({ eyebrow, title, tail, meta, action }) => (
    <header className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
            {eyebrow && (
                <div className="mb-3.5">
                    <Kicker>{eyebrow}</Kicker>
                </div>
            )}
            <h1 className="font-display font-semibold text-[30px] md:text-[38px] leading-[1.04] tracking-[-0.028em] text-foreground">
                {title}
                {tail && (
                    <span className="italic-accent text-foreground/85"> {tail}</span>
                )}
            </h1>
            {meta && (
                <p className="mt-3 text-[13.5px] text-muted-foreground tabular max-w-[560px] leading-relaxed">
                    {meta}
                </p>
            )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </header>
);

/* ── Section — small editorial header for grouped content ──────────────── */
export const Section = ({ label, eyebrow, action, children, className = '' }) => (
    <section className={`mb-14 ${className}`}>
        {(label || action || eyebrow) && (
            <div className="flex items-baseline justify-between gap-3 mb-5">
                <div>
                    {eyebrow && (
                        <div className="mb-1.5">
                            <Kicker>{eyebrow}</Kicker>
                        </div>
                    )}
                    {label && (
                        <h2 className="font-display font-semibold text-[18px] tracking-[-0.018em] text-foreground">
                            {label}
                        </h2>
                    )}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
        )}
        {children}
    </section>
);

/* ── Surface — flat card. Hover-lift opt-in. ───────────────────────────── */
export const Surface = ({ children, className = '', lift = false, ...props }) => (
    <div
        className={`relative rounded-2xl bg-card border ${lift ? 'hover-lift' : ''} ${className}`}
        style={{ borderColor: 'hsl(var(--hair))' }}
        {...props}
    >
        {children}
    </div>
);

/* ── TintedSurface — painterly fabric-tone card. Highlights & feature blocks ── */
const FABRIC = {
    sage:  { bg: 'bg-fabric-sage',  ink: '#0E334F' },
    peach: { bg: 'bg-fabric-peach', ink: '#7A4A1F' },
    mist:  { bg: 'bg-fabric-mist',  ink: '#0E334F' },
    rose:  { bg: 'bg-fabric-rose',  ink: '#7A1F4A' },
    sand:  { bg: 'bg-fabric-sand',  ink: '#3a2e2a' },
    teal:  { bg: 'bg-fabric-teal',  ink: '#0E334F' },
};
export const TintedSurface = ({ tone = 'sage', className = '', lift = false, children, ...props }) => {
    const t = FABRIC[tone] || FABRIC.sage;
    return (
        <div
            className={`relative rounded-2xl border ${t.bg} ${lift ? 'hover-lift' : ''} ${className}`}
            style={{ borderColor: 'hsl(var(--ink) / 0.06)' }}
            {...props}
        >
            {children}
        </div>
    );
};
TintedSurface.tones = Object.keys(FABRIC);

/* ── KpiTile — compact metric card ────────────────────────────────────── */
export const KpiTile = ({ label, value, hint, tone, lift = true }) => {
    const Wrapper = tone ? TintedSurface : Surface;
    const inkColor = tone && FABRIC[tone] ? FABRIC[tone].ink : undefined;
    return (
        <Wrapper tone={tone} lift={lift} className="p-5">
            <p
                className="text-[10.5px] font-semibold uppercase tracking-[0.16em] truncate"
                style={{ color: inkColor ? `${inkColor}99` : undefined }}
            >
                {!inkColor && <span className="text-muted-foreground/75">{label}</span>}
                {inkColor && label}
            </p>
            <p
                className="mt-3 font-display font-semibold text-[30px] leading-none tracking-[-0.025em] tabular"
                style={{ color: inkColor || 'hsl(var(--foreground))' }}
            >
                {value}
            </p>
            {hint && (
                <p
                    className="mt-2.5 text-[12px] truncate"
                    style={{ color: inkColor ? `${inkColor}aa` : 'hsl(var(--muted-foreground))' }}
                >
                    {hint}
                </p>
            )}
        </Wrapper>
    );
};

/* ── HeroTile — large editorial display card with eyebrow + display + accent ── */
export const HeroTile = ({ eyebrow, value, label, footnote, tone = 'sand', accent }) => {
    const t = FABRIC[tone] || FABRIC.sand;
    return (
        <TintedSurface tone={tone} lift className="p-7 lg:p-8 overflow-hidden">
            {eyebrow && (
                <p
                    className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-5"
                    style={{ color: `${t.ink}88` }}
                >
                    {eyebrow}
                </p>
            )}
            <div
                className="font-display font-semibold text-[56px] md:text-[68px] leading-[0.92] tracking-[-0.04em] tabular"
                style={{ color: t.ink }}
            >
                {value}
            </div>
            {label && (
                <p
                    className="mt-4 text-[15px] leading-snug"
                    style={{ color: `${t.ink}d0` }}
                >
                    {label}
                    {accent && <span className="italic-accent"> {accent}</span>}
                </p>
            )}
            {footnote && (
                <p
                    className="mt-3 text-[12px] tabular"
                    style={{ color: `${t.ink}90` }}
                >
                    {footnote}
                </p>
            )}
        </TintedSurface>
    );
};

/* ── EmptyState ─────────────────────────────────────────────────────────── */
export const EmptyState = ({ title, description, action }) => (
    <div className="px-6 py-16 text-center">
        {title && (
            <h3 className="font-display font-semibold text-[18px] tracking-[-0.015em] text-foreground mb-2">
                {title}
            </h3>
        )}
        {description && (
            <p className="text-[13.5px] text-muted-foreground max-w-[420px] mx-auto leading-relaxed">
                {description}
            </p>
        )}
        {action && <div className="mt-6">{action}</div>}
    </div>
);

/* ── PageShell — standard padding wrapper ─────────────────────────────── */
export const PageShell = ({ children, className = '', maxWidth = 'max-w-[1180px]' }) => (
    <div className={`px-5 sm:px-8 lg:px-14 py-8 lg:py-14 relative ${className}`}>
        <div className={`mx-auto ${maxWidth}`}>{children}</div>
    </div>
);

/* ── PainterlyHero — thin painterly cloud strip behind page header ─────── */
export const PainterlyHero = ({ children, height = 280, image }) => (
    <div className="relative overflow-hidden">
        <div
            className="absolute inset-x-0 top-0 pointer-events-none select-none"
            style={{
                height: `${height}px`,
                backgroundImage: image ? `url(${image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%',
                opacity: 0.32,
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%)',
            }}
        />
        <div className="relative z-10">{children}</div>
    </div>
);

export default {
    Kicker,
    PageHeader,
    Section,
    Surface,
    TintedSurface,
    KpiTile,
    HeroTile,
    EmptyState,
    PageShell,
    PainterlyHero,
};
