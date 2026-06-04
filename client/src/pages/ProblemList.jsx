import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Search, ArrowUpRight, FlaskConical } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { PageShell, PageHeader, Surface, KpiTile } from '../components/ui/AppPrimitives';
import { listProblems, DIFFICULTY_ORDER } from '../data/problems';
import { useAuth } from '../contexts/AuthContext';
import { submissionsApi } from '../lib/api';

const DIFF_COLOR = { Easy: '#0E334F', Medium: '#7A4A1F', Hard: '#9C2A1F' };
const FILTERS = ['All', 'Easy', 'Medium', 'Hard'];

export default function ProblemList() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const problems = useMemo(() => listProblems(), []);
    const [filter, setFilter] = useState('All');
    const [q, setQ] = useState('');
    const [summary, setSummary] = useState({});

    useEffect(() => {
        let alive = true;
        if (currentUser?.email) {
            submissionsApi.summary(currentUser.email)
                .then((res) => { if (alive) setSummary(res?.summary || {}); })
                .catch(() => {});
        }
        return () => { alive = false; };
    }, [currentUser?.email]);

    const solvedCount = problems.filter((p) => summary[p.id]?.solved).length;
    const attemptedCount = problems.filter((p) => summary[p.id]?.attempts > 0).length;

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        return problems
            .filter((p) => (filter === 'All' ? true : p.difficulty === filter))
            .filter((p) => (needle ? `${p.title} ${p.topic} ${p.tags.join(' ')}`.toLowerCase().includes(needle) : true))
            .sort((a, b) => (DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]) || a.title.localeCompare(b.title));
    }, [problems, filter, q]);

    return (
        <PageShell>
            <SEOHead title="Problems — AXIOM Code Lab" description="Solve curated DSA problems in your browser with live test cases, an algorithm visualizer, and an AI tutor — Python, JavaScript, and TypeScript." />

            <PageHeader
                eyebrow="Code Lab"
                title="Problems"
                tail="solve them live"
                meta="Write, run, and submit solutions against real test cases — then watch them execute step by step. No setup, runs entirely in your browser."
                action={(
                    <button
                        type="button"
                        onClick={() => navigate('/app/lab')}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-card border text-[13px] font-medium text-foreground hover:bg-secondary transition-colors"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    >
                        <FlaskConical className="w-4 h-4" /> Open playground
                    </button>
                )}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                <KpiTile label="Solved" value={`${solvedCount}`} hint={`of ${problems.length} problems`} tone="sage" />
                <KpiTile label="Attempted" value={`${attemptedCount}`} hint="problems tried" tone="mist" />


// TODO: Complete implementation in subsequent commits (Stage 1/2)
