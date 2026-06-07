import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    LayoutDashboard,
    Code2,
    GitBranch,
    Trophy,
    GraduationCap,
    Layers,
    Briefcase,
    Newspaper,
    MessagesSquare,
    User,
    Settings as SettingsIcon,
    Sparkles,
    DollarSign,
    BookOpen,
    LogOut,
    ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const COMMANDS = [
    // Navigation
    { id: 'nav-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, kind: 'nav', target: '/app', kbd: 'g d' },
    { id: 'nav-dsa', label: 'Go to DSA Tracker', icon: Code2, kind: 'nav', target: '/app/dsa', kbd: 'g s' },
    { id: 'nav-oss', label: 'Go to OSS Engine', icon: GitBranch, kind: 'nav', target: '/app/oss', kbd: 'g o' },
    { id: 'nav-gsoc', label: 'Go to GSOC', icon: Trophy, kind: 'nav', target: '/app/gsoc' },
    { id: 'nav-education', label: 'Go to Education', icon: GraduationCap, kind: 'nav', target: '/app/education' },
    { id: 'nav-interview', label: 'Go to Interview Prep', icon: Layers, kind: 'nav', target: '/app/interview', kbd: 'g i' },
    { id: 'nav-jobs', label: 'Go to Jobs', icon: Briefcase, kind: 'nav', target: '/app/jobs', kbd: 'g j' },
    { id: 'nav-posts', label: 'Go to Posts', icon: Newspaper, kind: 'nav', target: '/app/posts', kbd: 'g p' },
    { id: 'nav-connect', label: 'Go to Dev Connect', icon: MessagesSquare, kind: 'nav', target: '/app/connect', kbd: 'g c' },
    { id: 'nav-profile', label: 'Go to Profile', icon: User, kind: 'nav', target: '/app/profile' },
    { id: 'nav-settings', label: 'Settings', icon: SettingsIcon, kind: 'nav', target: '/app/settings', kbd: 'g ,' },

    // Public pages
    { id: 'nav-pricing', label: 'View Pricing', icon: DollarSign, kind: 'public', target: '/pricing' },
    { id: 'nav-docs', label: 'View Documentation', icon: BookOpen, kind: 'public', target: '/docs' },

    // Actions
    { id: 'act-upgrade', label: 'Upgrade to Pro', icon: Sparkles, kind: 'action', action: 'upgrade' },
    { id: 'act-github', label: 'Open AXIOM on GitHub', icon: ArrowUpRight, kind: 'action', action: 'github' },
    { id: 'act-logout', label: 'Sign out', icon: LogOut, kind: 'action', action: 'logout' },
];

const KIND_LABEL = {
    nav: 'Navigate',
    public: 'Pages',
    action: 'Actions',
};

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Global ⌘K / Ctrl-K toggle
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((p) => !p);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Listen for custom 'open-command-palette' event so the topbar button can trigger it
    useEffect(() => {
        const onCustom = () => setOpen(true);
        window.addEventListener('open-command-palette', onCustom);
        return () => window.removeEventListener('open-command-palette', onCustom);
    }, []);

    // Reset state on open + focus input
    useEffect(() => {
        if (open) {
            setQ('');
            setActiveIdx(0);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return COMMANDS;
        return COMMANDS.filter((c) => c.label.toLowerCase().includes(needle));
    }, [q]);

    // Group into sections
    const grouped = useMemo(() => {
        const map = new Map();
        filtered.forEach((c) => {
            const key = c.kind;
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(c);
        });
        return Array.from(map.entries()); // [['nav', [...]], ['public', [...]], ['action', [...]]]
    }, [filtered]);

    // Flat list (used for keyboard navigation and selection)
    const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

    useEffect(() => {
        // Clamp active index when filter changes
        setActiveIdx((prev) => Math.min(prev, Math.max(0, flat.length - 1)));
    }, [flat.length]);

    const runCommand = async (cmd) => {
        if (!cmd) return;
        setOpen(false);
        if (cmd.kind === 'nav' || cmd.kind === 'public') {
            navigate(cmd.target);
        } else if (cmd.kind === 'action') {
            if (cmd.action === 'upgrade') navigate('/pricing');
            else if (cmd.action === 'github') window.open('https://github.com/Adi-gitX/AXIOM', '_blank', 'noopener');
            else if (cmd.action === 'logout') {
                try { await logout?.(); } catch { /* ignore */ }
                navigate('/');
            }
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx((i) => (i + 1) % flat.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((i) => (i - 1 + flat.length) % flat.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            runCommand(flat[activeIdx]);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setOpen(false)}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-foreground/15 backdrop-blur-sm" />

            {/* Palette */}
            <div
                className="relative w-full max-w-[640px] rounded-2xl bg-card border shadow-[0_24px_48px_rgba(15,30,45,0.18)] overflow-hidden"
                style={{ borderColor: 'hsl(var(--hair))' }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Command palette"
            >
                <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'hsl(var(--hair))' }}>
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent outline-none border-none text-[14.5px] text-foreground placeholder:text-muted-foreground"
                        data-testid="cmdk-input"
                    />
                    <kbd
                        className="px-1.5 py-0.5 rounded bg-secondary border text-[10px] font-mono text-muted-foreground"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    >
                        ESC
                    </kbd>
                </div>

                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar py-2">
                    {flat.length === 0 ? (
                        <div className="px-5 py-8 text-center text-[13.5px] text-muted-foreground">
                            No results for &quot;{q}&quot;
                        </div>
                    ) : (
                        grouped.map(([kind, items]) => (
                            <div key={kind} className="mb-2">
                                <div className="px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
                                    {KIND_LABEL[kind] || kind}
                                </div>
                                {items.map((cmd) => {
                                    const Icon = cmd.icon;
                                    const flatIndex = flat.indexOf(cmd);
                                    const isActive = flatIndex === activeIdx;
                                    return (
                                        <button
                                            key={cmd.id}
                                            type="button"
                                            data-testid={`cmdk-${cmd.id}`}
                                            onMouseEnter={() => setActiveIdx(flatIndex)}
                                            onClick={() => runCommand(cmd)}
                                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left text-[13.5px] transition-colors ${
                                                isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4 shrink-0 opacity-70" strokeWidth={1.7} />
                                            <span className="flex-1 truncate">{cmd.label}</span>
                                            {cmd.kbd && (
                                                <kbd
                                                    className="px-1.5 py-0.5 rounded bg-secondary border text-[10px] font-mono text-muted-foreground"
                                                    style={{ borderColor: 'hsl(var(--hair))' }}
                                                >
                                                    {cmd.kbd}
                                                </kbd>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                <div className="flex items-center justify-between px-5 py-2.5 border-t text-[10.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground/70" style={{ borderColor: 'hsl(var(--hair))' }}>
                    <span className="inline-flex items-center gap-1.5">
                        <kbd className="px-1.5 rounded bg-secondary border" style={{ borderColor: 'hsl(var(--hair))' }}>↑</kbd>
                        <kbd className="px-1.5 rounded bg-secondary border" style={{ borderColor: 'hsl(var(--hair))' }}>↓</kbd>
                        navigate
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <kbd className="px-1.5 rounded bg-secondary border" style={{ borderColor: 'hsl(var(--hair))' }}>↵</kbd>
                        select
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
