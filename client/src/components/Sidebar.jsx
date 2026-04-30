import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    GraduationCap,
    Code2,
    GitBranch,
    Trophy,
    MessagesSquare,
    Briefcase,
    Newspaper,
    Layers,
    Settings as SettingsIcon,
    X,
    Star,
    Building2,
    BookOpen,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../stores/useUserStore';
import { useSidebar } from './Layout';

// Three editorial groups — each titled in a tiny eyebrow caps label.
// Active items get a teal-tinted bg + bold text + a tiny teal dot on the left edge.
const GROUPS = [
    {
        label: 'Workspace',
        items: [{ path: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true }],
    },
    {
        label: 'Engineering',
        items: [
            { path: '/app/dsa', label: 'DSA Tracker', icon: Code2, end: true },
            { path: '/app/dsa/companies', label: 'Companies', icon: Building2 },
            { path: '/app/oss', label: 'OSS Engine', icon: GitBranch },
            { path: '/app/gsoc', label: 'GSOC', icon: Trophy },
        ],
    },
    {
        label: 'Career',
        items: [
            { path: '/app/education', label: 'Education', icon: GraduationCap },
            { path: '/app/interview', label: 'Interview Prep', icon: Layers },
            { path: '/app/interviews', label: 'Interview Stories', icon: BookOpen },
            { path: '/app/jobs', label: 'Jobs', icon: Briefcase },
        ],
    },
    {
        label: 'Community',
        items: [
            { path: '/app/connect', label: 'Dev Connect', icon: MessagesSquare },
            { path: '/app/posts', label: 'Posts', icon: Newspaper },
        ],
    },
];

const Sidebar = () => {
    const { currentUser } = useAuth();
    const { user: profileData, fetchProfile } = useUserStore();
    const { open, setOpen } = useSidebar();
    const location = useLocation();
    const [stars, setStars] = useState(null);

    useEffect(() => { setOpen(false); }, [location.pathname, setOpen]);

    useEffect(() => {
        if (currentUser?.email) fetchProfile(currentUser.email);
    }, [currentUser?.email, fetchProfile]);

    useEffect(() => {
        let cancelled = false;
        fetch('https://api.github.com/repos/Adi-gitX/AXIOM')
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (!cancelled && d && typeof d.stargazers_count === 'number') setStars(d.stargazers_count);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    const fmtStars = (n) => {
        if (n == null) return '—';
        if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
        return String(n);
    };

    const displayName =
        profileData?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Developer';
    const displayAvatar =
        profileData?.avatar || currentUser?.photoURL || 'https://github.com/shadcn.png';
    const isPro = Boolean(profileData?.is_pro);

    return (
        <aside
            data-testid="app-sidebar"
            className={`fixed lg:sticky top-0 h-full flex flex-col w-[228px] shrink-0 z-40 bg-card border-r transition-transform duration-200 ease-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            style={{ borderColor: 'hsl(var(--hair))' }}
        >
            <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="lg:hidden absolute top-3 right-3 w-7 h-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Brand — wordmark + serif italic suffix */}
            <NavLink to="/" className="h-14 flex items-baseline gap-1.5 px-5 group shrink-0">
                <span className="font-display font-semibold text-[19px] tracking-[-0.025em] text-foreground">
                    axiom
                </span>
                <span className="italic-accent text-[12px] text-muted-foreground">/dev</span>
            </NavLink>

            {/* Nav — editorial groups */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-5">
                {GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                            {group.label}
                        </p>
                        <div className="space-y-px">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                        className={({ isActive }) =>
                                            `group relative flex items-center gap-2.5 pl-3 pr-2.5 py-[7px] rounded-md text-[13px] transition-colors duration-100 ${
                                                isActive
                                                    ? 'bg-[#E5E8F2]/60 text-foreground font-semibold'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <span
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
                                                        style={{ background: '#0E334F' }}
                                                    />
                                                )}
                                                <Icon
                                                    className={`w-[15px] h-[15px] shrink-0 ${isActive ? 'text-[#0E334F]' : 'opacity-70'}`}
                                                    strokeWidth={1.7}
                                                />
                                                <span className="flex-1 tracking-[-0.005em]">{item.label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Open-source badge — connects inside-app to OSS identity */}
                <a
                    href="https://github.com/Adi-gitX/AXIOM"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="sidebar-oss-badge"
                    className="mx-2 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-fabric-sage border border-[#0E334F]/10 text-[12px] text-[#0E334F] hover:border-[#0E334F]/25 transition-colors group"
                >
                    <Star className="w-3.5 h-3.5 fill-[#0E334F]" strokeWidth={0} />
                    <span className="flex-1 font-medium">Open source</span>
                    <span className="font-semibold tabular">{fmtStars(stars)}</span>
                </a>
            </nav>

            {/* User block */}
            <div className="p-2.5 shrink-0 border-t" style={{ borderColor: 'hsl(var(--hair))' }}>
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/app/profile"
                        data-testid="sidebar-profile-link"
                        className="flex-1 flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-secondary transition-colors min-w-0"
                    >
                        <div
                            className="w-7 h-7 rounded-full bg-secondary border overflow-hidden shrink-0"
                            style={{ borderColor: 'hsl(var(--hair))' }}
                        >
                            <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12.5px] font-semibold text-foreground truncate leading-tight">
                                {displayName}
                            </p>
                            <p className="text-[10.5px] tracking-[-0.005em] text-muted-foreground truncate">
                                {isPro ? 'Pro' : 'Free plan'}
                            </p>
                        </div>
                    </NavLink>
                    <NavLink
                        to="/app/settings"
                        data-testid="sidebar-settings-link"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                    >
                        <SettingsIcon className="w-3.5 h-3.5" strokeWidth={1.7} />
                    </NavLink>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
