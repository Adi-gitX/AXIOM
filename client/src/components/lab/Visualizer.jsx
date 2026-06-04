import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Pause, SkipBack, SkipForward, ChevronsLeft, ChevronsRight, ChevronDown, AlertTriangle, Gauge,
} from 'lucide-react';
import { buildTimeline, valueKind, mapEntries, setValues } from './traceModel';

const SPEEDS = [0.5, 1, 2, 4];
const CELL = 44; // px — array cell width
const GAP = 4; // px — gap between cells
const POINTER_COLORS = ['#0E334F', '#7A4A1F', '#7A1F4A', '#2E7D7A', '#9C2A1F', '#3f6e3a'];

/**
 * Visualizer — an animated, step-through view of an execution trace:
 *  - arrays render as cells with labelled pointer arrows (i, j, left, right…) that
 *    glide to their indices; cells pulse on read (teal) / write (ink)
 *  - scalars, maps and sets render as chips that highlight on change
 *  - the call stack, stdout and return value update per step
 *  - the active source line is pushed to the editor via onActiveLineChange
 */
export default function Visualizer({ trace, onActiveLineChange }) {
    const traceData = trace?.trace || null;
    const { steps } = useMemo(() => buildTimeline(traceData || { events: [] }), [traceData]);
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const timer = useRef(null);

    useEffect(() => {
        setIdx(0);
        setPlaying(steps.length > 1);
    }, [trace]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!playing || steps.length === 0) return undefined;
        timer.current = setInterval(() => {
            setIdx((i) => {
                if (i >= steps.length - 1) { setPlaying(false); return i; }
                return i + 1;
            });
        }, Math.max(80, 440 / speed));
        return () => clearInterval(timer.current);
    }, [playing, speed, steps.length]);

    const step = steps[Math.min(idx, steps.length - 1)] || null;
    const prevStep = idx > 0 ? steps[idx - 1] : null;

    useEffect(() => {
        if (onActiveLineChange) onActiveLineChange(step?.line ?? null);
    }, [step, onActiveLineChange]);

    if (!trace) {
        return <EmptyVisual title="Visualize your algorithm" body="Hit Visualize to trace your code and step through it — every array write, pointer move, and function call, animated." />;
    }
    if (trace.error && steps.length === 0) {
        return (
            <div className="h-full overflow-y-auto custom-scrollbar p-4">
                <div className="rounded-lg border bg-[#9C2A1F]/5 px-3 py-2.5" style={{ borderColor: 'rgba(156,42,31,0.25)' }}>
                    <div className="flex items-center gap-1.5 text-[#9C2A1F] font-semibold text-[12px] mb-1"><AlertTriangle className="w-3.5 h-3.5" /> Couldn’t trace</div>
                    <pre className="whitespace-pre-wrap text-[#7a2018] text-[12px] font-mono">{trace.error}</pre>
                </div>
            </div>
        );
    }
    if (steps.length === 0) {
        return <EmptyVisual title="No trace produced" body="The run completed but produced no trace events." />;
    }

    const frame = step.stack[step.stack.length - 1];
    const prevVars = prevStep && prevStep.stack.length ? prevStep.stack[prevStep.stack.length - 1].vars : {};
    const entries = Object.entries(frame.vars);
    const arrays = entries.filter(([, v]) => valueKind(v) === 'array');
    const others = entries.filter(([, v]) => valueKind(v) !== 'array');

    return (
        <div className="h-full flex flex-col">
            {/* Transport */}
            <div className="shrink-0 px-3 py-2 border-b bg-card/50" style={{ borderColor: 'hsl(var(--hair))' }}>
                <div className="flex items-center gap-1.5">
                    <IconBtn onClick={() => { setPlaying(false); setIdx(0); }} title="Restart"><ChevronsLeft className="w-4 h-4" /></IconBtn>
                    <IconBtn onClick={() => { setPlaying(false); setIdx((i) => Math.max(0, i - 1)); }} title="Previous"><SkipBack className="w-4 h-4" /></IconBtn>
                    <button type="button" onClick={() => { if (idx >= steps.length - 1) setIdx(0); setPlaying((p) => !p); }} className="inline-flex items-center justify-center w-9 h-8 rounded-md bg-[#0E334F] text-white hover:opacity-90 transition-opacity" title={playing ? 'Pause' : 'Play'}>
                        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <IconBtn onClick={() => { setPlaying(false); setIdx((i) => Math.min(steps.length - 1, i + 1)); }} title="Next"><SkipForward className="w-4 h-4" /></IconBtn>
                    <IconBtn onClick={() => { setPlaying(false); setIdx(steps.length - 1); }} title="To end"><ChevronsRight className="w-4 h-4" /></IconBtn>
                    <div className="flex-1" />
                    <button type="button" onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])} className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11.5px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors tabular" title="Playback speed"><Gauge className="w-3.5 h-3.5" /> {speed}×</button>
                    <span className="text-[11.5px] text-muted-foreground tabular w-20 text-right">{idx + 1} / {steps.length}</span>
                </div>
                <input type="range" min={0} max={steps.length - 1} value={idx} onChange={(e) => { setPlaying(false); setIdx(Number(e.target.value)); }} className="w-full mt-2 accent-[#0E334F] h-1" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 space-y-4">
                <OpBanner op={step.op} line={step.line} />

                {/* Arrays — the main stage */}
                {arrays.map(([name, value]) => (
                    <ArrayStage
                        key={name}
                        name={name}
                        value={value}
                        prevValue={prevVars[name]}
                        pointers={computePointers(name, value.length, frame.vars)}
                        highlight={step.highlight && step.highlight.name === name ? step.highlight : null}
                    />
                ))}

                {/* Scalars / maps / sets */}
                {others.length > 0 && (
                    <div>
                        <PanelLabel>Variables{step.stack.length > 1 ? ` · ${frame.function}` : ''}</PanelLabel>
                        <div className="flex flex-wrap gap-2">
                            {others.map(([name, value]) => (
                                <VarChip key={name} name={name} value={value} changed={!sameJson(value, prevVars[name])} highlight={step.highlight && step.highlight.name === name ? step.highlight : null} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Call stack */}
                {step.stack.length > 1 && (
                    <div>
                        <PanelLabel>Call stack</PanelLabel>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {step.stack.map((f, i) => (
                                <span key={i} className={`px-2 py-0.5 rounded-md text-[11.5px] font-mono ${i === step.stack.length - 1 ? 'bg-[#0E334F] text-white' : 'bg-secondary text-muted-foreground'}`}>{f.function}</span>
                            ))}
                        </div>
                    </div>
                )}

                {step.hasReturn && (
                    <div>
                        <PanelLabel>Returned</PanelLabel>
                        <span className="inline-block px-2.5 py-1 rounded-md bg-fabric-peach font-mono text-[12.5px] text-[#7A4A1F]">{deepText(step.returnValue)}</span>
                    </div>
                )}

                {step.stdout.length > 0 && (
                    <div>
                        <PanelLabel>stdout</PanelLabel>
                        <div className="rounded-md bg-secondary/50 px-2.5 py-1.5 font-mono text-[12px] text-foreground/90 whitespace-pre-wrap">{step.stdout.join('')}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Array stage with pointer arrows ────────────────────────────────────── */
function computePointers(arrName, len, vars) {
    const ptrs = [];
    let ci = 0;
    for (const [k, v] of Object.entries(vars)) {
        if (k === arrName) continue;
        if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= len) {
            ptrs.push({ name: k, index: v });
        }
    }
    // group by index for vertical stacking; assign stable colors by name
    const colorByName = {};
    ptrs.forEach((p) => { if (!(p.name in colorByName)) { colorByName[p.name] = POINTER_COLORS[ci % POINTER_COLORS.length]; ci += 1; } });
    return ptrs.map((p) => ({ ...p, color: colorByName[p.name] }));
}

function ArrayStage({ name, value, prevValue, pointers, highlight }) {
    const len = value.length;
    const slot = CELL + GAP;
    // stack pointers that share an index
    const byIndex = {};
    pointers.forEach((p) => { (byIndex[p.index] = byIndex[p.index] || []).push(p); });

    return (
        <div>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="font-mono text-[12px] text-[#7A1F4A]">{name}</span>
                <span className="font-mono text-[11px] text-muted-foreground/50">len {len}</span>
            </div>
            <div className="overflow-x-auto custom-scrollbar pb-1">
                <div className="relative" style={{ width: Math.max(len * slot, slot), minWidth: '100%' }}>
                    {/* pointer arrows */}
                    <div className="relative h-9" style={{ width: len * slot }}>
                        {Object.entries(byIndex).map(([index, group]) => (
                            <motion.div
                                key={group.map((g) => g.name).join('-')}
                                className="absolute flex flex-col items-center"
                                initial={false}
                                animate={{ left: Number(index) * slot }}
                                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                style={{ width: CELL }}
                            >
                                <div className="flex gap-1 mb-0.5">
                                    {group.map((p) => (
                                        <span key={p.name} className="px-1 rounded text-[10px] font-mono font-semibold leading-tight" style={{ color: p.color }}>{p.name}</span>
                                    ))}
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 -mt-0.5" style={{ color: group[0].color }} />
                            </motion.div>
                        ))}
                    </div>

                    {/* cells */}
                    <div className="flex" style={{ gap: GAP }}>
                        <AnimatePresence initial={false}>
                            {value.map((el, i) => {
                                const isHi = highlight && highlight.path && highlight.path[0] === i;
                                const isRead = isHi && highlight.kind === 'read';
                                const changed = !sameJson(el, prevValue?.[i]);
                                const bg = isHi ? (isRead ? '#DCEFEC' : '#E2EEE1') : changed ? '#FBF3E6' : '#FFFFFF';
                                const border = isHi ? (isRead ? '#2E7D7A' : '#0E334F') : 'hsl(214 20% 88%)';
                                return (
                                    <motion.div
                                        key={i}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: isHi ? 1.06 : 1, backgroundColor: bg, borderColor: border }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.18 }}
                                        className="flex flex-col items-center justify-center rounded-md border font-mono shrink-0"
                                        style={{ width: CELL, height: CELL, borderWidth: isHi ? 2 : 1 }}
                                    >
                                        <span className="text-[12.5px] text-[#16263a] leading-none">{cellText(el)}</span>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* index labels */}
                    <div className="flex mt-1" style={{ gap: GAP }}>
                        {value.map((_, i) => (
                            <span key={i} className="text-center text-[9.5px] font-mono text-muted-foreground/45 shrink-0" style={{ width: CELL }}>{i}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Scalar / map / set chip ────────────────────────────────────────────── */
function VarChip({ name, value, changed, highlight }) {
    const kind = valueKind(value);
    const isHi = Boolean(highlight);
    const ring = isHi ? (highlight.kind === 'read' ? 'ring-2 ring-[#2E7D7A]/60' : 'ring-2 ring-[#0E334F]') : changed ? 'ring-1 ring-[#7A4A1F]/40' : '';
    return (
        <motion.div layout initial={false} animate={{ scale: isHi ? 1.04 : 1 }} transition={{ duration: 0.15 }} className={`rounded-lg border bg-card px-2.5 py-1.5 ${ring}`} style={{ borderColor: 'hsl(var(--hair))' }}>
            <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11.5px] text-[#7A1F4A]">{name}</span>
                <span className="font-mono text-[11px] text-muted-foreground/40">=</span>
                {kind === 'map' ? <MapMini value={value} /> : kind === 'set' ? <SetMini value={value} /> : <span className="font-mono text-[12px] text-[#16263a]">{deepText(value)}</span>}
            </div>
        </motion.div>
    );
}

function MapMini({ value }) {
    const entries = mapEntries(value);
    if (!entries.length) return <span className="font-mono text-[12px] text-muted-foreground/60">Map(0)</span>;
    return (
        <span className="inline-flex flex-wrap gap-1">
            {entries.slice(0, 8).map(([k, v], i) => (
                <span key={i} className="font-mono text-[11px] px-1 rounded bg-secondary/60"><span className="text-[#7A4A1F]">{cellText(k)}</span><span className="text-muted-foreground/40">→</span><span className="text-[#16263a]">{cellText(v)}</span></span>
            ))}
            {entries.length > 8 && <span className="text-[10px] text-muted-foreground/50">+{entries.length - 8}</span>}
        </span>
    );
}

function SetMini({ value }) {
    const vals = setValues(value);
    if (!vals.length) return <span className="font-mono text-[12px] text-muted-foreground/60">Set(0)</span>;
    return (
        <span className="inline-flex flex-wrap gap-1">
            {vals.slice(0, 10).map((v, i) => <span key={i} className="font-mono text-[11px] px-1 rounded bg-secondary/60 text-[#16263a]">{cellText(v)}</span>)}
            {vals.length > 10 && <span className="text-[10px] text-muted-foreground/50">+{vals.length - 10}</span>}
        </span>
    );
}

/* ── helpers + chrome ───────────────────────────────────────────────────── */
function cellText(v) {
    if (v === null) return '∅';
    if (v === undefined) return '·';
    if (typeof v === 'string') return v.length <= 4 ? v : `${v.slice(0, 3)}…`;
    if (typeof v === 'object') return Array.isArray(v) ? `[${v.length}]` : '{}';
    return String(v);
}
function deepText(v) {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'string') return `"${v}"`;
    try { const s = JSON.stringify(v); return s.length > 80 ? `${s.slice(0, 79)}…` : s; } catch { return String(v); }
}
function sameJson(a, b) {
    try { return JSON.stringify(a) === JSON.stringify(b); } catch { return a === b; }
}

function IconBtn({ children, onClick, title }) {
    return <button type="button" onClick={onClick} title={title} aria-label={title} className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">{children}</button>;
}
function PanelLabel({ children }) {
    return <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 mb-2">{children}</p>;
}

const OP_TONE = {
    write: { bg: 'bg-fabric-sage', ink: '#0E334F' }, mutate: { bg: 'bg-fabric-sage', ink: '#0E334F' },
    read: { bg: 'bg-fabric-mist', ink: '#0E334F' }, call: { bg: 'bg-fabric-peach', ink: '#7A4A1F' },
    return: { bg: 'bg-fabric-peach', ink: '#7A4A1F' }, stdout: { bg: 'bg-secondary', ink: '#444' },
    exception: { bg: 'bg-[#9C2A1F]/10', ink: '#9C2A1F' }, timeout: { bg: 'bg-[#9C2A1F]/10', ink: '#9C2A1F' },
};
function OpBanner({ op, line }) {
    const tone = (op && OP_TONE[op.kind]) || { bg: 'bg-secondary/60', ink: '#555' };
    return (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${tone.bg}`}>
            <span className="text-[10.5px] font-mono px-1.5 py-0.5 rounded bg-white/60" style={{ color: tone.ink }}>L{line ?? '—'}</span>
            <span className="text-[12.5px] font-mono truncate" style={{ color: tone.ink }}>{op ? op.text : 'executing line'}</span>
        </div>
    );
}
function EmptyVisual({ title, body }) {
    return (
        <div className="h-full flex items-center justify-center px-8 text-center">
            <div className="max-w-[320px]">
                <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-fabric-sage flex items-center justify-center"><Play className="w-4 h-4 text-[#0E334F]" /></div>
                <h3 className="font-display font-semibold text-[15px] text-foreground mb-1.5">{title}</h3>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">{body}</p>
            </div>
        </div>
    );
}
