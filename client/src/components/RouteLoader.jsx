import React from 'react';

/**
 * Branded loader — shown while route-level lazy chunks are fetching.
 * Replaces the bare "Loading..." text with a soft brand identity.
 *
 * Static-rendered (no spinner animation) to feel instant, with a
 * very subtle pulse on the wordmark for liveness.
 */
const RouteLoader = () => (
    <div className="min-h-screen bg-[#FAF8F2] text-[#0F1419] flex items-center justify-center antialiased">
        <div className="text-center">
            <div className="flex items-baseline justify-center gap-1.5 mb-3">
                <span
                    className="font-display font-semibold text-[26px] tracking-[-0.025em] animate-pulse"
                    style={{ animationDuration: '1.6s' }}
                >
                    axiom
                </span>
                <span
                    className="text-[14px] text-[#0F1419]/55"
                    style={{ fontFamily: 'Newsreader, "Source Serif Pro", Georgia, serif', fontStyle: 'italic', fontWeight: 300 }}
                >
                    /dev
                </span>
            </div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#0F1419]/40">
                loading
            </p>
        </div>
    </div>
);

export default RouteLoader;
