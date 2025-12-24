import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] border border-transparent hover:scale-[1.02]',
        secondary: 'bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/20 backdrop-blur-md',
        outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
        ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
        glass: 'glass-button text-white',
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
