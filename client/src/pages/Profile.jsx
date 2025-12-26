import React, { useState, useEffect, useRef } from 'react';
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
    ExternalLink,
    Image as ImageIcon,
    Loader2,
    Settings,
    FileText,
    Check,
    Upload,
    Calendar,
    Trash2,
    X,
    Share2
} from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { cn } from '../lib/utils';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../stores/useUserStore';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-xl border font-medium",
                type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
            )}
        >
            {type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {message}
        </motion.div>
    );
};

const Profile = () => {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    const defaultUser = {
        name: currentUser?.displayName || 'Aditya Kammati',
        role: 'Senior Full Stack Engineer',
        location: 'San Francisco, CA',
        bio: 'Building the future of developer tools. Passionate about distributed systems, UI/UX, and AI agents.',
        avatar: currentUser?.photoURL || 'https://github.com/shadcn.png',
        banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
        resumeName: '',
        resumeUrl: ''
    };

    const defaultSocials = [
        { id: '1', platform: 'GitHub', url: 'https://github.com/Adi-gitX', iconName: 'Github' },
        { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com/in/kammatiaditya', iconName: 'Linkedin' }
    ];

    const defaultSkills = ['React', 'Node.js', 'TypeScript', 'Tailwind', 'Python', 'AWS'];

    const defaultExperience = [
        {
            id: 1,
            role: 'Senior Engineer',
            company: 'Tech Corp',
            period: '2023 - Present',
            description: 'Leading the frontend infrastructure team and architecting the new design system.'
        },
        {
            id: 2,
            role: 'Full Stack Developer',
            company: 'Startup Inc',
            period: '2021 - 2023',
            description: 'Built the MVP from scratch and scaled it to 100k users. Handled both React frontend and Node backend.'
        }
    ];

    const { user: storeUser, setUser: setStoreUser } = useUserStore();
    const [user, setUser] = useState(defaultUser);
    const [socials, setSocials] = useState(defaultSocials);
    const [skills, setSkills] = useState(defaultSkills);
    const [experience, setExperience] = useState(defaultExperience);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.email) {
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            let data = storeUser;

            if (!data) {
                try {
                    const API_URL = import.meta.env.VITE_API_URL || '';
                    const response = await fetch(`${API_URL}/api/users/${currentUser.email}`);
                    if (response.ok) {
                        data = await response.json();
                        setStoreUser(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            }

            // Always merge with defaultUser to ensure Auth fallback
            setUser({
                name: data?.name || defaultUser.name,
                role: data?.role || defaultUser.role,
                location: data?.location || defaultUser.location,
                bio: data?.bio || defaultUser.bio,
                avatar: data?.avatar || defaultUser.avatar,
                banner: data?.banner || defaultUser.banner,
                resumeName: data?.resume_name || defaultUser.resumeName,
                resumeUrl: data?.resume_url || defaultUser.resumeUrl
            });

            if (data) {
                setExperience(data.experience || defaultExperience);
                setSkills(data.skills || defaultSkills);
                setSocials(data.socials || defaultSocials);
            }
            setIsLoading(false);
        };

        loadData();
    }, [currentUser, storeUser, setStoreUser]);

    const [showSocialModal, setShowSocialModal] = useState(false);
    const [newSocial, setNewSocial] = useState({ platform: 'GitHub', url: '' });
    const [newSkill, setNewSkill] = useState('');

    const iconMap = {
        Github: Github,
        Linkedin: Linkedin,
        Twitter: Twitter,
        Youtube: Youtube,
        Globe: Globe
    };

    const platforms = [
        { name: 'GitHub', icon: Github },
        { name: 'LinkedIn', icon: Linkedin },
        { name: 'Twitter', icon: Twitter },
        { name: 'YouTube', icon: Youtube },
        { name: 'Website', icon: Globe },
    ];

    const showNotification = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleSave = async () => {
        if (!currentUser) {
            showNotification('Please log in to save changes', 'error');
            return;
        }

        try {
            const payload = {
                email: currentUser.email,
                name: user.name,
                role: user.role,
                location: user.location,
                bio: user.bio,
                avatar: user.avatar,
                banner: user.banner,
                experience,
                skills,
                socials,
                resume_url: user.resumeUrl,
                resume_name: user.resumeName
            };

            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save');

            const savedUser = await response.json();
            setStoreUser(savedUser);

            await updateProfile(currentUser, {
                displayName: user.name,
                photoURL: user.avatar
            });

            setIsEditing(false);
            showNotification('Profile saved successfully!');
        } catch (error) {
            console.error(error);
            showNotification('Error saving profile', 'error');
        }
    };

    const handleAddSocial = () => {
        if (!newSocial.url) return;
        const iconName = platforms.find(p => p.name === newSocial.platform)?.name === 'Website' ? 'Globe' : newSocial.platform;

        const updatedSocials = [...socials, {
            id: Date.now().toString(),
            platform: newSocial.platform,
            url: newSocial.url,
            iconName: iconName || 'Globe'
        }];

        setSocials(updatedSocials);
        setNewSocial({ platform: 'GitHub', url: '' });
        setShowSocialModal(false);
    };

    const removeSocial = (id) => {
        const updated = socials.filter(s => s.id !== id);
        setSocials(updated);
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            if (skills.includes(newSkill.trim())) {
                showNotification('Skill already exists', 'error');
                return;
            }
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleExperienceChange = (id, field, value) => {
        setExperience(experience.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        ));
    };

    const addExperience = () => {
        setExperience([
            {
                id: Date.now(),
                role: 'New Role',
                company: 'Company Name',
                period: 'Year - Year',
                description: 'Description of your role...'
            },
            ...experience
        ]);
    };

    const removeExperience = (id) => {
        setExperience(experience.filter(e => e.id !== id));
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                showNotification('Uploading Resume...', 'success');
                const url = await uploadToCloudinary(file);
                if (url) {
                    setUser(prev => ({ ...prev, resumeName: file.name, resumeUrl: url }));
                    showNotification('Resume uploaded successfully!');
                }
            } catch (error) {
                console.error(error);
                showNotification('Failed to upload resume', 'error');
            }
        }
    };

    const bannerInputRef = useRef(null);
    const avatarInputRef = useRef(null);

    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (file) {
            try {
                showNotification(`Uploading ${field}...`, 'success');
                const url = await uploadToCloudinary(file);
                if (url) {
                    setUser(prev => ({ ...prev, [field]: url }));
                    showNotification(`${field === 'avatar' ? 'Profile picture' : 'Banner'} uploaded!`);
                }
            } catch (error) {
                showNotification(`Failed to upload ${field}`, 'error');
            }
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading Profile...</div>;
    }

    return (
        <div className="flex-1 min-h-screen bg-transparent text-foreground font-sans p-4 md:p-8 overflow-y-auto custom-scrollbar pb-32">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="relative group rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl transition-all duration-500 hover:shadow-primary/5">
                    <div className="h-64 md:h-80 w-full overflow-hidden relative">
                        <img src={user.banner} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                        <input
                            type="file"
                            ref={bannerInputRef}
                            onChange={(e) => handleImageUpload(e, 'banner')}
                            className="hidden"
                            accept="image/*"
                        />
                        {isEditing && (
                            <button
                                onClick={() => bannerInputRef.current?.click()}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all z-10"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="px-8 pb-8 -mt-20 relative flex flex-col md:flex-row items-end md:items-start gap-6">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-[2rem] border-4 border-background overflow-hidden relative group/avatar shadow-2xl bg-muted">
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                <input
                                    type="file"
                                    ref={avatarInputRef}
                                    onChange={(e) => handleImageUpload(e, 'avatar')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {isEditing && (
                                    <div
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer backdrop-blur-[1px] transition-opacity"
                                    >
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background shadow-lg" />
                        </div>
                        <div className="flex-1 pt-20 md:pt-24 min-w-0 text-center md:text-left w-full">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                <div className="space-y-2 w-full md:w-auto">
                                    {isEditing ? (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                            <input
                                                value={user.name}
                                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                                className="text-4xl font-bold font-display bg-transparent border-b border-white/20 focus:border-primary focus:outline-none w-full md:w-auto"
                                            />
                                            <input
                                                value={user.role}
                                                onChange={(e) => setUser({ ...user, role: e.target.value })}
                                                className="text-lg text-muted-foreground font-medium bg-transparent border-b border-white/20 focus:border-primary focus:outline-none w-full md:w-auto block"
                                            />
                                            <input
                                                value={user.location}
                                                onChange={(e) => setUser({ ...user, location: e.target.value })}
                                                className="text-sm text-muted-foreground bg-transparent border-b border-white/20 focus:border-primary focus:outline-none w-full md:w-auto block"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">{user.name}</h1>
                                            <p className="text-lg text-muted-foreground font-medium">{user.role}</p>
                                            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground/80">
                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.location}</span>
                                                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> Available for hire</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    {isEditing ? (
                                        <button onClick={handleSave} className="px-6 py-2.5 rounded-full bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                                            <Check className="w-4 h-4" /> Save
                                        </button>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95">
                                            Edit Profile
                                        </button>
                                    )}
                                    <button className="p-2.5 rounded-full border border-border hover:bg-muted/50 transition-all">
                                        <Settings className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section className="p-8 rounded-[2rem] bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                                About
                                {isEditing && <span className="text-xs font-sans font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">Editing</span>}
                            </h2>
                            {isEditing ? (
                                <textarea
                                    value={user.bio}
                                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                    className="w-full bg-muted/50 border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]"
                                />
                            ) : (
                                <p className="text-muted-foreground leading-relaxed text-lg">{user.bio}</p>
                            )}
                        </section>

                        <section className="p-8 rounded-[2rem] bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold font-display">Experience</h2>
                                {isEditing && (
                                    <button onClick={addExperience} className="text-xs flex items-center gap-1 bg-foreground/5 hover:bg-foreground/10 px-3 py-1.5 rounded-full transition-colors">
                                        <Plus className="w-3 h-3" /> Add Role
                                    </button>
                                )}
                            </div>

                            <div className="space-y-8">
                                <AnimatePresence initial={false}>
                                    {experience.map((exp, index) => (
                                        <motion.div
                                            key={exp.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="relative pl-8 border-l-2 border-border last:border-0"
                                        >
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />

                                            {isEditing ? (
                                                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-white/5">
                                                    <div className="flex justify-between items-start">
                                                        <input
                                                            value={exp.role}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                                                            className="font-bold bg-transparent border-b border-white/10 w-full focus:outline-none focus:border-primary"
                                                            placeholder="Role"
                                                        />
                                                        <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={exp.company}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                                            className="text-sm font-medium bg-transparent border-b border-white/10 flex-1 focus:outline-none focus:border-primary"
                                                            placeholder="Company"
                                                        />
                                                        <input
                                                            value={exp.period}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'period', e.target.value)}
                                                            className="text-sm text-muted-foreground bg-transparent border-b border-white/10 w-32 focus:outline-none focus:border-primary"
                                                            placeholder="Period"
                                                        />
                                                    </div>
                                                    <textarea
                                                        value={exp.description}
                                                        onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                                        className="w-full text-sm bg-transparent border border-white/10 rounded-lg p-2 focus:outline-none focus:border-primary resize-none"
                                                        rows={2}
                                                        placeholder="Description"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="font-bold text-lg text-foreground">{exp.role}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 mb-2">
                                                        <span className="font-medium text-foreground/80">{exp.company}</span>
                                                        <span>•</span>
                                                        <span>{exp.period}</span>
                                                    </div>
                                                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                                                </>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>

                        <section className="p-8 rounded-[2rem] bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold font-display mb-6">Tech Stack</h2>
                            <div className="flex flex-wrap gap-3">
                                <AnimatePresence>
                                    {skills.map((tech) => (
                                        <motion.div
                                            key={tech}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="group relative pl-4 pr-4 py-3 rounded-2xl bg-background/40 border border-white/10 flex items-center gap-3 hover:bg-background/60 transition-all cursor-default select-none shadow-sm"
                                        >
                                            <span className="font-semibold text-foreground/80 text-sm">{tech}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />

                                            {isEditing && (
                                                <button
                                                    onClick={() => removeSkill(tech)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {isEditing && (
                                    <div className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-2xl bg-muted/20 border border-dashed border-muted-foreground/30 focus-within:border-primary/50 focus-within:bg-muted/40 transition-colors">
                                        <Plus className="w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={handleAddSkill}
                                            placeholder="Add skill..."
                                            className="bg-transparent border-none text-sm focus:outline-none w-24 text-foreground placeholder:text-muted-foreground/50"
                                        />
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-[2rem] bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold font-display">Connect</h3>
                                <button onClick={() => setShowSocialModal(true)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <AnimatePresence initial={false}>
                                    {socials.map((social) => {
                                        const Icon = iconMap[social.iconName] || Globe;
                                        return (
                                            <motion.div
                                                key={social.id}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="relative group"
                                            >
                                                <a
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/50"
                                                >
                                                    <div className="p-2 rounded-lg bg-background shadow-sm group-hover:scale-110 transition-transform">
                                                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm truncate">{social.platform}</p>
                                                        <p className="text-xs text-muted-foreground truncate opacity-60 group-hover:opacity-100">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</p>
                                                    </div>
                                                    <LinkIcon className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/50" />
                                                </a>

                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeSocial(social.id)}
                                                        className="absolute top-1/2 -translate-y-1/2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                {socials.length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground/50 text-sm italic">
                                        No socials added yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {(user.resumeUrl || isEditing) && (
                            <section className="p-8 rounded-[2rem] bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm">
                                <h2 className="text-xl font-bold font-display mb-6">Resume</h2>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-white/10">
                                    <FileText className="w-10 h-10 text-primary" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{user.resumeName || 'No resume uploaded'}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">PDF Format</p>
                                    </div>

                                    {user.resumeUrl && (
                                        <a
                                            href={user.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-background rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                                            title="Download"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </a>
                                    )}

                                    {isEditing && (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                onChange={handleResumeUpload}
                                                className="hidden"
                                                id="resume-upload"
                                                accept=".pdf"
                                            />
                                            <label
                                                htmlFor="resume-upload"
                                                className="flex items-center gap-2 cursor-pointer bg-foreground text-background px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                                            >
                                                <Upload className="w-4 h-4" />
                                                {user.resumeUrl ? 'Replace Resume' : 'Upload Resume'}
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {user.resumeUrl && (
                                    <div className="mt-6 w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                                        <iframe
                                            src={user.resumeUrl.replace('http://', 'https://')}
                                            className="w-full h-full"
                                            title="Resume Preview"
                                        />
                                        <div className="p-2 text-center text-xs text-muted-foreground">
                                            Powered by Cloudinary PDF Preview
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        <div className="p-6 rounded-[2rem] bg-background/30 backdrop-blur-md border border-white/10 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Remote</p>
                                    <p className="text-muted-foreground text-xs">Preferred work mode</p>
                                </div>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Immediate</p>
                                    <p className="text-muted-foreground text-xs">Start date availability</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showSocialModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-background rounded-[2rem] border border-white/20 shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold font-display">Add Social Link</h3>
                                <button onClick={() => setShowSocialModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Platform</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {platforms.map(p => (
                                            <button
                                                key={p.name}
                                                onClick={() => setNewSocial({ ...newSocial, platform: p.name })}
                                                className={`p-2 rounded-xl border flex flex-col items-center gap-2 transition-all ${newSocial.platform === p.name ? 'bg-primary/10 border-primary text-primary scale-105 shadow-md' : 'border-border hover:bg-muted/50'}`}
                                            >
                                                <p.icon className="w-5 h-5" />
                                                <span className="text-[9px] font-bold">{p.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">URL</label>
                                    <input
                                        type="text"
                                        value={newSocial.url}
                                        onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                                    />
                                </div>

                                <button onClick={handleAddSocial} className="w-full py-4 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    Add Link
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default Profile;
