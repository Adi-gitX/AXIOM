import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    MapPin,
    Briefcase,
    Link as LinkIcon,
    Plus,
    Github,
    Linkedin,
    Twitter,
    Youtube,
    Globe,
    FileText,
    Settings,
    X,
    Check
} from 'lucide-react';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [user, setUser] = useState({
        name: 'Aditya Kammati',
        role: 'Senior Full Stack Engineer',
        location: 'San Francisco, CA',
        bio: 'Building the future of developer tools. Passionate about distributed systems, UI/UX, and AI agents.',
        avatar: 'https://github.com/shadcn.png',
        banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
        resume: 'resume.pdf'
    });

    const [socials, setSocials] = useState([
        { id: '1', platform: 'GitHub', url: 'https://github.com/Adi-gitX', icon: Github, color: 'hover:text-black dark:hover:text-white' },
        { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com/in/kammatiaditya', icon: Linkedin, color: 'hover:text-[#0077b5]' }
    ]);

    const [newSocial, setNewSocial] = useState({ platform: 'GitHub', url: '' });

    const platforms = [
        { name: 'GitHub', icon: Github },
        { name: 'LinkedIn', icon: Linkedin },
        { name: 'Twitter', icon: Twitter },
        { name: 'YouTube', icon: Youtube },
        { name: 'Website', icon: Globe },
    ];

    const handleAddSocial = () => {
        if (!newSocial.url) return;
        const platformData = platforms.find(p => p.name === newSocial.platform);
        setSocials([...socials, {
            id: Date.now().toString(),
            platform: newSocial.platform,
            url: newSocial.url,
            icon: platformData.icon,
            color: 'hover:text-primary'
        }]);
        setNewSocial({ platform: 'GitHub', url: '' });
        setShowSocialModal(false);
    };

    return (
        <div className="flex-1 min-h-screen bg-background text-foreground font-sans p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Profile Header */}
                <div className="relative group rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl">
                    {/* Banner */}
                    <div className="h-64 md:h-80 w-full overflow-hidden relative">
                        <img src={user.banner} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Profile Info */}
                    <div className="px-8 pb-8 -mt-20 relative flex flex-col md:flex-row items-end md:items-start gap-6">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-[2rem] border-4 border-background overflow-hidden relative group/avatar shadow-2xl">
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                        </div>

                        <div className="flex-1 pt-20 md:pt-24 min-w-0 text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                <div>
                                    <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">{user.name}</h1>
                                    <p className="text-lg text-muted-foreground font-medium mt-1">{user.role}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-muted-foreground/80">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.location}</span>
                                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> Available for hire</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setIsEditing(!isEditing)} className="px-6 py-2.5 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95">
                                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                                    </button>
                                    <button className="p-2.5 rounded-full border border-border hover:bg-muted/50 transition-all">
                                        <Settings className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Bio Section */}
                        <section className="p-8 rounded-[2rem] bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                                About
                                {isEditing && <span className="text-xs font-sans font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">Editing</span>}
                            </h2>
                            {isEditing ? (
                                <textarea
                                    value={user.bio}
                                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                    className="w-full bg-muted/50 border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                                />
                            ) : (
                                <p className="text-muted-foreground leading-relaxed text-lg">{user.bio}</p>
                            )}
                        </section>

                        {/* Tech Stack / Stats (Placeholder for "lot more details") */}
                        <section className="grid grid-cols-2 gap-4">
                            {['React', 'Node.js', 'TypeScript', 'Tailwind', 'Python', 'AWS'].map((tech) => (
                                <div key={tech} className="p-4 rounded-2xl bg-background/30 border border-white/10 flex items-center justify-between group hover:bg-background/50 transition-all cursor-default">
                                    <span className="font-semibold text-foreground/80">{tech}</span>
                                    <div className="w-2 h-2 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors shadow-glow" />
                                </div>
                            ))}
                        </section>

                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">

                        {/* Socials */}
                        <div className="p-6 rounded-[2rem] bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold font-display">Connect</h3>
                                <button onClick={() => setShowSocialModal(true)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {socials.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all group border border-transparent hover:border-border/50"
                                    >
                                        <div className="p-2 rounded-lg bg-background shadow-sm group-hover:scale-110 transition-transform">
                                            <social.icon className={`w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{social.platform}</p>
                                            <p className="text-xs text-muted-foreground truncate opacity-60 group-hover:opacity-100">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</p>
                                        </div>
                                        <LinkIcon className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/50" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Resume */}
                        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Resume</h3>
                                    <p className="text-xs text-muted-foreground">PDF, 2.4 MB</p>
                                </div>
                            </div>
                            <button className="w-full py-3 rounded-xl border border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                                Download Resume <Check className="w-4 h-4" />
                            </button>
                        </div>

                    </div>
                </div>

            </div>

            {/* Add Social Modal */}
            <AnimatePresence>
                {showSocialModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-background rounded-3xl border border-white/20 shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold font-display">Add Social Link</h3>
                                <button onClick={() => setShowSocialModal(false)} className="p-2 hover:bg-muted rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Platform</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {platforms.map(p => (
                                            <button
                                                key={p.name}
                                                onClick={() => setNewSocial({ ...newSocial, platform: p.name })}
                                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${newSocial.platform === p.name ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-muted/50'}`}
                                            >
                                                <p.icon className="w-6 h-6" />
                                                <span className="text-[10px] font-bold">{p.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">URL</label>
                                    <input
                                        type="text"
                                        value={newSocial.url}
                                        onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <button onClick={handleAddSocial} className="w-full py-4 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-all mt-4">
                                    Add Link
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Profile;
