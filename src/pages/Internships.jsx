import React from 'react';
import { Briefcase } from 'lucide-react';

const Internships = () => {
    return (
        <div className="page-container animate-fade-in">
            <header className="page-header">
                <h1>Internships & Jobs</h1>
                <p>Find your next opportunity from LinkedIn and top boards.</p>
            </header>
            <div className="empty-state glass-panel">
                <Briefcase size={48} color="var(--accent-primary)" />
                <h3>Opportunities Await</h3>
            </div>
        </div>
    );
};

export default Internships;
