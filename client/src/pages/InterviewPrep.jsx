import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RESOURCES = [
    { id: 1, cat: 'Behavioral', title: 'STAR Method Guide', desc: 'Structure your answers' },
    { id: 2, cat: 'Behavioral', title: 'Common Questions', desc: '50 most asked questions' },
    { id: 3, cat: 'System Design', title: 'Design Patterns', desc: 'Essential patterns' },
    { id: 4, cat: 'System Design', title: 'Scalability Basics', desc: 'How to scale systems' },
    { id: 5, cat: 'Coding', title: 'Time Complexity', desc: 'Big O notation' },
    { id: 6, cat: 'Coding', title: 'Problem Solving', desc: 'Approach any problem' },
    { id: 7, cat: 'Resume', title: 'Tech Resume Guide', desc: 'Craft the perfect resume' },
    { id: 8, cat: 'Resume', title: 'Project Showcase', desc: 'Present your work' },
];

const CATS = ['All', 'Behavioral', 'System Design', 'Coding', 'Resume'];

const TIPS = [
    "Research the company's engineering blog before interviews",
    "Practice explaining your thought process out loud",
    "Prepare 2-3 questions to ask your interviewer",
    "Review your past projects and be ready to discuss them",
];

const InterviewPrep = () => {
    const [cat, setCat] = useState('All');
    const filtered = cat === 'All' ? RESOURCES : RESOURCES.filter(r => r.cat === cat);

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl font-light text-foreground text-glow font-display">Interview Prep</h1>
                    <p className="text-muted-foreground mt-2">Resources to ace your interviews</p>
                </motion.header>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CATS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className={`px-4 py-2 text-sm rounded-full transition-all border ${cat === c
                                ? 'bg-foreground text-background border-foreground shadow-glow font-medium'
                                : 'bg-muted text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
                    {filtered.map((r, i) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="glass-card p-6 rounded-2xl hover:bg-accent/50 transition-all cursor-pointer group border border-border hover:border-border/80"
                        >
                            <span className="text-xs text-muted-foreground font-mono group-hover:text-foreground transition-colors">{r.cat}</span>
                            <h3 className="font-medium text-foreground mt-1 group-hover:text-glow transition-all">{r.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{r.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tips */}
                <div className="glass-panel p-8 rounded-3xl border border-border">
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6 opacity-50">Quick Tips</h2>
                    <div className="space-y-4">
                        {TIPS.map((tip, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                            >
                                <span className="text-xs text-muted-foreground font-mono pt-1">{String(i + 1).padStart(2, '0')}</span>
                                <p className="text-foreground/80 text-sm leading-relaxed">{tip}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InterviewPrep;
