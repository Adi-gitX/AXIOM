import React, { useState } from 'react';
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
    Laptop
} from 'lucide-react';
import { AnimatedThemeToggler } from '../components/AnimatedThemeToggler';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
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
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-medium text-sm">
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="bg-background/50 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm min-h-[500px]">

                            {activeTab === 'account' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <h2 className="text-xl font-bold font-display mb-1">Personal Information</h2>
                                        <p className="text-sm text-muted-foreground">Manage your personal details.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Full Name</label>
                                            <input type="text" defaultValue="Aditya Kammati" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <input type="email" defaultValue="aditya@axiom.com" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Username</label>
                                            <input type="text" defaultValue="@adigitx" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-border flex justify-end">
                                        <button className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity">Save Changes</button>
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

                                        {/* Reusing existing theme toggler but potentially we could expand it */}
                                        <div className="flex bg-muted/50 p-1 rounded-full border border-border">
                                            <button className="p-2 rounded-full hover:bg-background transition-all"><Sun className="w-4 h-4" /></button>
                                            <button className="p-2 rounded-full bg-background shadow-sm transition-all"><Moon className="w-4 h-4" /></button>
                                            <button className="p-2 rounded-full hover:bg-background transition-all"><Laptop className="w-4 h-4" /></button>
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
                                        {['Email Notifications', 'Push Notifications', 'Weekly Digest', 'Product Updates'].map((item) => (
                                            <div key={item} className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-colors cursor-pointer">
                                                <span className="font-medium">{item}</span>
                                                <div className="w-11 h-6 bg-green-500 rounded-full relative cursor-pointer">
                                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
