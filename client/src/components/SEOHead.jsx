import { useEffect } from 'react';

/**
 * SEO Head component — updates document title and meta tags per route.
 * Since this is a SPA, we dynamically update <head> on route change.
 *
 * Usage:
 *   <SEOHead
 *     title="DSA Tracker"
 *     description="Track 1,096 DSA problems with spaced repetition"
 *     path="/app/dsa"
 *   />
 */
const SEOHead = ({
    title,
    description,
    path = '',
    noIndex = false,
}) => {
    const BASE_URL = 'https://axiomdev.vercel.app';
    const fullTitle = title ? `${title} | AXIOM` : 'AXIOM — The Developer Career Command Center';
    const fullUrl = `${BASE_URL}${path}`;
    const defaultDescription = 'Free, open-source developer career command center with DSA tracking, OSS contributions, GSOC prep, interview prep, jobs, and public portfolio.';
    const desc = description || defaultDescription;

    useEffect(() => {
        // Update title
        document.title = fullTitle;

        // Helper to set or create a meta tag
        const setMeta = (attr, key, content) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        // Primary meta
        setMeta('name', 'description', desc);
        if (noIndex) {
            setMeta('name', 'robots', 'noindex, nofollow');
        } else {
            setMeta('name', 'robots', 'index, follow');
        }

        // Open Graph
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', desc);
        setMeta('property', 'og:url', fullUrl);

        // Twitter Card
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', desc);
        setMeta('name', 'twitter:url', fullUrl);

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', fullUrl);
    }, [fullTitle, desc, fullUrl, noIndex]);

    return null;
};

export default SEOHead;
