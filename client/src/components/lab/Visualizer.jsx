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



// TODO: Complete implementation in subsequent commits (Stage 2/4)
