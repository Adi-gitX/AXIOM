import { E as ExecutionResult, C as CodeExecutionResult } from './runtime-types-2qM0MukN.js';

type JavaScriptExecutionStyle = 'function' | 'solution-method' | 'ops-class';
type JavaScriptWorkerLanguage = 'javascript' | 'typescript';
interface JavaScriptWorkerClientOptions {
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
declare class JavaScriptWorkerClient {
    private readonly options;
    private worker;
    private pendingMessages;
    private messageId;
    private isInitializing;
    private initPromise;
    private warmupPromises;
    private workerReadyPromise;
    private workerReadyResolve;
    private workerReadyReject;
    private readonly debug;
    constructor(options: JavaScriptWorkerClientOptions);
    isSupported(): boolean;
    private getWorker;
    private waitForWorkerReady;
    private sendMessage;
    private executeWithTimeout;
    private terminateAndReset;
    init(): Promise<InitResult>;
    warmup(language?: JavaScriptWorkerLanguage): Promise<WarmupResult>;
    executeWithTracing(code: string, functionName: string | null, inputs: Record<string, unknown>, options?: {
        maxTraceSteps?: number;
        maxLineEvents?: number;
        maxSingleLineHits?: number;
        maxStoredEvents?: number;
        minimalTrace?: boolean;
    }, executionStyle?: JavaScriptExecutionStyle, language?: JavaScriptWorkerLanguage): Promise<ExecutionResult>;
    executeCode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle?: JavaScriptExecutionStyle, language?: JavaScriptWorkerLanguage): Promise<CodeExecutionResult>;
    executeCodeInterviewMode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle?: JavaScriptExecutionStyle, language?: JavaScriptWorkerLanguage): Promise<CodeExecutionResult>;
    terminate(): void;
}
declare function isJavaScriptWorkerSupported(): boolean;

export { type JavaScriptExecutionStyle as J, JavaScriptWorkerClient as a, type JavaScriptWorkerClientOptions as b, type JavaScriptWorkerLanguage as c, isJavaScriptWorkerSupported as i };
