import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Play, PhoneOff, Loader2, Wifi, WifiOff, RefreshCcw, Star, X, Clock, UserCheck,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import CollabCodeEditor from '../components/lab/CollabCodeEditor';
import JitsiVideo from '../components/lab/JitsiVideo';
import TestResultsPanel from '../components/lab/TestResultsPanel';
import Markdownish from '../components/lab/Markdownish';
import { runAgainstTests, getLanguage } from '../lib/exec';
import { getProblem, visibleTests } from '../data/problems';
import { useAuth } from '../contexts/AuthContext';
import { peerApi } from '../lib/api';

const LEVEL_COLOR = { Beginner: '#0E334F', Intermediate: '#7A4A1F', Advanced: '#9C2A1F' };

export default function PeerRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const me = currentUser?.email;
    const myName = currentUser?.displayName || (me ? me.split('@')[0] : 'You');

    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState(false);
    const [run, setRun] = useState(null);
    const [busy, setBusy] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [role, setRole] = useState('Interviewer');
    const codeRef = useRef(null);

    const problem = useMemo(() => (room?.problem_id ? getProblem(room.problem_id) : null), [room]);
    const isHost = room && room.host_email === me;
    const peerEmail = room ? (isHost ? room.guest_email : room.host_email) : null;
    const peerName = room ? (isHost ? room.guest_name : room.host_name) : null;

    // Load / join the room.
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await peerApi.getRoom(roomId);
                let r = res?.room;
                if (!r) { setError('Room not found.'); return; }
                if (r.host_email !== me && r.guest_email !== me && r.status === 'open') {
                    const joined = await peerApi.joinRoom(roomId, { email: me, name: myName, avatar: currentUser?.photoURL });
                    r = joined?.room || r;
                }
                if (alive) {
                    setRoom(r);
                    setRole(r.host_email === me ? 'Interviewer' : 'Interviewee');
                }
            } catch (e) {
                if (alive) setError(e?.message || 'Could not open room.');
            }
        })();
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    // Session timer.
    useEffect(() => {
        if (!room) return undefined;
        const t = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [room]);

    // Poll for a peer joining (so the host sees the guest name appear).
    useEffect(() => {
        if (!room || peerEmail) return undefined;
        const t = setInterval(async () => {
            try {
                const res = await peerApi.getRoom(roomId);
                if (res?.room && (res.room.guest_email || res.room.status === 'ended')) setRoom(res.room);
            } catch { /* ignore */ }
        }, 4000);
        return () => clearInterval(t);
    }, [room, peerEmail, roomId]);

    const initialCode = useMemo(() => {
        if (!room) return '';
        if (problem) return problem.starter[room.language] || '';
        const ln = getLanguage(room.language).label;
        return `// ${ln} — collaborate live. Pick a question together and code it here.\n`;
    }, [room, problem]);

    const handleRun = useCallback(async () => {
        if (!problem) return;
        const code = codeRef.current ? codeRef.current() : '';
        setBusy(true);
        setRun({ results: [], passed: 0, total: visibleTests(problem).length, allPassed: false, running: true });
        const out = await runAgainstTests({ language: room.language, code, functionName: problem.functionName, tests: visibleTests(problem), compare: problem.compare || 'deep' });
        setRun({ ...out, running: false });
        setBusy(false);
    }, [problem, room]);

    const endAndLeave = useCallback(async () => {
        try { await peerApi.endRoom(roomId, me); } catch { /* ignore */ }
        navigate('/app/peer');
    }, [roomId, me, navigate]);

    const handleEndClick = () => {
        if (peerEmail) setShowFeedback(true);
        else endAndLeave();
    };

    if (error) {
        return (
            <div className="h-full flex items-center justify-center px-8 text-center">
                <div>
                    <p className="text-[14px] font-medium text-foreground">{error}</p>
                    <button type="button" onClick={() => navigate('/app/peer')} className="mt-3 text-[13px] text-[#0E334F] underline underline-offset-4">Back to lobby</button>
                </div>
            </div>
        );
    }
    if (!room) {
        return <div className="h-full flex items-center justify-center text-[13px] text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Opening room…</div>;
    }

    const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

    return (
        <div className="h-full flex flex-col">
            <SEOHead title="Peer Interview — AXIOM" description="Live peer interview room." />

            {/* Toolbar */}
            <div className="shrink-0 flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 border-b bg-card/60 backdrop-blur" style={{ borderColor: 'hsl(var(--hair))' }}>
                <button type="button" onClick={handleEndClick} className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Leave"><ArrowLeft className="w-4 h-4" /></button>
                <span className="text-[13.5px] font-semibold text-foreground">{problem ? problem.title : 'Open question'}</span>
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded" style={{ color: LEVEL_COLOR[room.level], background: `${LEVEL_COLOR[room.level]}14` }}>{room.level}</span>
                <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground tabular"><Clock className="w-3.5 h-3.5" /> {mmss}</span>

                <button type="button" onClick={() => setRole((r) => (r === 'Interviewer' ? 'Interviewee' : 'Interviewer'))} className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-secondary/70 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors" title="Swap your role">
                    <UserCheck className="w-3.5 h-3.5" /> {role}
                </button>

                <div className="flex-1" />

                <span className={`inline-flex items-center gap-1 text-[11.5px] ${connected ? 'text-emerald-600' : 'text-muted-foreground/70'}`}>
                    {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />} {connected ? 'Synced' : 'Connecting'}
                </span>
                <span className="hidden sm:inline text-[11.5px] text-muted-foreground px-2">
                    {room.host_name || 'Host'}{peerName ? ` ↔ ${peerName}` : ' · waiting for peer…'}
                </span>

                {problem && (
                    <button type="button" onClick={handleRun} disabled={busy} className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-card border text-[12.5px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50" style={{ borderColor: 'hsl(var(--hair))' }}>
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Run tests
                    </button>
                )}
                <button type="button" onClick={handleEndClick} className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-[#9C2A1F] text-[12.5px] font-semibold text-white hover:opacity-90 transition-opacity">
                    <PhoneOff className="w-3.5 h-3.5" /> End
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
                {/* Question */}
                <div className="lg:w-[26%] lg:max-w-[360px] min-h-[140px] lg:min-h-0 overflow-y-auto custom-scrollbar p-4 border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'hsl(var(--hair))' }}>
                    {problem ? (
                        <>
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70 mb-2">Question</p>
                            <Markdownish text={problem.statement} className="text-[13px] text-foreground/90" />
                            {problem.examples?.slice(0, 2).map((ex, i) => (
                                <div key={i} className="mt-2.5 rounded-lg border bg-secondary/30 p-2.5 font-mono text-[11.5px]" style={{ borderColor: 'hsl(var(--hair))' }}>
                                    <div className="text-muted-foreground/70">in: <span className="text-foreground">{ex.input}</span></div>
                                    <div className="text-muted-foreground/70">out: <span className="text-foreground">{ex.output}</span></div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-[13px] text-muted-foreground">
                            <p className="font-medium text-foreground mb-1">No fixed question</p>
                            <p>Decide a problem together over video, then code it in the shared editor. Tip: open the <span className="text-foreground">Problems</span> tab in another window for ideas.</p>
                        </div>
                    )}
                </div>

                {/* Editor + results */}
                <div className="flex-1 min-h-0 flex flex-col border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'hsl(var(--hair))' }}>
                    <div className="flex-1 min-h-[200px] overflow-hidden">
                        <CollabCodeEditor
                            roomId={roomId}
                            language={room.language}
                            initialCode={initialCode}
                            isHost={isHost}
                            user={{ name: myName }}
                            codeRef={codeRef}
                            onStatus={setConnected}
                        />
                    </div>
                    {problem && (
                        <div className="h-[34%] min-h-[140px] border-t" style={{ borderColor: 'hsl(var(--hair))' }}>
                            <TestResultsPanel run={run} />
                        </div>
                    )}
                </div>

                {/* Video */}
                <div className="lg:w-[30%] lg:max-w-[420px] h-[260px] lg:h-auto lg:min-h-0">
                    <JitsiVideo roomId={roomId} displayName={myName} />
                </div>
            </div>

            {showFeedback && (
                <FeedbackModal
                    peerName={peerName}
                    onClose={() => setShowFeedback(false)}
                    onSubmit={async (scores) => {
                        try {
                            if (peerEmail) await peerApi.submitFeedback({ email: me, roomId, toEmail: peerEmail, ...scores });
                        } catch { /* non-blocking */ }
                        await endAndLeave();
                    }}
                />
            )}
        </div>
    );
}

function FeedbackModal({ peerName, onClose, onSubmit }) {
    const [problemSolving, setPs] = useState(3);
    const [communication, setCo] = useState(3);
    const [codeQuality, setCq] = useState(3);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const rows = [
        ['Problem solving', problemSolving, setPs],
        ['Communication', communication, setCo],
        ['Code quality', codeQuality, setCq],
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
            <div className="w-full max-w-[420px] rounded-2xl bg-card border shadow-xl p-5" style={{ borderColor: 'hsl(var(--hair))' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-[16px] text-foreground">Rate {peerName || 'your peer'}</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                    {rows.map(([label, val, setter]) => (
                        <div key={label}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[12.5px] text-foreground">{label}</span>
                                <span className="text-[12px] text-muted-foreground tabular">{val}/5</span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button key={n} type="button" onClick={() => setter(n)} className="p-0.5" title={`${n}`}>
                                        <Star className={`w-5 h-5 ${n <= val ? 'fill-[#7A4A1F] text-[#7A4A1F]' : 'text-muted-foreground/30'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional: what went well, what to improve…" className="w-full px-3 py-2 rounded-md bg-background border text-[13px] text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-[#0E334F]/15" style={{ borderColor: 'hsl(var(--hair))' }} />
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <button type="button" onClick={onClose} className="flex-1 h-9 rounded-lg bg-secondary text-[13px] font-medium text-foreground hover:opacity-90">Skip</button>
                    <button type="button" disabled={submitting} onClick={async () => { setSubmitting(true); await onSubmit({ problemSolving, communication, codeQuality, notes }); }} className="flex-1 h-9 rounded-lg bg-[#0E334F] text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-1.5">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Submit & finish
                    </button>
                </div>
            </div>
        </div>
    );
}
