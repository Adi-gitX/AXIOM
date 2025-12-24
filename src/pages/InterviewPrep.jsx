import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Users, BrainCircuit, ArrowRight, Play, Clock } from 'lucide-react';

const InterviewPrep = () => {
    const resources = [
        {
            title: "System Design",
            description: "Scalability, distributed systems, and architectural patterns.",
            icon: BrainCircuit,
            count: "15 Topics",
            color: "bg-violet-50 text-violet-600 border-violet-100"
        },
        {
            title: "Behavioral",
            description: "STAR method, leadership principles, and soft skills.",
            icon: Users,
            count: "20+ Scenarios",
            color: "bg-blue-50 text-blue-600 border-blue-100"
        },
        {
            title: "Machine Coding",
            description: "DOM manipulation, React patterns, and optimization.",
            icon: Code,
            count: "30 Challenges",
            color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        },
        {
            title: "Core CS",
            description: "OS, DBMS, CN, and OOPS for quick revision.",
            icon: Book,
            count: "4 Modules",
            color: "bg-amber-50 text-amber-600 border-amber-100"
        }
    ];

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-[1100px] mx-auto space-y-8">

                {/* Header */}
                <header>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display mb-2">
                        Interview Prep
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Everything you need to crack your dream job
                    </p>
                </header>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map((res, idx) => (
                        <motion.div
                            key={res.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer group hover:border-gray-200 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${res.color} border flex items-center justify-center shrink-0`}>
                                    <res.icon size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                                        {res.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        {res.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                                            {res.count}
                                        </span>
                                        <ArrowRight size={18} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Daily Challenge */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Daily Practice</h3>
                        <span className="text-xs text-gray-400">Refreshes in 8 hours</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                <BrainCircuit size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Design a Rate Limiter</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">Medium</span>
                                    <span className="text-xs text-gray-400">• System Design</span>
                                </div>
                            </div>
                        </div>
                        <button className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                            <Play size={14} />
                            Start
                        </button>
                    </div>
                </div>

                {/* Mock Interview CTA */}
                <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Ready for a Mock Interview?</h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Practice with AI-powered mock interviews and get instant feedback on your performance.
                        </p>
                        <button className="px-5 py-3 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                            Start Mock Interview
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
            </div>
        </div>
    );
};

export default InterviewPrep;
