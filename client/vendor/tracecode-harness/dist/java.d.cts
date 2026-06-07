import { d as RuntimeClient } from './runtime-types-2qM0MukN.cjs';
import { b as JavaWorkerClient } from './java-worker-client-BOwKW-11.cjs';
export { J as JavaExecutionStyle, a as JavaTraceExecutionOptions, c as JavaWorkerClientOptions, d as JavaWorkerRawTraceResult, e as JavaWorkerTraceResult } from './java-worker-client-BOwKW-11.cjs';

declare function createJavaRuntimeClient(workerClient: JavaWorkerClient): RuntimeClient;

export { JavaWorkerClient, createJavaRuntimeClient };
