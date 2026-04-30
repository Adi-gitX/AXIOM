import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import PublicNavbar from '../components/PublicNavbar';

/**
 * Reusable layout for legal/policy pages — keeps Privacy + Terms visually
 * twinned, painterly cream theme, light editorial typography.
 */
const PolicyLayout = ({ kicker, title, lastUpdated, sections, footnote }) => (
    <div className="bg-[#FAF8F2] text-[#0F1419] font-sans antialiased min-h-screen">
        <PublicNavbar />
        <article className="max-w-[760px] mx-auto px-6 md:px-10 pt-32 pb-24">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#0F1419]/55 mb-5">
                {kicker}
            </p>
            <h1 className="font-display font-semibold text-[40px] md:text-[56px] leading-[1.02] tracking-[-0.03em] text-[#0F1419]">
                {title}
            </h1>
            <p className="mt-6 text-[12.5px] tabular text-[#0F1419]/55 font-mono uppercase tracking-[0.06em]">
                Last updated · {lastUpdated}
            </p>

            <div className="mt-12 space-y-10">
                {sections.map((s, i) => (
                    <section key={i}>
                        <h2 className="font-display font-semibold text-[20px] tracking-[-0.018em] text-[#0F1419] mb-3">
                            <span className="text-[#0F1419]/40 font-mono text-[14px] tabular mr-3">{String(i + 1).padStart(2, '0')}</span>
                            {s.heading}
                        </h2>
                        <div className="space-y-3 text-[14.5px] leading-[1.65] text-[#0F1419]/75">
                            {s.body.map((p, j) => <p key={j}>{p}</p>)}
                        </div>
                    </section>
                ))}
            </div>

            {footnote && (
                <p className="mt-16 pt-8 border-t border-[#0F1419]/10 text-[13px] text-[#0F1419]/55 italic-accent">
                    {footnote}
                </p>
            )}
        </article>
    </div>
);

export const Privacy = () => {
    const navigate = useNavigate();
    return (
        <>
            <SEOHead title="Privacy Policy" path="/privacy" description="How AXIOM collects, uses, and protects your data." />
            <PolicyLayout
                kicker="Legal"
                title="Privacy Policy."
                lastUpdated="April 2026"
                sections={[
                    {
                        heading: 'What we collect',
                        body: [
                            'When you sign up with email, we store your email address, display name, and a hashed authentication token (handled by Firebase Authentication). When you connect GitHub, we store your username and the repositories you grant us access to — never your password.',
                            'We collect usage telemetry: which pages you visit, how long you stay, what problems you mark solved, and what issues you save. This is used to improve the product, never sold.',
                        ],
                    },
                    {
                        heading: 'What we never collect',
                        body: [
                            'We do not collect contact lists, location, microphone, camera, or browsing history outside AXIOM. We do not run third-party advertising networks. We do not sell, rent, or license your data to anyone, ever.',
                        ],
                    },
                    {
                        heading: 'Public profiles',
                        body: [
                            'Your profile at /u/your-handle is public by default — anyone with the link can view your name, bio, contributions, and the projects you choose to display. You can switch to private mode in Settings → Visibility at any time.',
                        ],
                    },
                    {
                        heading: 'AI features',
                        body: [
                            'When you use the "AI polish", "Hint", or "AI rewrite" features, the relevant text is sent to a third-party LLM provider (currently OpenAI via Emergent\'s gateway) for processing. The result is returned to you and not stored on our servers. We do not include personally identifiable information in any AI prompt.',
                        ],
                    },
                    {
                        heading: 'Cookies',
                        body: [
                            'We use first-party cookies for authentication (your login session) and a single localStorage entry to remember your DSA progress for offline use. We do not use third-party tracking cookies.',
                        ],
                    },
                    {
                        heading: 'Your rights',
                        body: [
                            'You can export all your data from Settings → Data → Export. You can delete your account at any time from Settings → Account → Delete account — this immediately removes your profile, progress, and submissions from our database.',
                            'For any data request you cannot fulfill yourself, email privacy@axiom.dev. We respond within 7 days.',
                        ],
                    },
                    {
                        heading: 'Open source',
                        body: [
                            'AXIOM is MIT-licensed open source. The exact code that handles your data is publicly auditable at github.com/Adi-gitX/AXIOM. If you find a privacy bug, please report it to security@axiom.dev — we treat security reports seriously and acknowledge within 48 hours.',
                        ],
                    },
                ]}
                footnote="If something here feels unclear or inadequate, write to us — we will fix the policy and the product."
            />
        </>
    );
};

export const Terms = () => (
    <>
        <SEOHead title="Terms of Service" path="/terms" description="The terms under which you use AXIOM." />
        <PolicyLayout
            kicker="Legal"
            title="Terms of Service."
            lastUpdated="April 2026"
            sections={[
                {
                    heading: 'Acceptance',
                    body: [
                        'By creating an account or using AXIOM, you agree to these terms. If you do not agree, please do not use the service.',
                        'These terms may be updated occasionally — material changes will be announced via email and a banner on the dashboard at least 14 days before they take effect.',
                    ],
                },
                {
                    heading: 'What AXIOM is',
                    body: [
                        'AXIOM is a free, open-source platform for software-engineering students and early-career developers to track DSA practice, OSS contributions, GSOC preparation, and career progress. Core features are free forever.',
                        'AXIOM is provided AS-IS. We make no guarantee of uptime, accuracy of curated content, or that GSOC / job recommendations will lead to outcomes.',
                    ],
                },
                {
                    heading: 'Acceptable use',
                    body: [
                        'You agree not to use AXIOM to: post content that infringes copyright, harass other users, spam the community feed, scrape the database without permission, attempt to circumvent rate limits, or impersonate another person.',
                        'Violations may result in immediate account termination at our discretion.',
                    ],
                },
                {
                    heading: 'User-generated content',
                    body: [
                        'When you submit content (interview experiences, posts, profile bio, comments), you retain ownership but grant AXIOM a worldwide, non-exclusive, royalty-free license to display, store, and serve that content as part of the service.',
                        'You can delete any content you submitted at any time from your profile — this revokes the license for that piece of content.',
                    ],
                },
                {
                    heading: 'AI features',
                    body: [
                        'The AI polish, hint, and bio-rewrite features use third-party language models. The output is a suggestion only — we do not guarantee accuracy, originality, or absence of bias. You remain responsible for what you publish.',
                        'AI usage is rate-limited per IP to prevent abuse. Heavy or automated use may be throttled or blocked.',
                    ],
                },
                {
                    heading: 'Liability',
                    body: [
                        'AXIOM is not liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the use or inability to use the service, including loss of data, missed deadlines, or career outcomes.',
                        'Maximum aggregate liability for any claim arising out of these terms is the amount you paid AXIOM in the preceding 12 months — for free users, this is $0.',
                    ],
                },
                {
                    heading: 'Termination',
                    body: [
                        'You may terminate your account at any time from Settings. We may terminate or suspend your account if you violate these terms. Upon termination, your data is deleted within 30 days unless retention is required by law.',
                    ],
                },
                {
                    heading: 'Governing law',
                    body: [
                        'These terms are governed by the laws of India. Any disputes will be resolved in the courts of Bengaluru, Karnataka.',
                    ],
                },
            ]}
            footnote="Plain language. Real protections. If something here ever needs a lawyer to interpret, file an issue and we will rewrite it."
        />
    </>
);

export default Privacy;
