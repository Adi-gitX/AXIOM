import { f as RuntimeExecutionTimings, C as CodeExecutionResult, r as TraceExecutionOptions, E as ExecutionResult } from './runtime-types-2qM0MukN.js';

type CSharpExecutionStyle = 'function' | 'solution-method' | 'ops-class';
interface CSharpWorkerClientOptions {
    workerUrl: string;
    assetBaseUrl: string;
    debug?: boolean;
    initTimeoutMs?: number;
    executionTimeoutMs?: number;
    tracingTimeoutMs?: number;
    interviewTimeoutMs?: number;
    workerIdleTimeoutMs?: number;
}
interface InitResult {
    success: boolean;
    loadTimeMs: number;
    timings?: RuntimeExecutionTimings;
}
interface WarmupResult {
    success: boolean;
    loadTimeMs: number;
    error?: string;
    timings?: RuntimeExecutionTimings;
}
interface CSharpDiagnostic {
    file: string;
    line: number;
    column: number;
    message: string;
    severity: string;
    id?: string;
}
declare class CSharpWorkerClient {
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
    private readonly initTimeoutMs;
    private readonly executionTimeoutMs;
    private readonly tracingTimeoutMs;
    private readonly interviewTimeoutMs;
    constructor(options: CSharpWorkerClientOptions);
    isSupported(): boolean;
    private getWorker;
    private waitForWorkerReady;
    private sendMessage;
    private executeWithTimeout;
    private terminateAndReset;
    private shouldRetryInit;
    private sendInitMessage;
    private workerOptionsPayload;
    init(): Promise<InitResult>;
    warmup(): Promise<WarmupResult>;
    executeCode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle: CSharpExecutionStyle): Promise<CodeExecutionResult>;
    executeCodeInterviewMode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle: CSharpExecutionStyle): Promise<CodeExecutionResult>;
    executeWithTracing(code: string, functionName: string, inputs: Record<string, unknown>, options: TraceExecutionOptions | undefined, executionStyle: CSharpExecutionStyle): Promise<ExecutionResult>;
    private createTrace;
    private isInterviewTimeoutLike;
    terminate(): void;
}

export { type CSharpDiagnostic as C, type CSharpExecutionStyle as a, CSharpWorkerClient as b, type CSharpWorkerClientOptions as c };
