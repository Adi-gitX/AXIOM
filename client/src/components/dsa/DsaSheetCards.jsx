import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import { orderSheetsByPreferredFlow } from '../../lib/dsaCatalog';

const DsaSheetCards = ({ sheets = [], sheetStatsById = {} }) => {
    const navigate = useNavigate();
    const orderedSheets = useMemo(
        () => orderSheetsByPreferredFlow(sheets),
        [sheets]
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {orderedSheets.map((sheet) => {
                const stats = sheetStatsById[sheet.id] || { solved: 0, total: sheet.totalProblems || 0, progress: 0 };
                return (
                    <GlassCard
                        key={sheet.id}
                        className="p-5 cursor-pointer border-border/80 hover:border-foreground/30"
                        onClick={() => navigate(`/app/dsa/${sheet.id}`)}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-lg font-semibold text-foreground">{sheet.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{sheet.totalTopics} topics curated</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground font-mono">
                                {stats.progress}%
                            </span>
                        </div>

                        <p className="text-2xl font-light text-foreground mt-4">{stats.solved}/{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Problems solved</p>

                        <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden mt-3">
                            <div className="h-full rounded-full bg-foreground" style={{ width: `${stats.progress}%` }} />
                        </div>

                        <button
                            type="button"
                            className="mt-4 text-sm font-medium text-foreground hover:underline underline-offset-4"
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/app/dsa/${sheet.id}`);
                            }}
                        >
                            Open Sheet
                        </button>
                    </GlassCard>
                );
            })}
        </div>
    );
};

export default DsaSheetCards;
