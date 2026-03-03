import React from 'react';

const DsaFilters = ({ filters, onChange, onReset }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
                <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => onChange({ query: e.target.value })}
                    placeholder="Search topics or problems"
                    className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
            </div>

            <select
                value={filters.status}
                onChange={(e) => onChange({ status: e.target.value })}
                className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
                <option value="all">All status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
            </select>

            <select
                value={filters.difficulty}
                onChange={(e) => onChange({ difficulty: e.target.value })}
                className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
                <option value="all">All difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Unknown">Unknown</option>
            </select>

            <select
                value={filters.sort}
                onChange={(e) => onChange({ sort: e.target.value })}
                className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
                <option value="sheet-order">Sheet order</option>
                <option value="topic-a-z">Topic A-Z</option>
                <option value="most-complete">Most complete</option>
            </select>

            <button
                type="button"
                onClick={onReset}
                className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            >
                Reset filters
            </button>
        </div>
    );
};

export default DsaFilters;
