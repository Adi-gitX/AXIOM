import React, { useEffect, useRef, useState } from 'react';
import { Video, Loader2 } from 'lucide-react';

const JITSI_DOMAIN = 'meet.jit.si';
let scriptPromise = null;

function loadJitsiScript() {
    if (window.JitsiMeetExternalAPI) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = `https://${JITSI_DOMAIN}/external_api.js`;
        s.async = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load Jitsi'));
        document.body.appendChild(s);
    });
    return scriptPromise;
}

/**
 * JitsiVideo — embeds a Jitsi Meet call for a peer-interview room. Uses the public
 * meet.jit.si instance (no account or API key). Both peers join the same room name
 * derived from the AXIOM room id, so they land in the same call.
 *
 * For production scale/branding, self-host Jitsi or swap to LiveKit/Daily — this
 * component is the only place video is wired.
 */
export default function JitsiVideo({ roomId, displayName }) {
    const containerRef = useRef(null);
    const apiRef = useRef(null);
    const [state, setState] = useState('loading'); // loading | ready | error

    useEffect(() => {
        let disposed = false;
        loadJitsiScript()
            .then(() => {
                if (disposed || !containerRef.current) return;
                // eslint-disable-next-line new-cap
                apiRef.current = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
                    roomName: `axiom-peer-${roomId}`,
                    parentNode: containerRef.current,
                    width: '100%',
                    height: '100%',
                    userInfo: { displayName: displayName || 'Peer' },
                    configOverwrite: {
                        prejoinPageEnabled: false,
                        disableDeepLinking: true,
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                    },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'tileview', 'hangup', 'fullscreen'],
                        SHOW_JITSI_WATERMARK: false,
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    },
                });
                setState('ready');
            })
            .catch(() => !disposed && setState('error'));

        return () => {
            disposed = true;
            try { apiRef.current?.dispose(); } catch { /* ignore */ }
            apiRef.current = null;
        };
    }, [roomId, displayName]);

    return (
        <div className="relative h-full w-full bg-[#1a1c20]">
            <div ref={containerRef} className="h-full w-full" />
            {state !== 'ready' && (
                <div className="absolute inset-0 flex items-center justify-center text-white/80">
                    {state === 'error' ? (
                        <div className="text-center px-4">
                            <Video className="w-5 h-5 mx-auto mb-2 opacity-60" />
                            <p className="text-[12.5px]">Video unavailable. Check your connection or browser permissions.</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[12.5px]"><Loader2 className="w-4 h-4 animate-spin" /> Connecting video…</div>
                    )}
                </div>
            )}
        </div>
    );
}
