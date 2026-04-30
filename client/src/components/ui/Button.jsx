import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Painterly Button primitive — restraint, no scale tricks, no glow shadows.
 * Pill shape by default. Pages already use raw className for one-offs.
 */
const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-foreground text-background hover:opacity-90',
        secondary: 'bg-card text-foreground border hover:border-foreground/20',
        outline: 'bg-transparent border text-foreground hover:bg-secondary',
        ghost: 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary',
    };

    return (
        <button
            className={twMerge(
                'inline-flex items-center justify-center gap-2 h-9 px-5 rounded-full text-[13px] font-medium transition-colors',
                variants[variant],
                className
            )}
            style={variant === 'secondary' || variant === 'outline' ? { borderColor: 'hsl(var(--hair))' } : undefined}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
