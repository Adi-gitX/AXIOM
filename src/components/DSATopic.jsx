import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Circle, ExternalLink } from 'lucide-react';
import './DSATopic.css';

const DSATopic = ({ topic }) => {
    const [isOpen, setIsOpen] = useState(false);

    const solvedCount = topic.problems.filter(p => p.status === 'solved').length;
    const progress = (solvedCount / topic.problems.length) * 100;

    return (
        <div className="dsa-topic-card glass-panel">
            <div
                className="topic-header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="topic-info">
                    <h3>{topic.name}</h3>
                    <span className="topic-stats">{solvedCount} / {topic.problems.length} Done</span>
                </div>

                <div className="topic-actions">
                    <div className="progress-bar-sm">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isOpen && (
                <div className="topic-content animate-fade-in">
                    {topic.problems.map(problem => (
                        <div key={problem.id} className="problem-row">
                            <div className="problem-status">
                                {problem.status === 'solved'
                                    ? <CheckCircle size={18} className="status-icon solved" />
                                    : <Circle size={18} className="status-icon pending" />
                                }
                            </div>
                            <div className="problem-main">
                                <span className="problem-title">{problem.title}</span>
                                <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                                    {problem.difficulty}
                                </span>
                            </div>
                            <a href={problem.link} target="_blank" rel="noreferrer" className="solve-link">
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DSATopic;
