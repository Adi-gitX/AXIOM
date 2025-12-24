import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Github, ArrowRight } from 'lucide-react';

export const WaitlistForm = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const [role, setRole] = useState('architect');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => setStatus('success'), 2000); // Longer delay for "processing" feel
    };

    if (status === 'success') {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8 }}
                    className="w-32 h-32 border border-green-500/20 bg-green-500/5 rounded-full flex items-center justify-center mb-8 relative"
                >
                    <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping opacity-20" />
                    <Check className="w-12 h-12 text-green-400" />
                </motion.div>
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tighter mb-4 uppercase"
                >
                    Signal Received
                </motion.h3>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 text-sm font-mono text-green-400/80 bg-green-500/5 border border-green-500/10 px-4 py-2 rounded-full"
                >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    ENCRYPTION_KEY_GENERATED
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row bg-[#050505] text-white">

            {/* Left Column: The Manifesto (Context) */}
            <div className="hidden lg:flex flex-1 flex-col justify-between p-12 lg:p-20 relative overflow-hidden border-r border-white/5 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black">
                {/* Tech Deco */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute top-10 left-10 text-[10px] font-mono text-white/20 tracking-[0.3em]">
                    AXIOM_KERNEL_V.0.9.2
                </div>

                <div className="relative z-10 mt-auto mb-auto">
                    <h2 className="text-5xl lg:text-7xl font-bold font-display tracking-tighter leading-none mb-8 text-white">
                        THE CODE <br />
                        MUST FLOW.
                    </h2>
                    <div className="space-y-6 max-w-md">
                        <p className="text-lg text-gray-400 font-light leading-relaxed border-l border-white/10 pl-6">
                            We are building the operating system for the next generation of software architects.
                            If you believe unparalleled performance is a basic human right, you belong here.
                        </p>
                        <ul className="space-y-3 pt-6">
                            {[
                                'Direct access to the kernel',
                                'Unlimited private repositories',
                                'Global CDN deployment'
                            ].map((trait, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-mono text-gray-500 uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm" />
                                    {trait}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="relative z-10 flex gap-8 text-[10px] font-mono text-white/30 tracking-widest uppercase">
                    <div>Latency: 12ms</div>
                    <div>Uptime: 99.99%</div>
                    <div>Nodes: 4,028</div>
                </div>
            </div>

            {/* Right Column: The Input Terminal (Form) */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-20 relative bg-[#080808]">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                <div className="relative z-10 max-w-md w-full mx-auto">
                    <div className="mb-10">
                        <div className="inline-block px-3 py-1 border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                            Access Request Protocol
                        </div>
                        <h3 className="text-2xl font-bold font-display tracking-tight text-white mb-2">Initialize Connection</h3>
                        <p className="text-gray-500 text-sm">Secure authorization required.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Identity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Identity</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Name"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:bg-blue-500/[0.02] transition-colors font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Signal</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="Email"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:bg-blue-500/[0.02] transition-colors font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* Repository */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Github className="w-3 h-3" /> git_repository
                            </label>
                            <input
                                type="url"
                                placeholder="https://github.com/username"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:bg-blue-500/[0.02] transition-colors font-mono text-sm"
                            />
                        </div>

                        {/* Class Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Class Selection</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['architect', 'builder', 'keeper', 'breaker'].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`px-4 py-3 text-left border text-xs font-mono uppercase tracking-wide transition-all duration-200 ${role === r
                                            ? 'bg-white text-black border-white'
                                            : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-gray-300'
                                            }`}
                                    >
                                        &gt; {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action */}
                        <button
                            disabled={status === 'loading'}
                            className="w-full bg-blue-600 text-white font-bold text-sm py-4 uppercase tracking-widest hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {status === 'loading' ? 'Compiling...' : 'Execute Sequence'}
                                {!status === 'loading' && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
