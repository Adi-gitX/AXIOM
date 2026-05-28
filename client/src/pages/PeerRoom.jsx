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


// TODO: Complete implementation in subsequent commits (Stage 1/3)
