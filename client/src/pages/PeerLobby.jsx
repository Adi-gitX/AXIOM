import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Zap, Plus, Trophy, Loader2, RefreshCw, Video, ArrowUpRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { PageShell, PageHeader, Surface, KpiTile, Section } from '../components/ui/AppPrimitives';
import { useAuth } from '../contexts/AuthContext';
import { peerApi } from '../lib/api';
import { LANGUAGES } from '../lib/exec';
import { listProblems } from '../data/problems';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LEVEL_COLOR = { Beginner: '#0E334F', Intermediate: '#7A4A1F', Advanced: '#9C2A1F' };

export default function PeerLobby() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const problems = useMemo(() => listProblems(), []);

    const [level, setLevel] = useState('Intermediate');
    const [language, setLanguage] = useState('javascript');
    const [problemId, setProblemId] = useState('');
    const [stats, setStats] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [busy, setBusy] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(true);

    const me = currentUser?.email;
    const myName = currentUser?.displayName || (me ? me.split('@')[0] : 'You');
    const payloadBase = () => ({ email: me, name: myName, avatar: currentUser?.photoURL, level, language, problemId: problemId || null });

    const refresh = useCallback(async () => {
        setLoadingRooms(true);
        try {
            const [r, lb] = await Promise.all([peerApi.listRooms(), peerApi.leaderboard()]);
            setRooms(r?.rooms || []);
            setLeaderboard(lb?.leaderboard || []);
        } catch { /* ignore */ } finally { setLoadingRooms(false); }
    }, []);

    useEffect(() => {
        if (me) peerApi.myStats(me).then((s) => setStats(s?.stats)).catch(() => {});
        refresh();
    }, [me, refresh]);

    const goToRoom = (room) => room?.id && navigate(`/app/peer/${room.id}`);

    const handleQuickMatch = async () => {
        setBusy(true);
        try {
            const res = await peerApi.quickMatch(payloadBase());
            goToRoom(res?.room);
        } catch { setBusy(false); }
    };
    const handleCreate = async () => {
        setBusy(true);
        try {
            const res = await peerApi.createRoom(payloadBase());
            goToRoom(res?.room);
        } catch { setBusy(false); }
    };
    const handleJoin = async (room) => {
        try {
            await peerApi.joinRoom(room.id, { email: me, name: myName, avatar: currentUser?.photoURL });
            goToRoom(room);
        } catch { /* room may have filled */ refresh(); }
    };

    return (
        <PageShell>
            <SEOHead title="Peer Interviews — AXIOM" description="Practice technical interviews with peers: shared editor, live video, real questions, and a rating that grows as you do." />

            <PageHeader
                eyebrow="Peer Interviews"
                title="Interview a peer,"
                tail="grow together."
                meta="Get matched with another engineer, share a live coding pad and video, work a real question, and rate each other. Your level climbs as you practice."
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <KpiTile label="Your rating" value={stats ? stats.rating : '—'} hint="peer-interview ELO" tone="sage" />
                <KpiTile label="Level" value={stats?.level || level} hint="self-selected" tone="mist" />
                <KpiTile label="Sessions" value={stats ? stats.sessions : '—'} hint="completed" tone="peach" />
                <KpiTile label="Online rooms" value={rooms.length} hint="open now" tone="sand" />
            </div>

            {/* Start a session */}
            <Surface className="p-5 mb-8">
                <div className="flex flex-wrap items-end gap-4">
                    <Field label="Level">
                        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/70">
                            {LEVELS.map((l) => (
                                <button key={l} type="button" onClick={() => setLevel(l)} className={`px-3 h-8 rounded-md text-[12.5px] font-medium transition-colors ${level === l ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{l}</button>
                            ))}
                        </div>
                    </Field>
                    <Field label="Language">
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-9 px-2.5 rounded-lg bg-card border text-[13px] text-foreground" style={{ borderColor: 'hsl(var(--hair))' }}>
                            {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                        </select>
                    </Field>
                    <Field label="Question (optional)">
                        <select value={problemId} onChange={(e) => setProblemId(e.target.value)} className="h-9 px-2.5 rounded-lg bg-card border text-[13px] text-foreground min-w-[180px]" style={{ borderColor: 'hsl(var(--hair))' }}>
                            <option value="">Let us pick / decide live</option>
                            {problems.map((p) => <option key={p.id} value={p.id}>{p.title} · {p.difficulty}</option>)}
                        </select>
                    </Field>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={handleCreate} disabled={busy} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-card border text-[13px] font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50" style={{ borderColor: 'hsl(var(--hair))' }}>
                            <Plus className="w-4 h-4" /> Create room
                        </button>
                        <button type="button" onClick={handleQuickMatch} disabled={busy} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#0E334F] text-[13px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Quick match
                        </button>
                    </div>
                </div>
            </Surface>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Open rooms */}
                <div className="lg:col-span-3">
                    <Section
                        label="Open rooms"
                        action={<button type="button" onClick={refresh} className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>}
                    >
                        {loadingRooms ? (
                            <p className="text-[13px] text-muted-foreground py-6 text-center">Loading rooms…</p>
                        ) : rooms.length === 0 ? (
                            <Surface className="p-8 text-center">
                                <Video className="w-5 h-5 mx-auto mb-2 text-muted-foreground/50" />
                                <p className="text-[13px] text-muted-foreground">No open rooms yet. Create one or Quick-match — a peer will join you.</p>
                            </Surface>
                        ) : (
                            <div className="space-y-2">
                                {rooms.map((room) => (
                                    <Surface key={room.id} lift className="group cursor-pointer" onClick={() => (room.host_email === me ? goToRoom(room) : handleJoin(room))}>
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <div className="w-9 h-9 rounded-full bg-fabric-sage flex items-center justify-center text-[12px] font-semibold text-[#0E334F]">
                                                {(room.host_name || 'P').slice(0, 1).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[13.5px] font-semibold text-foreground truncate">{room.host_name || 'A peer'}{room.host_email === me ? ' (you)' : ''}</div>
                                                <div className="text-[11.5px] text-muted-foreground">{room.topic || 'Open question'} · {room.language}</div>
                                            </div>
                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ color: LEVEL_COLOR[room.level], background: `${LEVEL_COLOR[room.level]}14` }}>{room.level}</span>
                                            <span className="text-[12px] font-medium text-[#0E334F] group-hover:underline">{room.host_email === me ? 'Re-enter' : 'Join'}</span>
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                                        </div>
                                    </Surface>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>

                {/* Leaderboard */}
                <div className="lg:col-span-2">
                    <Section label="Leaderboard" eyebrow="Top peers">
                        {leaderboard.length === 0 ? (
                            <p className="text-[13px] text-muted-foreground">No ranked peers yet — be the first.</p>
                        ) : (
                            <div className="space-y-1.5">
                                {leaderboard.map((p, i) => (
                                    <div key={p.user_email} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2" style={{ borderColor: 'hsl(var(--hair))' }}>
                                        <span className={`w-6 text-center text-[12px] font-semibold ${i < 3 ? 'text-[#7A4A1F]' : 'text-muted-foreground/60'}`}>{i === 0 ? <Trophy className="w-4 h-4 inline" /> : i + 1}</span>
                                        <span className="flex-1 min-w-0 text-[13px] font-medium text-foreground truncate">{p.name || p.user_email.split('@')[0]}</span>
                                        <span className="text-[11px] text-muted-foreground">{p.sessions} sess</span>
                                        <span className="text-[12.5px] font-semibold tabular text-[#0E334F]">{p.rating}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>
            </div>
        </PageShell>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70 mb-1.5">{label}</p>
            {children}
        </div>
    );
}
