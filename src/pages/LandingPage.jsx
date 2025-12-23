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
    CheckCircle2,
    Sparkles
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
        <div className="bg-stone-50 text-gray-900 selection:bg-black selection:text-white font-sans overflow-x-hidden">
            {/* HERO SECTION */}
            <div className="relative h-screen w-full overflow-hidden flex flex-col justify-between">
                {/* Background Image with Light Fade */}
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
                    {/* Gradient Fade to White/Stone at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-stone-50" />
                </motion.div>

                {/* Header */}
                <header className="relative z-20 px-6 md:px-12 py-6 flex justify-between items-center bg-transparent">
                    <div className="text-xl md:text-2xl font-bold tracking-tight font-display text-gray-900">AXIOM</div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600 bg-white/40 backdrop-blur-md py-2 px-6 rounded-full border border-white/40 shadow-sm">
                        {['Product', 'Solutions', 'Enterprise', 'Pricing'].map(item => (
                            <a key={item} href="#" className="hover:text-black transition-colors">{item}</a>
                        ))}
                    </nav>
                    <button onClick={() => navigate('/app')} className="px-5 py-2 text-sm font-semibold bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95">
                        Log in
                    </button>
                </header>

                {/* Hero Content */}
                <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4">
                    <div className="text-center max-w-5xl mx-auto space-y-8">
                        {/* Tagline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-gray-200 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4"
                        >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>V-1.0 Public Beta</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-gray-900"
                        >
                            The new standard
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 pb-4">in excellence</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed"
                        >
                            Master <span className="text-gray-900 font-semibold">DSA</span>, <span className="text-gray-900 font-semibold">System Design</span>, and <span className="text-gray-900 font-semibold">Engineering</span>.
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
                                className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/50"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-shimmer" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* TRUSTED BY */}
            <div className="relative z-10 py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-8">Trusted by world-class engineering teams</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-all duration-700 grayscale">
                        {/* Logos */}
                        {['Google', 'Meta', 'Netflix', 'Amazon', 'Apple', 'Uber'].map(brand => (
                            <span key={brand} className="text-2xl md:text-3xl font-bold font-display text-gray-900 cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* BENTO GRID FEATURES (LIGHT MODE) */}
            <div className="bg-stone-50 py-32 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <FadeIn className="mb-20">
                        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 text-gray-900">Designed for <br /> world-class engineers.</h2>
                        <p className="text-xl text-gray-500 max-w-2xl">Everything you need to go from junior developer to principal engineer, all in one seamless ecosystem.</p>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[450px]">
                        {/* Feature 1: Education Hub - Large */}
                        <FadeIn className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white border border-gray-200 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <Globe className="w-7 h-7 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-3 text-gray-900">Education Hub</h3>
                                    <p className="text-gray-500 text-lg">Comprehensive video courses, interactive system design modules, and deep dives into distributed systems.</p>
                                </div>
                            </div>
                            {/* Abstract Visual - Light */}
                            <div className="absolute right-0 bottom-0 w-1/2 h-2/3 bg-gray-50 border-t border-l border-gray-100 rounded-tl-3xl p-6 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 shadow-inner">
                                <div className="space-y-4 opacity-50">
                                    <div className="h-2 w-1/3 bg-gray-200 rounded-full" />
                                    <div className="h-2 w-2/3 bg-gray-200 rounded-full" />
                                    <div className="h-2 w-full bg-gray-200 rounded-full" />
                                    <div className="h-32 w-full bg-blue-50/50 rounded-lg border border-blue-100" />
                                </div>
                            </div>
                        </FadeIn>

                        {/* Feature 2: DSA Tracker */}
                        <FadeIn delay={0.1} className="group relative overflow-hidden rounded-[2rem] bg-white border border-gray-200 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                            <div className="h-full flex flex-col justify-between relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Cpu className="w-7 h-7 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-gray-900">DSA Tracker</h3>
                                    <p className="text-gray-500">Master 450+ patterns with progress tracking.</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
                        </FadeIn>

                        {/* Feature 3: Interview Prep */}
                        <FadeIn delay={0.2} className="group relative overflow-hidden rounded-[2rem] bg-stone-100 border border-gray-200 p-10 hover:bg-white transition-all duration-500 hover:shadow-lg">
                            <div className="h-full flex flex-col justify-between relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-7 h-7 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-gray-900">Interview Prep</h3>
                                    <p className="text-gray-500">Mock interviews with AI-driven feedback loops.</p>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Feature 4: Dev Connect - Large */}
                        <FadeIn delay={0.3} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white border border-gray-200 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                            <div className="flex flex-col md:flex-row h-full items-start md:items-center justify-between gap-8 relative z-10">
                                <div className="max-w-md">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Users className="w-7 h-7 text-orange-500" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-3 text-gray-900">Developer Connect</h3>
                                    <p className="text-gray-500 text-lg">Join a private community of elite engineers. Share knowledge, find mentors, and accelerate your growth.</p>
                                </div>

                                {/* Chat UI Mockup - Light */}
                                <div className="relative w-full md:w-1/2 h-48 md:h-full bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 overflow-hidden shadow-inner">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">JD</div>
                                        <div className="bg-white rounded-2xl rounded-tl-none p-3 text-sm text-gray-700 shadow-sm border border-gray-100">
                                            Does anyone have resources on consistent hashing?
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">AK</div>
                                        <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none p-3 text-sm shadow-md">
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
            <div className="bg-white py-32 px-6 border-t border-gray-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <FadeIn>
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1] text-gray-900">Build your future,<br /><span className="text-gray-300">one block at a time.</span></h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
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
                                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 text-blue-600 transition-colors">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2} className="relative aspect-square lg:h-[600px] w-full bg-gray-900 rounded-3xl p-1 flex items-center justify-center overflow-hidden shadow-2xl">
                        {/* Terminal stays dark because code is usually dark mode */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

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

            {/* LIGHT CTA SECTION */}
            <div className="relative py-40 flex items-center justify-center text-center px-6 overflow-hidden bg-white">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-[100px] pointer-events-none opacity-60" />

                <div className="relative z-10 max-w-4xl">
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-10 text-gray-900">Ready to ascend?</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/app')}
                        className="px-12 py-6 bg-gray-900 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-xl hover:bg-black transition-all"
                    >
                        Start your journey
                    </motion.button>
                </div>
            </div>

            {/* MODERN LANDSCAPE FOOTER */}
            <footer className="relative bg-white h-[80vh] min-h-[600px] flex flex-col justify-end overflow-hidden text-sm">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-top"
                        style={{ backgroundImage: `url(${footerBg})` }}
                    />
                    {/* Gradient Fade from Top White to Transparent to show image */}
                    {/* We want the image to emerge from the white background */}
                    <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white to-transparent" />

                    {/* Gradient Fade at bottom for text readability - keeping it dark overlay for footer legibility? 
                        Or should we invert footer too? The image is likely colorful/dark. 
                        Let's keep text white on the footer image for contrast, as landscapes are usually complex.
                    */}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-black/80 to-transparent" />
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
