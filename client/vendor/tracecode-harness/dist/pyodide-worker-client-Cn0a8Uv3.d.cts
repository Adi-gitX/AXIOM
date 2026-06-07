import { E as ExecutionResult, C as CodeExecutionResult } from './runtime-types-2qM0MukN.cjs';

/**
 * Python Worker Client
 *
 * TypeScript client for communicating with the Python Web Worker.
 * Provides a promise-based API for executing Python code off the main thread.
 */

type ExecutionStyle = 'function' | 'solution-method' | 'ops-class';
interface PythonWorkerClientOptions {
    workerUrl: string;
    debug?: boolean;
}
interface InitResult {
    success: boolean;
    loadTimeMs: number;
}
interface WarmupResult {
    success: boolean;
    loadTimeMs: number;
}
interface StatusResult {
    isReady: boolean;
    isLoading: boolean;
}
declare class PythonWorkerClient {
    private readonly options;
    private worker;
    private pendingMessages;
    private messageId;
    private isInitializing;
    private initPromise;
    private warmupPromise;
    private workerReadyPromise;
    private workerReadyResolve;
    private workerReadyReject;
    private readonly debug;
    constructor(options: PythonWorkerClientOptions);
    /**
     * Check if Web Workers are supported
     */
    isSupported(): boolean;
    /**
     * Get or create the worker instance
     */
    private getWorker;
    /**
     * Wait for worker bootstrap signal with timeout.
     * Guards against deadlocks when the worker script fails before posting "worker-ready".
     */
    private waitForWorkerReady;
    /**
     * Send a message to the worker and wait for a response
     */
    private sendMessage;
    /**
     * Execute code with a timeout - terminates worker if execution takes too long
     */
    private executeWithTimeout;
    /**
     * Terminate the worker and reset state for recreation
     */
    private terminateAndReset;
    /**
     * Initialize the Python worker. Runtime loading is lazy unless warmup() is called.
     */
    init(): Promise<InitResult>;
    warmup(): Promise<WarmupResult>;
    /**
     * Execute Python code with tracing for step-by-step visualization
     * @param options.maxLineEvents - Max line events before abort (for complexity analysis, use higher values)
     */
    executeWithTracing(code: string, functionName: string | null, inputs: Record<string, unknown>, options?: {
        maxTraceSteps?: number;
        maxLineEvents?: number;
        maxSingleLineHits?: number;
        maxStoredEvents?: number;
        minimalTrace?: boolean;
    }, executionStyle?: ExecutionStyle): Promise<ExecutionResult>;
    /**
     * Execute Python code without tracing (for running tests)
     */
    executeCode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle?: ExecutionStyle): Promise<CodeExecutionResult>;
    /**
     * Execute Python code in interview mode - 5 second timeout, generic error messages
     * Does not reveal which line caused the timeout
     */
    executeCodeInterviewMode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle?: ExecutionStyle): Promise<CodeExecutionResult>;
    /**
     * Check the status of the worker
     */
    getStatus(): Promise<StatusResult>;
    /**
     * Analyze Python code using AST (off main thread)
     * Returns CodeFacts with semantic information about the code
     */
    analyzeCode(code: string): Promise<unknown>;
    /**
     * Terminate the worker and clean up resources
     */
    terminate(): void;
}
type PyodideWorkerClientOptions = PythonWorkerClientOptions;

/**
 * Check if the worker client is supported
 */
declare function isWorkerSupported(): boolean;

export { type ExecutionStyle as E, PythonWorkerClient as P, type PyodideWorkerClientOptions as a, type PythonWorkerClientOptions as b, isWorkerSupported as i };
