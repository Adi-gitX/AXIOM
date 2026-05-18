import { d as RuntimeClient } from './runtime-types-2qM0MukN.js';
import { b as JavaWorkerClient } from './java-worker-client-C97DDnCp.js';
export { J as JavaExecutionStyle, a as JavaTraceExecutionOptions, c as JavaWorkerClientOptions, d as JavaWorkerRawTraceResult, e as JavaWorkerTraceResult } from './java-worker-client-C97DDnCp.js';

declare function createJavaRuntimeClient(workerClient: JavaWorkerClient): RuntimeClient;

export { JavaWorkerClient, createJavaRuntimeClient };
