import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Surface } from '../ui/AppPrimitives';
import { orderSheetsByPreferredFlow } from '../../lib/dsaCatalog';

const DsaSheetCards = ({ sheets = [], sheetStatsById = {} }) => {
    const navigate = useNavigate();
    const orderedSheets = useMemo(() => orderSheetsByPreferredFlow(sheets), [sheets]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {orderedSheets.map((sheet) => {
                const stats = sheetStatsById[sheet.id] || { solved: 0, total: sheet.totalProblems || 0, progress: 0 };
                return (
                    <Surface
                        key={sheet.id}
                        className="p-6 cursor-pointer hover:border-foreground/15 transition-colors group"
                        onClick={() => navigate(`/app/dsa/${sheet.id}`)}
                    >
                        <div className="flex items-start justify-between gap-3 mb-5">
                            <div className="min-w-0">
                                <p className="font-display font-semibold text-[16px] tracking-[-0.012em] text-foreground truncate">{sheet.name}</p>
                                <p className="text-[11.5px] font-mono uppercase tracking-[0.08em] text-muted-foreground/80 mt-1">{sheet.totalTopics} topics</p>
                            </div>
                            <span className="text-[11px] font-mono tabular text-muted-foreground shrink-0">
                                {stats.progress}%
                            </span>
                        </div>

                        <div className="font-display font-semibold text-[26px] leading-none tracking-[-0.02em] text-foreground tabular">
                            {stats.solved}<span className="text-muted-foreground/40 font-light">/{stats.total}</span>
                        </div>
                        <p className="text-[11.5px] text-muted-foreground mt-1.5">solved</p>

                        <div
                            className="h-[3px] w-full rounded-full mt-5 overflow-hidden"
                            style={{ backgroundColor: 'hsl(var(--paper-soft))' }}
                        >
                            <div
                                className="h-full rounded-full bg-foreground transition-all duration-700"
                                style={{ width: `${stats.progress}%` }}
                            />
                        </div>

                        <button
                            type="button"
                            className="mt-5 inline-flex items-center gap-1 text-[12px] font-semibold text-foreground group-hover:opacity-70 transition-opacity"
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/app/dsa/${sheet.id}`);
                            }}
                        >
                            Open sheet
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                    </Surface>
                );
            })}
        </div>
    );
};

export default DsaSheetCards;
