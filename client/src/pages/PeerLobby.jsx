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


// TODO: Complete implementation in subsequent commits (Stage 1/2)
