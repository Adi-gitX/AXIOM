import express from 'express';
import rateLimit from 'express-rate-limit';
import { isJudge0Enabled, judge0Languages, runOnJudge0 } from '../services/judge0.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

// Anyone can check availability; running code requires auth + a tight rate limit.
router.get('/status', (req, res) => {
    res.json({ enabled: isJudge0Enabled(), languages: judge0Languages() });
});

const runLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test' || process.env.DISABLE_AI_RATE_LIMIT === 'true',
    message: { error: 'Too many runs — slow down a moment.' },
});

router.post('/run', runLimiter, requireVerifiedUser, async (req, res) => {
    try {
        const { language, code, stdin } = req.body || {};
        if (!language || !code) return res.status(400).json({ error: 'language and code are required.' });
        const out = await runOnJudge0({ language, code: String(code).slice(0, 50000), stdin: String(stdin || '').slice(0, 10000) });
        res.json(out);
    } catch (err) {
        // 503 → client should fall back to the in-browser harness.
        res.status(err.status || 500).json({ error: err.message, fallback: err.status === 503 });
    }
});

export default router;
