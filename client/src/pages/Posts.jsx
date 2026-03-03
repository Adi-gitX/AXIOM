import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { postsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    return num?.toString() || '0';
};

const safeParseJson = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return value;
    if (typeof value !== 'string') return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

// Post Card
const PostCard = ({ post, index, onClick, onVote, onSave, userEmail }) => {
    const [upvotes, setUpvotes] = useState(post.upvotes || 0);
    const [hasUpvoted, setHasUpvoted] = useState(post.user_vote === 1);
    const [hasDownvoted, setHasDownvoted] = useState(post.user_vote === -1);
    const [isSaved, setIsSaved] = useState(post.is_saved || false);

    const handleUpvote = async (e) => {
        e.stopPropagation();
        const newVote = hasUpvoted ? 0 : 1;

        // Optimistic update
        if (hasUpvoted) {
            setUpvotes(prev => prev - 1);
            setHasUpvoted(false);
        } else {
            setUpvotes(prev => prev + (hasDownvoted ? 2 : 1));
            setHasUpvoted(true);
            setHasDownvoted(false);
        }

        if (onVote) await onVote(post.id, newVote);
    };

    const handleDownvote = async (e) => {
        e.stopPropagation();
        const newVote = hasDownvoted ? 0 : -1;

        if (hasDownvoted) {
            setUpvotes(prev => prev + 1);
            setHasDownvoted(false);
        } else {
            setUpvotes(prev => prev - (hasUpvoted ? 2 : 1));
            setHasDownvoted(true);
            setHasUpvoted(false);
        }

        if (onVote) await onVote(post.id, newVote);
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        if (onSave) await onSave(post.id, !isSaved);
    };

    // Parse tags
    const tags = Array.isArray(post.tags) ? post.tags : safeParseJson(post.tags, []);

    // Parse preview
    const preview = safeParseJson(post.preview, {});

    // Parse source
    const source = safeParseJson(post.source, { name: 'AXIOM', icon: 'A', color: '#6366f1' });

    // Parse author
    const author = safeParseJson(post.author, { name: 'Anonymous' });

    return (
        <GlassCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            hoverEffect={true}
            className="p-0 border-transparent hover:border-border/50 flex flex-col h-full group"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col">
                    <div className="p-6 pb-0">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg ring-1 ring-border/10" style={{ backgroundColor: source.color }}>
                            {source.icon}
                        </div>
                        <h2 className="text-xl font-bold text-foreground leading-tight mb-3 group-hover:text-glow transition-all">{post.title}</h2>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-muted/50 border border-border/50 text-sm text-muted-foreground rounded-lg">#{tag}</span>
                            ))}
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {post.read_time || '3m read'}
                        </p>
                    </div>

                    {preview.repo && (
                        <div className="mx-6 mb-4 p-4 bg-muted/30 rounded-2xl border border-border/50 mt-auto">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-foreground/80 mb-1">
                                        {preview.repo.split('/')[0]}/<span className="font-bold text-foreground">{preview.repo.split('/')[1]}</span>
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate">{preview.description}</p>
                                </div>
                                {preview.icon && <img src={preview.icon} alt="" className="w-12 h-12 rounded-lg ml-3 bg-muted" />}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border/50">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" /></svg>
                                    <span className="font-medium">{formatNumber(preview.stars)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0z" /></svg>
                                    <span className="font-medium">{formatNumber(preview.forks)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mx-6 mb-4 h-px bg-border/50 mt-auto" />

                <div className="px-6 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-muted/50 rounded-xl border border-border/50 p-1">
                            <button onClick={handleUpvote} className={`h-8 flex items-center gap-2 px-3 rounded-lg transition-all ${hasUpvoted ? 'bg-foreground text-background shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span className="text-sm font-semibold">{upvotes}</span>
                            </button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <button onClick={handleDownvote} className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${hasDownvoted ? 'text-red-400 bg-background/50' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                        <button className="h-10 px-3 flex items-center gap-2 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span className="font-medium text-sm">{post.comments_count || 0}</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isSaved ? 'text-background bg-foreground shadow-lg' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

// Main Page
const Posts = () => {
    const { currentUser } = useAuth();
    const [activeFilter, setActiveFilter] = useState('For You');
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
    const [createLoading, setCreateLoading] = useState(false);
    const [error, setError] = useState('');
    const [retryNonce, setRetryNonce] = useState(0);
    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );

    const filters = ['For You', 'Following', 'Popular', 'Recent'];

    // Fetch posts from API
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            let sort = 'recent';
            if (activeFilter === 'Popular') sort = 'popular';
            else if (activeFilter === 'For You') sort = 'trending';

            const data = await postsApi.getAll({
                sort,
                email: currentUser?.email
            });
            // Handle both array response and object with posts property
            setPosts(Array.isArray(data) ? data : (data.posts || []));
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to fetch posts:', err);
            }
            setPosts([]);
            setError('Unable to refresh posts right now.');
        } finally {
            setLoading(false);
        }
    }, [activeFilter, currentUser?.email]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, retryNonce]);

    // Handle vote
    const handleVote = async (postId, vote) => {
        if (!currentUser?.email) return;
        try {
            const voteType = vote === 1 ? 'up' : vote === -1 ? 'down' : 'none';
            await postsApi.vote(postId, currentUser.email, voteType);
        } catch (err) {
            console.error('Failed to vote:', err);
        }
    };

    // Handle save
    const handleSave = async (postId, save) => {
        if (!currentUser?.email) return;
        try {
            await postsApi.toggleSave(postId, currentUser.email);
        } catch (err) {
            console.error('Failed to save:', err);
        }
    };

    // Handle create post
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!currentUser?.email) {
            alert('You need to log in to create a post.');
            return;
        }
        if (!newPost.title.trim()) return;

        setCreateLoading(true);
        try {
            const tagsArray = newPost.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            const postData = {
                email: currentUser.email,
                title: newPost.title.trim(),
                content: newPost.content.trim(),
                tags: tagsArray,
                userName: currentUser.displayName || currentUser.email.split('@')[0],
                userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`
            };

            const created = await postsApi.create(postData);
            setPosts(prev => [created, ...prev]);
            setNewPost({ title: '', content: '', tags: '' });
            setShowCreateModal(false);
        } catch (err) {
            console.error('Failed to create post:', err);
            alert(err.message || 'Failed to create post. Please try again.');
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-5xl font-light text-foreground text-glow font-display tracking-tight mb-2">Posts</h1>
                        <p className="text-muted-foreground text-lg font-light">Discover developer articles and projects</p>
                        {error && (
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <p className="text-sm text-rose-400">{error}</p>
                                <button
                                    type="button"
                                    onClick={() => setRetryNonce((prev) => prev + 1)}
                                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-foreground/40"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                        New Post
                    </Button>
                </header>

                <div className="flex items-center gap-2 border-b border-border pb-4">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === filter ? 'bg-foreground text-background shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">Share your ideas, projects, or discoveries with the community.</p>
                        <button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-all">Write the first post</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, index) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                index={index}
                                onClick={() => setSelectedPost(post)}
                                onVote={handleVote}
                                onSave={handleSave}
                                userEmail={currentUser?.email}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-foreground">Create Post</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 rounded-xl hover:bg-muted transition-colors"
                                >
                                    <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreatePost} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={newPost.title}
                                        onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="What's on your mind?"
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                                        required
                                        maxLength={300}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Content</label>
                                    <textarea
                                        value={newPost.content}
                                        onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Share your thoughts, code snippets, or ideas..."
                                        rows={5}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground resize-none"
                                        maxLength={10000}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={newPost.tags}
                                        onChange={e => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                                        placeholder="react, javascript, tutorial"
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading || !newPost.title.trim()}
                                        className="flex-1 px-4 py-3 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {createLoading ? 'Posting...' : 'Post'}
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
