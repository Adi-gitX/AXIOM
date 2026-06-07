import { f as RuntimeExecutionTimings, h as RuntimeTrace, C as CodeExecutionResult } from './runtime-types-2qM0MukN.js';

type JavaExecutionStyle = 'function' | 'solution-method' | 'ops-class';
interface JavaWorkerClientOptions {
    workerUrl: string;
    debug?: boolean;
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
    timings?: RuntimeExecutionTimings;
}
interface JavaWorkerRawTraceResult {
    success: boolean;
    output?: unknown;
    events: string[];
    sourceText?: string;
    executionTimeMs: number;
    error?: string;
    errorLine?: number;
    consoleOutput: string[];
    traceLimitExceeded?: boolean;
    timeoutReason?: 'trace-limit';
    droppedEventCount?: number;
    timings?: RuntimeExecutionTimings;
}
interface JavaWorkerTraceResult extends JavaWorkerRawTraceResult {
    trace: RuntimeTrace;
}
interface JavaTraceExecutionOptions {
    maxTraceSteps?: number;
    maxLineEvents?: number;
    maxSingleLineHits?: number;
    maxStoredEvents?: number;
    minimalTrace?: boolean;
}
declare class JavaWorkerClient {
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
    constructor(options: JavaWorkerClientOptions);
    isSupported(): boolean;
    private getWorker;
    private waitForWorkerReady;
    private sendMessage;
    private executeWithTimeout;
    private terminateAndReset;
    init(): Promise<InitResult>;
    private workerOptionsPayload;
    warmup(): Promise<WarmupResult>;
    executeWithTracing(code: string, functionName: string, inputs: Record<string, unknown>, options: JavaTraceExecutionOptions | undefined, executionStyle: JavaExecutionStyle): Promise<JavaWorkerTraceResult>;
    executeCode(code: string, functionName: string, inputs: Record<string, unknown>, options: JavaTraceExecutionOptions | undefined, executionStyle: JavaExecutionStyle): Promise<CodeExecutionResult>;
    private executeCodeMessage;
    executeCodeInterviewMode(code: string, functionName: string, inputs: Record<string, unknown>, options: JavaTraceExecutionOptions | undefined, executionStyle: JavaExecutionStyle): Promise<CodeExecutionResult>;
    terminate(): void;
}

export { type JavaExecutionStyle as J, type JavaTraceExecutionOptions as a, JavaWorkerClient as b, type JavaWorkerClientOptions as c, type JavaWorkerRawTraceResult as d, type JavaWorkerTraceResult as e };
