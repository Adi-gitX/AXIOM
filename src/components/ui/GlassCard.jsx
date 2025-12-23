import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, hoverEffect = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={twMerge(
                clsx(
                    'relative overflow-hidden rounded-2xl border border-white/10 bg-glass-100 backdrop-blur-xl shadow-lg p-6',
                    hoverEffect && 'hover:bg-glass-200 hover:border-white/20 hover:shadow-xl transition-all duration-300 group',
                    className
                )
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

export default GlassCard;
