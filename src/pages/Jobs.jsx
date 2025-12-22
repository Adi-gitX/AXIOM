import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Globe, Clock, DollarSign, Filter, RefreshCw } from 'lucide-react';

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
        salary: "$120k - $160k",
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
        salary: "$90/hr",
        posted: "Just now",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=NE"
    },
];

const Jobs = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

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
                {JOBS.map((job) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        className="glass-card p-6 flex flex-col md:flex-row gap-6 group cursor-pointer"
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
                                {job.stack.map(tech => (
                                    <span key={tech} className="text-xs font-medium px-2 py-1 rounded bg-surface border border-border text-textMuted">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-textMuted">{job.posted}</span>
                                <button className="px-4 py-2 bg-primary hover:bg-primaryHover text-white text-sm font-medium rounded-lg transition-colors">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Jobs;
