declare const RUNTIME_TRACE_SCHEMA_VERSION = "runtime-trace-2026-04-28";
type RuntimeTraceEventKind = 'line' | 'call' | 'return' | 'read' | 'write' | 'mutate' | 'snapshot' | 'stdout' | 'exception' | 'timeout';
type RuntimeTraceTarget = {
    variable: string;
    scope?: 'local' | 'global' | 'builtin' | 'receiver';
} | {
    variable: string;
    path: Array<string | number>;
    indexSources?: Array<string | null>;
    scope?: 'local' | 'global' | 'builtin' | 'receiver';
} | {
    objectId: string;
    path?: Array<string | number>;
    indexSources?: Array<string | null>;
};
interface RuntimeTraceCallFrame {
    function: string;
    line?: number;
    args?: Record<string, unknown> | unknown[];
}
interface RuntimeTraceBaseEvent {
    kind: RuntimeTraceEventKind;
    runId: string;
    file?: string;
    line?: number;
    column?: number;
    frameId?: string;
    callStack?: RuntimeTraceCallFrame[];
}
type RuntimeTraceEvent = (RuntimeTraceBaseEvent & {
    kind: 'line';
    line: number;
    function?: string;
}) | (RuntimeTraceBaseEvent & {
    kind: 'call';
    line: number;
    function: string;
    args?: Record<string, unknown> | unknown[];
}) | (RuntimeTraceBaseEvent & {
    kind: 'return';
    line: number;
    function?: string;
    value?: unknown;
}) | (RuntimeTraceBaseEvent & {
    kind: 'read' | 'write';
    line: number;
    target: RuntimeTraceTarget;
    value?: unknown;
    binding?: RuntimeTraceIterationBinding;
}) | (RuntimeTraceBaseEvent & {
    kind: 'mutate';
    line: number;
    target: RuntimeTraceTarget;
    method?: string;
    args?: unknown[];
}) | (RuntimeTraceBaseEvent & {
    kind: 'snapshot';
    line: number;
    target: RuntimeTraceTarget;
    value: unknown;
}) | (RuntimeTraceBaseEvent & {
    kind: 'stdout';
    text: string;
}) | (RuntimeTraceBaseEvent & {
    kind: 'exception';
    message: string;
}) | (RuntimeTraceBaseEvent & {
    kind: 'timeout';
    message: string;
    reason?: 'trace-limit' | 'line-limit' | 'single-line-limit' | 'client-timeout';
});
interface RuntimeTrace {
    schemaVersion: typeof RUNTIME_TRACE_SCHEMA_VERSION;
    language: Language;
    runId: string;
    events: RuntimeTraceEvent[];
    lineEventCount: number;
    traceStepCount: number;
}
interface RuntimeTraceIterationBinding {
    kind?: 'iteration';
    variable: string;
}
interface RuntimeTraceOptions {
    runId?: string;
    file?: string;
}
declare function createEmptyRuntimeTrace(language: Language, options?: RuntimeTraceOptions): RuntimeTrace;
interface RuntimeTraceParityAccessTarget {
    kind: 'read' | 'write' | 'mutate';
    variable?: string;
    pathDepth?: number;
}
interface RuntimeTraceParitySignature {
    lineSequence: number[];
    eventKindsByLine: Record<number, RuntimeTraceEventKind[]>;
    variableSnapshotsByLine: Record<number, string[]>;
    accessTargetsByLine: Record<number, RuntimeTraceParityAccessTarget[]>;
    callReturnShape: Array<'call' | 'return'>;
}
declare function withRuntimeTraceOptions(trace: RuntimeTrace, options?: RuntimeTraceOptions): RuntimeTrace;
declare function buildRuntimeTraceParitySignature(trace: RuntimeTrace): RuntimeTraceParitySignature;

/**
 * Execution types for browser runtime contracts.
 */
type ExecutionStatus = 'idle' | 'loading' | 'ready' | 'running' | 'stepping' | 'paused' | 'completed' | 'error';
interface TestResult {
    id: string;
    passed: boolean;
    input: Record<string, unknown>;
    expected: unknown;
    actual: unknown;
    error?: string;
    warning?: string;
    executionTimeMs?: number;
}
interface RuntimeExecutionTimings {
    totalMs?: number;
    initMs?: number;
    warmupMs?: number;
    toolchainLoadMs?: number;
    rewriteMs?: number;
    driverBuildMs?: number;
    compileMs?: number;
    linkMs?: number;
    wasmCompileMs?: number;
    classLoadMs?: number;
    runMs?: number;
    hostCallMs?: number;
    compileCacheHit?: boolean;
}
interface CodeExecutionResult {
    success: boolean;
    output: unknown;
    error?: string;
    errorLine?: number;
    consoleOutput?: string[];
    timeoutReason?: 'trace-limit' | 'line-limit' | 'single-line-limit' | 'recursion-limit' | 'memory-limit' | 'client-timeout';
    diagnosticStage?: 'compile' | 'runtime' | 'trace' | 'interview' | 'driver-compile' | 'trace-driver-compile' | 'driver-link';
    timings?: RuntimeExecutionTimings;
}
interface ExecutionResult {
    success: boolean;
    output?: unknown;
    error?: string;
    errorLine?: number;
    trace: RuntimeTrace;
    executionTimeMs: number;
    consoleOutput: string[];
    traceLimitExceeded?: boolean;
    maxTraceSteps?: number;
    timeoutReason?: 'trace-limit' | 'line-limit' | 'single-line-limit' | 'recursion-limit' | 'memory-limit' | 'client-timeout';
    lineEventCount?: number;
    traceStepCount?: number;
    timings?: RuntimeExecutionTimings;
}
interface PyodideState {
    status: 'loading' | 'ready' | 'error';
    error?: Error;
    loadTimeMs?: number;
}

type Language = 'python' | 'javascript' | 'typescript' | 'java' | 'csharp' | 'cpp';
type RuntimeExecutionStyle = 'function' | 'solution-method' | 'ops-class';
type RuntimeMaturity = 'experimental' | 'beta' | 'stable';
interface RuntimeCapabilities {
    execution: {
        styles: {
            function: boolean;
            solutionMethod: boolean;
            opsClass: boolean;
            script: boolean;
            interviewMode: boolean;
        };
        timeouts: {
            clientTimeouts: boolean;
            runtimeTimeouts: boolean;
        };
    };
    tracing: {
        supported: boolean;
        events: {
            line: boolean;
            call: boolean;
            return: boolean;
            exception: boolean;
            stdout: boolean;
            timeout: boolean;
        };
        controls: {
            maxTraceSteps: boolean;
            maxLineEvents: boolean;
            maxSingleLineHits: boolean;
            maxStoredEvents: boolean;
            minimalTrace: boolean;
        };
        fidelity: {
            preciseLineMapping: boolean;
            stableFunctionNames: boolean;
            callStack: boolean;
        };
    };
    diagnostics: {
        compileErrors: boolean;
        runtimeErrors: boolean;
        mappedErrorLines: boolean;
        stackTraces: boolean;
    };
    structures: {
        treeNodeRefs: boolean;
        listNodeRefs: boolean;
        mapSerialization: boolean;
        setSerialization: boolean;
        graphSerialization: boolean;
        cycleReferences: boolean;
    };
}
interface TraceBudget {
    maxTraceSteps?: number;
    maxLineEvents?: number;
    maxSingleLineHits?: number;
    maxStoredEvents?: number;
}
interface TraceExecutionOptions extends TraceBudget {
    minimalTrace?: boolean;
}
interface LanguageRuntimeProfile {
    language: Language;
    maturity: RuntimeMaturity;
    capabilities: RuntimeCapabilities;
    notes?: string[];
}
interface RuntimeClient {
    init(): Promise<{
        success: boolean;
        loadTimeMs: number;
    }>;
    executeWithTracing(code: string, functionName: string | null, inputs: Record<string, unknown>, options?: TraceExecutionOptions, executionStyle?: RuntimeExecutionStyle): Promise<ExecutionResult>;
    executeCode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle?: RuntimeExecutionStyle): Promise<CodeExecutionResult>;
    executeCodeInterviewMode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle?: RuntimeExecutionStyle): Promise<CodeExecutionResult>;
}

export { type CodeExecutionResult as C, type ExecutionResult as E, type Language as L, type PyodideState as P, RUNTIME_TRACE_SCHEMA_VERSION as R, type TestResult as T, type ExecutionStatus as a, type LanguageRuntimeProfile as b, type RuntimeCapabilities as c, type RuntimeClient as d, type RuntimeExecutionStyle as e, type RuntimeExecutionTimings as f, type RuntimeMaturity as g, type RuntimeTrace as h, type RuntimeTraceCallFrame as i, type RuntimeTraceEvent as j, type RuntimeTraceEventKind as k, type RuntimeTraceIterationBinding as l, type RuntimeTraceOptions as m, type RuntimeTraceParityAccessTarget as n, type RuntimeTraceParitySignature as o, type RuntimeTraceTarget as p, type TraceBudget as q, type TraceExecutionOptions as r, buildRuntimeTraceParitySignature as s, createEmptyRuntimeTrace as t, withRuntimeTraceOptions as w };
