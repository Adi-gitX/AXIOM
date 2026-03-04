import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { motion } from 'framer-motion';
import { Check, Sparkles, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const FREE_FEATURES = [
    'Dashboard command center with DSA heatmap + streak',
    'DSA tracker (all sheets, filters, notes, review queue)',
    'OSS contribution engine + good first issue matcher',
    'GSOC accelerator with timeline and readiness score',
    'Education, interview prep, dev connect, profile portfolio',
];

const PRO_FEATURES = [
    'Unlimited AI suggestions for DSA, OSS, and interview prep',
    'Advanced analytics and deeper activity insights',
    'Private collaboration rooms in Dev Connect',
];

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <ReactLenis root options={{ lerp: 0.05 }}>
            <div className="min-h-screen font-sans pb-24">
                <PublicNavbar />

                <div className="pt-36 px-6 text-center max-w-4xl mx-auto mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-bold tracking-tighter text-foreground font-display leading-[0.95]"
                    >
                        Free Forever + Pro
                    </motion.h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light mt-6">
                        Keep the full learning stack free. Upgrade only for AI-heavy workflows and advanced analytics.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card rounded-3xl border border-border p-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs uppercase tracking-widest text-muted-foreground">
                            <Sparkles className="w-3 h-3" /> Free Forever
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mt-4">$0/mo</h2>
                        <p className="text-sm text-muted-foreground mt-2">Everything students need to learn and track real progress.</p>

                        <ul className="space-y-3 mt-6">
                            {FREE_FEATURES.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-sm text-foreground/85">
                                    <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={() => navigate('/app')}
                            className="mt-8 w-full rounded-xl bg-foreground text-background py-3 text-sm font-semibold"
                        >
                            Start Free
                        </button>
                    </div>

                    <div className="glass-card rounded-3xl border border-border p-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs uppercase tracking-widest text-muted-foreground">
                            <BarChart3 className="w-3 h-3" /> Pro
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mt-4">$12/mo</h2>
                        <p className="text-sm text-muted-foreground mt-2">For power users who want faster iteration and deeper insight.</p>

                        <ul className="space-y-3 mt-6">
                            {PRO_FEATURES.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-sm text-foreground/85">
                                    <Check className="w-4 h-4 text-sky-500 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={() => navigate('/app/settings')}
                            className="mt-8 w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:border-foreground/40"
                        >
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        </ReactLenis>
    );
};

export default Pricing;
