import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, hoverEffect = true, premium = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={twMerge(
                'glass-card relative overflow-hidden rounded-3xl p-6 group',
                hoverEffect && 'glass-card-hover group cursor-pointer',
                premium && 'premium-card',
                className
            )}
            {...props}
        >
            {premium && (
                <>
                    <div className="premium-card-border" />
                    <div className="premium-card-glow" />
                </>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] to-transparent pointer-events-none opacity-50" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

export default GlassCard;
