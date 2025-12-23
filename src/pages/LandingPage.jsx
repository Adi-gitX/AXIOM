import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import landscapeBg from '../assets/axiom-landscape.png';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col bg-gradient-to-b from-amber-50/30 to-gray-100/30">
            {/* Beautiful Illustrated Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${landscapeBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Top Brand */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 pt-6 px-6 md:pt-8 md:px-8"
            >
                <div className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                    AXIOM
                </div>
            </motion.div>

            {/* Main Content - Positioned Lower */}
            <div className="relative z-10 flex-1 flex items-end justify-center px-6 pb-28 md:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-center max-w-4xl w-full"
                >
                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 leading-[1.1] tracking-tight">
                        The new standard
                        <br />
                        in compliance
                    </h1>
                    
                    {/* Description */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
                        Master DSA, System Design, and Engineering with a platform built for modern developers.
                    </p>
                    
                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <button
                            onClick={() => navigate('/app')}
                            className="inline-flex items-center justify-center px-7 py-3.5 text-sm md:text-base font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                        >
                            Get started
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Feature Tags */}
            <motion.div 
                className="relative z-10 pb-8 px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                <div className="flex flex-wrap justify-center gap-2.5 max-w-5xl mx-auto">
                    {[
                        'Education Hub',
                        'DSA Tracker',
                        'Interview Prep',
                        'Dev Connect',
                        'Opportunities'
                    ].map((feature, index) => (
                        <motion.div
                            key={feature}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + (index * 0.04), duration: 0.4 }}
                            className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium text-gray-800 border border-gray-300/40 hover:bg-white/90 hover:border-gray-400/50 transition-all duration-150 cursor-default"
                        >
                            {feature}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
