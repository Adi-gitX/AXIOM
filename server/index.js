import express from 'express';
import cors from 'cors';
import dotenvx from '@dotenvx/dotenvx';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';

// Route imports
import userRoutes from './routes/userRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

// Middleware imports
import { sanitizeBody } from './middleware/validation.js';

dotenvx.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());

// Rate Limiting (100 requests per 15 mins)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Performance & Logging
app.use(compression());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://axiomdev.vercel.app',
        'https://axiom-client.vercel.app'
    ],
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(sanitizeBody);

// ========================================
// API Routes
// ========================================

// User profile routes
app.use('/api', userRoutes);

// Progress & Dashboard routes
app.use('/api/progress', progressRoutes);

// Jobs routes
app.use('/api/jobs', jobsRoutes);

// Education routes
app.use('/api/education', educationRoutes);

// Chat routes
app.use('/api/chat', chatRoutes);

// Posts routes
app.use('/api/posts', postsRoutes);

// Settings routes
app.use('/api/settings', settingsRoutes);

// ========================================
// Health & Root Endpoints
// ========================================

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'AXIOM API is running',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            progress: '/api/progress',
            jobs: '/api/jobs',
            education: '/api/education',
            chat: '/api/chat',
            posts: '/api/posts'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ========================================
// Error Handling
// ========================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message
    });
});

// ========================================
// Server Start
// ========================================

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n🚀 AXIOM Server running on http://localhost:${PORT}`);
        console.log(`📍 API endpoints available at /api/*\n`);
    });
}

// Export app for Vercel
export default app;
