/**
 * AXIOM code engine — public surface.
 *
 * Import from here (`@/lib/exec`), never from `@tracecode/harness` directly.
 * This keeps the AGPL engine behind a single swappable boundary.
 */

export {
    runCode,
    traceCode,
    warmLanguage,
    disposeLanguage,
    disposeEngine,
    supportsTracing,
    isBrowser,
} from './engine';

export {
    LANGUAGES,
    LANGUAGE_IDS,
    DEFAULT_LANGUAGE,
    getLanguage,
    isLanguageId,
    getStarter,
    PLAYGROUND_STARTERS,
} from './languages';

export { deepEqual, unorderedEqual, makeComparator, formatValue } from './value';

export { runAgainstTests } from './judge';
