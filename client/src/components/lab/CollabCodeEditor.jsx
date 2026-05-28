import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror.next';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { axiomCodeMirror } from './editorTheme';

const USER_COLORS = ['#0E334F', '#7A4A1F', '#7A1F4A', '#2E7D7A', '#3f6e3a'];

function langExt(language) {
    if (language === 'python') return python();
    if (language === 'typescript') return javascript({ typescript: true });
    return javascript();
}

function collabWsBase() {
    if (import.meta.env.VITE_COLLAB_WS_URL) return import.meta.env.VITE_COLLAB_WS_URL;
    if (import.meta.env.DEV) return 'ws://localhost:8001';
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${proto}://${window.location.host}`;
}

/**
 * CollabCodeEditor — a CodeMirror 6 editor whose document is a shared Yjs text,
 * synced peer-to-peer through the backend relay (ws://…/peer-collab/<roomId>).
 * Remote cursors/selections render via Yjs awareness.
 *
 * Props:
 *  - roomId          collaboration room id (Yjs room name)
 *  - language        'python' | 'javascript' | 'typescript' (fixed per room)
 *  - initialCode     seed text; inserted once by the host into an empty doc
 *  - isHost          only the host seeds initial content (avoids duplication)
 *  - user            { name, color? } for awareness
 *  - codeRef         a React ref kept updated with the current document text
 *  - onStatus(bool)  connection status callback
 */
export default function CollabCodeEditor({ roomId, language = 'javascript', initialCode = '', isHost = false, user, codeRef, onStatus }) {
    const hostElRef = useRef(null);

    useEffect(() => {
        if (!hostElRef.current || !roomId) return undefined;

        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(`${collabWsBase()}/peer-collab`, roomId, ydoc, { connect: true });
        const ytext = ydoc.getText('code');
        const undoManager = new Y.UndoManager(ytext);

        const color = user?.color || USER_COLORS[Math.abs(hashCode(user?.name || 'peer')) % USER_COLORS.length];
        provider.awareness.setLocalStateField('user', { name: user?.name || 'Peer', color, colorLight: `${color}33` });



// TODO: Complete implementation in subsequent commits (Stage 1/2)
