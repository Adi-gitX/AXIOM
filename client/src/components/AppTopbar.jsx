import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Github, Menu, Flame } from 'lucide-react';
import { useSidebar } from './Layout';

const ROUTE_LABEL = {
    '/app': 'Dashboard',
    '/app/dsa': 'DSA Tracker',
    '/app/dsa/companies': 'Companies',
    '/app/oss': 'OSS Engine',
    '/app/gsoc': 'GSOC',
    '/app/education': 'Education',
    '/app/interview': 'Interview Prep',
    '/app/interviews': 'Interview Stories',
    '/app/connect': 'Dev Connect',
    '/app/jobs': 'Jobs',
    '/app/posts': 'Posts',
    '/app/profile': 'Profile',
    '/app/settings': 'Settings',
};

const ROUTE_GROUP = {
    '/app': 'Workspace',
    '/app/dsa': 'Engineering',
    '/app/dsa/companies': 'Engineering',
    '/app/oss': 'Engineering',
    '/app/gsoc': 'Engineering',
    '/app/education': 'Career',
    '/app/interview': 'Career',
    '/app/interviews': 'Career',
    '/app/jobs': 'Career',
    '/app/connect': 'Community',
    '/app/posts': 'Community',
    '/app/profile': 'Workspace',
    '/app/settings': 'Workspace',
};

const fmtToday = () => {
    try {
        return new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
};

const AppTopbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setOpen } = useSidebar();
    const label = ROUTE_LABEL[location.pathname] || 'AXIOM';
    const group = ROUTE_GROUP[location.pathname] || 'Workspace';
    const [today] = useState(fmtToday());

    return (
        <header
            data-testid="app-topbar"
            className="sticky top-0 z-30 px-5 sm:px-8 lg:px-14 h-14 flex items-center justify-between gap-3 sm:gap-6 bg-background/85 backdrop-blur-md border-b shrink-0"
            style={{ borderColor: 'hsl(var(--hair))' }}
        >
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    className="lg:hidden w-7 h-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors -ml-1"
                >
                    <Menu className="w-4 h-4" />
                </button>

                {/* Editorial breadcrumb — eyebrow group + page name */}
                <div className="flex items-baseline gap-2 min-w-0">
                    <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/65">
                        {group}
                    </span>
                    <span className="hidden sm:inline text-muted-foreground/40 text-[11px]">/</span>
                    <span className="text-[13px] font-semibold text-foreground tracking-[-0.005em] truncate">
                        {label}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
                {/* Today / streak indicator */}
                <span
                    className="hidden md:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-fabric-peach text-[11px] font-medium text-[#7A4A1F] tabular"
                    style={{ borderColor: 'rgba(122,74,31,0.12)', borderWidth: 1, borderStyle: 'solid' }}
                    data-testid="topbar-today"
                >
                    <Flame className="w-3 h-3" strokeWidth={2} />
                    <span>{today}</span>
                </span>

                <button
                    type="button"
                    data-testid="topbar-search-btn"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                    className="hidden sm:inline-flex items-center gap-2 h-7 px-2.5 rounded-full bg-card border text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                    style={{ borderColor: 'hsl(var(--hair))' }}
                >
                    <Search className="w-3 h-3" />
                    <span>Search</span>
                    <kbd
                        className="ml-1 px-1.5 rounded bg-secondary border text-[9.5px] font-mono text-muted-foreground leading-relaxed"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    >
                        ⌘K
                    </kbd>
                </button>

                <a
                    href="https://github.com/Adi-gitX/AXIOM"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="topbar-github"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-card border text-muted-foreground hover:text-foreground transition-colors"
                    style={{ borderColor: 'hsl(var(--hair))' }}
                    aria-label="GitHub"
                >
                    <Github className="w-3.5 h-3.5" />
                </a>

                <button
                    type="button"
                    data-testid="topbar-upgrade-btn"
                    onClick={() => navigate('/pricing')}
                    className="inline-flex items-center h-7 px-3.5 rounded-full bg-foreground text-background text-[11.5px] font-semibold tracking-[-0.005em] hover:opacity-90 transition-opacity"
                >
                    Upgrade
                </button>
            </div>
        </header>
    );
};

export default AppTopbar;
