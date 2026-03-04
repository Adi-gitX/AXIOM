import React from 'react';
import { twMerge } from 'tailwind-merge';

const TONE_CLASSES = {
    neutral: 'bg-foreground/5 text-foreground/80 border-border/80',
    accent: 'bg-foreground/10 text-foreground border-foreground/20',
    subtle: 'bg-background/50 text-muted-foreground border-border',
};

const PremiumBadge = ({ children, tone = 'neutral', className }) => {
    const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.neutral;

    return (
        <span
            className={twMerge(
                'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide',
                toneClass,
                className
            )}
        >
            {children}
        </span>
    );
};

export default PremiumBadge;
