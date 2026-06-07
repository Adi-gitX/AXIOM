import { d as RuntimeClient } from './runtime-types-2qM0MukN.cjs';
import { b as CSharpWorkerClient } from './csharp-worker-client-DMHIa2YG.cjs';
export { C as CSharpDiagnostic, a as CSharpExecutionStyle, c as CSharpWorkerClientOptions } from './csharp-worker-client-DMHIa2YG.cjs';

declare function createCSharpRuntimeClient(workerClient: CSharpWorkerClient): RuntimeClient;

export { CSharpWorkerClient, createCSharpRuntimeClient };
