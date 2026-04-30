import React from 'react';
import SEOHead from '../components/SEOHead';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const FREE_FEATURES = [
    'Dashboard with DSA heatmap, streak, weekly activity',
    'DSA tracker — all 1,096 problems across 3 curated sheets',
    'OSS contribution engine + good-first-issue matcher',
    'GSOC accelerator — timeline, orgs, readiness score',
    'Education Hub, Interview Prep, Dev Connect',
    'Public portfolio with ATS score',
];

const PRO_FEATURES = [
    'Unlimited AI suggestions for DSA, OSS, and interviews',
    'Advanced analytics — momentum diagnostics, weekly trends',
    'Mock interviews with Gemini / Claude (voice + text)',
    'Priority OSS issue matching',
    'Private collaboration rooms in Dev Connect',
    'Resume builder + ATS auto-scoring',
];

const Card = ({ kicker, price, period, description, features, primary, ctaLabel, onCta }) => (
    <div className="rounded-2xl bg-card border p-8 lg:p-10 flex flex-col" style={{ borderColor: 'hsl(var(--hair))' }}>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-4">{kicker}</p>
        <div className="flex items-baseline gap-1.5">
            <h2 className="font-display font-semibold text-[42px] leading-none tracking-[-0.025em] text-foreground tabular">{price}</h2>
            {period && <span className="text-[14px] text-muted-foreground">{period}</span>}
        </div>
        <p className="text-[14px] text-muted-foreground mt-3 leading-relaxed">{description}</p>

        <ul className="mt-8 space-y-3.5 flex-1">
            {features.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-foreground/85">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: primary ? 'hsl(var(--teal))' : 'hsl(var(--ink))' }} strokeWidth={2.4} />
                    <span>{item}</span>
                </li>
            ))}
        </ul>

        <button
            type="button"
            onClick={onCta}
            className={`mt-8 w-full h-11 rounded-full text-[13.5px] font-semibold transition-colors ${primary ? 'bg-foreground text-background hover:opacity-90' : 'bg-card border hover:border-foreground/20 text-foreground'}`}
            style={!primary ? { borderColor: 'hsl(var(--hair))' } : {}}
        >
            {ctaLabel}
        </button>
    </div>
);

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <ReactLenis root options={{ lerp: 0.05 }}>
            <div className="min-h-screen bg-background font-sans pb-24">
                <SEOHead
                    title="Pricing"
                    description="AXIOM pricing — Free Forever plan with full DSA tracking, OSS engine, GSOC accelerator. Pro plan unlocks AI features and advanced analytics."
                    path="/pricing"
                />
                <PublicNavbar />

                <div className="pt-32 lg:pt-40 px-6 text-center max-w-[820px] mx-auto mb-14">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-5">
                        Pricing
                    </p>
                    <h1 className="font-display font-semibold text-[42px] md:text-[58px] leading-[1.05] tracking-[-0.025em] text-foreground">
                        Free forever — Pro
                        <br />
                        <span className="font-serif italic font-light text-foreground/65">when you're ready.</span>
                    </h1>
                    <p className="mt-6 text-[15.5px] text-muted-foreground max-w-[560px] mx-auto leading-relaxed">
                        Keep the full learning stack free for life. Upgrade only for AI-heavy workflows and deeper analytics.
                    </p>
                </div>

                <div className="max-w-[920px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                        kicker="Free forever"
                        price="$0"
                        period="/ month"
                        description="Everything students need to learn and track real progress. No card required."
                        features={FREE_FEATURES}
                        primary={false}
                        ctaLabel="Start free"
                        onCta={() => navigate('/signup')}
                    />
                    <Card
                        kicker="Pro"
                        price="$12"
                        period="/ month"
                        description="For power users who want AI feedback, deeper insight, and faster iteration."
                        features={PRO_FEATURES}
                        primary={true}
                        ctaLabel="Upgrade to Pro"
                        onCta={() => navigate('/signup')}
                    />
                </div>

                <p className="mt-10 text-center text-[12.5px] text-muted-foreground">
                    Annual billing saves 20%. Student discount with .edu email — 50% off Pro.
                </p>
            </div>
        </ReactLenis>
    );
};

export default Pricing;
