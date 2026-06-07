import express from 'express';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const EMERGENT_GATEWAY = 'https://integrations.emergentagent.com/llm/openai/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini'; // fast + cheap, good enough for polish/hint use cases

// Strict character cap so a single invocation can't blow the LLM budget.
const MAX_INPUT_CHARS = 4000;
const MAX_OUTPUT_TOKENS = 400;

/**
 * Rate limit AI endpoints — controls cost. Generous enough for normal
 * organic use, tight enough to neutralize abuse.
 *
 * Per-IP: 30 calls per 10 minutes (≈3/min sustained).
 * Disabled in test/dev to keep e2e tests fast.
 */
const aiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () =>
        process.env.NODE_ENV === 'test' ||
        process.env.DISABLE_AI_RATE_LIMIT === 'true',
    message: {
        error: 'Too many AI requests right now. Please try again in a few minutes.',
    },
});
router.use(aiLimiter);

const callLLM = async ({ system, user, model = DEFAULT_MODEL, max_tokens = MAX_OUTPUT_TOKENS }) => {
    const apiKey = process.env.EMERGENT_LLM_KEY;
    if (!apiKey) {
        const err = new Error('EMERGENT_LLM_KEY missing — add to backend .env');
        err.status = 500;
        throw err;
    }
    const r = await fetch(EMERGENT_GATEWAY, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
            ],
            max_tokens,
            temperature: 0.65,
        }),
    });
    if (!r.ok) {
        const body = await r.text();
        const err = new Error(`LLM gateway error ${r.status}: ${body.slice(0, 200)}`);
        err.status = 502;
        throw err;
    }
    const data = await r.json();
    return data?.choices?.[0]?.message?.content?.trim() || '';
};

const truncate = (s) => String(s ?? '').slice(0, MAX_INPUT_CHARS);

/**


// TODO: Complete implementation in subsequent commits (Stage 1/3)
