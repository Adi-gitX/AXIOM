import { d as RuntimeClient } from './runtime-types-2qM0MukN.cjs';
import { b as CppWorkerClient } from './cpp-worker-client-BzdJLuZa.cjs';
export { C as CppExecutionStyle, a as CppWorkerAssets, c as CppWorkerClientOptions } from './cpp-worker-client-BzdJLuZa.cjs';

declare function createCppRuntimeClient(workerClient: CppWorkerClient): RuntimeClient;

export { CppWorkerClient, createCppRuntimeClient };
