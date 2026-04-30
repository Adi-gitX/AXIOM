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
 * POST /api/ai/polish-story
 * Improve grammar / clarity of an interview-experience submission without
 * altering meaning. Used inside the Submit-Experience modal.
 */
router.post('/polish-story', async (req, res, next) => {
    try {
        const { quote, company, role } = req.body || {};
        if (!quote || quote.trim().length < 20) {
            return res.status(400).json({ error: 'Quote must be at least 20 characters.' });
        }
        const system = [
            'You are an experienced career coach helping software engineers communicate clearly.',
            'Polish the user\'s interview-experience reflection: fix grammar, tighten phrasing, keep their voice.',
            'CRITICAL RULES:',
            '- Do NOT add new claims or invent details.',
            '- Do NOT change the verdict (e.g. selected, rejected, ghosted).',
            '- Keep length within ±20% of the original.',
            '- Preserve technical specifics (e.g. "DP", "BFS", "system design").',
            '- Output ONLY the polished text, no preamble, no quotes, no markdown.',
        ].join('\n');
        const user = `Company: ${company || '(unspecified)'}\nRole: ${role || '(unspecified)'}\n\nOriginal reflection:\n"""\n${truncate(quote)}\n"""`;
        const polished = await callLLM({ system, user });
        res.json({ polished });
    } catch (err) { next(err); }
});

/**
 * POST /api/ai/problem-hint
 * Generate a beginner-friendly hint that nudges without revealing the solution.
 * Used on the DSA problem flow (future expansion).
 */
router.post('/problem-hint', async (req, res, next) => {
    try {
        const { title, difficulty } = req.body || {};
        if (!title) return res.status(400).json({ error: 'Title required.' });
        const system = [
            'You are a senior engineer giving Socratic DSA hints to a student.',
            'Give exactly 2 short hints (≤25 words each). The first nudges the data structure or pattern. The second nudges the optimization.',
            'NEVER reveal the full algorithm or write code. Use bullet format starting with "•".',
            'Output only the 2 bullet hints, nothing else.',
        ].join('\n');
        const user = `Problem: ${truncate(title)}\nDifficulty: ${difficulty || 'Unknown'}`;
        const hint = await callLLM({ system, user, max_tokens: 150 });
        res.json({ hint });
    } catch (err) { next(err); }
});

/**
 * POST /api/ai/bio-rewrite
 * Rewrite a developer bio to be sharper and outcomes-driven (Profile page hook).
 */
router.post('/bio-rewrite', async (req, res, next) => {
    try {
        const { bio, role } = req.body || {};
        if (!bio || bio.trim().length < 10) {
            return res.status(400).json({ error: 'Bio must be at least 10 characters.' });
        }
        const system = [
            'You are a developer-portfolio editor.',
            'Rewrite the bio to be 2-3 punchy sentences with specific signals (technologies, outcomes, scale).',
            'Keep first-person voice. No emojis. No buzzwords like "passionate" or "rockstar".',
            'Output ONLY the rewritten bio, no preamble.',
        ].join('\n');
        const user = `Role: ${role || 'Software Engineer'}\n\nOriginal bio:\n"""\n${truncate(bio)}\n"""`;
        const rewritten = await callLLM({ system, user, max_tokens: 250 });
        res.json({ rewritten });
    } catch (err) { next(err); }
});

export default router;
