import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Legacy card wrapper — pure div, no entrance animation.
 * Pages still using GlassCard get instant render.
 */
const GlassCard = ({ children, className, hoverEffect = true, premium = false, ...rest }) => {
    // Pull off motion-only props so they don't leak to the DOM
    const {
        initial: _i, animate: _a, exit: _e, transition: _t, whileHover: _wh, whileTap: _wt,
        ...props
    } = rest;
    void _i; void _a; void _e; void _t; void _wh; void _wt; void premium;
    return (
        <div
            className={twMerge(
                'relative overflow-hidden rounded-xl bg-card border border-border',
                hoverEffect && 'hover:border-foreground/15 transition-colors',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
