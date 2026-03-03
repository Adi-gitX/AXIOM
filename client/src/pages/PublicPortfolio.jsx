import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Github, MapPin, Briefcase } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { userApi } from '../lib/api';

const PublicPortfolio = () => {
    const { username } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await userApi.getPublicProfile(username);
                setData(response);
            } catch (err) {
                console.error('Failed to load public portfolio:', err);
                setError('Profile not found or private.');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            load();
        }
    }, [username]);

    const profile = data?.profile;
    const showcase = data?.ossShowcase;

    return (
        <div className="min-h-screen">
            <PublicNavbar />
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {loading ? (
                        <p className="text-muted-foreground">Loading profile...</p>
                    ) : error || !profile ? (
                        <div className="glass-card p-8 rounded-3xl border border-border text-center">
                            <p className="text-lg text-foreground">{error || 'Profile not found'}</p>
                            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground mt-3 inline-block">
                                Go back home
                            </Link>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card rounded-3xl border border-border overflow-hidden"
                            >
                                {profile.banner && (
                                    <div className="h-48 w-full overflow-hidden">
                                        <img src={profile.banner} alt="banner" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-start gap-5">
                                        <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-2xl object-cover border border-border" />
                                        <div className="flex-1">
                                            <h1 className="text-4xl font-light text-foreground font-display tracking-tight">{profile.name}</h1>
                                            <p className="text-muted-foreground mt-1 inline-flex items-center gap-2"><Briefcase className="w-4 h-4" /> {profile.role || 'Developer'}</p>
                                            {profile.location && (
                                                <p className="text-muted-foreground mt-1 inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile.location}</p>
                                            )}
                                            {profile.bio && <p className="text-sm text-foreground/80 mt-4 leading-relaxed">{profile.bio}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="rounded-xl border border-border bg-background/40 p-3">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">PRs Opened</p>
                                            <p className="text-2xl font-light mt-1">{showcase?.prsOpened ?? 0}</p>
                                        </div>
                                        <div className="rounded-xl border border-border bg-background/40 p-3">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Merged PRs</p>
                                            <p className="text-2xl font-light mt-1">{showcase?.prsMerged ?? 0}</p>
                                        </div>
                                        <div className="rounded-xl border border-border bg-background/40 p-3">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Skills</p>
                                            <p className="text-2xl font-light mt-1">{(profile.skills || []).length}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="glass-card rounded-3xl border border-border p-5 lg:col-span-2">
                                    <p className="text-sm font-semibold text-foreground mb-3">OSS Showcase</p>
                                    {(showcase?.recentPrs || []).length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No public OSS activity yet.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {(showcase?.recentPrs || []).map((pr, index) => (
                                                <a
                                                    key={`${pr.repo_full_name}-${index}`}
                                                    href={pr.html_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block rounded-xl border border-border bg-background/40 px-3 py-2 hover:border-foreground/30 transition-colors"
                                                >
                                                    <p className="text-sm font-medium text-foreground">{pr.title}</p>
                                                    <p className="text-[11px] text-muted-foreground mt-1">{pr.repo_full_name}</p>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="glass-card rounded-3xl border border-border p-5">
                                    <p className="text-sm font-semibold text-foreground mb-3">Links</p>
                                    <div className="space-y-2">
                                        {(profile.socials || []).map((social, index) => (
                                            <a
                                                key={`${social?.platform}-${index}`}
                                                href={social?.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block rounded-xl border border-border bg-background/40 px-3 py-2 hover:border-foreground/30 transition-colors"
                                            >
                                                <p className="text-sm text-foreground">{social?.platform || 'Link'}</p>
                                                <p className="text-[11px] text-muted-foreground truncate">{social?.url}</p>
                                            </a>
                                        ))}

                                        {profile.github_username && (
                                            <a
                                                href={`https://github.com/${profile.github_username}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 text-sm text-foreground hover:underline mt-2"
                                            >
                                                <Github className="w-4 h-4" /> @{profile.github_username}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicPortfolio;
