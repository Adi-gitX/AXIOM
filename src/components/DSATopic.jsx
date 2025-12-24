import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Circle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DSATopic = ({ topic }) => {
    const [isOpen, setIsOpen] = useState(false);

    const solvedCount = topic.problems.filter(p => p.status === 'solved').length;
    const progress = (solvedCount / topic.problems.length) * 100;

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        {solvedCount}/{topic.problems.length}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100"
                    >
                        <div className="divide-y divide-gray-50">
                            {topic.problems.map(problem => (
                                <div key={problem.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/50 transition-colors group">
                                    <div className="flex items-center gap-2.5 flex-1">
                                        {problem.status === 'solved'
                                            ? <CheckCircle size={16} className="text-green-500 shrink-0" />
                                            : <Circle size={16} className="text-gray-300 shrink-0" />
                                        }
                                        <span className="text-sm text-gray-700">{problem.title}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                                                problem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <a href={problem.link} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-blue-500 transition-colors p-1.5 rounded opacity-0 group-hover:opacity-100">
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DSATopic;
