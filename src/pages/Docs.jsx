import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import PublicNavbar from '../components/PublicNavbar';
import { Terminal, Code2, Cpu, Globe, ArrowRight } from 'lucide-react';

const Docs = () => {
    const [activeSection, setActiveSection] = useState('intro');
    const scrollRef = useRef(null);

    // Scroll Spy Logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            rootMargin: '-20% 0px -50% 0px',
            threshold: 0.1
        });

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Offset for fixed header
            const headerOffset = 120;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const NavLink = ({ id, label }) => (
        <button
            onClick={(e) => scrollToSection(e, id)}
            className={`w-full text-left block py-2 px-3 rounded-lg text-sm transition-all duration-300 ${activeSection === id
                ? 'bg-accent/50 text-foreground font-semibold translate-x-1 shadow-glow border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
        >
            {label}
        </button>
    );

    return (
        <ReactLenis root options={{ lerp: 0.05 }}>
            <div className="min-h-screen font-sans">
                <PublicNavbar />

                <div className="max-w-7xl mx-auto pt-32 px-6 flex flex-col md:flex-row gap-12">

                    {/* SIDEBAR */}
                    <aside className="hidden md:block w-64 fixed h-[calc(100vh-8rem)] overflow-y-auto pt-8 pb-20 pr-4 border-r border-border custom-scrollbar">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 font-display">Start Here</h3>
                                <div className="space-y-1">
                                    <NavLink id="intro" label="Introduction" />
                                    <NavLink id="features" label="Core Features" />
                                    <NavLink id="quickstart" label="Quick Start" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 font-display">Modules</h3>
                                <div className="space-y-1">
                                    <NavLink id="education" label="Education Hub" />
                                    <NavLink id="dsa" label="DSA Tracker" />
                                    <NavLink id="interview" label="Interview Prep" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 font-display">Reference</h3>
                                <div className="space-y-1">
                                    <NavLink id="cli" label="CLI Commands" />
                                    <NavLink id="api" label="API Access" />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="md:ml-72 w-full py-8 space-y-24 pb-40">

                        {/* Intro Section */}
                        <section id="intro" className="space-y-6">
                            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tighter font-display leading-[0.9] text-glow">
                                Introduction
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">
                                AXIOM is the definitive ecosystem for software engineers. From mastering algorithms to system design, we provide the runtime environment for your career growth.
                            </p>
                            <div className="p-6 bg-muted/30 rounded-2xl border border-border shadow-sm backdrop-blur-md">
                                <p className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">Note:</span> AXIOM is currently in Public Beta 1.0. Some features may evolve.
                                </p>
                            </div>
                        </section>

                        {/* Features Section */}
                        <section id="features" className="space-y-8">
                            <h2 className="text-3xl font-bold text-foreground tracking-tight font-display">Core Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: Code2, title: 'Interactive Runtime', desc: 'Execute code directly in the browser with our custom runtime.' },
                                    { icon: Cpu, title: 'Performance Metrics', desc: 'Real-time time and space complexity analysis.' },
                                    { icon: Globe, title: 'Global Sync', desc: 'Progress synchronized across all devices instantly.' },
                                    { icon: Terminal, title: 'CLI Integration', desc: 'Manage your learning path via axiom-cli.' }
                                ].map((item, i) => (
                                    <div key={i} className="glass-card flex gap-4 p-5 rounded-2xl border border-border hover:border-border/80 transition-all group hover:bg-muted/50">
                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                                            <item.icon className="w-6 h-6 text-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Quickstart Section */}
                        <section id="quickstart" className="space-y-8">
                            <h2 className="text-3xl font-bold text-foreground tracking-tight font-display">Quick Start</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                                Get up and running with AXIOM in less than 5 minutes.
                            </p>
                            <div className="bg-[#0D1117] rounded-2xl overflow-hidden font-mono text-sm text-white shadow-xl max-w-2xl border border-white/10">
                                <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex gap-2">
                                        <span className="text-pink-400">$</span>
                                        <span>npm install -g @axiom/cli</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-pink-400">$</span>
                                        <span>axiom login</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-pink-400">$</span>
                                        <span>axiom init my-workspace</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="w-full h-px bg-border" />

                        {/* Modules Section */}
                        <section id="education" className="space-y-6">
                            <h2 className="text-3xl font-bold text-foreground tracking-tight font-display">Education Hub</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Curated video courses covering System Design (LLD/HLD), Operating Systems, and DBMS.
                            </p>
                        </section>

                        <section id="dsa" className="space-y-6">
                            <h2 className="text-3xl font-bold text-foreground tracking-tight font-display">DSA Tracker</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The heart of AXIOM. Track your progress through 450+ algorithmic problems.
                            </p>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2 marker:text-foreground/50">
                                <li>Blind 75 & NeetCode 150 Integration</li>
                                <li>Spaced Repetition tracking</li>
                                <li>Companies tag filter (Google, Meta, Amazon)</li>
                            </ul>
                        </section>

                        <section id="cli" className="space-y-8 pt-12">
                            <h2 className="text-3xl font-bold text-foreground tracking-tight font-display">CLI Commands</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-border">
                                        <tr>
                                            <th className="py-3 font-bold text-foreground">Command</th>
                                            <th className="py-3 font-bold text-foreground">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr>
                                            <td className="py-3 font-mono text-pink-400">axiom sync</td>
                                            <td className="py-3 text-muted-foreground">Syncs local progress with the cloud.</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-pink-400">axiom test</td>
                                            <td className="py-3 text-muted-foreground">Runs test cases against the current solution.</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-pink-400">axiom submit</td>
                                            <td className="py-3 text-muted-foreground">Submits solution for verification.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </ReactLenis>
    );
};

export default Docs;
