import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Target,
    Zap,
    BookOpen,
    Code2,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    Play,
    Calendar,
    Flame
} from 'lucide-react';

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subtext, trend, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-emerald-50 text-emerald-600",
        purple: "bg-violet-50 text-violet-600",
        amber: "bg-amber-50 text-amber-600"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp size={10} />
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{value}</p>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </motion.div>
    );
};

// Activity Chart
const ActivityChart = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [4, 7, 3, 8, 5, 9, 6];
    const maxValue = Math.max(...values);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Weekly Activity</h3>
                    <p className="text-sm text-gray-400">Problems solved this week</p>
                </div>
                <select className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-100 cursor-pointer">
                    <option>This Week</option>
                    <option>Last Week</option>
                    <option>This Month</option>
                </select>
            </div>
            <div className="flex items-end justify-between gap-4 h-44">
                {days.map((day, i) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-3">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(values[i] / maxValue) * 100}%` }}
                            transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                            className={`w-full rounded-xl ${i === 5 ? 'bg-gray-900' : 'bg-gray-100 hover:bg-gray-200'} min-h-[12px] transition-colors cursor-pointer`}
                        />
                        <span className={`text-xs font-medium ${i === 5 ? 'text-gray-900' : 'text-gray-400'}`}>{day}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// Skill Progress Component
const SkillProgress = () => {
    const skills = [
        { name: 'Arrays & Hashing', progress: 85, color: 'bg-blue-500' },
        { name: 'Two Pointers', progress: 70, color: 'bg-violet-500' },
        { name: 'Binary Search', progress: 60, color: 'bg-emerald-500' },
        { name: 'Dynamic Programming', progress: 35, color: 'bg-amber-500' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
        >
            <h3 className="font-semibold text-gray-900 text-lg mb-5">Skill Distribution</h3>
            <div className="space-y-5">
                {skills.map((skill, i) => (
                    <div key={skill.name}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 font-medium">{skill.name}</span>
                            <span className="text-xs font-bold text-gray-400">{skill.progress}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.progress}%` }}
                                transition={{ duration: 0.8, delay: 0.3 + (i * 0.1) }}
                                className={`h-full ${skill.color} rounded-full`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// Recent Activity Component
const RecentActivity = () => {
    const activities = [
        { icon: CheckCircle2, text: 'Completed "Two Sum"', time: '2 hours ago', color: 'text-emerald-500 bg-emerald-50' },
        { icon: Play, text: 'Started System Design course', time: '5 hours ago', color: 'text-blue-500 bg-blue-50' },
        { icon: Flame, text: 'Achieved 7-day streak', time: 'Yesterday', color: 'text-amber-500 bg-amber-50' },
        { icon: Code2, text: 'Solved "Valid Parentheses"', time: 'Yesterday', color: 'text-violet-500 bg-violet-50' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
        >
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">View all</button>
            </div>
            <div className="space-y-4">
                {activities.map((activity, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activity.color} transition-transform group-hover:scale-105`}>
                            <activity.icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 font-medium truncate group-hover:text-gray-900 transition-colors">{activity.text}</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// Quick Actions Component
const QuickActions = () => {
    const actions = [
        { label: 'Continue DSA', icon: Code2, href: '/app/dsa' },
        { label: 'Watch Course', icon: Play, href: '/app/education' },
        { label: 'Mock Interview', icon: BookOpen, href: '/app/interview' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
        >
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
                {actions.map((action, i) => (
                    <motion.a
                        key={action.label}
                        href={action.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + (i * 0.1) }}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                <action.icon size={18} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                        </div>
                        <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-display"
                        >
                            {greeting}, Aditya
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 text-sm mt-1"
                        >
                            Here's your progress overview
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 shadow-sm"
                    >
                        <Calendar size={14} />
                        <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </motion.div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Target}
                        label="Problems Solved"
                        value="124"
                        trend="+12%"
                        color="blue"
                        subtext="28 this week"
                    />
                    <StatCard
                        icon={Zap}
                        label="Current Streak"
                        value="7 days"
                        color="amber"
                        subtext="Best: 21 days"
                    />
                    <StatCard
                        icon={Clock}
                        label="Study Time"
                        value="14.5h"
                        trend="+8%"
                        color="purple"
                        subtext="This week"
                    />
                    <StatCard
                        icon={BookOpen}
                        label="Courses Completed"
                        value="8"
                        color="green"
                        subtext="3 in progress"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        <ActivityChart />
                        <SkillProgress />
                    </div>

                    {/* Right Column - Actions & Activity */}
                    <div className="space-y-6">
                        <QuickActions />
                        <RecentActivity />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
