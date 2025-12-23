import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import landscapeBg from '../assets/axiom-landscape.png';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            {/* Beautiful Illustrated Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${landscapeBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />

            {/* Top Brand */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 pt-8 px-8"
            >
                <div className="flex items-center gap-2 text-gray-900">
                    <span className="text-2xl font-bold tracking-tight">AXIOM</span>
                </div>
            </motion.div>

            {/* Main Content - Centered */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl"
                >
                    {/* Headline */}
                    <motion.h1 
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        The new standard
                        <br />
                        in compliance
                    </motion.h1>
                    
                    {/* Description */}
                    <motion.p 
                        className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto font-normal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Master DSA, System Design, and Engineering with a
                        platform built for modern developers.
                    </motion.p>
                    
                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <button
                            onClick={() => navigate('/app')}
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Get started
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Feature Tags */}
            <motion.div 
                className="relative z-10 pb-10 px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
            >
                <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
                    {[
                        'Education Hub',
                        'DSA Tracker',
                        'Interview Prep',
                        'Dev Connect',
                        'Opportunities'
                    ].map((feature, index) => (
                        <motion.div
                            key={feature}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + (index * 0.05), duration: 0.5 }}
                            className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 border border-gray-200/50 hover:bg-white hover:border-gray-300 transition-all duration-200"
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
