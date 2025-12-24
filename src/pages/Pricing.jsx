import React, { useRef } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { motion, useSpring } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TiltCard = ({ children, className = "", delay = 0 }) => {
    const ref = useRef(null);
    const x = useSpring(0, { stiffness: 150, damping: 20 });
    const y = useSpring(0, { stiffness: 150, damping: 20 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 10);
        y.set(yPct * -10);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX: y, rotateY: x, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-[2rem] transition-all duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
};

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <ReactLenis root options={{ lerp: 0.05 }}>
            <div className="min-h-screen font-sans pb-32">
                <PublicNavbar />

                <div className="pt-40 px-6 text-center max-w-4xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-sm text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8 font-display"
                    >
                        <span>Invest in yourself</span>
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground font-display mb-8 leading-[0.9] text-glow">
                        Simple pricing for <br /> serious engineers.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Start for free, upgrade when you're ready to master the entire stack.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* PLAN 1: CADET */}
                    <TiltCard delay={0} className="glass-card p-8 border border-white/10 hover:border-white/20">
                        <div className="flex flex-col h-full relative z-10 transform-style-3d">
                            <div className="mb-4">
                                <Zap className="w-10 h-10 text-blue-400 mb-4" />
                                <h3 className="text-2xl font-bold text-foreground font-display tracking-tight">Cadet</h3>
                                <p className="text-sm text-muted-foreground mt-2">Perfect for getting started.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-5xl font-bold text-foreground tracking-tighter">$0</span>
                                <span className="text-muted-foreground font-medium">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    'Access to blind 75 patterns',
                                    'Basic Progress Tracking',
                                    'Community Support',
                                    'Public Profile'
                                ].map(item => (
                                    <li key={item} className="flex gap-3 text-sm text-muted-foreground font-medium">
                                        <Check className="w-5 h-5 text-green-400 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => navigate('/app')} className="w-full py-4 rounded-xl border border-border text-foreground font-bold hover:bg-accent transition-colors backdrop-blur-md">
                                Get Started
                            </button>
                        </div>
                    </TiltCard>

                    {/* PLAN 2: ENGINEER (Featured) */}
                    <TiltCard delay={0.1} className="bg-white/5 backdrop-blur-3xl text-white p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/20">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-glow">
                                Popular
                            </div>
                        </div>
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

                        <div className="flex flex-col h-full relative z-10">
                            <div className="mb-4">
                                <Shield className="w-10 h-10 text-white mb-4" />
                                <h3 className="text-2xl font-bold text-white font-display tracking-tight">Engineer</h3>
                                <p className="text-sm text-gray-400 mt-2">Everything you need to get hired.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-5xl font-bold text-white tracking-tighter">$12</span>
                                <span className="text-gray-500 font-medium">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    'All Cadet features',
                                    'Full DSA 450+ Patterns',
                                    'Video Solutions & Explanations',
                                    'System Design (LLD/HLD)',
                                    'Mock Interview AI Bot'
                                ].map(item => (
                                    <li key={item} className="flex gap-3 text-sm text-gray-300 font-medium">
                                        <div className="bg-blue-600 rounded-full p-0.5 shrink-0 shadow-lg">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Upgrade Now
                            </button>
                        </div>
                    </TiltCard>

                    {/* PLAN 3: STAFF */}
                    <TiltCard delay={0.2} className="glass-card p-8 border border-white/10 hover:border-white/20">
                        <div className="flex flex-col h-full relative z-10">
                            <div className="mb-4">
                                <Crown className="w-10 h-10 text-purple-400 mb-4" />
                                <h3 className="text-2xl font-bold text-white font-display tracking-tight">Staff</h3>
                                <p className="text-sm text-gray-400 mt-2">For teams and organizations.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-5xl font-bold text-white tracking-tighter">$49</span>
                                <span className="text-gray-500 font-medium">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    'All Engineer features',
                                    'Team Analytics',
                                    'Custom Learning Paths',
                                    'Mentor Connect Access',
                                    'Priority Support'
                                ].map(item => (
                                    <li key={item} className="flex gap-3 text-sm text-gray-300 font-medium">
                                        <Check className="w-5 h-5 text-purple-400 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors backdrop-blur-md">
                                Contact Sales
                            </button>
                        </div>
                    </TiltCard>

                </div>
            </div>
        </ReactLenis>
    );
};

export default Pricing;
