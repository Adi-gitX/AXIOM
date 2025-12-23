import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-primary hover:bg-primaryHover text-white shadow-lg shadow-primary/30',
        secondary: 'bg-glass-200 hover:bg-glass-300 text-white border border-white/10',
        outline: 'bg-transparent border border-white/20 hover:bg-white/5 text-white',
        ghost: 'bg-transparent hover:bg-white/5 text-white',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(
                'px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm',
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
