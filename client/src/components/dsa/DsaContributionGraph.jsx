import React, { useMemo } from 'react';

const CELL_SIZE_PX = 12;
const CELL_GAP_PX = 4;
const RANGE_DAYS = 365;
const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
const rangeDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
const tooltipDateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
});

const levelStyles = {
    0: { backgroundColor: 'var(--contrib-l0)', borderColor: 'var(--contrib-b0)' },
    1: { backgroundColor: 'var(--contrib-l1)', borderColor: 'var(--contrib-b1)' },
    2: { backgroundColor: 'var(--contrib-l2)', borderColor: 'var(--contrib-b2)' },
    3: { backgroundColor: 'var(--contrib-l3)', borderColor: 'var(--contrib-b3)' },
    4: { backgroundColor: 'var(--contrib-l4)', borderColor: 'var(--contrib-b4)' },
};

const toDateKey = (date) => (
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
);

const parseDateKeyToLocalDate = (dateKey) => {
    if (!DATE_KEY_RE.test(String(dateKey || ''))) {
        return null;
    }
    const [year, month, day] = dateKey.split('-').map((value) => Number.parseInt(value, 10));
    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfLocalDay = (date = new Date()) => (
    new Date(date.getFullYear(), date.getMonth(), date.getDate())
);

const addDays = (date, offset) => {
    const next = new Date(date);
    next.setDate(next.getDate() + offset);
    return startOfLocalDay(next);
};

const getContributionLevel = (count, maxCount) => {
    if (count <= 0 || maxCount <= 0) return 0;
    if (maxCount === 1) return 4;
    const ratio = count / maxCount;
    return Math.min(4, Math.max(1, Math.ceil(ratio * 4)));
};

const getMonthLabel = (date, previousLabelDate) => {
    const base = monthFormatter.format(date);
    if (!previousLabelDate || previousLabelDate.getFullYear() !== date.getFullYear()) {
        return `${base} '${String(date.getFullYear()).slice(-2)}`;
    }
    return base;
};

const getRangeLabel = (fromKey, toKey) => {
    const fromDate = parseDateKeyToLocalDate(fromKey);
    const toDate = parseDateKeyToLocalDate(toKey);
    if (!fromDate || !toDate) return '';
    return `${rangeDateFormatter.format(fromDate)} - ${rangeDateFormatter.format(toDate)}`;
};

const toTooltipDate = (dateKey) => {
    const date = parseDateKeyToLocalDate(dateKey);
    return date ? tooltipDateFormatter.format(date) : dateKey;
};

const buildGridData = (rows = [], rangeFrom = null, rangeTo = null) => {
    const countsByDate = new Map();
    for (const row of rows) {
        const key = String(row?.activity_date || '').slice(0, 10);
        if (!DATE_KEY_RE.test(key)) continue;
        const count = Number.parseInt(row?.problems_solved, 10) || 0;
        countsByDate.set(key, (countsByDate.get(key) || 0) + count);
    }

    const today = parseDateKeyToLocalDate(rangeTo) || startOfLocalDay(new Date());
    const todayKey = toDateKey(today);
    const defaultStart = addDays(today, -(RANGE_DAYS - 1));
    const rangeStart = parseDateKeyToLocalDate(rangeFrom) || defaultStart;
    const rangeStartKey = toDateKey(rangeStart);

    const gridStart = addDays(rangeStart, -rangeStart.getDay());
    const gridEnd = addDays(today, 6 - today.getDay());

    const allDays = [];
    for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor = addDays(cursor, 1)) {
        const date = new Date(cursor);
        const dateKey = toDateKey(date);
        const inRange = dateKey >= rangeStartKey && dateKey <= todayKey;
        const count = inRange ? (countsByDate.get(dateKey) || 0) : 0;

        allDays.push({
            date,
            key: dateKey,
            inRange,
            count,
            isToday: dateKey === todayKey,
        });
    }

    const maxCount = allDays.reduce((max, day) => (
        day.inRange ? Math.max(max, day.count) : max
    ), 0);

    const weeks = [];
    allDays.forEach((day, index) => {
        const weekIndex = Math.floor(index / 7);
        if (!weeks[weekIndex]) weeks[weekIndex] = [];
        weeks[weekIndex].push({
            ...day,
            level: day.inRange ? getContributionLevel(day.count, maxCount) : -1,
        });
    });

    const monthLabels = [];
    let previousLabelDate = null;

    weeks.forEach((week, weekIndex) => {
        const labelDay = week.find((day) => day.inRange && day.date.getDate() === 1)
            || (weekIndex === 0 ? week.find((day) => day.inRange) : null);
        if (!labelDay) return;

        const previousMonth = previousLabelDate
            ? `${previousLabelDate.getFullYear()}-${previousLabelDate.getMonth()}`
            : null;
        const currentMonth = `${labelDay.date.getFullYear()}-${labelDay.date.getMonth()}`;
        if (previousMonth === currentMonth) return;

        monthLabels.push({
            weekIndex,
            label: getMonthLabel(labelDay.date, previousLabelDate),
        });
        previousLabelDate = labelDay.date;
    });

    return {
        weeks,
        monthLabels,
        maxCount,
        rangeStartKey,
        todayKey,
        totalContributions: allDays.reduce((sum, day) => (
            day.inRange ? sum + day.count : sum
        ), 0),
        activeDays: allDays.reduce((sum, day) => (
            day.inRange && day.count > 0 ? sum + 1 : sum
        ), 0),
    };
};

const DsaContributionGraph = ({
    rows = [],
    loading = false,
    timezone = 'UTC',
    from = null,
    to = null,
}) => {
    const graph = useMemo(() => buildGridData(rows, from, to), [rows, from, to]);
    const graphWidth = graph.weeks.length * (CELL_SIZE_PX + CELL_GAP_PX);
    const rangeLabel = useMemo(
        () => getRangeLabel(graph.rangeStartKey, graph.todayKey),
        [graph.rangeStartKey, graph.todayKey]
    );
    const isEmpty = graph.totalContributions === 0;

    if (loading) {
        return (
            <div className="p-4 rounded-2xl border border-border bg-background/50">
                <div className="h-4 w-56 rounded bg-foreground/10 animate-pulse" />
                <div className="h-40 w-full rounded bg-foreground/10 animate-pulse mt-4" />
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-background/40 p-4 md:p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <p className="text-sm font-semibold text-foreground">Contribution Activity (Last 365 days)</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {graph.totalContributions} problems solved across {graph.activeDays} active days
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                        {rangeLabel}{timezone ? ` • ${timezone}` : ''}
                    </p>
                    {isEmpty && (
                        <p className="text-xs text-muted-foreground mt-2">No contributions yet.</p>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                        <span
                            key={level}
                            className="w-3 h-3 rounded-[3px] border"
                            style={levelStyles[level]}
                            aria-hidden="true"
                        />
                    ))}
                    <span>More</span>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar pb-2">
                <div style={{ minWidth: `${graphWidth + 48}px` }}>
                    <div className="relative h-4 mb-1" style={{ marginLeft: 28, width: graphWidth }}>
                        {graph.monthLabels.map((label) => (
                            <span
                                key={`${label.weekIndex}-${label.label}`}
                                className="absolute text-[10px] text-muted-foreground"
                                style={{ left: `${label.weekIndex * (CELL_SIZE_PX + CELL_GAP_PX)}px` }}
                            >
                                {label.label}
                            </span>
                        ))}
                    </div>

                    <div
                        className="flex items-start gap-2"
                        role="img"
                        aria-label={`${graph.totalContributions} DSA solves in the last 365 days`}
                    >
                        <div className="grid grid-rows-7 gap-1 pt-[1px]">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                <span
                                    key={`${day}-${index}`}
                                    className="h-3 text-[10px] text-muted-foreground/80"
                                >
                                    {index === 1 || index === 3 || index === 5 ? day : ''}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-1">
                            {graph.weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="grid grid-rows-7 gap-1">
                                    {week.map((day) => {
                                        const inRangeStyle = day.inRange
                                            ? levelStyles[day.level] || levelStyles[0]
                                            : { backgroundColor: 'transparent', borderColor: 'transparent' };
                                        const todayRing = day.isToday
                                            ? { boxShadow: '0 0 0 1px hsl(var(--ring) / 0.65)' }
                                            : undefined;

                                        return (
                                            <div
                                                key={day.key}
                                                className="w-3 h-3 rounded-[3px] border transition-colors"
                                                style={{ ...inRangeStyle, ...todayRing }}
                                                aria-label={day.inRange
                                                    ? `${day.count} problems solved on ${toTooltipDate(day.key)}`
                                                    : undefined}
                                                title={day.inRange
                                                    ? `${day.count} problems solved on ${toTooltipDate(day.key)}`
                                                    : ''}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex md:hidden items-center gap-1 text-[10px] text-muted-foreground mt-3">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <span
                        key={level}
                        className="w-3 h-3 rounded-[3px] border"
                        style={levelStyles[level]}
                        aria-hidden="true"
                    />
                ))}
                <span>More</span>
            </div>
        </div>
    );
};

export default DsaContributionGraph;
