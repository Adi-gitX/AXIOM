import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Loader2, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import skyClouds from '../../assets/figma/sky-clouds.webp';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            setError('');
            setLoading(true);
            await signup(email, password);
            navigate('/app');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        }
        setLoading(false);
    };

    const perks = [
        '1,096 DSA problems with spaced repetition',
        'Auto-tracked OSS contributions & GSOC prep',
        'AI-reviewed interview practice',
        'Free forever — no credit card required',
    ];

    return (
        <div data-testid="signup-page" className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#FAF8F2] text-[#0F1419] font-sans">
            {/* Left — painterly visual + perks */}
            <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden">
                <img
                    src={skyClouds}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F1419]/15 via-transparent to-[#46838b]/30 pointer-events-none" />

                <Link to="/" data-testid="signup-back-home" className="relative z-10 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-white/95 hover:text-white transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                <div className="relative z-10 text-white max-w-[460px]">
                    <div className="flex items-center gap-2 mb-8">
                        <span className="font-display font-semibold text-[28px] tracking-[-0.02em]">axiom</span>
                        <span className="text-[20px]">✦</span>
                    </div>
                    <h2 className="font-display font-semibold text-[44px] leading-[1.05] tracking-[-0.025em]">
                        Start your
                        <br />
                        <span className="font-serif italic font-light">excellence loop.</span>
                    </h2>
                    <ul className="mt-8 space-y-3">
                        {perks.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-[15px] text-white/90">
                                <span className="mt-0.5 w-5 h-5 rounded-full bg-white/15 backdrop-blur flex items-center justify-center shrink-0 border border-white/25">
                                    <Check className="w-3 h-3" strokeWidth={3} />
                                </span>
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right — form */}
            <div className="relative flex items-center justify-center px-6 py-16 lg:px-16">
                <Link to="/" className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0F1419]/70 hover:text-[#0F1419] transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Home
                </Link>

                <div className="w-full max-w-[420px]">
                    <div className="mb-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2EFE7] border border-black/[0.06] text-[11px] font-medium uppercase tracking-[0.12em] text-[#0F1419]/65 mb-6">
                            Get started — free
                        </span>
                        <h1 className="font-display font-semibold text-[40px] leading-[1.05] tracking-[-0.025em] text-[#0F1419]">
                            Create your <span className="font-serif italic font-light">AXIOM.</span>
                        </h1>
                        <p className="mt-3 text-[15px] text-[#0F1419]/60">
                            Track every problem, every contribution, every interview — in one place.
                        </p>
                    </div>

                    {error && (
                        <div data-testid="signup-error" className="mb-5 rounded-2xl bg-[#FEF1F0] border border-[#F4C7C2] text-[#9C2A1F] px-4 py-3 text-[13px]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0F1419]/65 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F1419]/40" />
                                <input
                                    data-testid="signup-email-input"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-black/[0.08] rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0E334F]/20 focus:border-[#0E334F]/40 transition-all text-[15px] text-[#0F1419] placeholder:text-[#0F1419]/35"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0F1419]/65 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F1419]/40" />
                                <input
                                    data-testid="signup-password-input"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-black/[0.08] rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0E334F]/20 focus:border-[#0E334F]/40 transition-all text-[15px] text-[#0F1419] placeholder:text-[#0F1419]/35"
                                    placeholder="At least 8 characters"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0F1419]/65 mb-2">Confirm password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F1419]/40" />
                                <input
                                    data-testid="signup-confirm-input"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white border border-black/[0.08] rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0E334F]/20 focus:border-[#0E334F]/40 transition-all text-[15px] text-[#0F1419] placeholder:text-[#0F1419]/35"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            data-testid="signup-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F1419] text-[#FAF8F2] rounded-full text-[14px] font-semibold tracking-wide hover:bg-[#0E334F] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create account <ChevronRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <p className="mt-8 text-[14px] text-[#0F1419]/65">
                        Already have an account?{' '}
                        <Link to="/login" data-testid="signup-to-login" className="font-semibold text-[#0F1419] hover:text-[#0E334F] underline underline-offset-4 decoration-[#0F1419]/30 hover:decoration-[#0E334F]">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
