import { d as RuntimeClient } from './runtime-types-2qM0MukN.js';
import { b as CppWorkerClient } from './cpp-worker-client-Bn7kC0_L.js';
export { C as CppExecutionStyle, a as CppWorkerAssets, c as CppWorkerClientOptions } from './cpp-worker-client-Bn7kC0_L.js';

declare function createCppRuntimeClient(workerClient: CppWorkerClient): RuntimeClient;

export { CppWorkerClient, createCppRuntimeClient };
