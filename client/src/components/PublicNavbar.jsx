import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';

const PublicNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Honest, product-aligned nav — what AXIOM actually is, not generic SaaS labels.
    const links = [
        { label: 'Product', kind: 'scroll', target: 'product' },
        { label: 'Pricing', kind: 'route', path: '/pricing' },
        { label: 'Docs', kind: 'route', path: '/docs' },
        { label: 'Changelog', kind: 'scroll', target: 'changelog' },
    ];

    const isActive = (link) => link.kind === 'route' && location.pathname === link.path;

    const handleClick = (link) => {
        if (link.kind === 'route') navigate(link.path);
        else scrollTo(link.target);
    };

    return (
        <header
            data-testid="public-navbar"
            className={`fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow] duration-300 ${
                scrolled
                    ? 'bg-[#FAF8F2]/85 backdrop-blur-xl shadow-[0_1px_0_rgba(15,20,25,0.06)]'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 md:px-10 h-[68px]">
                {/* Brand — wordmark only, no ornament */}
                <button
                    data-testid="brand-logo"
                    onClick={() => navigate('/')}
                    className="flex items-baseline gap-1 group"
                >
                    <span className="font-display text-[22px] tracking-[-0.025em] font-semibold text-[#0F1419]">
                        axiom
                    </span>
                    <span className="font-serif italic text-[13px] text-[#0F1419]/45 -ml-0.5">/dev</span>
                </button>

                {/* Center nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {links.map((item) => (
                        <button
                            key={item.label}
                            data-testid={`nav-${item.label.toLowerCase()}`}
                            onClick={() => handleClick(item)}
                            className={`px-3.5 py-2 text-[13.5px] font-medium tracking-[-0.005em] rounded-md transition-colors ${
                                isActive(item)
                                    ? 'text-[#0F1419]'
                                    : 'text-[#0F1419]/65 hover:text-[#0F1419]'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Right cluster */}
                <div className="flex items-center gap-2">
                    <a
                        href="https://github.com/Adi-gitX/AXIOM"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="nav-github"
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#0F1419]/70 hover:text-[#0F1419] rounded-md transition-colors"
                    >
                        <Github className="w-4 h-4" strokeWidth={1.6} />
                        GitHub
                    </a>
                    <button
                        data-testid="nav-signin-btn"
                        onClick={() => navigate('/login')}
                        className="hidden sm:inline-flex px-3.5 py-2 text-[13.5px] font-medium text-[#0F1419]/70 hover:text-[#0F1419] rounded-md transition-colors"
                    >
                        Sign in
                    </button>
                    <button
                        data-testid="nav-cta-btn"
                        onClick={() => navigate('/signup')}
                        className="px-4 py-2 text-[13.5px] font-medium bg-[#0F1419] text-[#FAF8F2] rounded-full hover:bg-[#0E334F] transition-colors"
                    >
                        Get started
                    </button>
                </div>
            </div>
        </header>
    );
};

export default PublicNavbar;
