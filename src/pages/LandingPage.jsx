import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background Ambient Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[100px] animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 max-w-4xl"
            >
                <motion.h1 
                    className="text-7xl md:text-9xl font-display font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50"
                >
                    AXIOM
                </motion.h1>
                <motion.p 
                    className="text-xl md:text-2xl text-textMuted mb-12 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    The Ultimate Development Universe. Master DSA, System Design, and Engineering with a premium experience.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Button 
                        variant="primary" 
                        className="px-8 py-4 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)]"
                        onClick={() => navigate('/app')}
                    >
                        Enter Universe
                    </Button>
                </motion.div>
            </motion.div>

            {/* Feature Grid Preview */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
            >
                <GlassCard className="h-64 flex flex-col justify-center items-center text-center group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
                    <h3 className="text-xl font-bold mb-2">Education Hub</h3>
                    <p className="text-textMuted text-sm">Curated paths for fast-track learning.</p>
                </GlassCard>
                <GlassCard className="h-64 flex flex-col justify-center items-center text-center group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                    <h3 className="text-xl font-bold mb-2">DSA Tracker</h3>
                    <p className="text-textMuted text-sm">Visualize your progress with Striver's/Love Babbar's sheets.</p>
                </GlassCard>
                <GlassCard className="h-64 flex flex-col justify-center items-center text-center group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
                    <h3 className="text-xl font-bold mb-2">Dev Connect</h3>
                    <p className="text-textMuted text-sm">Real-time collaboration with peers.</p>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default LandingPage;
