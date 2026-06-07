import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

/**
 * Branded 404 page — public-side miss handler.
 * Replaces the previous hard redirect to `/` so deep-links don't silently swallow.
 */
const NotFound = () => {
    const navigate = useNavigate();
    return (
        <>
            <SEOHead title="Page not found" path="/404" noIndex />
            <div className="min-h-screen bg-[#FAF8F2] text-[#0F1419] flex flex-col items-center justify-center p-6 antialiased">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#0F1419]/55 mb-5">
                    404 · not found
                </p>
                <h1 className="font-display font-semibold text-[64px] md:text-[88px] leading-none tracking-[-0.04em] text-[#0F1419]">
                    Off the map.
                </h1>
                <p className="mt-6 text-[15px] text-[#0F1419]/65 max-w-[460px] text-center leading-relaxed">
                    This page doesn&apos;t exist
                    <span style={{ fontFamily: 'Newsreader, "Source Serif Pro", Georgia, serif', fontStyle: 'italic', fontWeight: 300 }}> — yet.</span>
                    Try the dashboard or the docs.
                </p>
                <div className="mt-9 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        data-testid="notfound-home-btn"
                        className="h-9 px-5 rounded-full bg-[#0F1419] text-[#FAF8F2] text-[13px] font-semibold hover:opacity-90 transition-opacity"
                    >
                        Go home
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/docs')}
                        className="h-9 px-4 rounded-full bg-white border border-[#0F1419]/10 text-[13px] font-medium text-[#0F1419] hover:border-[#0F1419]/25 transition-colors"
                    >
                        Read docs
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotFound;
