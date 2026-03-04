import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userApi } from '../lib/api';

const AuthContext = createContext();
const syncInFlightByEmail = new Map();
const syncTimestampByEmail = new Map();
const SYNC_CACHE_TTL_MS = 60 * 1000;
const SYNC_FAILURE_BACKOFF_MS = 90 * 1000;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const syncUserToDatabase = async (user) => {
        const email = String(user?.email || '').trim().toLowerCase();
        if (!email) return null;

        const now = Date.now();
        const lastSyncedAt = syncTimestampByEmail.get(email) || 0;
        if (now - lastSyncedAt < SYNC_CACHE_TTL_MS) {
            return null;
        }

        if (syncInFlightByEmail.has(email)) {
            return syncInFlightByEmail.get(email);
        }

        const promise = userApi.createOrGet({
            email,
            name: user.displayName || email.split('@')[0],
            avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        }).then((response) => {
            syncTimestampByEmail.set(email, Date.now());
            return response;
        }).catch((err) => {
            console.error('Failed to sync user to database:', err);
            if (err?.status === 429 || err?.status === 401 || err?.status === 403) {
                // Prevent repeated startup sync storms after transient auth/rate-limit failures.
                syncTimestampByEmail.set(email, Date.now() - SYNC_CACHE_TTL_MS + SYNC_FAILURE_BACKOFF_MS);
            }
            // Don't block auth flow if DB sync fails
            return null;
        }).finally(() => {
            syncInFlightByEmail.delete(email);
        });

        syncInFlightByEmail.set(email, promise);
        return promise;
    };

    const signup = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
            if (user) {
                syncUserToDatabase(user);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
