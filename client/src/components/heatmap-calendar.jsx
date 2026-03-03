import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseValidDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymdMatch) {
      const year = Number(ymdMatch[1]);
      const month = Number(ymdMatch[2]);
      const day = Number(ymdMatch[3]);
      const parsedLocal = new Date(year, month - 1, day);
      if (
        !Number.isNaN(parsedLocal.getTime())
        && parsedLocal.getFullYear() === year
        && parsedLocal.getMonth() === month - 1
        && parsedLocal.getDate() === day
      ) {
        return parsedLocal;
      }
      return null;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function toKey(d) {
  const normalized = startOfDay(d);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, "0");
  const day = String(normalized.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek(d, weekStartsOn) {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  x.setDate(x.getDate() - diff);
  return x;
}

function getLevel(value) {
  if (value <= 0) return 0;
  if (value <= 2) return 1;
  if (value <= 5) return 2;
  if (value <= 10) return 3;
  return 4;
}

function clampLevel(level, levelCount) {
  return Math.max(0, Math.min(levelCount - 1, level));
}

function bgStyleForLevel(level, palette) {
  if (!Array.isArray(palette) || palette.length === 0) return undefined;
  const idx = clampLevel(level, palette.length);
  return { backgroundColor: palette[idx] };
}

function sameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function formatMonth(d, fmt) {
  if (fmt === "numeric") {
    const yy = String(d.getFullYear()).slice(-2);
    return `${d.getMonth() + 1}/${yy}`;
  }
  return d.toLocaleDateString(undefined, { month: fmt });
}

function weekdayLabelForIndex(index, weekStartsOn) {
  const actualDay = (weekStartsOn + index) % 7;
  const base = new Date(Date.UTC(2024, 0, 7 + actualDay));
  return base.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase();
}

export function HeatmapCalendar({
  title = "Activity",
  data = [],
  rangeDays = 365,
  endDate = new Date(),
  weekStartsOn = 1,
  cellSize = 12,
  cellGap = 3,
  onCellClick,
  levelClassNames,
  palette,
  legend = true,
  axisLabels = true,
  renderLegend,
  renderTooltip,
  interactionMode = "hover",
  valueLabel = { singular: "question solved", plural: "questions solved" },
  className,
  loading = false,
  from = null,
  to = null,
  timezone = "UTC",
}) {
  const safeWeekStartsOn = weekStartsOn === 0 ? 0 : 1;
  const levels = levelClassNames ?? [
    "bg-muted",
    "bg-primary/20",
    "bg-primary/35",
    "bg-primary/55",
    "bg-primary/75",
  ];
  const levelCount = Array.isArray(palette) && palette.length > 0 ? palette.length : levels.length;

  const legendCfg = legend === true ? {} : legend === false ? { show: false } : legend;
  const axisCfg = axisLabels === true ? {} : axisLabels === false ? { show: false } : axisLabels;

  const showAxis = axisCfg.show ?? true;
  const showWeekdays = axisCfg.showWeekdays ?? true;
  const showMonths = axisCfg.showMonths ?? true;
  const weekdayIndices = axisCfg.weekdayIndices ?? [1, 3, 5];
  const monthFormat = axisCfg.monthFormat ?? "short";
  const minWeekSpacing = axisCfg.minWeekSpacing ?? 3;

  const normalizedRangeDays = Number.isFinite(Number(rangeDays))
    ? Math.max(1, Number(rangeDays))
    : 365;
  const resolvedEndDate = parseValidDate(to) || parseValidDate(endDate) || new Date();
  const fallbackStartDate = addDays(resolvedEndDate, -(normalizedRangeDays - 1));
  const resolvedStartDate = parseValidDate(from) || fallbackStartDate;
  const start = startOfDay(resolvedStartDate <= resolvedEndDate ? resolvedStartDate : fallbackStartDate);
  const end = startOfDay(resolvedEndDate);

  const valueMap = React.useMemo(() => {
    const map = new Map();
    for (const item of data) {
      const d = parseValidDate(item?.date);
      if (!(d instanceof Date) || Number.isNaN(d.getTime())) continue;
      const key = toKey(d);
      const prev = map.get(key);
      const nextVal = (prev?.value ?? 0) + (Number(item?.value) || 0);
      map.set(key, { value: nextVal, meta: item?.meta ?? prev?.meta });
    }
    return map;
  }, [data]);

  const firstWeek = startOfWeek(start, safeWeekStartsOn);
  const totalDays = Math.ceil((end.getTime() - firstWeek.getTime()) / 86400000) + 1;
  const weeks = Math.ceil(totalDays / 7);

  const cells = React.useMemo(() => {
    const nextCells = [];
    for (let w = 0; w < weeks; w += 1) {
      for (let d = 0; d < 7; d += 1) {
        const date = addDays(firstWeek, w * 7 + d);
        const inRange = date >= start && date <= end;
        const key = toKey(date);
        const v = inRange ? (valueMap.get(key)?.value ?? 0) : 0;
        const meta = inRange ? valueMap.get(key)?.meta : undefined;
        const lvl = inRange ? getLevel(v) : 0;
        nextCells.push({
          date,
          key,
          value: v,
          level: clampLevel(lvl, levelCount),
          disabled: !inRange,
          meta,
          label: date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        });
      }
    }
    return nextCells;
  }, [weeks, firstWeek, start, end, valueMap, levelCount]);

  const columns = React.useMemo(() => {
    const nextColumns = [];
    for (let i = 0; i < weeks; i += 1) {
      nextColumns.push(cells.slice(i * 7, i * 7 + 7));
    }
    return nextColumns;
  }, [weeks, cells]);

  const monthLabels = React.useMemo(() => {
    if (!showAxis || !showMonths) return [];
    const labels = [];
    let lastLabeledWeek = -999;
    for (let i = 0; i < columns.length; i += 1) {
      const col = columns[i];
      const firstInCol = col.find((c) => !c.disabled)?.date ?? col[0].date;
      const prevCol = i > 0 ? columns[i - 1] : null;
      const prevFirst = prevCol?.find((c) => !c.disabled)?.date ?? prevCol?.[0]?.date;
      const monthChanged = !prevFirst || !sameMonth(firstInCol, prevFirst);
      if (monthChanged && i - lastLabeledWeek >= minWeekSpacing) {
        labels.push({ colIndex: i, text: formatMonth(firstInCol, monthFormat) });
        lastLabeledWeek = i;
      }
    }
    return labels;
  }, [columns, showAxis, showMonths, monthFormat, minWeekSpacing]);

  const showLegend = legendCfg.show ?? true;
  const placement = legendCfg.placement ?? "right";
  const direction = legendCfg.direction ?? "row";
  const showText = legendCfg.showText ?? true;
  const showArrow = legendCfg.showArrow ?? true;
  const lessText = legendCfg.lessText ?? "Less";
  const moreText = legendCfg.moreText ?? "More";
  const swatchSize = legendCfg.swatchSize ?? cellSize;
  const swatchGap = legendCfg.swatchGap ?? cellGap;

  const LegendUI = renderLegend ? (
    renderLegend({
      levelCount,
      levelClassNames: levels,
      palette,
      cellSize,
      cellGap,
    })
  ) : !showLegend ? null : (
    <div className={cn("min-w-[8.75rem]", legendCfg.className)}>
      {showText ? (
        <div className="mb-2 text-xs text-muted-foreground">
          {lessText} {showArrow ? <span aria-hidden>→</span> : null} {moreText}
        </div>
      ) : null}
      <div
        className={cn("flex items-center", direction === "row" ? "flex-row" : "flex-col")}
        style={{ gap: `${swatchGap}px` }}
      >
        {Array.from({ length: levelCount }).map((_, i) => {
          const cls = levels[clampLevel(i, levels.length)];
          return (
            <div
              key={i}
              className={cn("rounded-[3px]", !(Array.isArray(palette) && palette.length) && cls)}
              style={{
                width: swatchSize,
                height: swatchSize,
                ...(bgStyleForLevel(i, palette) ?? {}),
              }}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );

  const tooltipNode = (cell) => {
    if (renderTooltip) return renderTooltip(cell);
    if (cell.disabled) return "Outside range";
    const singularLabel = String(valueLabel?.singular || "question solved");
    const pluralLabel = String(valueLabel?.plural || "questions solved");
    const unit = cell.value === 1 ? singularLabel : pluralLabel;
    return (
      <div className="text-sm">
        <div className="font-medium">
          {cell.value} {unit}
        </div>
        <div className="text-muted-foreground">{cell.label}</div>
      </div>
    );
  };

  const weekdayLabelWidth = showAxis && showWeekdays ? 44 : 0;

  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 rounded-xl bg-foreground/10 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-[11px] text-muted-foreground">
          {start.toLocaleDateString()} - {end.toLocaleDateString()} {timezone ? `• ${timezone}` : ""}
        </p>
      </CardHeader>

      <CardContent>
        <TooltipProvider delayDuration={80}>
          <div className={cn("flex gap-4 overflow-x-auto", placement === "bottom" && "flex-col")}>
            <div className={cn("min-w-0", axisCfg.className)}>
              {showAxis && showMonths ? (
                <div className="flex items-end" style={{ paddingLeft: weekdayLabelWidth }}>
                  <div
                    className="relative"
                    style={{
                      height: 18,
                      width: columns.length * (cellSize + cellGap) - cellGap,
                    }}
                  >
                    {monthLabels.map((m) => (
                      <div
                        key={m.colIndex}
                        className="absolute text-xs text-muted-foreground"
                        style={{
                          left: m.colIndex * (cellSize + cellGap),
                          top: 0,
                        }}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex">
                {showAxis && showWeekdays ? (
                  <div className="mr-2 flex flex-col" style={{ gap: `${cellGap}px` }} aria-hidden="true">
                    {Array.from({ length: 7 }).map((_, rowIdx) => (
                      <div
                        key={rowIdx}
                        className="flex items-center justify-end text-xs text-muted-foreground"
                        style={{ width: 40, height: cellSize }}
                      >
                        {weekdayIndices.includes(rowIdx)
                          ? weekdayLabelForIndex(rowIdx, safeWeekStartsOn)
                          : ""}
                      </div>
                    ))}
                  </div>
                ) : null}

                <div
                  className="flex"
                  style={{ gap: `${cellGap}px` }}
                  role="grid"
                  aria-label="Heatmap calendar"
                >
                  {columns.map((col, i) => (
                    <div key={i} className="flex flex-col" style={{ gap: `${cellGap}px` }} role="rowgroup">
                      {col.map((cell) => {
                        const cls = levels[clampLevel(cell.level, levels.length)];
                        const singularLabel = String(valueLabel?.singular || "question solved");
                        const pluralLabel = String(valueLabel?.plural || "questions solved");
                        const ariaUnit = cell.value === 1 ? singularLabel : pluralLabel;
                        const isClickable = interactionMode === "click" && typeof onCellClick === "function";
                        return (
                          <Tooltip key={`${cell.key}-${i}`}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                disabled={cell.disabled}
                                onClick={isClickable ? () => !cell.disabled && onCellClick(cell) : undefined}
                                className={cn(
                                  "rounded-[3px] outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                  !(Array.isArray(palette) && palette.length) && cls,
                                  isClickable && !cell.disabled && "cursor-pointer",
                                  cell.disabled && "cursor-default opacity-30 pointer-events-none"
                                )}
                                style={{
                                  width: cellSize,
                                  height: cellSize,
                                  ...(bgStyleForLevel(cell.level, palette) ?? {}),
                                }}
                                aria-label={cell.disabled ? "Outside range" : `${cell.label}: ${cell.value} ${ariaUnit}`}
                                role="gridcell"
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top">{tooltipNode(cell)}</TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {LegendUI}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

export default HeatmapCalendar;
