import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Github, Menu, Flame } from 'lucide-react';
import { useSidebar } from './Layout';

const ROUTE_LABEL = {
    '/app': 'Dashboard',
    '/app/dsa': 'DSA Tracker',
    '/app/lab': 'Code Lab',
    '/app/problems': 'Problems',
    '/app/dsa/companies': 'Companies',
    '/app/oss': 'OSS Engine',
    '/app/gsoc': 'GSOC',
    '/app/education': 'Education',
    '/app/interview': 'Interview Prep',
    '/app/peer': 'Peer Interviews',
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
    '/app/lab': 'Engineering',
    '/app/problems': 'Engineering',
    '/app/dsa/companies': 'Engineering',
    '/app/oss': 'Engineering',
    '/app/gsoc': 'Engineering',
    '/app/education': 'Career',
    '/app/interview': 'Career',
    '/app/peer': 'Career',
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
    // Resolve by exact match, else the longest registered path prefix (handles dynamic
    // routes like /app/problems/:id → Problems).
    const resolveByPath = (map, fallback) => {
        if (map[location.pathname]) return map[location.pathname];
        const match = Object.keys(map)
            .filter((p) => p !== '/app' && location.pathname.startsWith(`${p}/`))
            .sort((a, b) => b.length - a.length)[0];
        return match ? map[match] : fallback;
    };
    const label = resolveByPath(ROUTE_LABEL, 'AXIOM');
    const group = resolveByPath(ROUTE_GROUP, 'Workspace');
    const [today] = useState(fmtToday());

    return (
        <header
            data-testid="app-topbar"
            className="sticky top-0 z-30 px-5 sm:px-8 lg:px-14 h-14 flex items-center justify-between gap-3 sm:gap-6 bg-background/85 backdrop-blur-md border-b shrink-0"
            style={{ borderColor: 'hsl(var(--hair))' }}
        >
            <div className="flex items-center gap-3 min-w-0">


// TODO: Complete implementation in subsequent commits (Stage 1/2)
