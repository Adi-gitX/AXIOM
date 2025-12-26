import React from 'react';
import { TOPICS } from '../data/dsaSheet';
import DSATopic from '../components/DSATopic';

const DSA = () => {
    return (
        <div className="min-h-screen bg-[#fafafa] p-8 lg:p-12">
            <div className="max-w-[1000px] mx-auto space-y-10">
                <header>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight font-display mb-3">
                        DSA Tracker
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl">
                        Track your progress through Striver's SDE Sheet. 450+ problems, organized by topic.
                    </p>
                </header>

                <div className="space-y-3">
                    {TOPICS.map(topic => (
                        <DSATopic key={topic.id} topic={topic} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DSA;
