import React from 'react';

/**
 * Markdownish — a tiny, dependency-free renderer for the small markdown subset the
 * AI tutor and problem statements use: paragraphs, `- `/`• ` bullets, **bold**,
 * `inline code`, and blank-line spacing. Not a full markdown engine by design.
 */
function renderInline(text, keyPrefix) {
    const nodes = [];
    // Split on **bold** and `code`, keeping delimiters.
    const tokens = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    tokens.forEach((tok, i) => {
        if (!tok) return;
        if (tok.startsWith('**') && tok.endsWith('**')) {
            nodes.push(<strong key={`${keyPrefix}-b${i}`} className="font-semibold text-foreground">{tok.slice(2, -2)}</strong>);
        } else if (tok.startsWith('`') && tok.endsWith('`')) {
            nodes.push(
                <code key={`${keyPrefix}-c${i}`} className="px-1 py-0.5 rounded bg-secondary/70 font-mono text-[0.92em] text-[#0E334F]">
                    {tok.slice(1, -1)}
                </code>,
            );
        } else {
            nodes.push(<React.Fragment key={`${keyPrefix}-t${i}`}>{tok}</React.Fragment>);
        }
    });
    return nodes;
}

export default function Markdownish({ text, className = '' }) {
    const lines = String(text || '').replace(/\r/g, '').split('\n');
    const blocks = [];
    let list = null;

    const flushList = (key) => {
        if (list && list.length) {
            blocks.push(
                <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1 my-1.5">
                    {list.map((item, i) => (
                        <li key={i}>{renderInline(item, `li-${key}-${i}`)}</li>
                    ))}
                </ul>,
            );
        }
        list = null;
    };

    lines.forEach((raw, idx) => {
        const line = raw.trimEnd();
        const bullet = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
        if (bullet) {
            if (!list) list = [];
            list.push(bullet[1]);
            return;
        }
        flushList(idx);
        if (line.trim() === '') return;
        blocks.push(
            <p key={`p-${idx}`} className="my-1.5 leading-relaxed">
                {renderInline(line, `p-${idx}`)}
            </p>,
        );
    });
    flushList('end');

    return <div className={`text-[13px] text-muted-foreground ${className}`}>{blocks}</div>;
}
