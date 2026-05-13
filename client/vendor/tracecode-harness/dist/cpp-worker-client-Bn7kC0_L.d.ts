import { f as RuntimeExecutionTimings, C as CodeExecutionResult, r as TraceExecutionOptions, E as ExecutionResult } from './runtime-types-2qM0MukN.js';

type CppExecutionStyle = 'function' | 'solution-method' | 'ops-class';
interface CppWorkerAssets {
    clangWasmUrl: string;
    lldWasmUrl: string;
    sysrootUrl: string;
    runtimeHeaderUrl: string;
    compilerBundleUrl: string;
    compilerFrameUrl?: string;
    compilerWorkerUrl?: string;
}
interface CppWorkerClientOptions extends CppWorkerAssets {
    workerUrl: string;
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
    error?: string;
    timings?: RuntimeExecutionTimings;
}
interface WarmupResult {
    success: boolean;
    loadTimeMs: number;
    error?: string;
    timings?: RuntimeExecutionTimings;
}
declare class CppWorkerClient {
    private readonly options;
    private worker;
    private pendingMessages;
    private messageId;
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
    private readonly compilerFrameUrl?;
    private readonly activeCompilerFrames;
    private compilerFrame;
    private compilerFrameReadyPromise;
    private compilerFrameReadyResolve;
    private compilerFrameReadyReject;
    private compilerFrameTargetOrigin;
    private compilerFrameRequestId;
    private compilerFrameMessageHandler;
    private pendingCompilerFrameRequests;
    constructor(options: CppWorkerClientOptions);
    isSupported(): boolean;
    private getWorker;
    private waitForWorkerReady;
    private sendMessage;
    private executeWithTimeout;
    private isClientTimeout;
    private timeoutCodeResult;
    private timeoutTraceResult;
    private terminateAndReset;
    private shouldRetryInit;
    private sendInitMessage;
    init(): Promise<InitResult>;
    private workerOptionsPayload;
    warmup(): Promise<WarmupResult>;
    private clearCompilerFrames;
    private handleCompileRequest;
    private ensureCompilerFrame;
    private compileInFrame;
    executeCode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle: CppExecutionStyle): Promise<CodeExecutionResult>;
    executeWithTracing(code: string, functionName: string, inputs: Record<string, unknown>, options: TraceExecutionOptions | undefined, executionStyle: CppExecutionStyle): Promise<ExecutionResult>;
    executeCodeInterviewMode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle: CppExecutionStyle): Promise<CodeExecutionResult>;
    terminate(): void;
}

export { type CppExecutionStyle as C, type CppWorkerAssets as a, CppWorkerClient as b, type CppWorkerClientOptions as c };
