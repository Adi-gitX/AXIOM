import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Bell,
    Shield,
    Palette,
    LogOut,
    ChevronRight,
    Monitor,
    Moon,
    Sun,
    Laptop,
    Check
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { settingsApi, userApi } from '../lib/api';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    // Settings state
    const [settings, setSettings] = useState({
        theme: 'system',
        email_notifications: true,
        push_notifications: true,
        weekly_digest: true,
        product_updates: true
    });
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        username: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Load settings from API
    useEffect(() => {
        const loadSettings = async () => {
            if (!currentUser?.email) {
                setLoading(false);
                return;
            }

            try {
                const [settingsData, userData] = await Promise.all([
                    settingsApi.get(currentUser.email).catch(() => null),
                    userApi.getProfile(currentUser.email).catch(() => null)
                ]);

                if (settingsData) {
                    setSettings(prev => ({ ...prev, ...settingsData }));
                }

                if (userData?.user) {
                    setProfile({
                        name: userData.user.name || currentUser.displayName || '',
                        email: userData.user.email || currentUser.email || '',
                        username: userData.user.role ? `@${userData.user.role.toLowerCase().replace(/\s+/g, '')}` : ''
                    });
                } else {
                    setProfile({
                        name: currentUser.displayName || '',
                        email: currentUser.email || '',
                        username: ''
                    });
                }
            } catch (err) {
                console.error('Failed to load settings:', err);
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [currentUser]);

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
        if (!currentUser?.email) return;

        setSaving(true);
        try {
            await userApi.updateProfile({
                email: currentUser.email,
                name: profile.name,
                role: profile.username?.replace('@', '') || ''
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
        if (!currentUser?.email) return;

        const newValue = !settings[key];
        setSettings(prev => ({ ...prev, [key]: newValue }));

        try {
            await settingsApi.updateNotifications(currentUser.email, {
                [key]: newValue
            });
        } catch (err) {
            console.error('Failed to update notification:', err);
            // Revert on error
            setSettings(prev => ({ ...prev, [key]: !newValue }));
        }
    };

    // Set theme
    const setTheme = async (theme) => {
        if (!currentUser?.email) return;

        setSettings(prev => ({ ...prev, theme }));

        try {
            await settingsApi.updateTheme(currentUser.email, theme);
        } catch (err) {
            console.error('Failed to update theme:', err);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Palette },
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
        <div className="flex-1 min-h-screen bg-background text-foreground font-sans p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold font-display tracking-tight mb-8">Settings</h1>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 shrink-0 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm border ${activeTab === tab.id
                                    ? 'bg-foreground text-background border-foreground shadow-lg'
                                    : 'bg-transparent text-muted-foreground border-transparent hover:bg-muted/50 hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}

                        <div className="pt-4 mt-4 border-t border-border">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-medium text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="bg-background/50 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm min-h-[500px]">

                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <p className="text-muted-foreground">Loading settings...</p>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'account' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <h2 className="text-xl font-bold font-display mb-1">Personal Information</h2>
                                                <p className="text-sm text-muted-foreground">Manage your personal details.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={profile.name}
                                                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Email Address</label>
                                                    <input
                                                        type="email"
                                                        value={profile.email}
                                                        disabled
                                                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 opacity-50 cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Username</label>
                                                    <input
                                                        type="text"
                                                        value={profile.username}
                                                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                                                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-border flex justify-end gap-3">
                                                {saveSuccess && (
                                                    <span className="flex items-center gap-2 text-emerald-500 text-sm">
                                                        <Check className="w-4 h-4" /> Saved!
                                                    </span>
                                                )}
                                                <button
                                                    onClick={saveProfile}
                                                    disabled={saving}
                                                    className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                                                >
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'appearance' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <h2 className="text-xl font-bold font-display mb-1">Theme Preferences</h2>
                                                <p className="text-sm text-muted-foreground">Customize how AXIOM looks on your device.</p>
                                            </div>

                                            <div className="p-6 rounded-2xl bg-muted/20 border border-border flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center">
                                                        <Monitor className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold">Interface Theme</h3>
                                                        <p className="text-sm text-muted-foreground">Select your preferred color scheme</p>
                                                    </div>
                                                </div>

                                                <div className="flex bg-muted/50 p-1 rounded-full border border-border">
                                                    <button
                                                        onClick={() => setTheme('light')}
                                                        className={`p-2 rounded-full transition-all ${settings.theme === 'light' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                                                    >
                                                        <Sun className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setTheme('dark')}
                                                        className={`p-2 rounded-full transition-all ${settings.theme === 'dark' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                                                    >
                                                        <Moon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setTheme('system')}
                                                        className={`p-2 rounded-full transition-all ${settings.theme === 'system' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                                                    >
                                                        <Laptop className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <h2 className="text-xl font-bold font-display mb-1">Notifications</h2>
                                                <p className="text-sm text-muted-foreground">Choose what you want to be notified about.</p>
                                            </div>

                                            <div className="space-y-4">
                                                {notificationSettings.map((item) => (
                                                    <div
                                                        key={item.key}
                                                        onClick={() => toggleNotification(item.key)}
                                                        className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-colors cursor-pointer"
                                                    >
                                                        <span className="font-medium">{item.label}</span>
                                                        <div
                                                            className={`w-11 h-6 rounded-full relative transition-colors ${settings[item.key] ? 'bg-emerald-500' : 'bg-muted'}`}
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
                                                <h2 className="text-xl font-bold font-display mb-1">Security</h2>
                                                <p className="text-sm text-muted-foreground">Manage your account security.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl bg-muted/20 border border-border">
                                                    <h3 className="font-medium mb-1">Connected Account</h3>
                                                    <p className="text-sm text-muted-foreground">Signed in with {currentUser?.providerData?.[0]?.providerId || 'Email'}</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-muted/20 border border-border">
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
