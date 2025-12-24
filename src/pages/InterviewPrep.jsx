import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Users, BrainCircuit, ArrowRight } from 'lucide-react';

const InterviewPrep = () => {
    const resources = [
        { title: "System Design", description: "Scalability, distributed systems, and architectural patterns.", icon: BrainCircuit, count: "15 Topics", color: "from-violet-500 to-purple-600" },
        { title: "Behavioral", description: "STAR method, leadership principles, and soft skills.", icon: Users, count: "20+ Scenarios", color: "from-blue-500 to-cyan-500" },
        { title: "Machine Coding", description: "DOM, React patterns, and performance optimization.", icon: Code, count: "30 Challenges", color: "from-emerald-500 to-teal-500" },
        { title: "Core CS", description: "OS, DBMS, CN, and OOPS for quick revision.", icon: Book, count: "4 Modules", color: "from-amber-500 to-orange-500" }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] p-8 lg:p-12">
            <div className="max-w-[1100px] mx-auto space-y-10">
                <header>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight font-display mb-3">Interview Prep</h1>
                    <p className="text-gray-500 text-lg max-w-xl">Everything you need to crack your dream job.</p>
                </header>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {resources.map((res, idx) => (
                        <motion.div
                            key={res.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer group bg-gradient-to-br ${res.color} text-white shadow-lg hover:shadow-2xl transition-shadow`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <res.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-1">{res.title}</h3>
                                    <p className="text-white/80 text-sm leading-relaxed">{res.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">{res.count}</span>
                                        <ArrowRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Daily Challenge */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Daily Practice</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                            <h4 className="font-semibold text-gray-900">Design a Rate Limiter</h4>
                            <span className="text-xs text-amber-600 font-medium">Medium • System Design</span>
                        </div>
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPrep;
