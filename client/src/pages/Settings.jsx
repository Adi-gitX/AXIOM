import React, { useCallback, useEffect, useState } from 'react';
import {
    User,
    Bell,
    Shield,
    LogOut,
    Check
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { settingsApi, userApi } from '../lib/api';

const normalizeBool = (value) => value === true || value === 1 || value === '1';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const currentEmail = currentUser?.email || '';
    const currentDisplayName = currentUser?.displayName || '';

    // Settings state
    const [settings, setSettings] = useState({
        email_notifications: true,
        push_notifications: true,
        weekly_digest: true,
        product_updates: true
    });
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        username: '',
        role: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [loadError, setLoadError] = useState('');

    const loadSettings = useCallback(async () => {
        if (!currentEmail) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setLoadError('');
        try {
            const [settingsData, userData] = await Promise.all([
                settingsApi.get(currentEmail).catch(() => null),
                userApi.getProfile(currentEmail).catch(() => null)
            ]);

            if (settingsData) {
                const normalized = {
                    ...settingsData,
                    email_notifications: normalizeBool(settingsData.email_notifications),
                    push_notifications: normalizeBool(settingsData.push_notifications),
                    weekly_digest: normalizeBool(settingsData.weekly_digest),
                    product_updates: normalizeBool(settingsData.product_updates),
                };
                setSettings((prev) => ({ ...prev, ...normalized }));
            }

            if (userData) {
                const normalizedUsername = String(userData.username || '').trim();
                setProfile({
                    name: userData.name || currentDisplayName || '',
                    email: userData.email || currentEmail || '',
                    username: normalizedUsername ? `@${normalizedUsername}` : '',
                    role: userData.role || '',
                });
            } else {
                setProfile({
                    name: currentDisplayName || '',
                    email: currentEmail || '',
                    username: '',
                    role: '',
                });
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
            setLoadError('Live settings refresh is limited right now. Showing last synced values.');
        } finally {
            setLoading(false);
        }
    }, [currentDisplayName, currentEmail]);

    // Load settings from API
    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    // Save profile changes
    const saveProfile = async () => {
        if (!currentEmail) return;

        setSaving(true);
        try {
            const normalizedUsername = profile.username
                ? profile.username.replace(/^@+/, '').trim()
                : '';

            await userApi.updateProfile({
                email: currentEmail,
                name: profile.name,
                role: profile.role || '',
                username: normalizedUsername,
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err) {
            console.error('Failed to save profile:', err);
        } finally {
            setSaving(false);
        }
    };

    // Toggle notification setting
    const toggleNotification = async (key) => {
        if (!currentEmail) return;

        const newValue = !settings[key];
        setSettings(prev => ({ ...prev, [key]: newValue }));

        try {
            await settingsApi.updateNotifications(currentEmail, {
                [key]: newValue
            });
        } catch (err) {
            console.error('Failed to update notification:', err);
            // Revert on error
            setSettings(prev => ({ ...prev, [key]: !newValue }));
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const notificationSettings = [
        { key: 'email_notifications', label: 'Email Notifications' },
        { key: 'push_notifications', label: 'Push Notifications' },
        { key: 'weekly_digest', label: 'Weekly Digest' },
        { key: 'product_updates', label: 'Product Updates' }
    ];

    return (
        <div className="px-5 sm:px-8 lg:px-14 py-8 lg:py-16 overflow-y-auto custom-scrollbar">
            <div className="max-w-[1180px] mx-auto">
                <header className="mb-12">
                    <div className="mb-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                            <span className="inline-block w-3.5 h-px bg-foreground/30" />
                            Workspace
                        </span>
                    </div>
                    <h1 className="font-display font-semibold text-[30px] md:text-[38px] leading-[1.04] tracking-[-0.028em] text-foreground">
                        Settings
                        <span className="italic-accent text-foreground/85"> — preferences.</span>
                    </h1>
                    <p className="mt-3 text-[13.5px] text-muted-foreground max-w-[560px] leading-relaxed">
                        Account, notifications, and security.
                    </p>
                </header>

                {loadError && (
                    <div className="mb-6 rounded-2xl border border-[#7A4A1F]/15 bg-[#FBEFE0] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-[#7A4A1F]">{loadError}</p>
                        <button
                            type="button"
                            onClick={loadSettings}
                            className="rounded-full bg-card border px-3 h-8 text-xs font-semibold text-foreground hover:border-foreground/15 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-60 shrink-0 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-foreground text-background'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                            >
                                <tab.icon className="w-[15px] h-[15px]" strokeWidth={1.7} />
                                {tab.label}
                            </button>
                        ))}

                        <div className="pt-3 mt-3 border-t border-border">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-[#9C2A1F] hover:bg-[#F2E5EC] transition-colors"
                            >
                                <LogOut className="w-[15px] h-[15px]" strokeWidth={1.7} />
                                Log Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 min-h-[500px]">

                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <p className="text-muted-foreground">Loading settings...</p>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'account' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <h2 className="text-xl font-display font-semibold mb-1">Personal Information</h2>
                                                <p className="text-sm text-muted-foreground">Manage your personal details.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={profile.name}
                                                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-foreground/15 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Email Address</label>
                                                    <input
                                                        type="email"
                                                        value={profile.email}
                                                        disabled
                                                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 opacity-50 cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Username</label>
                                                    <input
                                                        type="text"
                                                        value={profile.username}
                                                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                                                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-foreground/15 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-border flex justify-end gap-3">
                                                {saveSuccess && (
                                                    <span className="flex items-center gap-2 text-[#0E334F] text-sm">
                                                        <Check className="w-4 h-4" /> Saved!
                                                    </span>
                                                )}
                                                <button
                                                    onClick={saveProfile}
                                                    disabled={saving}
                                                    className="px-6 py-3 bg-foreground text-background rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                                >
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <h2 className="text-xl font-display font-semibold mb-1">Notifications</h2>
                                                <p className="text-sm text-muted-foreground">Choose what you want to be notified about.</p>
                                            </div>

                                            <div className="space-y-4">
                                                {notificationSettings.map((item) => (
                                                    <div
                                                        key={item.key}
                                                        onClick={() => toggleNotification(item.key)}
                                                        className="flex items-center justify-between p-4 hover:bg-secondary rounded-xl transition-colors cursor-pointer"
                                                    >
                                                        <span className="font-medium">{item.label}</span>
                                                        <div
                                                            className={`w-11 h-6 rounded-full relative transition-colors ${settings[item.key] ? 'bg-[#0E334F]' : 'bg-muted'}`}
                                                        >
                                                            <div
                                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings[item.key] ? 'right-1' : 'left-1'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'security' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <h2 className="text-xl font-display font-semibold mb-1">Security</h2>
                                                <p className="text-sm text-muted-foreground">Manage your account security.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl bg-secondary/60 border border-border">
                                                    <h3 className="font-medium mb-1">Connected Account</h3>
                                                    <p className="text-sm text-muted-foreground">Signed in with {currentUser?.providerData?.[0]?.providerId || 'Email'}</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-secondary/60 border border-border">
                                                    <h3 className="font-medium mb-1">Last Login</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {currentUser?.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() : 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
