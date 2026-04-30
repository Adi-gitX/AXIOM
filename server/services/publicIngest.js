/**
 * Public API ingestion service — pulls live data from no-auth public sources.
 *
 * Sources:
 *   - RemoteOK   (https://remoteok.com/api) — remote-only jobs, ~1000 calls/day
 *   - Arbeitnow  (https://arbeitnow.com/api/job-board-api) — global jobs
 *   - HackerNews (https://hacker-news.firebaseio.com/v0/topstories.json)
 *   - Dev.to     (https://dev.to/api/articles)
 *
 * Strategy: in-memory cache with 30-min TTL so we don't hammer upstream.
 * Falls back to seeded data if any upstream is down.
 */

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map();

const cached = async (key, ttl, fetcher) => {
    const entry = cache.get(key);
    const now = Date.now();
    if (entry && now - entry.t < ttl) return entry.v;
    try {
        const v = await fetcher();
        cache.set(key, { t: now, v });
        return v;
    } catch (err) {
        // Return stale-while-error if we have ANY prior value, else empty
        if (entry) {
            console.warn(`[ingest] ${key} upstream failed, serving stale:`, err.message);
            return entry.v;
        }
        console.warn(`[ingest] ${key} upstream failed (no cache):`, err.message);
        return null;
    }
};

const fetchJson = async (url, opts = {}) => {
    const r = await fetch(url, {
        ...opts,
        headers: {
            'User-Agent': 'AXIOM/1.0 (+https://github.com/Adi-gitX/AXIOM)',
            Accept: 'application/json',
            ...(opts.headers || {}),
        },
    });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    return r.json();
};

// ─────────────────────────────────────────────────────────────────────────
// Jobs — RemoteOK + Arbeitnow merged
// ─────────────────────────────────────────────────────────────────────────
const normalizeRemoteOK = (item) => ({
    id: `remoteok-${item.id || item.slug}`,
    title: item.position || item.title,
    company: item.company,
    company_logo: item.company_logo || item.logo,
    location: item.location || 'Remote',
    job_type: 'Full-time',
    salary: item.salary_min && item.salary_max ? `$${item.salary_min} - $${item.salary_max}` : null,
    is_remote: 1,
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
    apply_url: item.apply_url || item.url,
    source: 'RemoteOK',
    posted_at: item.date,
});

const normalizeArbeitnow = (item) => ({
    id: `arbeitnow-${item.slug}`,
    title: item.title,
    company: item.company_name,
    company_logo: null,
    location: item.location || 'Remote',
    job_type: Array.isArray(item.job_types) && item.job_types.length ? item.job_types[0] : 'Full-time',
    salary: null,
    is_remote: item.remote ? 1 : 0,
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
    apply_url: item.url,
    source: 'Arbeitnow',
    posted_at: item.created_at ? new Date(item.created_at * 1000).toISOString() : null,
});

export const fetchLiveJobs = async (limit = 30) =>
    cached(`jobs:${limit}`, CACHE_TTL_MS, async () => {
        const [remoteOk, arbeitnow] = await Promise.allSettled([
            fetchJson('https://remoteok.com/api'),
            fetchJson('https://www.arbeitnow.com/api/job-board-api'),
        ]);

        const merged = [];

        if (remoteOk.status === 'fulfilled' && Array.isArray(remoteOk.value)) {
            // First entry of RemoteOK is metadata, drop it
            const items = remoteOk.value.slice(1, 25);
            merged.push(...items.map(normalizeRemoteOK));
        }
        if (arbeitnow.status === 'fulfilled' && Array.isArray(arbeitnow.value?.data)) {
            merged.push(...arbeitnow.value.data.slice(0, 25).map(normalizeArbeitnow));
        }

        // Filter out incomplete entries
        const complete = merged.filter((j) => j.title && j.company && j.apply_url);
        return complete.slice(0, limit);
    });

// ─────────────────────────────────────────────────────────────────────────
// Posts — HackerNews top stories + Dev.to latest
// ─────────────────────────────────────────────────────────────────────────
const fetchHackerNewsTop = async (limit = 8) => {
    const ids = await fetchJson('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!Array.isArray(ids)) return [];
    const top = ids.slice(0, limit);
    const items = await Promise.all(
        top.map((id) => fetchJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).catch(() => null)),
    );
    return items
        .filter((it) => it && it.title)
        .map((it) => ({
            id: `hn-${it.id}`,
            source_name: 'HackerNews',
            source_icon: 'Y',
            source_color: '#FF6600',
            title: it.title,
            author_name: it.by,
            author_avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(it.by || 'hn')}`,
            published_at: new Date(it.time * 1000).toISOString(),
            read_time: '3m read',
            upvotes: it.score || 0,
            external_url: it.url || `https://news.ycombinator.com/item?id=${it.id}`,
        }));
};

const fetchDevToLatest = async (limit = 4) => {
    const articles = await fetchJson(`https://dev.to/api/articles?per_page=${limit}&top=1`);
    if (!Array.isArray(articles)) return [];
    return articles.map((a) => ({
        id: `devto-${a.id}`,
        source_name: 'Dev.to',
        source_icon: 'D',
        source_color: '#0A0A0A',
        title: a.title,
        author_name: a.user?.username,
        author_avatar: a.user?.profile_image_90,
        published_at: a.published_at || a.created_at,
        read_time: a.reading_time_minutes ? `${a.reading_time_minutes}m read` : '5m read',
        upvotes: a.public_reactions_count || 0,
        external_url: a.url,
    }));
};

export const fetchLivePosts = async (limit = 12) =>
    cached(`posts:${limit}`, CACHE_TTL_MS, async () => {
        const [hn, devto] = await Promise.allSettled([
            fetchHackerNewsTop(Math.ceil(limit * 0.66)),
            fetchDevToLatest(Math.ceil(limit * 0.34)),
        ]);
        const merged = [];
        if (hn.status === 'fulfilled') merged.push(...hn.value);
        if (devto.status === 'fulfilled') merged.push(...devto.value);
        // Sort by upvotes for ranking quality
        merged.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        return merged.slice(0, limit);
    });

export default { fetchLiveJobs, fetchLivePosts };
