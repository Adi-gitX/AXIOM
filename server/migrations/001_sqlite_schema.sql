-- AXIOM SQLite Schema
-- Compatible with better-sqlite3

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT,
    location TEXT,
    bio TEXT,
    avatar TEXT,
    banner TEXT,
    experience TEXT DEFAULT '[]',
    skills TEXT DEFAULT '[]',
    socials TEXT DEFAULT '[]',
    resume_url TEXT,
    resume_name TEXT,
    is_pro INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    job_type TEXT,
    salary TEXT,
    description TEXT,
    requirements TEXT DEFAULT '[]',
    apply_url TEXT,
    company_logo TEXT,
    is_remote INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    posted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Saved Jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    job_id INTEGER NOT NULL,
    saved_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, job_id)
);

-- Chat Channels
CREATE TABLE IF NOT EXISTS chat_channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_default INTEGER DEFAULT 0,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_name TEXT NOT NULL,
    source_icon TEXT,
    source_color TEXT,
    title TEXT NOT NULL,
    description TEXT,
    author_name TEXT,
    author_avatar TEXT,
    published_at TEXT,
    external_url TEXT,
    github_stats TEXT,
    tags TEXT DEFAULT '[]',
    read_time TEXT,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Post Interactions
CREATE TABLE IF NOT EXISTS post_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    post_id INTEGER NOT NULL,
    vote_type TEXT,
    is_saved INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, post_id)
);

-- Post Comments
CREATE TABLE IF NOT EXISTS post_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    theme TEXT DEFAULT 'system',
    email_notifications INTEGER DEFAULT 1,
    push_notifications INTEGER DEFAULT 1,
    weekly_digest INTEGER DEFAULT 1,
    product_updates INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User Activity
CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    activity_date TEXT NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    study_minutes INTEGER DEFAULT 0,
    videos_watched INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, activity_date)
);

-- Education Progress
CREATE TABLE IF NOT EXISTS education_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    video_id TEXT NOT NULL,
    topic_id TEXT,
    progress INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    last_watched TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, video_id)
);

-- Solved Problems
CREATE TABLE IF NOT EXISTS solved_problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    problem_id TEXT NOT NULL,
    topic_id INTEGER,
    solved_at TEXT DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(user_email, problem_id)
);

-- User Progress
CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT UNIQUE NOT NULL,
    total_problems_solved INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_study_minutes INTEGER DEFAULT 0,
    last_activity_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Applied Jobs
CREATE TABLE IF NOT EXISTS applied_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    job_id INTEGER NOT NULL,
    status TEXT DEFAULT 'applied',
    notes TEXT,
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, job_id)
);

-- Interview Resources
CREATE TABLE IF NOT EXISTS interview_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT DEFAULT 'Beginner',
    content_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User Interview Progress
CREATE TABLE IF NOT EXISTS user_interview_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    resource_id INTEGER NOT NULL,
    completed INTEGER DEFAULT 1,
    notes TEXT,
    completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, resource_id)
);
