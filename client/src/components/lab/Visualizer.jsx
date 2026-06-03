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


// TODO: Complete implementation in subsequent commits (Stage 1/4)
