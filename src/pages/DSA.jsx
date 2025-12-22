import React from 'react';
import { TOPICS } from '../data/dsaSheet';
import DSATopic from '../components/DSATopic';

const DSA = () => {
    return (
        <div className="page-container animate-fade-in">
            <header className="page-header" style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>DSA Tracker</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Striver's SDE Sheet Problem List</p>
            </header>

            <div className="dsa-container">
                {TOPICS.map(topic => (
                    <DSATopic key={topic.id} topic={topic} />
                ))}
            </div>
        </div>
    );
};

export default DSA;
