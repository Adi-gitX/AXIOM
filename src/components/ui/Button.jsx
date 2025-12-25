import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-foreground text-background shadow-glow hover:shadow-lg border border-transparent hover:scale-[1.02]',
        secondary: 'bg-muted text-foreground border border-border hover:bg-accent hover:border-border/80 backdrop-blur-md',
        outline: 'bg-transparent border border-border text-foreground hover:bg-muted hover:border-border',
        ghost: 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
        glass: 'glass-button text-foreground',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={twMerge(
                'px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
