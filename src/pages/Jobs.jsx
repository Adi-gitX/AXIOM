import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, DollarSign, Filter, RefreshCw, Bookmark, CheckCircle, ArrowRight, Building2 } from 'lucide-react';
import useStore from '../store/useStore';

const JOBS = [
    { id: 1, role: "Senior Frontend Engineer", company: "Vercel", location: "Remote", type: "Full-time", stack: ["React", "Next.js", "TypeScript"], salary: "$140k - $180k", posted: "2h ago", logo: "https://api.dicebear.com/7.x/initials/svg?seed=VE&backgroundColor=000000&textColor=ffffff" },
    { id: 2, role: "Software Engineer II", company: "Google", location: "Bangalore", type: "Hybrid", stack: ["C++", "Python"], salary: "₹35L - ₹55L", posted: "5h ago", logo: "https://api.dicebear.com/7.x/initials/svg?seed=GO&backgroundColor=4285f4&textColor=ffffff" },
    { id: 3, role: "Product Designer", company: "Airbnb", location: "San Francisco", type: "On-site", stack: ["Figma", "UI/UX"], salary: "$160k - $220k", posted: "1d ago", logo: "https://api.dicebear.com/7.x/initials/svg?seed=AB&backgroundColor=ff5a5f&textColor=ffffff" },
    { id: 4, role: "Backend Developer", company: "Netflix", location: "Remote", type: "Contract", stack: ["Java", "Spring"], salary: "$120/hr", posted: "Just now", logo: "https://api.dicebear.com/7.x/initials/svg?seed=NF&backgroundColor=e50914&textColor=ffffff" },
];

const Jobs = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { savedJobs, appliedJobs, saveJob, applyToJob } = useStore();

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-[1100px] mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <header>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display mb-2">Internships & Jobs</h1>
                        <p className="text-gray-500 text-lg">Curated opportunities from top companies</p>
                    </header>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors"
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        {isRefreshing ? 'Syncing...' : 'Sync Jobs'}
                    </button>
                </div>

                {/* Search */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by role, company, or stack..."
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-sm"
                        />
                    </div>
                    <select className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm font-medium focus:outline-none cursor-pointer hover:border-gray-300 transition-colors">
                        <option>Any Location</option>
                        <option>Remote</option>
                        <option>On-site</option>
                    </select>
                    <button className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                        <Filter size={18} />
                    </button>
                </div>

                {/* Job List */}
                <div className="space-y-3">
                    {JOBS.map((job, idx) => {
                        const isSaved = savedJobs.includes(job.id);
                        const isApplied = appliedJobs.includes(job.id);

                        return (
                            <motion.div
                                key={job.id}
                                className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all flex flex-col md:flex-row gap-5 group"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-xl object-cover" />
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">{job.role}</h3>
                                        <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                                            <Building2 size={14} /> {job.company}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge><MapPin size={12} /> {job.location}</Badge>
                                            <Badge><Clock size={12} /> {job.type}</Badge>
                                            <Badge className="text-emerald-600 bg-emerald-50 border-emerald-100"><DollarSign size={12} /> {job.salary}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => saveJob(job.id)}
                                            className={`p-2 rounded-lg transition-colors ${isSaved ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                                        </button>
                                        <span className="text-xs text-gray-400">{job.posted}</span>
                                    </div>
                                    {isApplied ? (
                                        <button disabled className="px-4 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm font-semibold rounded-xl flex items-center gap-2">
                                            <CheckCircle size={14} /> Applied
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => applyToJob(job.id)}
                                            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                                        >
                                            Apply <ArrowRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const Badge = ({ children, className = "" }) => (
    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-100 ${className}`}>
        {children}
    </span>
);

export default Jobs;
