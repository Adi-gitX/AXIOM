// Topics/Tags with real YouTube video IDs for each category
export const TOPICS = [
    { id: 'react', name: 'React', icon: '⚛️', color: 'from-cyan-500 to-blue-600' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢', color: 'from-green-500 to-emerald-600' },
    { id: 'python', name: 'Python', icon: '🐍', color: 'from-yellow-500 to-amber-600' },
    { id: 'javascript', name: 'JavaScript', icon: '💛', color: 'from-yellow-400 to-orange-500' },
    { id: 'typescript', name: 'TypeScript', icon: '💙', color: 'from-blue-500 to-indigo-600' },
    { id: 'nextjs', name: 'Next.js', icon: '▲', color: 'from-gray-700 to-gray-900' },
    { id: 'system-design', name: 'System Design', icon: '🏗️', color: 'from-violet-500 to-purple-600' },
    { id: 'dsa', name: 'DSA', icon: '🧮', color: 'from-rose-500 to-pink-600' },
    { id: 'aiml', name: 'AI/ML', icon: '🤖', color: 'from-purple-500 to-violet-600' },
    { id: 'neural-networks', name: 'Neural Networks', icon: '🧠', color: 'from-pink-500 to-rose-600' },
    { id: 'css', name: 'CSS', icon: '🎨', color: 'from-blue-400 to-cyan-500' },
    { id: 'devops', name: 'DevOps', icon: '🔧', color: 'from-orange-500 to-red-600' },
    { id: 'docker', name: 'Docker', icon: '🐳', color: 'from-blue-500 to-cyan-600' },
    { id: 'kubernetes', name: 'Kubernetes', icon: '☸️', color: 'from-blue-600 to-indigo-700' },
    { id: 'aws', name: 'AWS', icon: '☁️', color: 'from-orange-500 to-yellow-600' },
    { id: 'database', name: 'Database', icon: '🗄️', color: 'from-emerald-500 to-teal-600' },
    { id: 'golang', name: 'Go', icon: '🐹', color: 'from-cyan-500 to-teal-600' },
    { id: 'rust', name: 'Rust', icon: '🦀', color: 'from-orange-600 to-red-700' },
];

export const TRENDING_TAGS = ['react', 'python', 'system-design', 'aiml', 'typescript', 'nextjs', 'dsa', 'nodejs', 'neural-networks', 'docker'];
export const POPULAR_TAGS = ['javascript', 'css', 'nodejs', 'react', 'python', 'system-design', 'dsa', 'aws', 'golang', 'database'];
export const RECENT_TAGS = ['neural-networks', 'kubernetes', 'rust', 'aiml', 'devops', 'docker', 'typescript', 'nextjs'];

// Curated videos for each topic (using real YouTube video IDs)
export const VIDEOS_BY_TOPIC = {
    react: [
        { id: 'r1', title: "React Tutorial for Beginners", channel: "Programming with Mosh", channelAvatar: "https://yt3.googleusercontent.com/hKPOHBQLg7RqMBCl7R-9Gw8LqOl9t0r7tKj-OYlEVvQ-xrHI8JNEbXCf4lJO4YFTDSoOOFH2=s176", views: "7.8M views", duration: "1:04:27", youtubeId: "SqcY0GlETPk", thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/maxresdefault.jpg" },
        { id: 'r2', title: "React JS Full Course 2024", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "12M views", duration: "11:55:27", youtubeId: "bMknfKXIFA8", thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg" },
        { id: 'r3', title: "React Hooks Explained", channel: "Web Dev Simplified", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_k_mHkR9Oy8TRVcLOlDNPMRqwRYKO4CWTjj2f4rxmA=s176", views: "2.1M views", duration: "14:35", youtubeId: "O6P86uwfdR0", thumbnail: "https://i.ytimg.com/vi/O6P86uwfdR0/maxresdefault.jpg" },
        { id: 'r4', title: "Learn React in 30 Minutes", channel: "Traversy Media", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kuRqJOO3kLpqzf8jRJwjN7cTBMILZqJdz1_2kHfQ=s176", views: "1.5M views", duration: "32:15", youtubeId: "w7ejDZ8SWv8", thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/maxresdefault.jpg" },
    ],
    nodejs: [
        { id: 'n1', title: "Node.js Tutorial for Beginners", channel: "Programming with Mosh", channelAvatar: "https://yt3.googleusercontent.com/hKPOHBQLg7RqMBCl7R-9Gw8LqOl9t0r7tKj-OYlEVvQ-xrHI8JNEbXCf4lJO4YFTDSoOOFH2=s176", views: "5.2M views", duration: "58:51", youtubeId: "TlB_eWDSMt4", thumbnail: "https://i.ytimg.com/vi/TlB_eWDSMt4/maxresdefault.jpg" },
        { id: 'n2', title: "Node.js Full Course", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "8.1M views", duration: "8:16:48", youtubeId: "Oe421EPjeBE", thumbnail: "https://i.ytimg.com/vi/Oe421EPjeBE/maxresdefault.jpg" },
        { id: 'n3', title: "REST API with Node & Express", channel: "Traversy Media", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kuRqJOO3kLpqzf8jRJwjN7cTBMILZqJdz1_2kHfQ=s176", views: "2.8M views", duration: "1:12:36", youtubeId: "pKd0Rpw7O48", thumbnail: "https://i.ytimg.com/vi/pKd0Rpw7O48/maxresdefault.jpg" },
    ],
    python: [
        { id: 'p1', title: "Python Tutorial - Full Course", channel: "Programming with Mosh", channelAvatar: "https://yt3.googleusercontent.com/hKPOHBQLg7RqMBCl7R-9Gw8LqOl9t0r7tKj-OYlEVvQ-xrHI8JNEbXCf4lJO4YFTDSoOOFH2=s176", views: "35M views", duration: "6:14:07", youtubeId: "_uQrJ0TkZlc", thumbnail: "https://i.ytimg.com/vi/_uQrJ0TkZlc/maxresdefault.jpg" },
        { id: 'p2', title: "Python for Beginners", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "41M views", duration: "4:26:52", youtubeId: "rfscVS0vtbw", thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/maxresdefault.jpg" },
        { id: 'p3', title: "100 Days of Python", channel: "Dr. Angela Yu", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_mV9TlHGJF5eMSPpONONBfZtNGOGw6dJ_wYB-M=s176", views: "2.5M views", duration: "12:00:00", youtubeId: "BjzGJLmgCDI", thumbnail: "https://i.ytimg.com/vi/BjzGJLmgCDI/maxresdefault.jpg" },
    ],
    'system-design': [
        { id: 's1', title: "System Design Interview – Step By Step Guide", channel: "ByteByteGo", channelAvatar: "https://yt3.googleusercontent.com/U8d4TzLQGg_m9VzKFvhtLYjx5l-PvsQ4c7KKVwlyxjq7_HxL3zIqkF9xbm3OZHd8sFtj0YQ=s176", views: "1.2M views", duration: "24:42", youtubeId: "i7twT3x5yv8", thumbnail: "https://i.ytimg.com/vi/i7twT3x5yv8/maxresdefault.jpg" },
        { id: 's2', title: "System Design Fundamentals", channel: "NeetCode", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lGDC1R6UhSz3LW7N9HJQ2pFNvL3fFE5pYJzPJ4=s176", views: "890K views", duration: "1:21:49", youtubeId: "5TG0V5jXHp0", thumbnail: "https://i.ytimg.com/vi/5TG0V5jXHp0/maxresdefault.jpg" },
        { id: 's3', title: "System Design Full Course", channel: "Gaurav Sen", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_mVONQ_FRNVpBuKoAOMNJLHjdGBVhMAzVsLPZLU=s176", views: "2.1M views", duration: "4:32:15", youtubeId: "FSR1s2b-l_I", thumbnail: "https://i.ytimg.com/vi/FSR1s2b-l_I/maxresdefault.jpg" },
    ],
    aiml: [
        { id: 'a1', title: "Machine Learning Full Course", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "8.5M views", duration: "9:52:21", youtubeId: "NWONeJKn6kc", thumbnail: "https://i.ytimg.com/vi/NWONeJKn6kc/maxresdefault.jpg" },
        { id: 'a2', title: "AI For Everyone", channel: "DeepLearning.AI", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_mJpNTH_h4oJWLu1F4G8qwPpkxMXYr9qPCFtdNM=s176", views: "2.1M views", duration: "1:45:32", youtubeId: "m-QQ8pQsN9k", thumbnail: "https://i.ytimg.com/vi/m-QQ8pQsN9k/maxresdefault.jpg" },
        { id: 'a3', title: "Python Machine Learning Tutorial", channel: "Tech With Tim", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kDGvnRCn7OP4l0pR3m4t0J3RQoNQYkLZQ_yGE=s176", views: "1.8M views", duration: "3:24:15", youtubeId: "7eh4d6sabA0", thumbnail: "https://i.ytimg.com/vi/7eh4d6sabA0/maxresdefault.jpg" },
    ],
    'neural-networks': [
        { id: 'nn1', title: "Neural Networks Explained", channel: "3Blue1Brown", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_mT7Bm0qD2lgM5mDAoLHiG-DfI7tHJZHfdE3k4=s176", views: "15M views", duration: "19:13", youtubeId: "aircAruvnKk", thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg" },
        { id: 'nn2', title: "Deep Learning Crash Course", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "4.2M views", duration: "6:14:07", youtubeId: "VyWAvY2CF9c", thumbnail: "https://i.ytimg.com/vi/VyWAvY2CF9c/maxresdefault.jpg" },
        { id: 'nn3', title: "Build a Neural Network from Scratch", channel: "Sentdex", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_nw0pWS-fXKOFJU9tB6GQSPDk9E1f1H6WaC_D8=s176", views: "980K views", duration: "45:21", youtubeId: "Wo5dMEP_BbI", thumbnail: "https://i.ytimg.com/vi/Wo5dMEP_BbI/maxresdefault.jpg" },
    ],
    dsa: [
        { id: 'd1', title: "Data Structures Easy to Advanced", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "6.8M views", duration: "8:03:12", youtubeId: "RBSGKlAvoiM", thumbnail: "https://i.ytimg.com/vi/RBSGKlAvoiM/maxresdefault.jpg" },
        { id: 'd2', title: "LeetCode Top 150 Explained", channel: "NeetCode", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lGDC1R6UhSz3LW7N9HJQ2pFNvL3fFE5pYJzPJ4=s176", views: "1.5M views", duration: "5:21:48", youtubeId: "Q4L-rL4D1bI", thumbnail: "https://i.ytimg.com/vi/Q4L-rL4D1bI/maxresdefault.jpg" },
        { id: 'd3', title: "Algorithms Course - Graph Theory", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "2.3M views", duration: "3:52:41", youtubeId: "tWVWeAqZ0WU", thumbnail: "https://i.ytimg.com/vi/tWVWeAqZ0WU/maxresdefault.jpg" },
    ],
    typescript: [
        { id: 't1', title: "TypeScript Full Course", channel: "Programming with Mosh", channelAvatar: "https://yt3.googleusercontent.com/hKPOHBQLg7RqMBCl7R-9Gw8LqOl9t0r7tKj-OYlEVvQ-xrHI8JNEbXCf4lJO4YFTDSoOOFH2=s176", views: "3.2M views", duration: "1:04:28", youtubeId: "d56mG7DezGs", thumbnail: "https://i.ytimg.com/vi/d56mG7DezGs/maxresdefault.jpg" },
        { id: 't2', title: "TypeScript for React Developers", channel: "Jack Herrington", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kJDGE6zzshHPCMQPWQBLqvHvHJ1U4qQzPNVQ=s176", views: "620K views", duration: "42:15", youtubeId: "TPACABQTHvM", thumbnail: "https://i.ytimg.com/vi/TPACABQTHvM/maxresdefault.jpg" },
    ],
    nextjs: [
        { id: 'nx1', title: "Next.js 14 Tutorial", channel: "Traversy Media", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kuRqJOO3kLpqzf8jRJwjN7cTBMILZqJdz1_2kHfQ=s176", views: "890K views", duration: "2:15:42", youtubeId: "wm5gMKuwSYk", thumbnail: "https://i.ytimg.com/vi/wm5gMKuwSYk/maxresdefault.jpg" },
        { id: 'nx2', title: "Next.js Full Course 2024", channel: "JavaScript Mastery", channelAvatar: "https://yt3.googleusercontent.com/wg1TITEoPfxvBGfzuqWyt3bqm_qu35ZhMswUv3feetU3xNX_6wsAXZF40OlPIgY4TmqcGO3a=s176", views: "1.5M views", duration: "5:42:18", youtubeId: "pUNSHPyVryU", thumbnail: "https://i.ytimg.com/vi/pUNSHPyVryU/maxresdefault.jpg" },
    ],
    javascript: [
        { id: 'js1', title: "JavaScript Tutorial Full Course", channel: "Programming with Mosh", channelAvatar: "https://yt3.googleusercontent.com/hKPOHBQLg7RqMBCl7R-9Gw8LqOl9t0r7tKj-OYlEVvQ-xrHI8JNEbXCf4lJO4YFTDSoOOFH2=s176", views: "18M views", duration: "48:17", youtubeId: "W6NZfCO5SIk", thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg" },
        { id: 'js2', title: "Learn JavaScript - Full Course", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "14M views", duration: "3:26:43", youtubeId: "PkZNo7MFNFg", thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg" },
    ],
    css: [
        { id: 'c1', title: "CSS Tutorial - Zero to Hero", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "5.1M views", duration: "6:18:37", youtubeId: "1Rs2ND1ryYc", thumbnail: "https://i.ytimg.com/vi/1Rs2ND1ryYc/maxresdefault.jpg" },
        { id: 'c2', title: "CSS Flexbox in 20 Minutes", channel: "Traversy Media", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kuRqJOO3kLpqzf8jRJwjN7cTBMILZqJdz1_2kHfQ=s176", views: "2.8M views", duration: "19:35", youtubeId: "JJSoEo8JSnc", thumbnail: "https://i.ytimg.com/vi/JJSoEo8JSnc/maxresdefault.jpg" },
    ],
    devops: [
        { id: 'do1', title: "DevOps Engineering Course", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "1.8M views", duration: "2:48:21", youtubeId: "j5Zsa_eOXeY", thumbnail: "https://i.ytimg.com/vi/j5Zsa_eOXeY/maxresdefault.jpg" },
    ],
    docker: [
        { id: 'dk1', title: "Docker Tutorial for Beginners", channel: "TechWorld with Nana", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_mN_SLq0KLVPL5V6pK4oHlHr_KO4YpQw4lOCh8=s176", views: "4.2M views", duration: "2:45:32", youtubeId: "3c-iBn73dDE", thumbnail: "https://i.ytimg.com/vi/3c-iBn73dDE/maxresdefault.jpg" },
    ],
    kubernetes: [
        { id: 'k1', title: "Kubernetes Tutorial for Beginners", channel: "TechWorld with Nana", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_mN_SLq0KLVPL5V6pK4oHlHr_KO4YpQw4lOCh8=s176", views: "3.8M views", duration: "3:36:52", youtubeId: "X48VuDVv0do", thumbnail: "https://i.ytimg.com/vi/X48VuDVv0do/maxresdefault.jpg" },
    ],
    aws: [
        { id: 'aw1', title: "AWS Certified Cloud Practitioner", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "6.2M views", duration: "13:15:42", youtubeId: "SOTamWNgDKc", thumbnail: "https://i.ytimg.com/vi/SOTamWNgDKc/maxresdefault.jpg" },
    ],
    database: [
        { id: 'db1', title: "SQL Tutorial - Full Database Course", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "11M views", duration: "4:20:38", youtubeId: "HXV3zeQKqGY", thumbnail: "https://i.ytimg.com/vi/HXV3zeQKqGY/maxresdefault.jpg" },
    ],
    golang: [
        { id: 'g1', title: "Learn Go Programming", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "3.5M views", duration: "6:39:52", youtubeId: "YS4e4q9oBaU", thumbnail: "https://i.ytimg.com/vi/YS4e4q9oBaU/maxresdefault.jpg" },
    ],
    rust: [
        { id: 'rs1', title: "Rust Programming Course", channel: "freeCodeCamp", channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_njnXRlB_RWC4IWC8cGPhNBt8x3V0bO1v5Q1IKM=s176", views: "1.2M views", duration: "14:02:21", youtubeId: "MsocPEZBd-M", thumbnail: "https://i.ytimg.com/vi/MsocPEZBd-M/maxresdefault.jpg" },
    ],
};

// Legacy exports for compatibility
export const CATEGORIES = ["All", ...TOPICS.map(t => t.name)];
export const VIDEOS = Object.values(VIDEOS_BY_TOPIC).flat().slice(0, 6);
