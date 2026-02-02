-- AXIOM Database Schema v1.0
-- Complete schema for all application features

-- ============================================
-- USERS TABLE (Enhance existing)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(255),
    location VARCHAR(255),
    bio TEXT,
    avatar TEXT,
    banner TEXT,
    experience JSONB DEFAULT '[]',
    skills JSONB DEFAULT '[]',
    socials JSONB DEFAULT '[]',
    resume_url TEXT,
    resume_name TEXT,
    is_pro BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER PROGRESS (DSA Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    total_problems_solved INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_study_minutes INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email)
);

-- ============================================
-- SOLVED PROBLEMS
-- ============================================
CREATE TABLE IF NOT EXISTS solved_problems (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    problem_id VARCHAR(50) NOT NULL,
    topic_id INTEGER,
    solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(user_email, problem_id)
);

CREATE INDEX idx_solved_problems_user ON solved_problems(user_email);
CREATE INDEX idx_solved_problems_topic ON solved_problems(topic_id);

-- ============================================
-- USER ACTIVITY (Heatmap data)
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    study_minutes INTEGER DEFAULT 0,
    videos_watched INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, activity_date)
);

CREATE INDEX idx_user_activity_date ON user_activity(user_email, activity_date);

-- ============================================
-- JOBS
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    job_type VARCHAR(50), -- Full-time, Part-time, Contract, Internship
    salary VARCHAR(100),
    description TEXT,
    requirements JSONB DEFAULT '[]',
    apply_url TEXT,
    company_logo TEXT,
    is_remote BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_remote ON jobs(is_remote);
CREATE INDEX idx_jobs_active ON jobs(is_active);

-- ============================================
-- SAVED JOBS (User Bookmarks)
-- ============================================
CREATE TABLE IF NOT EXISTS saved_jobs (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, job_id)
);

CREATE INDEX idx_saved_jobs_user ON saved_jobs(user_email);

-- ============================================
-- APPLIED JOBS
-- ============================================
CREATE TABLE IF NOT EXISTS applied_jobs (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied', -- applied, interviewing, rejected, offered, accepted
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(user_email, job_id)
);

CREATE INDEX idx_applied_jobs_user ON applied_jobs(user_email);
CREATE INDEX idx_applied_jobs_status ON applied_jobs(status);

-- ============================================
-- EDUCATION PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS education_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    video_id VARCHAR(50) NOT NULL,
    topic_id VARCHAR(50) NOT NULL,
    watch_percentage INTEGER DEFAULT 0, -- 0-100
    is_completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, video_id)
);

CREATE INDEX idx_education_progress_user ON education_progress(user_email);
CREATE INDEX idx_education_progress_topic ON education_progress(topic_id);

-- ============================================
-- CHAT CHANNELS
-- ============================================
CREATE TABLE IF NOT EXISTS chat_channels (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default channels
INSERT INTO chat_channels (channel_id, name, description, is_default) VALUES
    ('general', 'General', 'General discussion', TRUE),
    ('react', 'React', 'React, hooks, components', TRUE),
    ('jobs', 'Jobs', 'Opportunities & careers', TRUE),
    ('help', 'Help', 'Get help with code', TRUE)
ON CONFLICT (channel_id) DO NOTHING;

-- ============================================
-- CHAT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(50) NOT NULL REFERENCES chat_channels(channel_id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    user_avatar TEXT,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_channel ON chat_messages(channel_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- ============================================
-- POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(100) NOT NULL, -- Y Combinator, Dev.to, etc.
    source_icon VARCHAR(10),
    source_color VARCHAR(20),
    title TEXT NOT NULL,
    description TEXT,
    author_name VARCHAR(255),
    author_avatar TEXT,
    published_at VARCHAR(50),
    external_url TEXT,
    github_stats JSONB, -- {contributors, issues, stars, forks}
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_source ON posts(source_name);
CREATE INDEX idx_posts_active ON posts(is_active);

-- ============================================
-- POST INTERACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS post_interactions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    vote_type VARCHAR(10), -- 'up', 'down', null
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, post_id)
);

CREATE INDEX idx_post_interactions_user ON post_interactions(user_email);
CREATE INDEX idx_post_interactions_post ON post_interactions(post_id);

-- ============================================
-- POST COMMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS post_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    user_name VARCHAR(255),
    user_avatar TEXT,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_comments_post ON post_comments(post_id);

-- ============================================
-- USER SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'system', -- 'light', 'dark', 'system'
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT TRUE,
    product_updates BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_settings_email ON user_settings(email);

-- ============================================
-- DB MIGRATIONS TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Record this migration
INSERT INTO migrations (name) VALUES ('001_initial_schema')
ON CONFLICT (name) DO NOTHING;
