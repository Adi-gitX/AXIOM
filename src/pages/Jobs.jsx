import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, Globe, Clock, DollarSign, Filter, RefreshCw, Bookmark, CheckCircle, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import GlassCard from '../components/ui/GlassCard';

const JOBS = [
    {
        id: 1,
        role: "Senior Frontend Engineer",
        company: "Vercel",
        location: "Remote",
        type: "Full-time",
        stack: ["React", "Next.js", "TypeScript"],
        salary: "$140k - $180k",
        posted: "2 hours ago",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=VE"
    },
    {
        id: 2,
        role: "Software Engineer II",
        company: "Google",
        location: "Bangalore, IN",
        type: "Hybrid",
        stack: ["C++", "Python", "System Design"],
        salary: "₹35L - ₹55L",
        posted: "5 hours ago",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=GO"
    },
    {
        id: 3,
        role: "Product Designer",
        company: "Airbnb",
        location: "San Francisco, CA",
        type: "On-site",
        stack: ["Figma", "UI/UX", "Prototyping"],
        salary: "$160k - $220k",
        posted: "1 day ago",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=AI"
    },
    {
        id: 4,
        role: "Backend Developer",
        company: "Netflix",
        location: "Remote",
        type: "Contract",
        stack: ["Java", "Spring Boot", "Kafka"],
        salary: "$120/hr",
        posted: "Just now",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=NE"
    },
];

const Jobs = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { savedJobs, appliedJobs, saveJob, applyToJob } = useStore();

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-6 max-w-6xl mx-auto pb-10">
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Internships & Jobs</h1>
                    <p className="text-white/60">Curated opportunities from top companies.</p>
                </div>
                <button 
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-colors text-white"
                >
                    <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Fetching...' : 'Sync Opportunities'}
                </button>
            </div>

            {/* Search & Filter */}
            <GlassCard className="p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by role, company, or stack..." 
                        className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-black/20 border border-white/5 rounded-xl px-6 py-3 text-white focus:outline-none cursor-pointer appearance-none hover:bg-black/30 transition-colors">
                        <option>Any Location</option>
                        <option>Remote</option>
                        <option>On-site</option>
                    </select>
                    <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                        <Filter size={20} />
                    </button>
                </div>
            </GlassCard>

            {/* Job List */}
            <div className="space-y-4">
                {JOBS.map((job) => {
                    const isSaved = savedJobs.includes(job.id);
                    const isApplied = appliedJobs.includes(job.id);

                    return (
                        <GlassCard 
                            key={job.id}
                            className="p-6 flex flex-col md:flex-row gap-6 group cursor-pointer border-white/5 hover:border-blue-500/30"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex items-start gap-5 flex-1">
                                <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-2xl bg-white p-2 object-contain shadow-lg" />
                                <div>
                                    <h3 className="font-bold text-2xl text-white group-hover:text-blue-400 transition-colors">{job.role}</h3>
                                    <p className="font-medium text-white/60 text-lg mb-4">{job.company}</p>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        <Badge icon={MapPin}>{job.location}</Badge>
                                        <Badge icon={Clock}>{job.type}</Badge>
                                        <Badge icon={DollarSign} className="text-green-400 border-green-500/20 bg-green-500/5">{job.salary}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between gap-4">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); saveJob(job.id); }}
                                        className={`p-3 rounded-xl transition-colors ${isSaved ? 'text-blue-400 bg-blue-500/10' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                                    >
                                        <Bookmark size={22} fill={isSaved ? "currentColor" : "none"} />
                                    </button>
                                    {job.stack.map(tech => (
                                        <span key={tech} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/50 hidden md:inline-block">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                                    <span className="text-sm text-white/30 hidden md:inline-block">{job.posted}</span>
                                    {isApplied ? (
                                        <button disabled className="px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/20 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-default w-full md:w-auto">
                                            <CheckCircle size={18} />
                                            Applied
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); applyToJob(job.id); }}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 w-full md:w-auto"
                                        >
                                            Apply Now <ArrowRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
};

const Badge = ({ children, icon: Icon, className }) => (
    <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 ${className}`}>
        {Icon && <Icon size={14} />}
        {children}
    </span>
);

export default Jobs;
