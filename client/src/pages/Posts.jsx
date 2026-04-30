import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Plus, Bookmark, MessageSquare, ArrowUp, ArrowDown, X, Star, GitFork } from 'lucide-react';import { postsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader, Surface, EmptyState } from '../components/ui/AppPrimitives';

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    return num?.toString() || '0';
};

const safeParseJson = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return value;
    if (typeof value !== 'string') return fallback;
    try { return JSON.parse(value); } catch { return fallback; }
};

const PostCard = ({ post, index, onClick, onVote, onSave }) => {
    const [upvotes, setUpvotes] = useState(post.upvotes || 0);
    const [hasUpvoted, setHasUpvoted] = useState(post.user_vote === 1);
    const [hasDownvoted, setHasDownvoted] = useState(post.user_vote === -1);
    const [isSaved, setIsSaved] = useState(post.is_saved || false);

    const handleUpvote = async (e) => {
        e.stopPropagation();
        const newVote = hasUpvoted ? 0 : 1;
        if (hasUpvoted) { setUpvotes((p) => p - 1); setHasUpvoted(false); }
        else { setUpvotes((p) => p + (hasDownvoted ? 2 : 1)); setHasUpvoted(true); setHasDownvoted(false); }
        if (onVote) await onVote(post.id, newVote);
    };
    const handleDownvote = async (e) => {
        e.stopPropagation();
        const newVote = hasDownvoted ? 0 : -1;
        if (hasDownvoted) { setUpvotes((p) => p + 1); setHasDownvoted(false); }
        else { setUpvotes((p) => p - (hasUpvoted ? 2 : 1)); setHasDownvoted(true); setHasUpvoted(false); }
        if (onVote) await onVote(post.id, newVote);
    };
    const handleSave = async (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        if (onSave) await onSave(post.id, !isSaved);
    };

    const tags = Array.isArray(post.tags) ? post.tags : safeParseJson(post.tags, []);
    const preview = safeParseJson(post.preview, {});
    const source = safeParseJson(post.source, { name: 'AXIOM', icon: 'A' });

    return (
        <div>
            <Surface
                onClick={onClick}
                className="p-5 cursor-pointer hover:border-foreground/15 transition-colors flex flex-col h-full group"
            >
                <div className="flex items-start gap-3 mb-3">
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-mono font-semibold text-[13px] text-background"
                        style={{ backgroundColor: 'hsl(var(--ink))' }}
                    >
                        {source.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] font-mono uppercase tracking-[0.1em] text-muted-foreground">{source.name || 'AXIOM'}</p>
                        <p className="text-[11px] text-muted-foreground/80">
                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {post.read_time || '3m read'}
                        </p>
                    </div>
                </div>

                <h2 className="font-display font-semibold text-[17px] leading-snug tracking-[-0.012em] text-foreground line-clamp-3 mb-3 group-hover:text-foreground/85 transition-colors">
                    {post.title}
                </h2>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-secondary text-[10.5px] font-mono uppercase tracking-[0.06em] text-muted-foreground border"
                                style={{ borderColor: 'hsl(var(--hair))' }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {preview.repo && (
                    <div
                        className="rounded-xl border p-3 mb-4 mt-auto"
                        style={{ borderColor: 'hsl(var(--hair))', backgroundColor: 'hsl(var(--paper-soft))' }}
                    >
                        <p className="text-[12.5px] font-medium text-foreground truncate">{preview.repo}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{preview.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-muted-foreground tabular">
                            <span className="inline-flex items-center gap-1"><Star className="w-3 h-3" /> {formatNumber(preview.stars)}</span>
                            <span className="inline-flex items-center gap-1"><GitFork className="w-3 h-3" /> {formatNumber(preview.forks)}</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 mt-auto border-t" style={{ borderColor: 'hsl(var(--hair))' }}>
                    <div
                        className="inline-flex items-center bg-secondary border rounded-full"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    >
                        <button
                            onClick={handleUpvote}
                            className={`h-7 inline-flex items-center gap-1.5 px-3 rounded-l-full text-[12px] font-semibold transition-colors ${
                                hasUpvoted ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.2} />
                            <span className="tabular">{upvotes}</span>
                        </button>
                        <span className="w-px h-4" style={{ backgroundColor: 'hsl(var(--hair))' }} />
                        <button
                            onClick={handleDownvote}
                            className={`h-7 w-7 inline-flex items-center justify-center rounded-r-full transition-colors ${
                                hasDownvoted ? 'text-[#9C2A1F]' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <ArrowDown className="w-3.5 h-3.5" strokeWidth={2.2} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="inline-flex items-center gap-1 h-7 px-2 rounded-full text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="tabular">{post.comments_count || 0}</span>
                        </button>
                        <button
                            onClick={handleSave}
                            className={`w-7 h-7 inline-flex items-center justify-center rounded-full transition-colors ${
                                isSaved ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} strokeWidth={1.8} />
                        </button>
                    </div>
                </div>
            </Surface>
        </div>
    );
};

const Posts = () => {
    const { currentUser } = useAuth();
    const [activeFilter, setActiveFilter] = useState('For You');
    const [, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
    const [createLoading, setCreateLoading] = useState(false);
    const [error, setError] = useState('');
    const [retryNonce, setRetryNonce] = useState(0);
    const [liveMode, setLiveMode] = useState(true);
    const isTransientApiError = (err) => err?.status === 401 || err?.status === 429 || err?.status === 503 || err?.code === 'BACKEND_UNAVAILABLE';
    const filters = useMemo(() => ['For You', 'Following', 'Popular', 'Recent'], []);

    const fetchPosts = useCallback(async () => {
        setLoading(true); setError('');
        try {
            if (liveMode) {
                const apiBase = (import.meta.env.VITE_API_URL || '') + '/api/public/posts';
                const r = await fetch(apiBase);
                if (!r.ok) throw new Error(`live posts ${r.status}`);
                const data = await r.json();
                // Map to the shape the existing card expects
                const adapted = (data.posts || []).map((p) => ({
                    id: p.id,
                    title: p.title,
                    upvotes: p.upvotes,
                    user_vote: 0,
                    is_saved: false,
                    tags: [],
                    preview: { type: 'link', url: p.external_url },
                    source: { name: p.source_name, icon: p.source_icon, color: p.source_color },
                    user: { name: p.author_name, avatar: p.author_avatar, email: '' },
                    read_time: p.read_time,
                    published_at: p.published_at,
                    external_url: p.external_url,
                }));
                setPosts(adapted);
            } else {
                let sort = 'recent';
                if (activeFilter === 'Popular') sort = 'popular';
                else if (activeFilter === 'For You') sort = 'trending';
                const data = await postsApi.getAll({ sort, email: currentUser?.email });
                setPosts(Array.isArray(data) ? data : (data.posts || []));
            }
        } catch (err) {
            if (!isTransientApiError(err)) console.error('Failed to fetch posts:', err);
            setPosts([]); setError('Unable to refresh posts right now.');
        } finally { setLoading(false); }
    }, [activeFilter, currentUser?.email, liveMode]);

    useEffect(() => { fetchPosts(); }, [fetchPosts, retryNonce]);

    const handleVote = async (postId, vote) => {
        if (!currentUser?.email) return;
        try {
            const voteType = vote === 1 ? 'up' : vote === -1 ? 'down' : 'none';
            await postsApi.vote(postId, currentUser.email, voteType);
        } catch (err) { console.error('Failed to vote:', err); }
    };
    const handleSave = async (postId) => {
        if (!currentUser?.email) return;
        try { await postsApi.toggleSave(postId, currentUser.email); }
        catch (err) { console.error('Failed to save:', err); }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!currentUser?.email) { alert('You need to log in to create a post.'); return; }
        if (!newPost.title.trim()) return;
        setCreateLoading(true);
        try {
            const tagsArray = newPost.tags.split(',').map((t) => t.trim()).filter(Boolean);
            const created = await postsApi.create({
                email: currentUser.email,
                title: newPost.title.trim(),
                content: newPost.content.trim(),
                tags: tagsArray,
                userName: currentUser.displayName || currentUser.email.split('@')[0],
                userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`,
            });
            setPosts((prev) => [created, ...prev]);
            setNewPost({ title: '', content: '', tags: '' });
            setShowCreateModal(false);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to create post.');
        } finally { setCreateLoading(false); }
    };

    return (
        <div className="px-5 sm:px-8 lg:px-14 py-8 lg:py-16">
            <div className="mx-auto max-w-[1280px]">
                <PageHeader
                    eyebrow="Community"
                    title="Posts"
                    tail={liveMode ? '— live from HackerNews + Dev.to.' : '— what devs are reading.'}
                    meta={`${posts.length} posts · ${liveMode ? 'refreshed every 30 min' : 'curated daily'}`}
                    action={
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-1 bg-card border rounded-full p-1" style={{ borderColor: 'hsl(var(--hair))' }}>
                                <button
                                    data-testid="posts-mode-live"
                                    onClick={() => setLiveMode(true)}
                                    className={`h-7 px-3 rounded-full text-[12px] font-semibold transition-colors ${liveMode ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <span className={`inline-block w-1.5 h-1.5 rounded-full bg-[#FF6600] mr-2 align-middle ${liveMode ? 'live-dot' : ''}`} /> Live
                                </button>
                                <button
                                    data-testid="posts-mode-curated"
                                    onClick={() => setLiveMode(false)}
                                    className={`h-7 px-3 rounded-full text-[12px] font-semibold transition-colors ${!liveMode ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Curated
                                </button>
                            </div>
                            <button
                                data-testid="posts-new-btn"
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-foreground text-background text-[13px] font-semibold hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-3.5 h-3.5" strokeWidth={2.4} />
                                New Post
                            </button>
                        </div>
                    }
                />

                {error && (
                    <Surface className="p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-[#9C2A1F]">{error}</p>
                            <button
                                onClick={() => setRetryNonce((p) => p + 1)}
                                className="rounded-full px-4 h-8 bg-foreground text-background text-[12px] font-semibold hover:opacity-90"
                            >
                                Retry
                            </button>
                        </div>
                    </Surface>
                )}

                {/* Filter tabs */}
                <div
                    className="flex items-center gap-6 border-b mb-8"
                    style={{ borderColor: 'hsl(var(--hair))' }}
                >
                    {filters.map((f) => (
                        <button
                            key={f}
                            data-testid={`posts-filter-${f.toLowerCase().replace(' ', '-')}`}
                            onClick={() => setActiveFilter(f)}
                            className={`pb-3 text-[13px] font-semibold tracking-[-0.005em] transition-colors border-b-2 -mb-px ${
                                activeFilter === f
                                    ? 'border-foreground text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Surface key={i} className="p-5">
                                <div className="h-9 w-9 rounded-lg bg-secondary animate-pulse mb-3" />
                                <div className="h-4 bg-secondary rounded animate-pulse mb-2" />
                                <div className="h-4 w-3/4 bg-secondary rounded animate-pulse mb-3" />
                                <div className="h-3 w-1/3 bg-secondary rounded animate-pulse" />
                            </Surface>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <EmptyState
                        title="No posts yet"
                        description="Share your ideas, projects, or discoveries with the community."
                        action={
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-foreground text-background text-[13px] font-semibold hover:opacity-90"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Write the first post
                            </button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.map((post, index) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                index={index}
                                onClick={() => {
                                    if (post.external_url) {
                                        window.open(post.external_url, '_blank', 'noopener,noreferrer');
                                    } else {
                                        setSelectedPost(post);
                                    }
                                }}
                                onVote={handleVote}
                                onSave={handleSave}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            className="w-full max-w-lg bg-card border rounded-2xl shadow-2xl p-6"
                            style={{ borderColor: 'hsl(var(--hair))' }}
                            initial={{ scale: 0.96, opacity: 0, y: 8 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display font-semibold text-[22px] tracking-[-0.015em] text-foreground">
                                    Create post
                                </h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="w-8 h-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePost} className="space-y-4">
                                <div>
                                    <label className="block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80 mb-1.5">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                                        placeholder="What's on your mind?"
                                        className="w-full px-4 h-11 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/15 focus:border-foreground/20 text-[14px] text-foreground placeholder:text-muted-foreground transition-all"
                                        style={{ borderColor: 'hsl(var(--hair))' }}
                                        required
                                        maxLength={300}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80 mb-1.5">
                                        Content
                                    </label>
                                    <textarea
                                        value={newPost.content}
                                        onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                                        placeholder="Share your thoughts, code snippets, or ideas..."
                                        rows={5}
                                        className="w-full px-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/15 focus:border-foreground/20 text-[14px] text-foreground placeholder:text-muted-foreground resize-none transition-all"
                                        style={{ borderColor: 'hsl(var(--hair))' }}
                                        maxLength={10000}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80 mb-1.5">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={newPost.tags}
                                        onChange={(e) => setNewPost((p) => ({ ...p, tags: e.target.value }))}
                                        placeholder="react, javascript, tutorial"
                                        className="w-full px-4 h-11 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/15 focus:border-foreground/20 text-[14px] text-foreground placeholder:text-muted-foreground transition-all"
                                        style={{ borderColor: 'hsl(var(--hair))' }}
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 h-11 rounded-full border bg-card text-foreground hover:bg-secondary transition-colors text-[13px] font-semibold"
                                        style={{ borderColor: 'hsl(var(--hair))' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading || !newPost.title.trim()}
                                        className="flex-1 h-11 rounded-full bg-foreground text-background font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {createLoading ? 'Posting…' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Posts;
