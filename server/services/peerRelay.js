import { WebSocketServer } from 'ws';

/**
 * peerRelay — a minimal room-scoped WebSocket relay for Yjs collaborative editing
 * in peer-interview rooms.
 *
 * Yjs is a CRDT, so a dumb relay that forwards every binary message to the other
 * peers in the same room is sufficient for the y-websocket client protocol with a
 * small number of participants (here: 2). We do NOT persist document state on the
 * server — peers converge directly. This keeps the surface tiny and avoids any
 * server-side document storage contract.
 *
 * Path: ws://<host>/peer-collab/<roomId>
 */
const COLLAB_PREFIX = '/peer-collab/';

export function attachPeerRelay(httpServer) {
    const wss = new WebSocketServer({ noServer: true });
    /** roomId -> Set<WebSocket> */
    const rooms = new Map();

    httpServer.on('upgrade', (req, socket, head) => {
        let pathname = '/';
        try {
            pathname = new URL(req.url, 'http://localhost').pathname;
        } catch {
            pathname = req.url || '/';
        }
        if (!pathname.startsWith(COLLAB_PREFIX)) {
            // Not ours — let other handlers deal with it; if none, close.
            return;
        }
        const roomId = decodeURIComponent(pathname.slice(COLLAB_PREFIX.length).split('/')[0] || '').trim();
        if (!roomId) {
            socket.destroy();
            return;
        }
        wss.handleUpgrade(req, socket, head, (ws) => {
            ws.roomId = roomId;
            if (!rooms.has(roomId)) rooms.set(roomId, new Set());
            rooms.get(roomId).add(ws);

            ws.on('message', (data, isBinary) => {
                const peers = rooms.get(roomId);
                if (!peers) return;
                for (const peer of peers) {
                    if (peer !== ws && peer.readyState === peer.OPEN) {
                        peer.send(data, { binary: isBinary });
                    }
                }
            });

            const cleanup = () => {
                const peers = rooms.get(roomId);
                if (peers) {
                    peers.delete(ws);
                    if (peers.size === 0) rooms.delete(roomId);
                }
            };
            ws.on('close', cleanup);
            ws.on('error', cleanup);
        });
    });

    console.log('[peer-relay] WebSocket collab relay attached at', `${COLLAB_PREFIX}<roomId>`);
    return wss;
}
