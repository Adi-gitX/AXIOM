import React from 'react';
import { Sentry } from '../lib/sentry';

/**
 * Top-level error boundary so a single component crash never blanks the entire app.
 * Catches render errors, logs them, and shows a tasteful retry surface.
 *
 * In dev, the error stack is shown for fast debugging.
 * In prod, a clean recovery card is shown.
 *
 * Forwards every captured error to Sentry (no-op if VITE_SENTRY_DSN unset).
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // Surface crash to the console with stack trace
        console.error('[AXIOM] crash captured by ErrorBoundary:', error, info);
        // Forward to Sentry — guarded so a Sentry-side error never re-throws.
        try {
            Sentry?.captureException?.(error, { extra: { componentStack: info?.componentStack } });
        } catch (sentryErr) {
            console.warn('[sentry] capture failed:', sentryErr?.message);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        const isDev = (typeof import.meta !== 'undefined') && import.meta?.env?.DEV;
        return (
            <div className="min-h-screen bg-[#FAF8F2] text-[#0F1419] flex items-center justify-center p-6 antialiased">
                <div className="max-w-[480px] w-full text-center">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0F1419]/55 mb-4">
                        Something broke
                    </p>
                    <h1 className="font-display font-semibold text-[32px] leading-[1.05] tracking-[-0.025em] text-[#0F1419]">
                        We hit an unexpected error.
                    </h1>
                    <p className="mt-4 text-[14px] text-[#0F1419]/65 leading-relaxed">
                        AXIOM caught a render error and stopped to prevent data loss. Try
                        reloading the page — your work is safe.
                    </p>
                    <div className="mt-7 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            data-testid="error-boundary-reload"
                            className="h-9 px-5 rounded-full bg-[#0F1419] text-[#FAF8F2] text-[13px] font-semibold hover:opacity-90 transition-opacity"
                        >
                            Reload page
                        </button>
                        <button
                            type="button"
                            onClick={this.handleReset}
                            className="h-9 px-4 rounded-full bg-white border border-[#0F1419]/10 text-[13px] font-medium text-[#0F1419] hover:border-[#0F1419]/25 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                    {isDev && this.state.error && (
                        <pre className="mt-8 p-4 rounded-xl bg-white border border-[#0F1419]/10 text-[11px] text-left text-[#9C2A1F] font-mono whitespace-pre-wrap break-all max-h-[240px] overflow-auto">
                            {String(this.state.error?.message || this.state.error)}
                            {this.state.error?.stack && '\n\n' + this.state.error.stack}
                        </pre>
                    )}
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
