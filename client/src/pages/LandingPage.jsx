import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
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
    MessageCircle,
    Github,
    Linkedin,
    Twitter,
    Check,
    Briefcase,
    FileText
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../components/ui/ExpandableScreen';
import { WaitlistForm } from '../components/WaitlistForm';
import { AnimatedThemeToggler } from '../components/AnimatedThemeToggler';

// Assets
import landscapeBg from '../assets/-landscape.webp';
import darkerLandscape from '../assets/darkerlandscape.webp';
import footerBg from '../assets/footer.webp';
import nightFooter from '../assets/footer.webp';

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
            className={`relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/[0.03] border border-stone-100/50 dark:border-white/10 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none dark:hover:shadow-none transition-shadow duration-500 ${className}`}
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

// --- MAIN COMPONENT ---

const LandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Theme Detection for Image Switching
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkTheme(); // Initial check
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Footer Parallax Logic: The content div needs to be z-10 and have a margin-bottom equal to footer height
    // We'll use a fixed footer and a main content that slides over it.

    return (
        <ReactLenis root options={{ lerp: 0.05, duration: 1.2, smoothTouch: true, wheelMultiplier: 0.8 }}>
            <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-x-hidden">

                {/* MAIN CONTENT WRAPPER (Z-10 to cover footer) */}
                <div className="relative z-10 bg-background shadow-2xl mb-[80vh]">
                    {/* ... Existing Content ... */}
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
                                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                                style={{ backgroundImage: `url(${isDark ? darkerLandscape : landscapeBg})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
                        </motion.div>

                        {/* Navigation */}
                        <header className="relative z-20 px-6 md:px-12 py-8 flex justify-between items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl font-bold tracking-tight text-foreground font-display"
                            >
                                AXIOM
                            </motion.div>
                            <motion.nav
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="hidden md:flex gap-1 text-sm font-medium text-muted-foreground bg-background/50 backdrop-blur-xl py-2 px-3 rounded-full border border-border/20 shadow-sm"
                            >
                                {[
                                    { label: 'Product', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
                                    { label: 'Documentation', action: () => navigate('/docs') },
                                    { label: 'OSS', action: () => navigate('/app/oss') },
                                    { label: 'GSOC', action: () => navigate('/app/gsoc') },
                                    { label: 'Jobs', action: () => navigate('/app/jobs') },
                                    { label: 'Pricing', action: () => navigate('/pricing') }
                                ].map(item => (
                                    <button
                                        key={item.label}
                                        onClick={item.action}
                                        className="px-5 py-2 rounded-full hover:bg-background hover:text-foreground transition-all duration-300 font-display tracking-wide uppercase text-xs focus:outline-none"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </motion.nav>
                            <div className="flex items-center gap-4">
                                <AnimatedThemeToggler />
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/20 font-display tracking-wide"
                                >
                                    Log in
                                </motion.button>
                            </div>
                        </header>

                        {/* Hero Text */}
                        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4">
                            <div className="text-center max-w-7xl mx-auto space-y-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 border border-border/40 backdrop-blur-md shadow-sm text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 font-display"
                                >
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                    <span>Public Beta 1.0</span>
                                </motion.div>

                                <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-foreground mx-auto font-display">
                                    <motion.span
                                        initial={{ opacity: 0, filter: "blur(10px)", y: 40 }}
                                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                        className="block text-foreground"
                                    >
                                        The new standard
                                    </motion.span>
                                    <motion.span
                                        initial={{ opacity: 0, filter: "blur(10px)", y: 40 }}
                                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                        className="block text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/80 to-muted-foreground"
                                    >
                                        in excellence.
                                    </motion.span>
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed text-balance tracking-wide"
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
                                        className="group relative px-10 py-5 bg-foreground text-background rounded-full font-bold text-lg md:text-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 font-display tracking-tight"
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
                    <div className="relative py-20 bg-background/50 backdrop-blur-sm">
                        <p className="text-center text-xs font-bold tracking-[0.25em] text-muted-foreground uppercase mb-10 font-display">Trusted by engineering teams at</p>
                        <div className="relative overflow-hidden">
                            {/* Left fade */}
                            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                            {/* Right fade */}
                            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                            {/* Marquee container */}
                            <div className="animate-marquee flex whitespace-nowrap">
                                {/* First set */}
                                {['Netflix', 'Amazon', 'Apple', 'Uber', 'Microsoft', 'Airbnb', 'Google', 'Meta'].map((brand, i) => (
                                    <span
                                        key={`a-${brand}-${i}`}
                                        className="mx-12 text-4xl md:text-5xl font-bold font-display text-muted-foreground/30 hover:text-foreground transition-colors duration-300 cursor-default tracking-tight"
                                    >
                                        {brand}
                                    </span>
                                ))}
                                {/* Duplicate for seamless loop */}
                                {['Netflix', 'Amazon', 'Apple', 'Uber', 'Microsoft', 'Airbnb', 'Google', 'Meta'].map((brand, i) => (
                                    <span
                                        key={`b-${brand}-${i}`}
                                        className="mx-12 text-4xl md:text-5xl font-bold font-display text-muted-foreground/30 hover:text-foreground transition-colors duration-300 cursor-default tracking-tight"
                                    >
                                        {brand}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BENTO GRID (Active & Tilted) */}
                    <div id="features" className="glass-panel py-40 px-6 relative border-y border-border">
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />

                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="mb-24 text-center md:text-left">
                                <ScrollRevealText>
                                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-foreground leading-[0.9] font-display">
                                        Designed for <br /> world-class engineers.
                                    </h2>
                                </ScrollRevealText>
                                <ScrollRevealText>
                                    <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl font-light leading-relaxed">
                                        Everything you need to go from junior developer to principal engineer, all in one seamless ecosystem.
                                    </p>
                                </ScrollRevealText>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[350px] md:auto-rows-[450px]">
                                {/* Card 1: Education Hub */}
                                <TiltCard className="md:col-span-2 p-12 bg-card/50">
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div className="w-16 h-16 rounded-3xl bg-white dark:bg-blue-500/10 shadow-sm flex items-center justify-center mb-6">
                                            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-bold mb-4 text-foreground tracking-tighter font-display">Education Hub</h3>
                                            <p className="text-muted-foreground text-xl max-w-[55%] leading-relaxed">Comprehensive video courses and interactive system design modules.</p>
                                        </div>
                                    </div>
                                    <div className="absolute right-0 bottom-0 w-3/5 h-4/5 bg-white dark:bg-gray-900 rounded-tl-[3rem] p-6 shadow-2xl translate-y-12 translate-x-12 group-hover:translate-y-6 group-hover:translate-x-6 transition-transform duration-700">
                                        <div className="space-y-3 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                            <div className="flex gap-2 mb-4">
                                                {['All', 'DSA', 'System Design', 'Web Dev'].map(cat => (
                                                    <span key={cat} className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${cat === 'All' ? 'bg-foreground text-background' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>{cat}</span>
                                                ))}
                                            </div>
                                            {['Graph Algorithms', 'Load Balancer Design', 'React Internals'].map((title, i) => (
                                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${['from-blue-500 to-cyan-400', 'from-purple-500 to-pink-400', 'from-emerald-500 to-teal-400'][i]} flex items-center justify-center`}>
                                                        <span className="text-white text-[10px] font-bold">▶</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{title}</p>
                                                        <p className="text-[10px] text-gray-400">12 lessons</p>
                                                    </div>
                                                    <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full bg-blue-500`} style={{ width: `${[65, 30, 90][i]}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TiltCard>

                                {/* Card 2: DSA Tracker */}
                                <TiltCard delay={0.1} className="p-12 glass-card">
                                    <div className="h-full flex flex-col justify-between relative z-10">
                                        <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                            <Cpu className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold mb-2 text-foreground tracking-tighter font-display">DSA Tracker</h3>
                                            <p className="text-muted-foreground text-lg">Master 450+ patterns.</p>
                                        </div>
                                    </div>
                                    {/* Animated Graph Bars */}
                                    <div className="absolute bottom-12 right-12 flex items-end gap-2 h-24 opacity-40">
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
                                <TiltCard delay={0.2} className="p-12 glass-card">
                                    <div className="h-full flex flex-col justify-between relative z-10">
                                        <div className="w-16 h-16 rounded-3xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                                            <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold mb-2 text-foreground tracking-tighter font-display">Interview Prep</h3>
                                            <p className="text-muted-foreground text-lg">Categorized resources & tips.</p>
                                        </div>
                                    </div>
                                    {/* Checklist Preview */}
                                    <div className="absolute top-12 right-12 space-y-2.5 opacity-50">
                                        {['Behavioral', 'System Design', 'Coding', 'HR Round'].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: 10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                className="flex items-center gap-2 text-xs font-medium text-foreground"
                                            >
                                                <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${i < 2 ? 'border-green-500 bg-green-500/10' : 'border-muted-foreground/30'}`}>
                                                    {i < 2 && <Check className="w-2.5 h-2.5 text-green-500" />}
                                                </div>
                                                {item}
                                            </motion.div>
                                        ))}
                                    </div>
                                </TiltCard>

                                {/* Card 4: Dev Connect */}
                                <TiltCard delay={0.3} className="md:col-span-2 p-12 bg-card/50">
                                    <div className="flex flex-col md:flex-row h-full items-start md:items-center justify-between gap-12 relative z-10">
                                        <div className="max-w-md">
                                            <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-8">
                                                <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <h3 className="text-4xl font-bold mb-4 text-foreground tracking-tighter font-display">Developer Connect</h3>
                                            <p className="text-muted-foreground text-xl text-balance leading-relaxed">Join a private community of elite engineers. Share knowledge, find mentors.</p>
                                        </div>

                                        {/* Chat Animation */}
                                        <div className="relative w-full md:w-[45%] h-full flex flex-col justify-center gap-4">
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-white dark:bg-white/10 p-5 rounded-2xl rounded-tr-none shadow-md dark:shadow-none border border-gray-100 dark:border-white/10 self-end max-w-[90%]"
                                            >
                                                <p className="text-sm text-gray-600 dark:text-gray-300">How do I optimize this graph query?</p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 }}
                                                className="bg-blue-600 p-5 rounded-2xl rounded-tl-none shadow-md shadow-blue-200 dark:shadow-none self-start max-w-[90%]"
                                            >
                                                <p className="text-sm text-white">Use a bidirectional BFS.</p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </TiltCard>

                                {/* Card 5: Jobs & Community */}
                                <TiltCard delay={0.4} className="md:col-span-3 p-12 glass-card">
                                    <div className="flex flex-col md:flex-row h-full items-start md:items-center justify-between gap-12 relative z-10">
                                        <div className="max-w-md">
                                            <div className="flex gap-4 mb-8">
                                                <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                                                    <Briefcase className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                                                </div>
                                                <div className="w-16 h-16 rounded-3xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center">
                                                    <FileText className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                                                </div>
                                            </div>
                                            <h3 className="text-4xl font-bold mb-4 text-foreground tracking-tighter font-display">Jobs & Community</h3>
                                            <p className="text-muted-foreground text-xl text-balance leading-relaxed">Browse curated job listings, share knowledge through posts, and grow with the community.</p>
                                        </div>
                                        <div className="relative w-full md:w-[50%] space-y-3">
                                            {[
                                                { title: 'Senior Frontend Engineer', company: 'Google', tag: 'Remote', tagBg: 'bg-blue-100 dark:bg-blue-500/10', tagText: 'text-blue-600 dark:text-blue-400' },
                                                { title: 'Staff Backend Engineer', company: 'Netflix', tag: 'Hybrid', tagBg: 'bg-red-100 dark:bg-red-500/10', tagText: 'text-red-600 dark:text-red-400' },
                                                { title: 'Full Stack Developer', company: 'Stripe', tag: 'On-site', tagBg: 'bg-purple-100 dark:bg-purple-500/10', tagText: 'text-purple-600 dark:text-purple-400' },
                                            ].map((job, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + i * 0.15 }}
                                                    className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm"
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">{job.title}</p>
                                                        <p className="text-xs text-muted-foreground">{job.company}</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${job.tagBg} ${job.tagText}`}>{job.tag}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </TiltCard>
                            </div>
                        </div>
                    </div>

                    {/* DEEP DIVE TERMINAL */}
                    <div className="py-40 px-6">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <ScrollRevealText>
                                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 text-foreground leading-[0.9] font-display">
                                    Build your future,<br /><span className="text-foreground/50">line by line.</span>
                                </h2>
                                <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-light max-w-lg">
                                    AXIOM provides the tools, runtime, and environment you need to prove your skills to the world&apos;s best companies.
                                </p>
                                <div className="space-y-5">
                                    {['450+ DSA Patterns & Tracking', 'Video Course Library', 'AI-powered Interview Prep'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-lg font-medium text-foreground">
                                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </ScrollRevealText>

                            {/* Terminal with Typewriter */}
                            <TiltCard className="bg-[#0D1117] border-gray-800 p-1 aspect-square md:aspect-auto md:h-[500px] shadow-2xl">
                                <div className="w-full h-full bg-[#0d1117] rounded-[2rem] overflow-hidden flex flex-col font-mono text-sm relative">
                                    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="ml-auto text-xs text-white/20 font-display tracking-widest">axiom-cli — 120x80</div>
                                    </div>
                                    <div className="p-8 text-blue-400 space-y-3 font-mono text-base">
                                        <div className="flex gap-2">
                                            <span className="text-pink-500">➜</span>
                                            <span className="text-cyan-400">~</span>
                                            <span className="text-white">axiom init career-v2</span>
                                        </div>
                                        <div className="pt-4 text-white/50 space-y-2">
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
                    <div className="relative py-60 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                        <div className="max-w-5xl z-10">
                            <ScrollRevealText>
                                <h2 className="text-8xl md:text-[10rem] font-bold tracking-tighter mb-16 text-foreground leading-[0.8] font-display">Ready to ascend?</h2>
                            </ScrollRevealText>

                            <ExpandableScreen>
                                <ExpandableScreenTrigger className="mx-auto rounded-full bg-foreground text-background shadow-2xl hover:shadow-primary/50 transition-all">
                                    <button className="px-16 py-8 text-2xl font-bold tracking-wide font-display flex items-center gap-3">
                                        Join the waitlist <ArrowRight className="w-6 h-6" />
                                    </button>
                                </ExpandableScreenTrigger>
                                <ExpandableScreenContent className="p-0">
                                    <WaitlistForm />
                                </ExpandableScreenContent>
                            </ExpandableScreen>
                            <p className="mt-10 text-gray-400 text-sm font-bold tracking-[0.2em] uppercase font-display">No credit card required</p>
                        </div>
                    </div>

                </div >
                {/* END MAIN CONTENT WRAPPER */}

                {/* FIXED FOOTER (Revealed by Parallax) */}
                <div className="fixed bottom-0 left-0 right-0 h-[80vh] z-0 flex flex-col justify-end bg-gray-900 text-white overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-bottom opacity-100 transition-all duration-700"
                        style={{ backgroundImage: `url(${isDark ? nightFooter : footerBg})` }}
                    />

                    {/* Darker gradient overlay at bottom for text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-12 h-full flex flex-col justify-between pt-32">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            {/* Platform */}
                            <div className="flex flex-col gap-6">
                                <h4 className="font-bold text-xl text-white mb-2 font-display tracking-tight">Platform</h4>
                                <ul className="space-y-4 text-white/80 text-sm font-medium drop-shadow-md">
                                    <li><a href="/app/education" className="hover:text-white hover:underline transition-all">Education Hub</a></li>
                                    <li><a href="/app/dsa" className="hover:text-white hover:underline transition-all">DSA Tracker</a></li>
                                    <li><a href="/app/oss" className="hover:text-white hover:underline transition-all">OSS Engine</a></li>
                                    <li><a href="/app/gsoc" className="hover:text-white hover:underline transition-all">GSOC Accelerator</a></li>
                                    <li><a href="/app/interview" className="hover:text-white hover:underline transition-all">Interview Prep</a></li>
                                    <li><a href="/app/connect" className="hover:text-white hover:underline transition-all">Developer Connect</a></li>
                                    <li><a href="/app/jobs" className="hover:text-white hover:underline transition-all">Jobs Board</a></li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div className="flex flex-col gap-6">
                                <h4 className="font-bold text-xl text-white mb-2 font-display tracking-tight">Resources</h4>
                                <ul className="space-y-4 text-white/80 text-sm font-medium drop-shadow-md">
                                    <li><a href="/docs" className="hover:text-white hover:underline transition-all">Documentation</a></li>
                                    <li><a href="/app/posts" className="hover:text-white hover:underline transition-all">Community Posts</a></li>
                                    <li><a href="/app/profile" className="hover:text-white hover:underline transition-all">Public Portfolio</a></li>
                                    <li><a href="/pricing" className="hover:text-white hover:underline transition-all">Pricing</a></li>
                                    <li><a href="/docs" className="hover:text-white hover:underline transition-all">System Design Guide</a></li>
                                </ul>
                            </div>

                            {/* Community */}
                            <div className="flex flex-col gap-6">
                                <h4 className="font-bold text-xl text-white mb-2 font-display tracking-tight">Community</h4>
                                <ul className="space-y-4 text-white/80 text-sm font-medium drop-shadow-md">
                                    <li><a href="/app/connect" className="hover:text-white hover:underline transition-all">Dev Connect Chat</a></li>
                                    <li><a href="/app/posts" className="hover:text-white hover:underline transition-all">Posts & Discussions</a></li>
                                    <li><a href="/app/profile" className="hover:text-white hover:underline transition-all">Your Profile</a></li>
                                </ul>
                            </div>

                            {/* Connect (Socials) */}
                            <div className="flex flex-col gap-6">
                                <h4 className="font-bold text-xl text-white mb-2 font-display tracking-tight">Connect</h4>
                                <div className="flex gap-4">
                                    <a href="https://github.com/Adi-gitX" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.linkedin.com/in/kammatiaditya/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a href="https://x.com/AdiGitX" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                </div>
                                <p className="text-white/60 text-sm max-w-xs leading-relaxed">
                                    Follow the journey as we redefine engineering education.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-end text-white/60 text-xs font-medium tracking-wide drop-shadow-md pb-8">
                            <div className="font-display tracking-widest">&copy; AXIOM 2026</div>
                            <div className="flex gap-6">
                                <a href="/docs" className="hover:text-white hover:underline transition-all">Privacy Policy</a>
                                <a href="/docs" className="hover:text-white hover:underline transition-all">Security</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </ReactLenis >
    );
};

export default LandingPage;
