import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Code2,
    Cpu,
    Globe,
    Zap,
    ShieldCheck,
    Users,
    ArrowRight,
    Terminal,
    Layout,
    CheckCircle2
} from 'lucide-react';

// Assets
import landscapeBg from '../assets/axiom-landscape.png';
import footerBg from '../assets/footer.png';

const FadeIn = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    return (
        <div className="bg-black text-white selection:bg-white/20 font-sans">
            {/* HERO SECTION */}
            <div className="relative h-screen w-full overflow-hidden flex flex-col justify-between">
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute inset-0 z-0"
                >
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${landscapeBg})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
                </motion.div>

                {/* Header */}
                <header className="relative z-20 px-6 md:px-12 py-6 flex justify-between items-center bg-transparent">
                    <div className="text-xl md:text-2xl font-bold tracking-tight mix-blend-difference font-display">AXIOM</div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-white/80 backdrop-blur-md bg-white/5 py-2 px-6 rounded-full border border-white/10">
                        {['Product', 'Solutions', 'Enterprise', 'Pricing'].map(item => (
                            <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
                        ))}
                    </nav>
                    <button onClick={() => navigate('/app')} className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-white/90 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                        Log in
                    </button>
                </header>

                {/* Hero Content */}
                <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4">
                    <div className="text-center max-w-5xl mx-auto space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-white"
                        >
                            The new standard
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">in excellence</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            Master <span className="text-white font-medium">DSA</span>, <span className="text-white font-medium">System Design</span>, and <span className="text-white font-medium">Engineering</span>.
                            <br className="hidden md:block" />
                            Built for the modern developer who demands perfection.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="pt-8"
                        >
                            <button
                                onClick={() => navigate('/app')}
                                className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-[100%] group-hover:animate-shimmer" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* TRUSTED BY */}
            <div className="relative z-10 bg-black py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs font-semibold tracking-[0.2em] text-white/30 uppercase mb-10">Trusted by world-class engineering teams</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                        {/* Logos using font display for aesthetic placeholder */}
                        {['Google', 'Meta', 'Netflix', 'Amazon', 'Apple', 'Uber'].map(brand => (
                            <span key={brand} className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight hover:text-white transition-colors cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* BENTO GRID FEATURES */}
            <div className="bg-black py-32 px-6 relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <FadeIn className="mb-20">
                        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6">Designed for <br /> world-class engineers.</h2>
                        <p className="text-xl text-white/50 max-w-2xl">Everything you need to go from junior developer to principal engineer, all in one seamless ecosystem.</p>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[450px]">
                        {/* Feature 1: Education Hub - Large */}
                        <FadeIn className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/10 p-10 hover:border-white/20 transition-all duration-500">
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <Globe className="w-7 h-7 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-3">Education Hub</h3>
                                    <p className="text-white/60 text-lg">Comprehensive video courses, interactive system design modules, and deep dives into distributed systems.</p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-[-50px] w-[300px] h-[300px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl group-hover:opacity-70 transition-opacity" />
                            {/* Abstract UI Element */}
                            <div className="absolute right-0 bottom-0 w-1/2 h-2/3 bg-black/60 border-t border-l border-white/10 rounded-tl-3xl p-6 backdrop-blur-sm translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="space-y-4">
                                    <div className="h-2 w-1/3 bg-white/20 rounded-full" />
                                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                                    <div className="h-2 w-full bg-white/10 rounded-full" />
                                    <div className="h-32 w-full bg-blue-900/20 rounded-lg border border-white/5" />
                                </div>
                            </div>
                        </FadeIn>

                        {/* Feature 2: DSA Tracker */}
                        <FadeIn delay={0.1} className="group relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/10 p-10 hover:border-white/20 transition-all duration-500">
                            <div className="h-full flex flex-col justify-between relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Cpu className="w-7 h-7 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">DSA Tracker</h3>
                                    <p className="text-white/60">Master 450+ patterns with progress tracking.</p>
                                </div>
                            </div>
                            {/* Visual specific to DSA */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                        </FadeIn>

                        {/* Feature 3: Interview Prep */}
                        <FadeIn delay={0.2} className="group relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/10 p-10 hover:border-white/20 transition-all duration-500">
                            <div className="h-full flex flex-col justify-between relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-7 h-7 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Interview Prep</h3>
                                    <p className="text-white/60">Mock interviews with AI-driven feedback loops.</p>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Feature 4: Dev Connect - Large */}
                        <FadeIn delay={0.3} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/10 p-10 hover:border-white/20 transition-all duration-500">
                            <div className="flex flex-col md:flex-row h-full items-start md:items-center justify-between gap-8 relative z-10">
                                <div className="max-w-md">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Users className="w-7 h-7 text-orange-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-3">Developer Connect</h3>
                                    <p className="text-white/60 text-lg">Join a private community of elite engineers. Share knowledge, find mentors, and accelerate your growth.</p>
                                </div>

                                {/* Chat UI Mockup */}
                                <div className="relative w-full md:w-1/2 h-48 md:h-full bg-black/40 rounded-2xl border border-white/10 p-4 backdrop-blur-md flex flex-col gap-3 overflow-hidden">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs">JD</div>
                                        <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 text-sm text-white/80">
                                            Does anyone have resources on consistent hashing?
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs">AK</div>
                                        <div className="bg-emerald-500/20 text-emerald-100 rounded-2xl rounded-tr-none p-3 text-sm">
                                            Check the System Design module. It covers Ring Hash + Virtual Nodes.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>

            {/* DETAILED FEATURES / DEEP DIVE */}
            <div className="bg-black py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <FadeIn>
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1]">Build your future,<br /><span className="text-white/40">one block at a time.</span></h2>
                        <p className="text-lg text-white/60 mb-8 leading-relaxed">
                            AXIOM isn't just a learning platform; it's a complete ecosystem designed to bridge the gap between theory and real-world application.
                            We provide the tools you need to prove your skills.
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: 'Interactive Learning', desc: 'Execute code directly in the browser with our high-performance runtime.' },
                                { title: 'Verified Certificates', desc: 'Earn credentials that top companies actually recognize.' },
                                { title: 'Global Contests', desc: 'Compete weekly to sharpen your problem-solving speed.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                        <p className="text-sm text-white/50">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2} className="relative aspect-square lg:h-[600px] w-full bg-gradient-to-b from-zinc-900 to-black rounded-3xl border border-white/10 p-1 flex items-center justify-center overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                        {/* Terminal Window Mockup */}
                        <div className="relative w-[90%] bg-[#0d1117] rounded-xl border border-white/10 shadow-2xl font-mono text-sm overflow-hidden">
                            <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                <div className="ml-4 text-xs text-white/30">axiom-cli — zsh — 80x24</div>
                            </div>
                            <div className="p-6 space-y-2 text-blue-400">
                                <p><span className="text-fuchsia-500">➜</span> <span className="text-cyan-400">~/projects</span> axiom init career-v2</p>
                                <p className="text-white/60">Initializing new career trajectory...</p>
                                <p className="text-white/60">Loading modules:</p>
                                <p className="text-green-400 pl-4">+ System Design (Loaded)</p>
                                <p className="text-green-400 pl-4">+ Advanced Algorithms (Loaded)</p>
                                <p className="text-green-400 pl-4">+ Soft Skills (Loaded)</p>
                                <p className="text-white/60">Compiling success...</p>
                                <div className="h-4 bg-white/10 rounded-full w-2/3 mt-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-blue-500"
                                    />
                                </div>
                                <p className="text-white pt-2 animate-pulse">Ready. Use `axiom start` to begin.</p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* PRE-FOOTER CTA */}
            <div className="relative py-40 flex items-center justify-center text-center px-6 overflow-hidden bg-black">
                {/* Spotlight effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl">
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-10">Ready to ascend?</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/app')}
                        className="px-12 py-6 bg-white text-black text-xl font-bold rounded-full shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)]"
                    >
                        Start your journey
                    </motion.button>
                </div>
            </div>

            {/* MODERN LANDSCAPE FOOTER */}
            <footer className="relative bg-black h-[80vh] min-h-[600px] flex flex-col justify-end overflow-hidden text-sm">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-top"
                        style={{ backgroundImage: `url(${footerBg})` }}
                    />
                    {/* Gradient Fade from Top Black to Transparent to show image */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black/60" />
                    {/* Add a specific gradient at the top to blend with the previous section */}
                    <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-12">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8 mb-24">
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white text-lg font-display">Product</h4>
                            <ul className="space-y-3 text-white/70">
                                <li><a href="#" className="hover:text-white transition-colors">Curriculum</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Challenges</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white text-lg font-display">Industries</h4>
                            <ul className="space-y-3 text-white/70">
                                <li><a href="#" className="hover:text-white transition-colors">Fintech</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Big Tech</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Startups</a></li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white text-lg font-display">Resources</h4>
                            <ul className="space-y-3 text-white/70">
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">System Design Primer</a></li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white text-lg font-display">Company</h4>
                            <ul className="space-y-3 text-white/70">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white text-lg font-display">Connect</h4>
                            <ul className="space-y-3 text-white/70">
                                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/20 pt-8 text-white/60">
                        <div className="mb-4 md:mb-0 text-xs tracking-widest uppercase">
                            &copy; 2025 AXIOM / Axis of Engineering
                        </div>
                        <div className="flex gap-8 text-xs font-medium uppercase tracking-wider">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
