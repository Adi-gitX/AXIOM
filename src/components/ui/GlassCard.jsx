import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, hoverEffect = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={twMerge(
                'glass-card relative overflow-hidden rounded-3xl p-6',
                hoverEffect && 'glass-card-hover group cursor-pointer',
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] to-transparent pointer-events-none opacity-50" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

export default GlassCard;
