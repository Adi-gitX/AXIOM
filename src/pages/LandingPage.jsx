import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
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
    Sparkles,
    MousePointer2,
    MessageCircle
} from 'lucide-react';

// Assets
import landscapeBg from '../assets/axiom-landscape.png';
import footerBg from '../assets/footer.png';

// --- COMPONENTS ---

// 1. Scroll Reveal Text (Apple Style)
const ScrollRevealText = ({ children, className = "" }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Map scroll progress to opacity/blur
    // As element rises from bottom (0) to center (0.5), it becomes clear
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 1, 1, 0.2]);
    const filter = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["blur(4px)", "blur(0px)", "blur(0px)", "blur(4px)"]);
    const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, filter, y }}
            className={`transition-all duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
};

// 2. 3D Tilt Card for Bento Grid
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

        x.set(xPct * 10); // Tilt amount
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
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={`relative overflow-hidden rounded-[2.5rem] bg-white border border-stone-100/50 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-shadow duration-500 ${className}`}
        >
            {children}
        </motion.div>
    );
};

// 3. Typewriter Effect
const Typewriter = ({ text, delay = 0 }) => {
    const [displayText, setDisplayText] = useState('');
    const inView = useInView(useRef(null), { once: true });

    useEffect(() => {
        if (!inView) return;
        let i = 0;
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayText(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, 30); // Speed
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [text, delay, inView]);

    return <span>{displayText}</span>;
}

const LandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Footer Parallax Logic: The content div needs to be z-10 and have a margin-bottom equal to footer height
    // We'll use a fixed footer and a main content that slides over it.

    return (
        <div className="bg-stone-50 text-gray-900 selection:bg-gray-900 selection:text-white font-sans overflow-x-hidden">

            {/* MAIN CONTENT WRAPPER (Z-10 to cover footer) */}
            <div className="relative z-10 bg-stone-50 shadow-2xl mb-[80vh]">

                {/* HERO SECTION */}
                <div className="relative h-screen w-full overflow-hidden flex flex-col justify-between">
                    {/* Parallax Background */}
                    <motion.div
                        style={{ y: heroY, opacity: heroOpacity }}
                        className="absolute inset-0 z-0"
                    >
                        <motion.div
                            initial={{ scale: 1.15 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "easeOut" }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${landscapeBg})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-stone-50" />
                    </motion.div>

                    {/* Navigation */}
                    <header className="relative z-20 px-6 md:px-12 py-8 flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-bold tracking-tighter text-gray-900"
                        >
                            AXIOM
                        </motion.div>
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="hidden md:flex gap-1 text-sm font-medium text-gray-600 bg-white/50 backdrop-blur-xl py-1.5 px-2 rounded-full border border-white/20 shadow-sm"
                        >
                            {['Product', 'Solutions', 'Enterprise', 'Pricing'].map(item => (
                                <a key={item} href="#" className="px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300">{item}</a>
                            ))}
                        </motion.nav>
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/app')}
                            className="px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-gray-900/20"
                        >
                            Log in
                        </motion.button>
                    </header>

                    {/* Hero Text */}
                    <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4">
                        <div className="text-center max-w-6xl mx-auto space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/40 backdrop-blur-md shadow-sm text-xs font-bold uppercase tracking-widest text-gray-500 mb-6"
                            >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Public Beta 1.0</span>
                            </motion.div>

                            <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-gray-900 mx-auto">
                                <motion.span
                                    initial={{ opacity: 0, filter: "blur(10px)", y: 40 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="block"
                                >
                                    The new standard
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, filter: "blur(10px)", y: 40 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                    className="block text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500"
                                >
                                    in excellence.
                                </motion.span>
                            </h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed text-balance"
                            >
                                Master DSA, System Design, and Engineering with a platform built for the perfectionist.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="pt-10"
                            >
                                <button
                                    onClick={() => navigate('/app')}
                                    className="group relative px-9 py-5 bg-gray-900 text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-gray-900/30"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Start your journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* LOGO MARQUEE (Seamless) */}
                <div className="relative py-24 bg-stone-50 border-t border-transparent">
                    <p className="text-center text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-12">Trusted by engineering teams at</p>
                    <div className="relative flex overflow-x-hidden group">
                        <div className="animate-marquee whitespace-nowrap flex gap-32">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-32 items-center opacity-30 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0">
                                    {['Google', 'Meta', 'Netflix', 'Amazon', 'Apple', 'Uber', 'Microsoft', 'Airbnb'].map(brand => (
                                        <span key={`${i}-${brand}`} className="text-4xl font-bold font-display text-gray-900 cursor-default">{brand}</span>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-stone-50 to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-stone-50 to-transparent z-10" />
                    </div>
                </div>

                {/* BENTO GRID (Active & Tilted) */}
                <div className="bg-white py-40 px-6 relative">
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-stone-50 to-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="mb-32 text-center md:text-left">
                            <ScrollRevealText>
                                <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 text-gray-900 leading-[0.9]">
                                    Designed for <br /> world-class engineers.
                                </h2>
                            </ScrollRevealText>
                            <ScrollRevealText>
                                <p className="text-2xl md:text-3xl text-gray-500 max-w-3xl font-light leading-relaxed">
                                    Everything you need to go from junior developer to principal engineer, all in one seamless ecosystem.
                                </p>
                            </ScrollRevealText>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[350px] md:auto-rows-[500px]">
                            {/* Card 1: Education Hub */}
                            <TiltCard className="md:col-span-2 p-12 bg-stone-50">
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                                        <Globe className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">Education Hub</h3>
                                        <p className="text-gray-500 text-xl max-w-md">Comprehensive video courses and interactive system design modules.</p>
                                    </div>
                                </div>
                                <div className="absolute right-0 bottom-0 w-3/5 h-4/5 bg-white rounded-tl-[3rem] p-8 shadow-2xl translate-y-12 translate-x-12 group-hover:translate-y-6 group-hover:translate-x-6 transition-transform duration-700">
                                    <div className="space-y-6 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-100" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
                                                <div className="h-3 w-1/2 bg-gray-200 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="h-32 w-full bg-blue-50 rounded-xl border border-blue-100" />
                                    </div>
                                </div>
                            </TiltCard>

                            {/* Card 2: DSA Tracker */}
                            <TiltCard delay={0.1} className="p-12 bg-white">
                                <div className="h-full flex flex-col justify-between relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center">
                                        <Cpu className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">DSA Tracker</h3>
                                        <p className="text-gray-500 text-lg">Master 450+ patterns.</p>
                                    </div>
                                </div>
                                {/* Animated Graph Bars */}
                                <div className="absolute bottom-12 right-12 flex items-end gap-2 h-24 opacity-20">
                                    {[40, 70, 50, 90, 60].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="w-4 bg-purple-600 rounded-t-md"
                                        />
                                    ))}
                                </div>
                            </TiltCard>

                            {/* Card 3: Interview Prep */}
                            <TiltCard delay={0.2} className="p-12 bg-white">
                                <div className="h-full flex flex-col justify-between relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
                                        <ShieldCheck className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">Interview Prep</h3>
                                        <p className="text-gray-500 text-lg">Mock interviews with AI.</p>
                                    </div>
                                </div>
                            </TiltCard>

                            {/* Card 4: Dev Connect */}
                            <TiltCard delay={0.3} className="md:col-span-2 p-12 bg-stone-50">
                                <div className="flex flex-col md:flex-row h-full items-start md:items-center justify-between gap-12 relative z-10">
                                    <div className="max-w-md">
                                        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-8">
                                            <Users className="w-8 h-8 text-orange-600" />
                                        </div>
                                        <h3 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">Developer Connect</h3>
                                        <p className="text-gray-500 text-xl text-balance">Join a private community of elite engineers. Share knowledge, find mentors.</p>
                                    </div>

                                    {/* Chat Animation */}
                                    <div className="relative w-full md:w-[45%] h-full flex flex-col justify-center gap-4">
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-white p-4 rounded-2xl rounded-tr-none shadow-md border border-gray-100 self-end max-w-[90%]"
                                        >
                                            <p className="text-sm text-gray-600">How do I optimize this graph query?</p>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="bg-blue-600 p-4 rounded-2xl rounded-tl-none shadow-md shadow-blue-200 self-start max-w-[90%]"
                                        >
                                            <p className="text-sm text-white">Use a bidirectional BFS. It reduces the branching factor.</p>
                                        </motion.div>
                                    </div>
                                </div>
                            </TiltCard>
                        </div>
                    </div>
                </div>

                {/* DEEP DIVE TERMINAL */}
                <div className="bg-white py-40 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <ScrollRevealText>
                            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12 text-gray-900 leading-[0.95]">
                                Build your future,<br /><span className="text-gray-300">line by line.</span>
                            </h2>
                            <p className="text-xl text-gray-500 mb-12 leading-relaxed font-light max-w-xl">
                                AXIOM provides the tools, runtime, and environment you need to prove your skills to the world's best companies.
                            </p>
                            <div className="space-y-4">
                                {['Real-time Execution', 'Verified Credentials', 'Global Leaderboards'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-lg font-medium text-gray-900">
                                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </ScrollRevealText>

                        {/* Terminal with Typewriter */}
                        <TiltCard className="bg-[#0D1117] border-gray-800 p-1 aspect-square md:aspect-auto md:h-[600px] shadow-2xl">
                            <div className="w-full h-full bg-[#0d1117] rounded-[2rem] overflow-hidden flex flex-col font-mono text-sm relative">
                                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="ml-auto text-xs text-white/20">axiom-cli — 120x80</div>
                                </div>
                                <div className="p-8 text-blue-400 space-y-2">
                                    <div className="flex gap-2">
                                        <span className="text-pink-500">➜</span>
                                        <span className="text-cyan-400">~</span>
                                        <span className="text-white">axiom init career-v2</span>
                                    </div>
                                    <div className="pt-4 text-white/50 space-y-1">
                                        <p>Initializing workspace...</p>
                                        <p>Loading dependencies:</p>
                                        <div className="pl-4 text-green-400">
                                            <p>+ System_Design_v2.0 <span className="text-white/20 ml-2">Done</span></p>
                                            <p>+ Algo_Patterns_v4 <span className="text-white/20 ml-2">Done</span></p>
                                            <p>+ Soft_Skills_Module <span className="text-white/20 ml-2">Done</span></p>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <span className="text-pink-500">➜</span>
                                        <span className="text-cyan-400">~</span>
                                        <span className="text-white ml-2">
                                            <Typewriter text="axiom start --mode=turbo" delay={2000} />
                                        </span>
                                        <span className="animate-pulse inline-block w-2 h-5 bg-white ml-1 align-middle" />
                                    </div>
                                </div>
                                {/* Grid Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
                            </div>
                        </TiltCard>
                    </div>
                </div>

                {/* PRE-FOOTER CTA */}
                <div className="relative py-60 flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white">
                    <div className="max-w-4xl z-10">
                        <ScrollRevealText>
                            <h2 className="text-7xl md:text-9xl font-bold tracking-tighter mb-12 text-gray-900">Ready to ascend?</h2>
                        </ScrollRevealText>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/app')}
                            className="px-16 py-8 bg-black text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-black/50 transition-all"
                        >
                            Start your journey
                        </motion.button>
                        <p className="mt-8 text-gray-400 text-sm font-medium tracking-widest uppercase">No credit card required</p>
                    </div>
                </div>

            </div>
            {/* END MAIN CONTENT WRAPPER */}

            {/* FIXED FOOTER (Revealed by Parallax) */}
            <div className="fixed bottom-0 left-0 right-0 h-[80vh] z-0 flex flex-col justify-end bg-gray-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-top opacity-50 mix-blend-overlay"
                    style={{ backgroundImage: `url(${footerBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-20">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-32">
                        <div className="flex flex-col gap-6">
                            <h4 className="font-bold text-2xl font-display text-white">Product</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Curriculum</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Challenges</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h4 className="font-bold text-2xl font-display text-white">Company</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>
                        <div className="md:col-span-3 flex flex-col items-start md:items-end">
                            <h4 className="text-9xl font-bold tracking-tighter text-white/10 mb-8 pointer-events-none">AXIOM</h4>
                            <div className="flex gap-4">
                                <input type="email" placeholder="Enter your email" className="bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 w-64" />
                                <button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">Subscribe</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-white/10 text-gray-500 text-sm">
                        <div>&copy; 2025 AXIOM Inc.</div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LandingPage;
