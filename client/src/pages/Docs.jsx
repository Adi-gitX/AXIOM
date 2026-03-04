import React, { useEffect, useRef, useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import PublicNavbar from '../components/PublicNavbar';

const SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'dsa', label: 'DSA Tracker' },
    { id: 'oss', label: 'OSS Engine' },
    { id: 'gsoc', label: 'GSOC Accelerator' },
    { id: 'modules', label: 'Other Modules' },
    { id: 'api', label: 'API Surface' },
];

const Docs = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const scrollRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            rootMargin: '-20% 0px -55% 0px',
            threshold: 0.1,
        });

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (!element) return;
        const offset = 110;
        const position = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
    };

    return (
        <ReactLenis root options={{ lerp: 0.05 }}>
            <div className="min-h-screen">
                <PublicNavbar />

                <div className="max-w-7xl mx-auto pt-32 px-6 flex flex-col md:flex-row gap-12" ref={scrollRef}>
                    <aside className="hidden md:block w-64 fixed h-[calc(100vh-8rem)] overflow-y-auto pt-6 pb-16 pr-4 border-r border-border custom-scrollbar">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Documentation</p>
                        <div className="space-y-1">
                            {SECTIONS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all ${activeSection === item.id
                                        ? 'bg-accent/50 text-foreground font-semibold border border-border'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className="md:ml-72 w-full py-8 space-y-20 pb-28">
                        <section id="overview" className="space-y-4">
                            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground font-display">AXIOM Product Docs</h1>
                            <p className="text-lg text-muted-foreground max-w-3xl">
                                AXIOM is a student-focused engineering growth platform. The current product combines DSA execution,
                                OSS contribution tracking, GSOC planning, learning modules, and a public portfolio surface.
                            </p>
                        </section>

                        <section id="dashboard" className="space-y-4">
                            <h2 className="text-3xl font-bold text-foreground font-display">Dashboard Command Center</h2>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2 marker:text-foreground/50">
                                <li>Global KPI cards: problems solved, streak, study hours, completion percentage.</li>
                                <li>GitHub-style 365-day DSA contribution graph with timezone-aware date alignment.</li>
                                <li>Daily Focus with 3 recommended DSA problems and one good-first-issue suggestion.</li>
                                <li>Weekly activity bars and quick access links to all major modules.</li>
                            </ul>
                        </section>

                        <section id="dsa" className="space-y-4">
                            <h2 className="text-3xl font-bold text-foreground font-display">DSA Tracker</h2>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2 marker:text-foreground/50">
                                <li>Home route `/app/dsa` for global progress and sheet entry cards.</li>
                                <li>Dedicated sheet routes: `/app/dsa/love450`, `/app/dsa/striverSDE`, `/app/dsa/striverA2Z`.</li>
                                <li>Search and filters: status, difficulty, and company tags.</li>
                                <li>Spaced repetition queue with review scheduling and completion actions.</li>
                                <li>Per-problem journal metadata: notes, time spent, attempts, interval planning.</li>
                            </ul>
                        </section>

                        <section id="oss" className="space-y-4">
                            <h2 className="text-3xl font-bold text-foreground font-display">OSS Contribution Engine</h2>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2 marker:text-foreground/50">
                                <li>One-click GitHub OAuth connect flow.</li>
                                <li>Automatic first sync after OAuth callback with sync-status visibility.</li>
                                <li>Contribution cards for opened PRs, merged PRs, stars, and merged streak.</li>
                                <li>Recent PR timeline and smart good-first-issue recommendation (skills + DSA signal).</li>
                                <li>Manual re-sync endpoint for live refresh.</li>
                            </ul>
                        </section>

                        <section id="gsoc" className="space-y-4">
                            <h2 className="text-3xl font-bold text-foreground font-display">GSOC Accelerator</h2>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2 marker:text-foreground/50">
                                <li>GSOC 2026 timeline with statuses and day offsets.</li>
                                <li>Organization explorer with search and language/difficulty filters.</li>
                                <li>Readiness score composed from DSA completion and OSS contribution signal.</li>
                                <li>Reminder dismissal/restore workflow with active/dismissed views and urgency buckets.</li>
                            </ul>
                        </section>

                        <section id="modules" className="space-y-4">
                            <h2 className="text-3xl font-bold text-foreground font-display">Other Modules</h2>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2 marker:text-foreground/50">
                                <li>Education Hub: topic progress with In Progress / Completed status and DSA quick links.</li>
                                <li>Interview Prep: categorized resources with mark-complete behavior and quick tips.</li>
                                <li>Dev Connect: channel-based chat with online users list and default `#gsoc` channel.</li>
                                <li>Profile + Portfolio: public username route `/u/:username`, ATS score, OSS showcase, resume PDF print export.</li>
                                <li>Pricing: simplified Free Forever + Pro model.</li>
                            </ul>
                        </section>

                        <section id="api" className="space-y-4">
                            <h2 className="text-3xl font-bold text-foreground font-display">API Surface</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-border">
                                        <tr>
                                            <th className="py-3 text-foreground">Module</th>
                                            <th className="py-3 text-foreground">Representative Endpoints</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border text-muted-foreground">
                                        <tr>
                                            <td className="py-3">Progress / DSA</td>
                                            <td className="py-3">`/api/progress/catalog`, `/api/progress/focus/:email`, `/api/progress/review/:email`, `/api/progress/problem-meta`</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">OSS</td>
                                            <td className="py-3">`/api/oss/github/connect-url`, `/api/oss/sync-status/:email`, `/api/oss/sync/:email`, `/api/oss/contributions/:email`</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">GSOC</td>
                                            <td className="py-3">`/api/gsoc/timeline`, `/api/gsoc/orgs`, `/api/gsoc/readiness/:email`, `/api/gsoc/reminders/:email`</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">Users</td>
                                            <td className="py-3">`/api/users/public/:username`, `/api/users/ats/:email`, `/api/users/username`</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">Chat</td>
                                            <td className="py-3">`/api/chat/channels`, `/api/chat/online`, `/api/chat/messages/:channelId`</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </ReactLenis>
    );
};

export default Docs;
