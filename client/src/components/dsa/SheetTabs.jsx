import React, { useMemo } from 'react';
import { orderSheetsByPreferredFlow } from '../../lib/dsaCatalog';

const SheetTabs = ({ sheets = [], activeSheetId, solvedSet, onChange }) => {
    const orderedSheets = useMemo(
        () => orderSheetsByPreferredFlow(sheets),
        [sheets]
    );

    const sheetStats = useMemo(() => {
        return orderedSheets.map((sheet) => {
            const total = sheet.totalProblems || 0;
            let solved = 0;

            for (const topic of sheet.topics || []) {
                for (const problem of topic.problems || []) {
                    if (solvedSet.has(problem.id)) {
                        solved += 1;
                    }
                }
            }

            return {
                id: sheet.id,
                name: sheet.name,
                solved,
                total,
                progress: total > 0 ? Math.round((solved / total) * 100) : 0,
            };
        });
    }, [orderedSheets, solvedSet]);

    return (
        <div className="overflow-x-auto pb-1 custom-scrollbar">
            <div className="inline-flex gap-3 min-w-full">
                {sheetStats.map((sheet) => {
                    const isActive = sheet.id === activeSheetId;
                    return (
                        <button
                            key={sheet.id}
                            type="button"
                            onClick={() => onChange(sheet.id)}
                            className={`min-w-[220px] text-left rounded-2xl border px-4 py-3 transition-colors ${isActive
                                ? 'bg-foreground text-background border-foreground shadow-[0_4px_14px_rgba(255,255,255,0.08)]'
                                : 'bg-background/40 text-foreground border-border hover:border-foreground/40 hover:bg-background/70'
                                }`}
                        >
                            <p className={`font-display text-sm font-semibold tracking-wide ${isActive ? 'text-background' : 'text-foreground'}`}>
                                {sheet.name}
                            </p>
                            <p className={`text-xs mt-1 ${isActive ? 'text-background/80' : 'text-muted-foreground'}`}>
                                {sheet.solved}/{sheet.total} solved
                            </p>
                            <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isActive ? 'bg-background/20' : 'bg-foreground/10'}`}>
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ease-out ${isActive ? 'bg-background' : 'bg-foreground'}`}
                                    style={{ width: `${sheet.progress}%` }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SheetTabs;
