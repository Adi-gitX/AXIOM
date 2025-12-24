import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUp,
    ArrowDown,
    MessageCircle,
    Bookmark,
    Share2,
    X,
    Clock,
    ExternalLink,
    Heart,
    MoreHorizontal,
    Send,
    ChevronUp,
    Link2,
    Award
} from 'lucide-react';

// Mock posts data
const POSTS = [
    {
        id: 1,
        title: "Building Scalable React Applications with Modern Patterns",
        excerpt: "Learn the best practices for building large-scale React applications using composition, hooks, and performance optimization techniques.",
        author: { name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", handle: "@alexchen", reputation: "12.5K" },
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
        tags: ["React", "Architecture", "Performance"],
        readTime: "5 min read",
        publishedAt: "Dec 24",
        upvotes: 284,
        comments: 42,
        saved: false
    },
    {
        id: 2,
        title: "The Future of CSS: What's Coming in 2025",
        excerpt: "Explore the upcoming CSS features that will change how we style web applications, including container queries and cascade layers.",
        author: { name: "Sarah Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", handle: "@sarahcss", reputation: "8.2K" },
        thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=300&fit=crop",
        tags: ["CSS", "Web Dev", "Frontend"],
        readTime: "4 min read",
        publishedAt: "Dec 23",
        upvotes: 156,
        comments: 28,
        saved: true
    },
    {
        id: 3,
        title: "System Design: Building a Real-time Notification System",
        excerpt: "A comprehensive guide to designing and implementing a scalable real-time notification system using WebSockets and Redis.",
        author: { name: "Mike Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", handle: "@mikej", reputation: "15.1K" },
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
        tags: ["System Design", "Backend", "Redis"],
        readTime: "8 min read",
        publishedAt: "Dec 22",
        upvotes: 421,
        comments: 67,
        saved: false
    },
    {
        id: 4,
        title: "TypeScript 5.4: New Features You Should Know",
        excerpt: "Discover the latest TypeScript features including improved type inference, new utility types, and better error messages.",
        author: { name: "Emma Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", handle: "@emmats", reputation: "9.8K" },
        thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop",
        tags: ["TypeScript", "JavaScript"],
        readTime: "6 min read",
        publishedAt: "Dec 21",
        upvotes: 198,
        comments: 35,
        saved: false
    },
    {
        id: 5,
        title: "Mastering Git Workflows for Team Collaboration",
        excerpt: "Learn effective Git strategies for teams including branching models, code review practices, and CI/CD integration.",
        author: { name: "David Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", handle: "@davidp", reputation: "11.3K" },
        thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop",
        tags: ["Git", "DevOps", "Collaboration"],
        readTime: "7 min read",
        publishedAt: "Dec 20",
        upvotes: 312,
        comments: 48,
        saved: true
    },
    {
        id: 6,
        title: "Building AI-Powered Features with OpenAI API",
        excerpt: "A practical guide to integrating OpenAI's GPT models into your applications for intelligent features.",
        author: { name: "Lisa Zhang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa", handle: "@lisaai", reputation: "7.6K" },
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
        tags: ["AI", "OpenAI", "API"],
        readTime: "10 min read",
        publishedAt: "Dec 19",
        upvotes: 567,
        comments: 89,
        saved: false
    }
];

const COMMENTS = [
    { id: 1, author: { name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", reputation: "5.2K" }, content: "Great article! Really helped me understand the concepts better.", time: "2h ago", upvotes: 24 },
    { id: 2, author: { name: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane", reputation: "3.8K" }, content: "Thanks for sharing. The examples were very practical.", time: "4h ago", upvotes: 18 },
    { id: 3, author: { name: "Bob Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", reputation: "12.1K" }, content: "I've been looking for something like this. Bookmarked for future reference!", time: "6h ago", upvotes: 31 },
];

// Post Card Component
const PostCard = ({ post, onSelect, onUpvote, onSave }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect(post)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-lg">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Author */}
                <div className="flex items-center gap-2 mb-3">
                    <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />
                    <span className="text-xs text-gray-500 font-medium">{post.author.name}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{post.publishedAt}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                </h3>

                {/* Read time */}
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); onUpvote(post.id); }}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            <ChevronUp size={16} />
                            <span className="text-xs font-medium">{post.upvotes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                            <MessageCircle size={14} />
                            <span className="text-xs font-medium">{post.comments}</span>
                        </button>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSave(post.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${post.saved ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Bookmark size={14} fill={post.saved ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Post Detail Modal
const PostModal = ({ post, onClose, comments }) => {
    const [newComment, setNewComment] = useState('');
    const [localUpvotes, setLocalUpvotes] = useState(post.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [localComments, setLocalComments] = useState(comments);

    const handleUpvote = () => {
        if (hasUpvoted) {
            setLocalUpvotes(prev => prev - 1);
        } else {
            setLocalUpvotes(prev => prev + 1);
        }
        setHasUpvoted(!hasUpvoted);
    };

    const handleComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            author: { name: "You", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You", reputation: "1.2K" },
            content: newComment,
            time: "Just now",
            upvotes: 0
        };
        setLocalComments([comment, ...localComments]);
        setNewComment('');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{post.author.name}</span>
                                <span className="text-xs text-gray-400">{post.author.handle}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="text-emerald-600 font-medium">⚡ {post.author.reputation}</span>
                                <span>•</span>
                                <span>{post.publishedAt}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="#"
                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            Read post <ExternalLink size={14} />
                        </a>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

                    {/* Thumbnail */}
                    <div className="rounded-xl overflow-hidden mb-6">
                        <img src={post.thumbnail} alt={post.title} className="w-full h-64 object-cover" />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-gray-100 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Excerpt */}
                    <p className="text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button className="px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-lg hover:bg-violet-200 transition-colors">
                            📝 TLDR
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
                            ✨ Simplify it
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
                            🎯 Key points
                        </button>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between py-4 border-y border-gray-100">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleUpvote}
                                className={`p-2 rounded-lg transition-colors ${hasUpvoted ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                            >
                                <ArrowUp size={20} />
                            </button>
                            <span className={`text-sm font-semibold ${hasUpvoted ? 'text-blue-600' : 'text-gray-600'}`}>{localUpvotes}</span>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <ArrowDown size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <MessageCircle size={16} /> Comment
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <Award size={16} /> Award
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <Bookmark size={16} /> Save
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <Link2 size={16} /> Copy
                            </button>
                        </div>
                    </div>

                    {/* Comment Input */}
                    <div className="flex items-center gap-3 py-4">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" className="w-9 h-9 rounded-full" />
                        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl p-1.5 border border-gray-200 focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                                placeholder="Share your thoughts..."
                                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 px-3 py-2 focus:outline-none"
                            />
                            <button
                                onClick={handleComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">{localComments.length} Comments</span>
                            <select className="text-sm text-gray-500 bg-transparent focus:outline-none cursor-pointer">
                                <option>Oldest first</option>
                                <option>Newest first</option>
                                <option>Top</option>
                            </select>
                        </div>

                        {localComments.map(comment => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3 p-4 bg-gray-50 rounded-xl"
                            >
                                <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm text-gray-900">{comment.author.name}</span>
                                        <span className="text-xs text-emerald-600 font-medium">⚡ {comment.author.reputation}</span>
                                        <span className="text-xs text-gray-400">{comment.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{comment.content}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                                            <ChevronUp size={14} /> {comment.upvotes}
                                        </button>
                                        <button className="text-xs text-gray-400 hover:text-gray-600">Reply</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Main Posts Page
const Posts = () => {
    const [posts, setPosts] = useState(POSTS);
    const [selectedPost, setSelectedPost] = useState(null);
    const [activeFilter, setActiveFilter] = useState('For You');

    const filters = ['For You', 'Following', 'Popular', 'Recent'];

    const handleUpvote = (postId) => {
        setPosts(posts.map(p =>
            p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p
        ));
    };

    const handleSave = (postId) => {
        setPosts(posts.map(p =>
            p.id === postId ? { ...p, saved: !p.saved } : p
        ));
    };

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-display">
                            Posts
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Discover articles from the community</p>
                    </div>
                    <button className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2">
                        + New Post
                    </button>
                </header>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === filter
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {posts.map((post, index) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onSelect={setSelectedPost}
                            onUpvote={handleUpvote}
                            onSave={handleSave}
                        />
                    ))}
                </div>
            </div>

            {/* Post Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <PostModal
                        post={selectedPost}
                        onClose={() => setSelectedPost(null)}
                        comments={COMMENTS}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Posts;
