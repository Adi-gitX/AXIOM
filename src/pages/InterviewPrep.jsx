import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Users, BrainCircuit, ArrowRight } from 'lucide-react';

const InterviewPrep = () => {
    const resources = [
        {
            title: "System Design",
            description: "Scalability, distributed systems, and architectural patterns.",
            icon: BrainCircuit,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            count: "15 Topics"
        },
        {
            title: "Behavioral Interviews",
            description: "STAR method, leadership principles, and soft skills.",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            count: "20+ Scenarios"
        },
        {
            title: "Frontend Machine Coding",
            description: "DOM manipulation, React patterns, and performance.",
            icon: Code,
            color: "text-green-500",
            bg: "bg-green-500/10",
            count: "30 Challenges"
        },
        {
            title: "Core CS Concepts",
            description: "OS, DBMS, CN, and OOPS concepts for quick revision.",
            icon: Book,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            count: "4 Modules"
        }
    ];

    const upcomingMock = {
        date: "Tomorrow, 4:00 PM",
        interviewer: "Sarah J. (Google)",
        type: "System Design Round"
    };

    return (
        <div className="animate-fade-in space-y-8 max-w-6xl mx-auto">
            <header>
                <h1 className="text-3xl font-display font-bold text-text">Interview Preparation</h1>
                <p className="text-textMuted mt-2">Everything you need to crack your dream job.</p>
            </header>

            {/* Featured / Mock Interview Status */}
            <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
                <div>
                    <h2 className="text-2xl font-bold text-text mb-2">Upcoming Mock Interview</h2>
                    <p className="text-textMuted flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {upcomingMock.type} with {upcomingMock.interviewer}
                    </p>
                    <p className="text-sm text-textMuted mt-1">{upcomingMock.date}</p>
                </div>
                <button className="px-6 py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/20">
                    Join Waiting Room
                </button>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((res, idx) => (
                    <motion.div
                        key={res.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex items-start gap-4 group cursor-pointer"
                    >
                        <div className={`p-3 rounded-lg ${res.bg} ${res.color}`}>
                            <res.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">{res.title}</h3>
                            <p className="text-textMuted text-sm mt-1 leading-relaxed">
                                {res.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs font-medium text-textMuted bg-surfaceHighlight px-2 py-1 rounded">
                                    {res.count}
                                </span>
                                <ArrowRight size={18} className="text-textMuted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Daily Practice */}
            <div className="glass-panel p-6">
                <h3 className="font-bold text-lg text-text mb-4">Daily Practice Problem</h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-surfaceHighlight/30 border border-border/50">
                    <div>
                        <h4 className="font-medium text-text">Design a Rate Limiter</h4>
                        <span className="text-xs text-yellow-500 mt-1 block">Medium • System Design</span>
                    </div>
                    <button className="px-4 py-2 bg-surface hover:bg-surfaceHighlight border border-border rounded-lg text-sm text-text transition-colors">
                        Start Challenge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewPrep;
