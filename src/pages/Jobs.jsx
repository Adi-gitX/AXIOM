import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, Globe, Clock, DollarSign, Filter, RefreshCw, Bookmark, CheckCircle, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';

const JOBS = [
    {
        id: 1,
        role: "Senior Frontend Engineer",
        company: "Vercel",
        location: "Remote",
        type: "Full-time",
        stack: ["React", "Next.js", "TypeScript"],
        salary: "k - k",
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
        salary: "k - k",
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
        salary: "/hr",
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
        <div className="animate-fade-in space-y-6 max-w-5xl mx-auto">
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text">Internships & Jobs</h1>
                    <p className="text-textMuted mt-1">Curated opportunities from top companies.</p>
                </div>
                <button 
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surfaceHighlight border border-border rounded-lg text-sm font-medium transition-colors"
                >
                    <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Fetching...' : 'Sync Opportunities'}
                </button>
            </div>

            {/* Search & Filter */}
            <div className="glass-panel p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-textMuted" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by role, company, or stack..." 
                        className="w-full bg-surfaceHighlight/50 border border-border/50 rounded-xl py-2.5 pl-10 pr-4 text-text placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-surfaceHighlight/50 border border-border/50 rounded-xl px-4 py-2.5 text-text focus:outline-none cursor-pointer">
                        <option>Any Location</option>
                        <option>Remote</option>
                        <option>On-site</option>
                    </select>
                    <button className="p-2.5 bg-surfaceHighlight/50 border border-border/50 rounded-xl text-text hover:text-primary transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Job List */}
            <div className="space-y-4">
                {JOBS.map((job) => {
                    const isSaved = savedJobs.includes(job.id);
                    const isApplied = appliedJobs.includes(job.id);

                    return (
                        <motion.div 
                            key={job.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.01 }}
                            className="glass-card p-6 flex flex-col md:flex-row gap-6 group cursor-pointer relative"
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg bg-white p-1 object-contain" />
                                <div>
                                    <h3 className="font-bold text-lg text-text group-hover:text-primary transition-colors">{job.role}</h3>
                                    <p className="font-medium text-textMuted">{job.company}</p>
                                    
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <span className="flex items-center gap-1.5 text-sm text-textMuted">
                                            <MapPin size={14} /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm text-textMuted">
                                            <Clock size={14} /> {job.type}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm text-textMuted">
                                            <DollarSign size={14} /> {job.salary}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between gap-4">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); saveJob(job.id); }}
                                        className={`p-2 rounded-lg transition-colors ${isSaved ? 'text-primary bg-primary/10' : 'text-textMuted hover:text-text hover:bg-surfaceHighlight'}`}
                                    >
                                        <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                                    </button>
                                    {job.stack.map(tech => (
                                        <span key={tech} className="text-xs font-medium px-2 py-1 rounded bg-surface border border-border text-textMuted hidden md:inline-block">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-textMuted">{job.posted}</span>
                                    {isApplied ? (
                                        <button disabled className="px-4 py-2 bg-green-500/20 text-green-500 border border-green-500/50 text-sm font-medium rounded-lg flex items-center gap-2 cursor-default">
                                            <CheckCircle size={16} />
                                            Applied
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); applyToJob(job.id); }}
                                            className="px-4 py-2 bg-primary hover:bg-primaryHover text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            Apply Now <ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Jobs;
