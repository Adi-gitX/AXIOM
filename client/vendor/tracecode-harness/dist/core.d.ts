import { m as RuntimeTraceOptions, h as RuntimeTrace, L as Language } from './runtime-types-2qM0MukN.js';
export { C as CodeExecutionResult, E as ExecutionResult, a as ExecutionStatus, b as LanguageRuntimeProfile, P as PyodideState, R as RUNTIME_TRACE_SCHEMA_VERSION, c as RuntimeCapabilities, d as RuntimeClient, e as RuntimeExecutionStyle, f as RuntimeExecutionTimings, g as RuntimeMaturity, i as RuntimeTraceCallFrame, j as RuntimeTraceEvent, k as RuntimeTraceEventKind, l as RuntimeTraceIterationBinding, n as RuntimeTraceParityAccessTarget, o as RuntimeTraceParitySignature, p as RuntimeTraceTarget, T as TestResult, q as TraceBudget, r as TraceExecutionOptions, s as buildRuntimeTraceParitySignature, t as createEmptyRuntimeTrace, w as withRuntimeTraceOptions } from './runtime-types-2qM0MukN.js';
export { L as LANGUAGE_RUNTIME_INFOS, a as LanguageRuntimeInfo, R as RuntimeComponentInfo, b as RuntimeLibraryInfo, S as SUPPORTED_LANGUAGE_RUNTIME_INFOS, g as getLanguageRuntimeInfo, c as getSupportedLanguageRuntimeInfos } from './runtime-language-info-BFUSti3-.js';

declare function normalizeJavaSerializedResult(output: unknown): unknown;
declare function javaTraceHooksEventsToRuntimeTrace(events: string[], sourceText?: string, options?: RuntimeTraceOptions): RuntimeTrace;

type RuntimeRawEmissionKind = 'line' | 'call' | 'return' | 'exception' | 'stdout' | 'snapshot' | 'read' | 'write' | 'mutate' | 'timeout';
interface RuntimeRawEmissionSummary {
    language: Language;
    kinds: RuntimeRawEmissionKind[];
    unsupported: string[];
}
declare function normalizeJavaNativeTraceJsonPayload(payload: string): string;
declare function summarizeJavaRawEmissions(events: string[]): RuntimeRawEmissionSummary;
declare function summarizeRuntimeTraceEmissions(trace: RuntimeTrace): RuntimeRawEmissionSummary;
declare function assertSupportedRawEmissions(summary: RuntimeRawEmissionSummary, label: string): void;
interface RuntimeRawEmissionParityMismatch {
    language: Language;
    missing: RuntimeRawEmissionKind[];
    extra: RuntimeRawEmissionKind[];
}
declare function compareRawEmissionParity(reference: RuntimeRawEmissionSummary, summaries: RuntimeRawEmissionSummary[]): RuntimeRawEmissionParityMismatch[];

export { Language, type RuntimeRawEmissionKind, type RuntimeRawEmissionParityMismatch, type RuntimeRawEmissionSummary, RuntimeTrace, RuntimeTraceOptions, assertSupportedRawEmissions, compareRawEmissionParity, javaTraceHooksEventsToRuntimeTrace, normalizeJavaNativeTraceJsonPayload, normalizeJavaSerializedResult, summarizeJavaRawEmissions, summarizeRuntimeTraceEmissions };
