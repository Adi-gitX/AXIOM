import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POSTS = [
    { id: 1, source: 'Y Combinator', title: 'coder/ghostty-web: Ghostty for the web with xterm.js API', tags: ['typescript'], date: 'Dec 02', readTime: '2m', stars: 209, upvotes: 59, comments: 1 },
    { id: 2, source: 'Dev.to', title: 'Building Scalable React Applications with Modern Patterns', tags: ['react', 'architecture'], date: 'Dec 24', readTime: '5m', stars: 218000, upvotes: 284, comments: 42 },
    { id: 3, source: 'Hacker News', title: 'The Future of CSS: Container Queries and Beyond', tags: ['css', 'frontend'], date: 'Dec 23', readTime: '4m', stars: 4200, upvotes: 156, comments: 28 },
    { id: 4, source: 'Medium', title: 'System Design: Building Real-time Notification Systems', tags: ['system-design'], date: 'Dec 22', readTime: '8m', stars: 245000, upvotes: 421, comments: 67 },
    { id: 5, source: 'Reddit', title: 'TypeScript 5.4: Everything New You Need to Know', tags: ['typescript'], date: 'Dec 21', readTime: '6m', stars: 97000, upvotes: 198, comments: 35 },
];

const formatNum = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K' : n;

const Posts = () => {
    const [selected, setSelected] = useState(null);

    return (
        <div className="min-h-screen bg-white p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light text-gray-900">Posts</h1>
                    <p className="text-gray-400 mt-2">Developer articles and projects</p>
                </motion.header>

                {/* Posts */}
                <div className="space-y-3">
                    {POSTS.map((post, i) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => setSelected(post)}
                            className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                            <span className="text-xs text-gray-400">{post.source}</span>
                            <h3 className="font-medium text-gray-900 mt-1 group-hover:text-gray-600 transition-colors">
                                {post.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-3">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                                ))}
                                <span className="text-xs text-gray-300">·</span>
                                <span className="text-xs text-gray-400">{post.date}</span>
                                <span className="text-xs text-gray-300">·</span>
                                <span className="text-xs text-gray-400">{post.readTime}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                <span>↑ {post.upvotes}</span>
                                <span>💬 {post.comments}</span>
                                <span>★ {formatNum(post.stars)}</span>
                            </div>
                        </motion.article>
                    ))}
                </div>

            </div>

            {/* Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white overflow-y-auto"
                        onClick={() => setSelected(null)}
                    >
                        <button
                            onClick={() => setSelected(null)}
                            className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="max-w-2xl mx-auto px-8 py-16" onClick={(e) => e.stopPropagation()}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-sm text-gray-400">{selected.source}</span>
                                <h1 className="text-3xl font-light text-gray-900 mt-2">{selected.title}</h1>

                                <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
                                    <span>{selected.date}</span>
                                    <span>·</span>
                                    <span>{selected.readTime} read</span>
                                </div>

                                <div className="flex gap-2 mt-6">
                                    {selected.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#{tag}</span>
                                    ))}
                                </div>

                                <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                                    <p className="text-gray-600">★ {formatNum(selected.stars)} stars on GitHub</p>
                                </div>

                                <div className="flex items-center gap-6 mt-12 text-gray-500">
                                    <span>↑ {selected.upvotes} upvotes</span>
                                    <span>💬 {selected.comments} comments</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Posts;
