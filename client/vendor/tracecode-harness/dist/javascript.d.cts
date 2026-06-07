import { e as RuntimeExecutionStyle, C as CodeExecutionResult, E as ExecutionResult, d as RuntimeClient } from './runtime-types-2qM0MukN.cjs';
import { c as JavaScriptWorkerLanguage, a as JavaScriptWorkerClient } from './javascript-worker-client-CYBGEEvc.cjs';
export { J as JavaScriptExecutionStyle, b as JavaScriptWorkerClientOptions } from './javascript-worker-client-CYBGEEvc.cjs';

declare function executeJavaScriptCode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle?: RuntimeExecutionStyle, language?: 'javascript' | 'typescript'): Promise<CodeExecutionResult>;
declare function executeJavaScriptWithTracing(code: string, functionName: string | null, inputs: Record<string, unknown>, executionStyle?: RuntimeExecutionStyle, language?: 'javascript' | 'typescript'): Promise<ExecutionResult>;
declare function executeTypeScriptCode(code: string, functionName: string, inputs: Record<string, unknown>, executionStyle?: RuntimeExecutionStyle): Promise<CodeExecutionResult>;

declare const TYPESCRIPT_RUNTIME_DECLARATIONS = "\ndeclare class ListNode {\n  val: any;\n  value: any;\n  next: ListNode | SerializedListNode | SerializedRef | null;\n  prev?: ListNode | SerializedListNode | SerializedRef | null;\n  constructor(val?: any, next?: ListNode | null);\n}\n\ndeclare class TreeNode {\n  val: any;\n  value: any;\n  left: TreeNode | SerializedTreeNode | SerializedRef | null;\n  right: TreeNode | SerializedTreeNode | SerializedRef | null;\n  constructor(val?: any, left?: TreeNode | null, right?: TreeNode | null);\n}\n\ntype SerializedRef = { __ref__: string };\n\ntype SerializedListNode = {\n  __id__?: string;\n  __type__?: 'ListNode';\n  val?: any;\n  value?: any;\n  next?: SerializedListNode | SerializedRef | ListNode | null;\n  prev?: SerializedListNode | SerializedRef | ListNode | null;\n};\n\ntype SerializedTreeNode = {\n  __id__?: string;\n  __type__?: 'TreeNode';\n  val?: any;\n  value?: any;\n  left?: SerializedTreeNode | SerializedRef | TreeNode | null;\n  right?: SerializedTreeNode | SerializedRef | TreeNode | null;\n};\n";
declare function withTypeScriptRuntimeDeclarations(sourceCode: string): string;

declare function createJavaScriptRuntimeClient(runtimeLanguage: JavaScriptWorkerLanguage, workerClient: JavaScriptWorkerClient): RuntimeClient;

export { JavaScriptWorkerClient, JavaScriptWorkerLanguage, TYPESCRIPT_RUNTIME_DECLARATIONS, createJavaScriptRuntimeClient, executeJavaScriptCode, executeJavaScriptWithTracing, executeTypeScriptCode, withTypeScriptRuntimeDeclarations };
