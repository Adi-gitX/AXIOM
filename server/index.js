import express from 'express';
import cors from 'cors';
import dotenvx from '@dotenvx/dotenvx';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';

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
app.use(morgan('combined'));

app.use(cors({
    origin: ['http://localhost:5173', 'https://axiomdev.vercel.app', 'https://axiom-client.vercel.app'],
    credentials: true
}));
app.use(express.json());

// Main API Routes
app.use('/api', userRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('AXIOM API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

// Conditional Listen for Local Dev vs Vercel Export
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export app for Vercel
export default app;
