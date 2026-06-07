import { d as RuntimeClient } from './runtime-types-2qM0MukN.js';
import { b as CSharpWorkerClient } from './csharp-worker-client-JwqS6LiX.js';
export { C as CSharpDiagnostic, a as CSharpExecutionStyle, c as CSharpWorkerClientOptions } from './csharp-worker-client-JwqS6LiX.js';

declare function createCSharpRuntimeClient(workerClient: CSharpWorkerClient): RuntimeClient;

export { CSharpWorkerClient, createCSharpRuntimeClient };
