import express from 'express';
import { DSA_SHEETS } from '../data/dsaCatalog.generated.js';
import { DSA_COMPANY_TAGS } from '../data/dsaCompanyTags.js';

const router = express.Router();

/**
 * Build a lookup of all problems by id with sheet/topic context, so we can
 * surface company-grouped problem lists alongside metadata frontend can render.
 */
const buildProblemIndex = () => {
    const index = new Map();
    for (const sheet of DSA_SHEETS) {
        for (const topic of sheet.topics) {
            for (const p of topic.problems) {
                index.set(p.id, {
                    id: p.id,
                    title: p.title,
                    difficulty: p.difficulty || 'Unknown',
                    external_url: p.external_url || '',
                    solution_url: p.solution_url || '',
                    source_platform: p.source_platform || 'other',
                    sheetId: sheet.id,
                    sheetName: sheet.name,
                    topicId: topic.id,
                    topicName: topic.name,
                });
            }
        }
    }
    return index;
};

const PROBLEM_INDEX = buildProblemIndex();

/**
 * Aggregate company → problem list (deduped). Sorted by problem count desc.
 * Companies referenced in dsaCompanyTags.js are the curated, "featured" set.
 */
const buildCompanyAggregate = () => {
    const map = new Map();
    for (const [problemId, companies] of Object.entries(DSA_COMPANY_TAGS)) {
        if (!Array.isArray(companies)) continue;
        const meta = PROBLEM_INDEX.get(problemId);
        if (!meta) continue;
        for (const company of companies) {
            if (!map.has(company)) {
                map.set(company, { name: company, problems: [], counts: { Easy: 0, Medium: 0, Hard: 0, Unknown: 0 } });
            }
            const entry = map.get(company);
            entry.problems.push(meta);
            const diff = meta.difficulty || 'Unknown';
            if (diff in entry.counts) entry.counts[diff] += 1; else entry.counts.Unknown += 1;
        }
    }
    return [...map.values()].sort((a, b) => b.problems.length - a.problems.length);
};

const COMPANIES_AGGREGATE = buildCompanyAggregate();

// Static employer metadata (logo init/color/segment) for the cards.
// Falls back to gracefully-derived defaults for any company not in this map.
const COMPANY_META = {
    Amazon: { segment: 'Product Based', tone: 'peach' },
    Google: { segment: 'Product Based', tone: 'mist' },
    Microsoft: { segment: 'Product Based', tone: 'mist' },
    Meta: { segment: 'Product Based', tone: 'mist' },
    Apple: { segment: 'Product Based', tone: 'sand' },
    Netflix: { segment: 'Product Based', tone: 'rose' },
    Uber: { segment: 'Product Based', tone: 'sand' },
    Adobe: { segment: 'Product Based', tone: 'rose' },
    Bloomberg: { segment: 'Product Based', tone: 'mist' },
    'Goldman Sachs': { segment: 'Service Based', tone: 'sage' },
    PayPal: { segment: 'Product Based', tone: 'mist' },
    LinkedIn: { segment: 'Product Based', tone: 'mist' },
    Atlassian: { segment: 'Product Based', tone: 'mist' },
    Salesforce: { segment: 'Product Based', tone: 'mist' },
    Walmart: { segment: 'Product Based', tone: 'sage' },
    Flipkart: { segment: 'Product Based', tone: 'peach' },
    Swiggy: { segment: 'Product Based', tone: 'peach' },
    Razorpay: { segment: 'Product Based', tone: 'mist' },
    Zoho: { segment: 'Product Based', tone: 'rose' },
    Infosys: { segment: 'Service Based', tone: 'sage' },
    TCS: { segment: 'Service Based', tone: 'sage' },
    Wipro: { segment: 'Service Based', tone: 'sage' },
    Intuit: { segment: 'Product Based', tone: 'sage' },
    Expedia: { segment: 'Product Based', tone: 'mist' },
    Nvidia: { segment: 'Product Based', tone: 'sage' },
    Oracle: { segment: 'Product Based', tone: 'rose' },
    ServiceNow: { segment: 'Product Based', tone: 'mist' },
};

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * GET /api/dsa/companies
 *   Returns the curated list of featured companies with problem counts.
 */
router.get('/', (_req, res) => {
    const companies = COMPANIES_AGGREGATE.map((c) => {
        const meta = COMPANY_META[c.name] || { segment: 'Tech', tone: 'mist' };
        return {
            name: c.name,
            slug: slugify(c.name),
            segment: meta.segment,
            tone: meta.tone,
            initial: c.name.charAt(0).toUpperCase(),
            count: c.problems.length,
            counts: c.counts,
        };
    });
    res.json({ companies, total: companies.length });
});

/**
 * GET /api/dsa/companies/:slug
 *   Returns full problem list for a given company.
 */
router.get('/:slug', (req, res) => {
    const slug = String(req.params.slug || '').toLowerCase();
    const match = COMPANIES_AGGREGATE.find((c) => slugify(c.name) === slug);
    if (!match) {
        return res.status(404).json({ error: 'Company not found', slug });
    }
    const meta = COMPANY_META[match.name] || { segment: 'Tech', tone: 'mist' };
    res.json({
        company: {
            name: match.name,
            slug,
            segment: meta.segment,
            tone: meta.tone,
            initial: match.name.charAt(0).toUpperCase(),
            count: match.problems.length,
            counts: match.counts,
        },
        problems: match.problems,
    });
});

export default router;
