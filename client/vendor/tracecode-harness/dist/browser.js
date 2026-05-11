// packages/harness-core/src/generated/runtime-language-info-data.ts
var LANGUAGE_RUNTIME_INFOS = Object.freeze({
  "python": {
    "language": "python",
    "displayName": "Python",
    "versionLabel": "Python 3.13.2 (Pyodide 0.29.0)",
    "description": "Python 3.13.2 (Pyodide 0.29.0).\n\nCommon algorithm helpers are imported automatically, including array, bisect, collections, functools, heapq, itertools. Other standard-library modules can be imported normally.\n\nsortedcontainers 2.4.0 is available for TreeMap, ordered-set, and sorted-list style workflows.",
    "runtime": {
      "name": "Pyodide",
      "version": "0.29.0",
      "detail": "CPython 3.13.2 compiled to WebAssembly."
    },
    "defaultImports": [
      "array",
      "bisect",
      "collections",
      "functools",
      "heapq",
      "itertools",
      "operator",
      "re",
      "string",
      "typing"
    ],
    "libraries": [
      {
        "name": "sortedcontainers",
        "version": "2.4.0",
        "importName": "sortedcontainers",
        "detail": "SortedDict, SortedList, and SortedSet are loaded for tree-map/tree-set style use cases."
      }
    ]
  },
  "javascript": {
    "language": "javascript",
    "displayName": "JavaScript",
    "versionLabel": "JavaScript (ECMAScript 2023)",
    "runtime": {
      "name": "Browser Worker JavaScript runtime",
      "detail": "Runs in the host browser worker; Node.js is not required for browser execution."
    },
    "libraries": [
      {
        "name": "lodash",
        "version": "4.17.21",
        "importName": "lodash",
        "globalName": "_"
      },
      {
        "name": "@datastructures-js/binary-search-tree",
        "version": "5.4.0",
        "importName": "@datastructures-js/binary-search-tree"
      },
      {
        "name": "@datastructures-js/deque",
        "version": "1.0.8",
        "importName": "@datastructures-js/deque"
      },
      {
        "name": "@datastructures-js/graph",
        "version": "5.3.1",
        "importName": "@datastructures-js/graph"
      },
      {
        "name": "@datastructures-js/heap",
        "version": "4.3.7",
        "importName": "@datastructures-js/heap"
      },
      {
        "name": "@datastructures-js/linked-list",
        "version": "6.1.4",
        "importName": "@datastructures-js/linked-list"
      },
      {
        "name": "@datastructures-js/priority-queue",
        "version": "6.3.5",
        "importName": "@datastructures-js/priority-queue"
      },
      {
        "name": "@datastructures-js/queue",
        "version": "4.3.0",
        "importName": "@datastructures-js/queue"
      },
      {
        "name": "@datastructures-js/set",
        "version": "4.2.2",
        "importName": "@datastructures-js/set"
      },
      {
        "name": "@datastructures-js/stack",
        "version": "3.1.6",
        "importName": "@datastructures-js/stack"
      },
      {
        "name": "@datastructures-js/trie",
        "version": "4.2.3",
        "importName": "@datastructures-js/trie"
      }
    ],
    "standard": "ECMAScript 2023-compatible syntax in the browser worker lane.",
    "description": 'JavaScript runs in an isolated browser Web Worker with ECMAScript 2023-compatible syntax.\n\nLodash 4.17.21 is available as both lodash and _.\n\nThe @datastructures-js packages are bundled for common algorithm data structures. Queue, Stack, Deque, Heap, PriorityQueue, MinPriorityQueue, and MaxPriorityQueue are available globally.\n\nBundled @datastructures-js versions:\n\n"@datastructures-js/binary-search-tree": "5.4.0"\n"@datastructures-js/deque": "1.0.8"\n"@datastructures-js/graph": "5.3.1"\n"@datastructures-js/heap": "4.3.7"\n"@datastructures-js/linked-list": "6.1.4"\n"@datastructures-js/priority-queue": "6.3.5"\n"@datastructures-js/queue": "4.3.0"\n"@datastructures-js/set": "4.2.2"\n"@datastructures-js/stack": "3.1.6"\n"@datastructures-js/trie": "4.2.3"\n\nBinary Search Tree, Trie, and Graph are bundled too, but are not exposed globally because those names can collide with problem definitions. Import or require the matching package when you need one.'
  },
  "typescript": {
    "language": "typescript",
    "displayName": "TypeScript",
    "versionLabel": "TypeScript 5.9.3",
    "description": 'TypeScript 5.9.3 is compiled in the browser and then executed on the JavaScript worker runtime.\n\nCompiler options: --target ES2020 --module None --strict false --esModuleInterop\n\nLodash 4.17.21 is available as both lodash and _.\n\nThe @datastructures-js packages are bundled for common algorithm data structures. Queue, Stack, Deque, Heap, PriorityQueue, MinPriorityQueue, and MaxPriorityQueue are available globally.\n\nBundled @datastructures-js versions:\n\n"@datastructures-js/binary-search-tree": "5.4.0"\n"@datastructures-js/deque": "1.0.8"\n"@datastructures-js/graph": "5.3.1"\n"@datastructures-js/heap": "4.3.7"\n"@datastructures-js/linked-list": "6.1.4"\n"@datastructures-js/priority-queue": "6.3.5"\n"@datastructures-js/queue": "4.3.0"\n"@datastructures-js/set": "4.2.2"\n"@datastructures-js/stack": "3.1.6"\n"@datastructures-js/trie": "4.2.3"\n\nBinary Search Tree, Trie, and Graph are bundled too, but are not exposed globally because those names can collide with problem definitions. Import or require the matching package when you need one.\n\nThe compiled output runs on the same browser worker execution lane as JavaScript submissions.',
    "runtime": {
      "name": "Browser Worker JavaScript runtime",
      "detail": "TypeScript is compiled before execution and runs on the JavaScript worker lane."
    },
    "compiler": {
      "name": "TypeScript",
      "version": "5.9.3"
    },
    "standard": "Transpiles to JavaScript for the browser worker lane.",
    "libraries": [
      {
        "name": "lodash",
        "version": "4.17.21",
        "importName": "lodash",
        "globalName": "_"
      },
      {
        "name": "@datastructures-js/binary-search-tree",
        "version": "5.4.0",
        "importName": "@datastructures-js/binary-search-tree"
      },
      {
        "name": "@datastructures-js/deque",
        "version": "1.0.8",
        "importName": "@datastructures-js/deque"
      },
      {
        "name": "@datastructures-js/graph",
        "version": "5.3.1",
        "importName": "@datastructures-js/graph"
      },
      {
        "name": "@datastructures-js/heap",
        "version": "4.3.7",
        "importName": "@datastructures-js/heap"
      },
      {
        "name": "@datastructures-js/linked-list",
        "version": "6.1.4",
        "importName": "@datastructures-js/linked-list"
      },
      {
        "name": "@datastructures-js/priority-queue",
        "version": "6.3.5",
        "importName": "@datastructures-js/priority-queue"
      },
      {
        "name": "@datastructures-js/queue",
        "version": "4.3.0",
        "importName": "@datastructures-js/queue"
      },
      {
        "name": "@datastructures-js/set",
        "version": "4.2.2",
        "importName": "@datastructures-js/set"
      },
      {
        "name": "@datastructures-js/stack",
        "version": "3.1.6",
        "importName": "@datastructures-js/stack"
      },
      {
        "name": "@datastructures-js/trie",
        "version": "4.2.3",
        "importName": "@datastructures-js/trie"
      }
    ]
  },
  "java": {
    "language": "java",
    "displayName": "Java",
    "versionLabel": "Java 17",
    "description": "Java 17 is compiled with javac 17 and executed in the browser through CheerpJ 4.2.\n\nCommon imports are added automatically: java.util.*, java.io.*, java.math.*, java.util.stream.*, javafx.util.Pair.",
    "runtime": {
      "name": "CheerpJ browser-local OpenJDK runtime",
      "version": "17",
      "detail": "Loaded through CheerpJ 4.2."
    },
    "compiler": {
      "name": "javac",
      "version": "17"
    },
    "defaultImports": [
      "java.util.*",
      "java.io.*",
      "java.math.*",
      "java.util.stream.*",
      "javafx.util.Pair"
    ],
    "libraries": [
      {
        "name": "JavaParser",
        "version": "3.25.10",
        "detail": "Used internally for Java source rewriting."
      },
      {
        "name": "javafx.util.Pair",
        "detail": "Small compatibility Pair class bundled with the Java helper jar."
      }
    ]
  },
  "csharp": {
    "language": "csharp",
    "displayName": "C#",
    "versionLabel": "C# 14 (.NET 10.0.8)",
    "description": "C# 14 with .NET 10.0.8 runtime.\n\nCode is compiled with Microsoft.CodeAnalysis.CSharp 5.3.0 and executed by a browser-local .NET WebAssembly runtime.\n\nCommon namespaces are imported automatically: System, System.Collections, System.Collections.Generic, System.Linq, System.Numerics, System.Text, System.Text.RegularExpressions.",
    "runtime": {
      "name": ".NET WebAssembly runtime",
      "version": "10.0.8",
      "detail": "Browser-local .NET runtime targeting net10.0."
    },
    "compiler": {
      "name": "Microsoft.CodeAnalysis.CSharp",
      "version": "5.3.0"
    },
    "standard": "C# 14",
    "defaultImports": [
      "System",
      "System.Collections",
      "System.Collections.Generic",
      "System.Linq",
      "System.Numerics",
      "System.Text",
      "System.Text.RegularExpressions"
    ]
  },
  "cpp": {
    "language": "cpp",
    "displayName": "C++",
    "versionLabel": "C++23 (YoWASP Clang 22)",
    "description": "C++ is compiled with YoWASP Clang/LLD 22.0.0-git20542-10 using the C++23 standard.\n\nSubmissions compile to WebAssembly and run in a browser-local WASI-style execution lane. The harness currently compiles with -O0 and -fno-exceptions, with a fixed program stack size.\n\nCommon standard library headers are included automatically, including <algorithm>, <array>, <bitset>, <climits>, <cmath>, <cstdint>, <functional>, <limits>, <numeric>, <sstream>, <tuple>, <vector>, <unordered_map>, <unordered_set> and more.",
    "runtime": {
      "name": "WASI/WebAssembly execution lane",
      "detail": "Compiled and executed in a browser-local WASI-style worker lane."
    },
    "compiler": {
      "name": "YoWASP Clang/LLD",
      "version": "22.0.0-git20542-10"
    },
    "standard": "C++23",
    "defaultImports": [
      "<algorithm>",
      "<array>",
      "<bitset>",
      "<climits>",
      "<cmath>",
      "<cstdint>",
      "<functional>",
      "<limits>",
      "<numeric>",
      "<sstream>",
      "<tuple>",
      "<vector>",
      "<unordered_map>",
      "<unordered_set>",
      "<map>",
      "<set>",
      "<deque>",
      "<queue>",
      "<stack>",
      "<utility>",
      "<string>",
      "<span>",
      "<ranges>",
      "<concepts>",
      "<any>",
      "<bit>",
      "<cctype>",
      "<cerrno>",
      "<cfloat>",
      "<charconv>",
      "<chrono>",
      "<cinttypes>",
      "<compare>",
      "<complex>",
      "<cstddef>",
      "<cstdio>",
      "<cstdlib>",
      "<cstring>",
      "<exception>",
      "<expected>",
      "<forward_list>",
      "<initializer_list>",
      "<iomanip>",
      "<ios>",
      "<iostream>",
      "<iterator>",
      "<list>",
      "<memory>",
      "<numbers>",
      "<optional>",
      "<random>",
      "<ratio>",
      "<regex>",
      "<stdexcept>",
      "<string_view>",
      "<type_traits>",
      "<typeindex>",
      "<typeinfo>",
      "<valarray>",
      "<variant>",
      "<version>"
    ],
    "libraries": [
      {
        "name": "C++ standard library and WASI libc",
        "detail": "Provided by the YoWASP Clang toolchain bundle."
      }
    ]
  }
});

// packages/harness-core/src/runtime-language-info.ts
var SUPPORTED_LANGUAGE_RUNTIME_INFOS = Object.freeze(
  Object.values(LANGUAGE_RUNTIME_INFOS)
);
function getLanguageRuntimeInfo(language) {
  const info = LANGUAGE_RUNTIME_INFOS[language];
  if (!info) {
    throw new Error(`Runtime info for language "${language}" is not implemented yet.`);
  }
  return info;
}
function getSupportedLanguageRuntimeInfos() {
  return SUPPORTED_LANGUAGE_RUNTIME_INFOS;
}

// packages/harness-browser/src/runtime-diagnostics.ts
var CONSOLE_METHOD_BY_LEVEL = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error"
};
function runtimeDiagnosticEvent(params) {
  return {
    schema: "tracecode.runtime-diagnostic.v1",
    source: "harness",
    ...params
  };
}
function logRuntimeDiagnostic(level, params, options = {}) {
  if (options.enabled === false && level !== "error") {
    return;
  }
  const method = CONSOLE_METHOD_BY_LEVEL[level] ?? "info";
  console[method]("[TraceRuntime]", runtimeDiagnosticEvent(params));
}

// packages/harness-browser/src/javascript-worker-client.ts
var EXECUTION_TIMEOUT_MS = 2e4;
var INTERVIEW_MODE_TIMEOUT_MS = 5e3;
var TRACING_TIMEOUT_MS = 2e4;
var INIT_TIMEOUT_MS = 1e4;
var TYPESCRIPT_WARMUP_TIMEOUT_MS = 3e4;
var MESSAGE_TIMEOUT_MS = 12e3;
var WORKER_READY_TIMEOUT_MS = 1e4;
var JavaScriptWorkerClient = class {
  constructor(options) {
    this.options = options;
    this.debug = options.debug ?? process.env.NODE_ENV === "development";
  }
  worker = null;
  pendingMessages = /* @__PURE__ */ new Map();
  messageId = 0;
  isInitializing = false;
  initPromise = null;
  warmupPromises = /* @__PURE__ */ new Map();
  workerReadyPromise = null;
  workerReadyResolve = null;
  workerReadyReject = null;
  debug;
  isSupported() {
    return typeof Worker !== "undefined";
  }
  getWorker() {
    if (this.worker) return this.worker;
    if (!this.isSupported()) {
      throw new Error("Web Workers are not supported in this environment");
    }
    this.workerReadyPromise = new Promise((resolve, reject) => {
      this.workerReadyResolve = resolve;
      this.workerReadyReject = (error) => reject(error);
    });
    const workerUrl = this.debug && !this.options.workerUrl.includes("?") ? `${this.options.workerUrl}?dev=${Date.now()}` : this.options.workerUrl;
    this.worker = new Worker(workerUrl);
    this.worker.onmessage = (event) => {
      const { id, type, payload } = event.data;
      if (type === "worker-ready") {
        this.workerReadyResolve?.();
        this.workerReadyResolve = null;
        this.workerReadyReject = null;
        logRuntimeDiagnostic("info", {
          component: "JavaScriptWorkerClient",
          runtime: "javascript",
          phase: "worker-ready",
          message: "JavaScript worker is ready."
        }, { enabled: this.debug });
        return;
      }
      if (id) {
        const pending = this.pendingMessages.get(id);
        if (!pending) return;
        this.pendingMessages.delete(id);
        if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
        if (type === "error") {
          pending.reject(new Error(payload.error));
          return;
        }
        pending.resolve(payload);
      }
    };
    this.worker.onerror = (error) => {
      logRuntimeDiagnostic("error", {
        component: "JavaScriptWorkerClient",
        runtime: "javascript",
        phase: "worker-error",
        message: "JavaScript worker emitted an error event.",
        detail: {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno
        }
      });
      const workerError = new Error("Worker error");
      this.workerReadyReject?.(workerError);
      this.workerReadyResolve = null;
      this.workerReadyReject = null;
      for (const [id, pending] of this.pendingMessages) {
        if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
        pending.reject(workerError);
        this.pendingMessages.delete(id);
      }
    };
    return this.worker;
  }
  async waitForWorkerReady() {
    const readyPromise = this.workerReadyPromise;
    if (!readyPromise) return;
    await new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        const timeoutError = new Error(
          `JavaScript worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS / 1e3)}s)`
        );
        this.terminateAndReset(timeoutError);
        reject(timeoutError);
      }, WORKER_READY_TIMEOUT_MS);
      readyPromise.then(() => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve();
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }
  async sendMessage(type, payload, timeoutMs = MESSAGE_TIMEOUT_MS) {
    const worker = this.getWorker();
    await this.waitForWorkerReady();
    const id = String(++this.messageId);
    return new Promise((resolve, reject) => {
      this.pendingMessages.set(id, {
        resolve,
        reject
      });
      const timeoutId = globalThis.setTimeout(() => {
        const pending2 = this.pendingMessages.get(id);
        if (!pending2) return;
        this.pendingMessages.delete(id);
        pending2.reject(new Error(`Worker request timed out: ${type}`));
      }, timeoutMs);
      const pending = this.pendingMessages.get(id);
      if (pending) pending.timeoutId = timeoutId;
      worker.postMessage({ id, type, payload });
    });
  }
  async executeWithTimeout(executor, timeoutMs) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        this.terminateAndReset();
        reject(
          new Error(
            `Execution timed out (possible infinite loop). Code execution was stopped after ${Math.round(timeoutMs / 1e3)} seconds.`
          )
        );
      }, timeoutMs);
      executor().then((result) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve(result);
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error);
      });
    });
  }
  terminateAndReset(reason = new Error("Worker was terminated")) {
    this.workerReadyReject?.(reason);
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.initPromise = null;
    this.warmupPromises.clear();
    this.isInitializing = false;
    this.workerReadyPromise = null;
    this.workerReadyResolve = null;
    this.workerReadyReject = null;
    for (const [, pending] of this.pendingMessages) {
      if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
      pending.reject(reason);
    }
    this.pendingMessages.clear();
  }
  async init() {
    if (this.initPromise) return this.initPromise;
    if (this.isInitializing) {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
      return this.init();
    }
    this.isInitializing = true;
    this.initPromise = this.sendMessage("init", void 0, INIT_TIMEOUT_MS);
    try {
      return await this.initPromise;
    } catch (error) {
      this.initPromise = null;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }
  async warmup(language = "javascript") {
    const existing = this.warmupPromises.get(language);
    if (existing) return existing;
    const warmupPromise = (async () => {
      await this.init();
      return this.sendMessage(
        "warmup",
        { language },
        language === "typescript" ? TYPESCRIPT_WARMUP_TIMEOUT_MS : INIT_TIMEOUT_MS
      );
    })();
    this.warmupPromises.set(language, warmupPromise);
    try {
      return await warmupPromise;
    } catch (error) {
      this.warmupPromises.delete(language);
      throw error;
    }
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle = "function", language = "javascript") {
    await this.init();
    return this.executeWithTimeout(
      () => this.sendMessage(
        "execute-with-tracing",
        {
          code,
          functionName,
          inputs,
          options,
          executionStyle,
          language
        },
        TRACING_TIMEOUT_MS + 2e3
      ),
      TRACING_TIMEOUT_MS
    );
  }
  async executeCode(code, functionName, inputs, executionStyle = "function", language = "javascript") {
    await this.init();
    return this.executeWithTimeout(
      () => this.sendMessage(
        "execute-code",
        {
          code,
          functionName,
          inputs,
          executionStyle,
          language
        },
        EXECUTION_TIMEOUT_MS + 2e3
      ),
      EXECUTION_TIMEOUT_MS
    );
  }
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle = "function", language = "javascript") {
    await this.init();
    try {
      const result = await this.executeWithTimeout(
        () => this.sendMessage(
          "execute-code-interview",
          {
            code,
            functionName,
            inputs,
            executionStyle,
            language
          },
          INTERVIEW_MODE_TIMEOUT_MS + 2e3
        ),
        INTERVIEW_MODE_TIMEOUT_MS
      );
      if (!result.success && result.error) {
        const normalized = result.error.toLowerCase();
        const isTimeoutOrResourceLimit = normalized.includes("timed out") || normalized.includes("infinite loop") || normalized.includes("line-limit") || normalized.includes("single-line-limit") || normalized.includes("recursion-limit") || normalized.includes("trace-limit") || normalized.includes("line events") || normalized.includes("trace steps") || normalized.includes("call depth");
        if (isTimeoutOrResourceLimit) {
          return {
            success: false,
            output: null,
            error: "Time Limit Exceeded",
            consoleOutput: result.consoleOutput ?? []
          };
        }
      }
      return result;
    } catch {
      return {
        success: false,
        output: null,
        error: "Time Limit Exceeded",
        consoleOutput: []
      };
    }
  }
  terminate() {
    this.terminateAndReset();
  }
};

// packages/harness-browser/src/runtime-capability-guards.ts
function isScriptRequest(functionName) {
  if (functionName == null) return true;
  return functionName.trim().length === 0;
}
function executionStyleLabel(executionStyle) {
  if (executionStyle === "solution-method") return "solution-method";
  if (executionStyle === "ops-class") return "ops-class";
  return "function";
}
function isExecutionStyleSupported(profile, executionStyle) {
  const styles = profile.capabilities.execution.styles;
  if (executionStyle === "solution-method") return styles.solutionMethod;
  if (executionStyle === "ops-class") return styles.opsClass;
  return styles.function;
}
function describeRequest(request) {
  if (request === "trace") return "tracing";
  if (request === "interview") return "interview execution";
  return "execution";
}
function assertRuntimeRequestSupported(profile, options) {
  if (options.request === "trace" && !profile.capabilities.tracing.supported) {
    throw new Error(`Runtime "${profile.language}" does not support tracing.`);
  }
  if (options.request === "interview" && !profile.capabilities.execution.styles.interviewMode) {
    throw new Error(`Runtime "${profile.language}" does not support interview execution.`);
  }
  if (!isExecutionStyleSupported(profile, options.executionStyle)) {
    throw new Error(
      `Runtime "${profile.language}" does not support execution style "${executionStyleLabel(options.executionStyle)}".`
    );
  }
  if (isScriptRequest(options.functionName) && !profile.capabilities.execution.styles.script) {
    throw new Error(`Runtime "${profile.language}" does not support script mode ${describeRequest(options.request)}.`);
  }
}

// packages/harness-browser/src/runtime-profiles.ts
var PYTHON_RUNTIME_PROFILE = {
  language: "python",
  maturity: "stable",
  capabilities: {
    execution: {
      styles: {
        function: true,
        solutionMethod: true,
        opsClass: true,
        script: true,
        interviewMode: true
      },
      timeouts: {
        clientTimeouts: true,
        runtimeTimeouts: true
      }
    },
    tracing: {
      supported: true,
      events: {
        line: true,
        call: true,
        return: true,
        exception: true,
        stdout: true,
        timeout: true
      },
      controls: {
        maxTraceSteps: true,
        maxLineEvents: true,
        maxSingleLineHits: true,
        maxStoredEvents: true,
        minimalTrace: true
      },
      fidelity: {
        preciseLineMapping: true,
        stableFunctionNames: true,
        callStack: true
      }
    },
    diagnostics: {
      compileErrors: false,
      runtimeErrors: true,
      mappedErrorLines: true,
      stackTraces: false
    },
    structures: {
      treeNodeRefs: true,
      listNodeRefs: true,
      mapSerialization: true,
      setSerialization: true,
      graphSerialization: true,
      cycleReferences: true
    }
  }
};
var JAVASCRIPT_RUNTIME_PROFILE = {
  language: "javascript",
  maturity: "stable",
  capabilities: {
    execution: {
      styles: {
        function: true,
        solutionMethod: true,
        opsClass: true,
        script: true,
        interviewMode: true
      },
      timeouts: {
        clientTimeouts: true,
        runtimeTimeouts: false
      }
    },
    tracing: {
      supported: true,
      events: {
        line: true,
        call: true,
        return: true,
        exception: true,
        stdout: false,
        timeout: true
      },
      controls: {
        maxTraceSteps: true,
        maxLineEvents: true,
        maxSingleLineHits: true,
        maxStoredEvents: true,
        minimalTrace: true
      },
      fidelity: {
        preciseLineMapping: true,
        stableFunctionNames: true,
        callStack: true
      }
    },
    diagnostics: {
      compileErrors: false,
      runtimeErrors: true,
      mappedErrorLines: false,
      stackTraces: false
    },
    structures: {
      treeNodeRefs: true,
      listNodeRefs: true,
      mapSerialization: true,
      setSerialization: true,
      graphSerialization: true,
      cycleReferences: true
    }
  }
};
var TYPESCRIPT_RUNTIME_PROFILE = {
  language: "typescript",
  maturity: "stable",
  capabilities: {
    execution: {
      styles: {
        function: true,
        solutionMethod: true,
        opsClass: true,
        script: true,
        interviewMode: true
      },
      timeouts: {
        clientTimeouts: true,
        runtimeTimeouts: false
      }
    },
    tracing: {
      supported: true,
      events: {
        line: true,
        call: true,
        return: true,
        exception: true,
        stdout: false,
        timeout: true
      },
      controls: {
        maxTraceSteps: true,
        maxLineEvents: true,
        maxSingleLineHits: true,
        maxStoredEvents: true,
        minimalTrace: true
      },
      fidelity: {
        preciseLineMapping: true,
        stableFunctionNames: true,
        callStack: true
      }
    },
    diagnostics: {
      compileErrors: true,
      runtimeErrors: true,
      mappedErrorLines: true,
      stackTraces: false
    },
    structures: {
      treeNodeRefs: true,
      listNodeRefs: true,
      mapSerialization: true,
      setSerialization: true,
      graphSerialization: true,
      cycleReferences: true
    }
  }
};
var JAVA_RUNTIME_PROFILE = {
  language: "java",
  maturity: "experimental",
  capabilities: {
    execution: {
      styles: {
        function: true,
        solutionMethod: true,
        opsClass: true,
        script: true,
        interviewMode: true
      },
      timeouts: {
        clientTimeouts: true,
        runtimeTimeouts: true
      }
    },
    tracing: {
      supported: true,
      events: {
        line: true,
        call: true,
        return: true,
        exception: true,
        stdout: false,
        timeout: true
      },
      controls: {
        maxTraceSteps: true,
        maxLineEvents: false,
        maxSingleLineHits: false,
        maxStoredEvents: true,
        minimalTrace: false
      },
      fidelity: {
        preciseLineMapping: true,
        stableFunctionNames: true,
        callStack: true
      }
    },
    diagnostics: {
      compileErrors: true,
      runtimeErrors: true,
      mappedErrorLines: false,
      stackTraces: true
    },
    structures: {
      treeNodeRefs: true,
      listNodeRefs: true,
      mapSerialization: true,
      setSerialization: true,
      graphSerialization: false,
      cycleReferences: true
    }
  },
  notes: [
    "Java currently supports the browser-local Java 17 lane for function, solution-method, ops-class, and script-style execution.",
    "Interview-mode Java reuses the same browser-local execution path and remains experimental.",
    'Script-style Java uses an empty function name with executionStyle="function" and reads the top-level result variable.'
  ]
};
var CSHARP_RUNTIME_PROFILE = {
  language: "csharp",
  maturity: "experimental",
  capabilities: {
    execution: {
      styles: {
        function: true,
        solutionMethod: true,
        opsClass: true,
        script: true,
        interviewMode: true
      },
      timeouts: {
        clientTimeouts: true,
        runtimeTimeouts: true
      }
    },
    tracing: {
      supported: true,
      events: {
        line: true,
        call: true,
        return: true,
        exception: true,
        stdout: true,
        timeout: true
      },
      controls: {
        maxTraceSteps: true,
        maxLineEvents: true,
        maxSingleLineHits: true,
        maxStoredEvents: true,
        minimalTrace: true
      },
      fidelity: {
        preciseLineMapping: true,
        stableFunctionNames: true,
        callStack: true
      }
    },
    diagnostics: {
      compileErrors: true,
      runtimeErrors: true,
      mappedErrorLines: true,
      stackTraces: false
    },
    structures: {
      treeNodeRefs: true,
      listNodeRefs: true,
      mapSerialization: true,
      setSerialization: true,
      graphSerialization: true,
      cycleReferences: true
    }
  },
  notes: [
    "C# support is browser-local and experimental.",
    "C# supports named function-style requests where the browser-local host can bind the named method.",
    'Script-style C# uses an empty function name with executionStyle="function" and reads the top-level result variable.',
    "Interview-mode C# uses the same browser-local worker execution path with interview timeout normalization.",
    "The first C# slice supports public class Solution methods.",
    "ListNode and TreeNode inputs are hydrated from level-order arrays or object-shaped JSON.",
    "Dictionary, HashSet, List, and array return values serialize through the browser-local worker.",
    "Tracing currently supports line, call, return, stdout, and simple local variable write events.",
    "Structural visualization is added after execution and diagnostics are proven."
  ]
};
var CPP_RUNTIME_PROFILE = {
  language: "cpp",
  maturity: "experimental",
  capabilities: {
    execution: {
      styles: {
        function: true,
        solutionMethod: true,
        opsClass: true,
        script: true,
        interviewMode: true
      },
      timeouts: {
        clientTimeouts: true,
        runtimeTimeouts: true
      }
    },
    tracing: {
      supported: true,
      events: {
        line: true,
        call: true,
        return: true,
        exception: true,
        stdout: true,
        timeout: true
      },
      controls: {
        maxTraceSteps: true,
        maxLineEvents: true,
        maxSingleLineHits: true,
        maxStoredEvents: true,
        minimalTrace: true
      },
      fidelity: {
        preciseLineMapping: true,
        stableFunctionNames: true,
        callStack: true
      }
    },
    diagnostics: {
      compileErrors: true,
      runtimeErrors: true,
      mappedErrorLines: true,
      stackTraces: false
    },
    structures: {
      treeNodeRefs: true,
      listNodeRefs: true,
      mapSerialization: true,
      setSerialization: true,
      graphSerialization: true,
      cycleReferences: true
    }
  },
  notes: [
    "C++ uses a focused browser-local Clang/LLD/WASI compiler lane with TraceCode-owned execution glue.",
    "The runtime intentionally does not depend on a generic multi-language container/runtime SDK.",
    'Script-style C++ uses an empty function name with executionStyle="function"; the snippet must assign a serializable result variable.',
    "Interview-mode C++ reuses the tracing compiler path with a trace budget and returns a non-trace execution result."
  ]
};
var LANGUAGE_RUNTIME_PROFILES = {
  python: PYTHON_RUNTIME_PROFILE,
  javascript: JAVASCRIPT_RUNTIME_PROFILE,
  typescript: TYPESCRIPT_RUNTIME_PROFILE,
  java: JAVA_RUNTIME_PROFILE,
  csharp: CSHARP_RUNTIME_PROFILE,
  cpp: CPP_RUNTIME_PROFILE
};
var SUPPORTED_LANGUAGES = Object.freeze(
  Object.keys(LANGUAGE_RUNTIME_PROFILES)
);
function getLanguageRuntimeProfile(language) {
  const profile = LANGUAGE_RUNTIME_PROFILES[language];
  if (!profile) {
    throw new Error(`Runtime profile for language "${language}" is not implemented yet.`);
  }
  return profile;
}
function getSupportedLanguageProfiles() {
  return SUPPORTED_LANGUAGES.map((language) => LANGUAGE_RUNTIME_PROFILES[language]);
}
function isLanguageSupported(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

// packages/harness-browser/src/javascript-runtime-client.ts
var JavaScriptRuntimeClient = class {
  constructor(runtimeLanguage, workerClient) {
    this.runtimeLanguage = runtimeLanguage;
    this.workerClient = workerClient;
  }
  async init() {
    return this.workerClient.init();
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile(this.runtimeLanguage), {
      request: "trace",
      executionStyle,
      functionName
    });
    return this.workerClient.executeWithTracing(
      code,
      functionName,
      inputs,
      options,
      executionStyle,
      this.runtimeLanguage
    );
  }
  async executeCode(code, functionName, inputs, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile(this.runtimeLanguage), {
      request: "execute",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCode(
      code,
      functionName,
      inputs,
      executionStyle,
      this.runtimeLanguage
    );
  }
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile(this.runtimeLanguage), {
      request: "interview",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCodeInterviewMode(
      code,
      functionName,
      inputs,
      executionStyle,
      this.runtimeLanguage
    );
  }
};
function createJavaScriptRuntimeClient(runtimeLanguage, workerClient) {
  return new JavaScriptRuntimeClient(runtimeLanguage, workerClient);
}

// packages/harness-core/src/runtime-trace.ts
var RUNTIME_TRACE_SCHEMA_VERSION = "runtime-trace-2026-04-28";
function createEmptyRuntimeTrace(language, options = {}) {
  return {
    schemaVersion: RUNTIME_TRACE_SCHEMA_VERSION,
    language,
    runId: options.runId ?? `${language}:run`,
    events: [],
    lineEventCount: 0,
    traceStepCount: 0
  };
}

// packages/harness-core/src/runtime-raw-emission-contract.ts
function sortedUnique(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
var FORBIDDEN_RUNTIME_TRACE_TOKENS = [
  "visualization",
  "objectKinds",
  "hashMaps",
  "graph-adjacency",
  "linked-list",
  "tree"
];
var FORBIDDEN_RUNTIME_TRACE_KEYS = /* @__PURE__ */ new Set([
  "visualization",
  "objectKinds",
  "hashMaps",
  "graph-adjacency",
  "linked-list"
]);
function normalizeJavaNativeTraceJsonPayload(payload) {
  return payload.replace(/(?<![A-Za-z0-9_"])-Infinity(?![A-Za-z0-9_"])/g, '"-Infinity"').replace(/(?<![A-Za-z0-9_"])Infinity(?![A-Za-z0-9_"])/g, '"Infinity"').replace(/(?<![A-Za-z0-9_"])NaN(?![A-Za-z0-9_"])/g, '"NaN"');
}
function forbiddenRuntimeTraceTokens(value) {
  const tokens = /* @__PURE__ */ new Set();
  collectForbiddenRuntimeTraceTokens(value, tokens, null, false);
  return FORBIDDEN_RUNTIME_TRACE_TOKENS.filter((token) => tokens.has(token));
}
function collectForbiddenRuntimeTraceTokens(value, tokens, parentKey, semanticPayload) {
  if (typeof value === "string") {
    if ((semanticPayload || parentKey === "kind" || parentKey === "type" || parentKey === "category") && FORBIDDEN_RUNTIME_TRACE_TOKENS.includes(value)) {
      tokens.add(value);
    }
    return;
  }
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) collectForbiddenRuntimeTraceTokens(item, tokens, parentKey, semanticPayload);
    return;
  }
  const entries = Object.entries(value);
  const objectSemanticPayload = entries.some(([key, child]) => {
    if (parentKey !== "args" && FORBIDDEN_RUNTIME_TRACE_KEYS.has(key)) return true;
    return (key === "kind" || key === "type" || key === "category") && typeof child === "string" && FORBIDDEN_RUNTIME_TRACE_TOKENS.includes(child);
  });
  for (const [key, child] of entries) {
    if (parentKey !== "args" && FORBIDDEN_RUNTIME_TRACE_KEYS.has(key)) {
      tokens.add(key);
    }
    if (key === "target" || key === "variable" || key === "function") continue;
    collectForbiddenRuntimeTraceTokens(child, tokens, key, semanticPayload || objectSemanticPayload);
  }
}
function unsupportedForbiddenPayload(label, value) {
  const tokens = forbiddenRuntimeTraceTokens(value);
  if (tokens.length === 0) return null;
  return `${label} contains forbidden runtime trace token(s): ${tokens.join(", ")}`;
}
function javaNativeTracePayloadKind(event) {
  if (!event.startsWith("trace:")) return null;
  try {
    const parsed = JSON.parse(normalizeJavaNativeTraceJsonPayload(event.slice("trace:".length)));
    if (parsed.kind === "line") return "line";
    if (parsed.kind === "call") return "call";
    if (parsed.kind === "return") return "return";
    if (parsed.kind === "exception") return "exception";
    if (parsed.kind === "timeout") return "timeout";
    if (parsed.kind === "stdout") return "stdout";
    if (parsed.kind === "snapshot") return "snapshot";
    if (parsed.kind === "read") return "read";
    if (parsed.kind === "write") return "write";
    if (parsed.kind === "mutate") return "mutate";
  } catch {
    return null;
  }
  return null;
}
function summarizeJavaRawEmissions(events) {
  const kinds = [];
  const unsupported = [];
  for (const [index, event] of events.entries()) {
    if (event.startsWith("trace:")) {
      try {
        const parsed = JSON.parse(normalizeJavaNativeTraceJsonPayload(event.slice("trace:".length)));
        const forbiddenPayload = unsupportedForbiddenPayload(`java trace event ${index}`, parsed);
        if (forbiddenPayload) {
          unsupported.push(forbiddenPayload);
          continue;
        }
      } catch {
      }
    }
    const nativeKind = javaNativeTracePayloadKind(event);
    if (nativeKind) {
      kinds.push(nativeKind);
      continue;
    }
    unsupported.push(event);
  }
  return {
    language: "java",
    kinds: sortedUnique(kinds),
    unsupported
  };
}
function assertSupportedRawEmissions(summary, label) {
  if (summary.unsupported.length > 0) {
    throw new Error(
      `${label} emitted unsupported raw runtime payloads:
${summary.unsupported.slice(0, 20).join("\n")}`
    );
  }
}

// packages/harness-core/src/trace-adapters/java.ts
function isNativeJavaTraceEvent(event) {
  return event.startsWith("trace:");
}
function stripInlineComments(line, inBlockComment) {
  let result = "";
  let index = 0;
  let inBlock = inBlockComment;
  while (index < line.length) {
    const current = line[index];
    const next = index + 1 < line.length ? line[index + 1] : "";
    if (inBlock) {
      if (current === "*" && next === "/") {
        inBlock = false;
        index += 2;
        continue;
      }
      index += 1;
      continue;
    }
    if (current === "/" && next === "*") {
      inBlock = true;
      index += 2;
      continue;
    }
    if (current === "/" && next === "/") break;
    result += current;
    index += 1;
  }
  return { text: result, inBlockComment: inBlock };
}
function isMethodDeclarationLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("@")) return false;
  if (!trimmed.includes("(") || !trimmed.includes(")")) return false;
  if (trimmed.endsWith(";")) return false;
  if (trimmed.includes("->")) return false;
  if (/^(?:if|for|while|switch|catch|do|try|else|return|throw|new)\b/.test(trimmed)) return false;
  if (!/[A-Za-z_][A-Za-z0-9_]*\s*\([^{};]*\)/.test(trimmed)) return false;
  return /(?:\{\s*)?$/.test(trimmed);
}
function buildLocalDeclarationNamesByLine(sourceText) {
  const namesByLine = /* @__PURE__ */ new Map();
  if (typeof sourceText !== "string" || sourceText.length === 0) return namesByLine;
  const lines = sourceText.split(/\r?\n/);
  let inBlockComment = false;
  for (let index = 0; index < lines.length; index += 1) {
    const { text, inBlockComment: nextInBlockComment } = stripInlineComments(lines[index] ?? "", inBlockComment);
    inBlockComment = nextInBlockComment;
    if (isMethodDeclarationLine(text)) continue;
    const names = [];
    const declarationPattern = /\b(?:final\s+)?(?:[A-Za-z_][A-Za-z0-9_.$]*(?:\s*<[^;=(){}]+>)?(?:\s*\[\])?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g;
    for (const match of text.matchAll(declarationPattern)) {
      if (match[1]) names.push(match[1]);
    }
    if (names.length > 0) namesByLine.set(index + 1, names);
  }
  return namesByLine;
}
function removeSameLineMutationDeclarationSnapshotEvents(events, sourceText) {
  const declarationNamesByLine = buildLocalDeclarationNamesByLine(sourceText);
  if (declarationNamesByLine.size === 0) return events;
  const mutationVariablesByLine = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (event.kind !== "mutate" || typeof event.line !== "number" || !("variable" in event.target)) continue;
    const variables = mutationVariablesByLine.get(event.line) ?? /* @__PURE__ */ new Set();
    variables.add(event.target.variable);
    mutationVariablesByLine.set(event.line, variables);
  }
  if (mutationVariablesByLine.size === 0) return events;
  return events.filter((event) => {
    if (event.kind !== "snapshot" || typeof event.line !== "number" || !("variable" in event.target)) return true;
    const declaredNames = declarationNamesByLine.get(event.line);
    if (!declaredNames?.includes(event.target.variable)) return true;
    const mutationVariables = mutationVariablesByLine.get(event.line);
    return mutationVariables?.has(event.target.variable) === true;
  });
}
function collectJavaLineDeclarationsForHeaderExpansion(line) {
  const names = [];
  const declarationPattern = /\b(?:final\s+)?((?:boolean|byte|char|short|int|long|float|double|String|Object|[A-Za-z_][A-Za-z0-9_<>.?]*(?:\s*<[^,;=(){}:]+>)?)\s*(?:\[\s*\])*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?==)/g;
  const skippedNames = /* @__PURE__ */ new Set(["class", "interface", "enum", "record", "return", "new"]);
  for (const match of line.matchAll(declarationPattern)) {
    const typeSource = match[1] ?? "";
    const name = match[2];
    if (!name || skippedNames.has(name) || name.startsWith("__tracecode")) continue;
    if (typeSource.includes("[")) continue;
    names.push(name);
  }
  return names;
}
function collectJavaControlHeaderDeclarations(line) {
  const forMatch = /\bfor\s*\(\s*(?:final\s+)?(?:[A-Za-z_][A-Za-z0-9_<>.?]*(?:\s*<[^;=(){}:]+>)?|\w+(?:\s*\[\s*\])*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:=|:)/.exec(line);
  return forMatch?.[1] ? [forMatch[1]] : [];
}
function buildJavaControlHeaderInfo(sourceText) {
  if (typeof sourceText !== "string" || sourceText.length === 0) return null;
  const lines = sourceText.split(/\r?\n/);
  const loopBodyLineToHeader = /* @__PURE__ */ new Map();
  const headerLineToExcludedVariables = /* @__PURE__ */ new Map();
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const isLoopHeader = /\b(?:for|while)\s*\(/.test(line);
    const isControlHeader = /\b(?:for|while|if|else\s+if)\s*\(/.test(line);
    if (!isControlHeader || !line.includes("{")) continue;
    for (let bodyIndex = index + 1; bodyIndex < lines.length; bodyIndex += 1) {
      const trimmed = (lines[bodyIndex] ?? "").trim();
      if (trimmed.length === 0) continue;
      if (trimmed.startsWith("}")) break;
      const headerInfo = {
        line: index + 1,
        excludedVariables: new Set(collectJavaLineDeclarationsForHeaderExpansion(lines[bodyIndex] ?? "")),
        headerVariables: new Set(collectJavaControlHeaderDeclarations(line))
      };
      if (isLoopHeader) loopBodyLineToHeader.set(bodyIndex + 1, headerInfo);
      headerLineToExcludedVariables.set(index + 1, headerInfo.excludedVariables);
      break;
    }
  }
  if (loopBodyLineToHeader.size === 0 && headerLineToExcludedVariables.size === 0) return null;
  return { loopBodyLineToHeader, headerLineToExcludedVariables };
}
function eventLine(event) {
  return typeof event.line === "number" && Number.isFinite(event.line) && event.line > 0 ? event.line : null;
}
function eventSnapshotVariable(event) {
  if (event.kind !== "snapshot") return null;
  const target = event.target;
  if (!target || typeof target !== "object" || !("variable" in target)) return null;
  const variable = target.variable;
  return typeof variable === "string" && variable.length > 0 ? variable : null;
}
function cloneRuntimeEventAtLine(event, line) {
  return { ...event, line };
}
function expandJavaLoopHeaderTraceEvents(events, sourceText) {
  if (events.length === 0) return events;
  const controlHeaderInfo = buildJavaControlHeaderInfo(sourceText);
  if (!controlHeaderInfo) return events;
  const { loopBodyLineToHeader, headerLineToExcludedVariables } = controlHeaderInfo;
  const expanded = [];
  const latestSnapshotByVariable = /* @__PURE__ */ new Map();
  let lastLineEventLine = null;
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const line = eventLine(event);
    const snapshotVariable = eventSnapshotVariable(event);
    if (line !== null && snapshotVariable && headerLineToExcludedVariables.get(line)?.has(snapshotVariable)) {
      continue;
    }
    const headerInfo = line === null ? void 0 : loopBodyLineToHeader.get(line);
    const headerLine = headerInfo?.line;
    if (headerInfo && typeof headerLine === "number" && event.kind === "line" && lastLineEventLine !== headerLine) {
      expanded.push(cloneRuntimeEventAtLine(event, headerLine));
      for (const [variable, snapshotEvent] of latestSnapshotByVariable) {
        if (headerInfo.excludedVariables.has(variable)) continue;
        expanded.push(cloneRuntimeEventAtLine(snapshotEvent, headerLine));
      }
      lastLineEventLine = headerLine;
    }
    if (headerInfo && typeof headerLine === "number" && event.kind === "line") {
      for (let lookahead = index + 1; lookahead < events.length; lookahead += 1) {
        if (eventLine(events[lookahead]) !== line) break;
        const variable = eventSnapshotVariable(events[lookahead]);
        if (!variable || !headerInfo.headerVariables.has(variable)) continue;
        expanded.push(cloneRuntimeEventAtLine(events[lookahead], headerLine));
      }
    }
    expanded.push(event);
    if (event.kind === "line") {
      lastLineEventLine = line;
    }
    if (snapshotVariable) {
      latestSnapshotByVariable.set(snapshotVariable, event);
    }
  }
  return expanded;
}
function nativeJavaTraceEventsToTrace(events, sourceText, options = {}) {
  const runId = options.runId ?? "java:run";
  let parsedEvents = events.map((event) => {
    let parsed;
    try {
      parsed = JSON.parse(normalizeJavaNativeTraceJsonPayload(event.slice("trace:".length)));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid Java native runtime trace event: ${message}
${event.slice(0, 500)}`);
    }
    return {
      ...parsed,
      runId,
      ...options.file ? { file: options.file } : {}
    };
  });
  parsedEvents = removeSameLineMutationDeclarationSnapshotEvents(parsedEvents, sourceText);
  parsedEvents = expandJavaLoopHeaderTraceEvents(parsedEvents, sourceText);
  return {
    schemaVersion: RUNTIME_TRACE_SCHEMA_VERSION,
    language: "java",
    runId,
    events: parsedEvents,
    lineEventCount: parsedEvents.filter((event) => event.kind === "line").length,
    traceStepCount: parsedEvents.length
  };
}
function javaTraceHooksEventsToRuntimeTrace(events, sourceText, options = {}) {
  assertSupportedRawEmissions(summarizeJavaRawEmissions(events), "java");
  if (events.length === 0) {
    return {
      schemaVersion: RUNTIME_TRACE_SCHEMA_VERSION,
      language: "java",
      runId: options.runId ?? "java:run",
      events: [],
      lineEventCount: 0,
      traceStepCount: 0
    };
  }
  if (!events.every(isNativeJavaTraceEvent)) {
    throw new Error("Java TraceHooks must emit native runtime trace events. Unsupported line=... events are no longer supported.");
  }
  return nativeJavaTraceEventsToTrace(events, sourceText, options);
}

// packages/harness-browser/src/java-worker-client.ts
var EXECUTION_TIMEOUT_MS2 = 2e4;
var TRACING_TIMEOUT_MS2 = 25e3;
var INIT_TIMEOUT_MS2 = 12e4;
var MESSAGE_TIMEOUT_MS2 = 3e4;
var WORKER_READY_TIMEOUT_MS2 = 1e4;
var JAVA_DEFAULT_FILE = "solution.java";
var JavaWorkerClient = class {
  constructor(options) {
    this.options = options;
    this.debug = options.debug ?? process.env.NODE_ENV === "development";
  }
  worker = null;
  pendingMessages = /* @__PURE__ */ new Map();
  messageId = 0;
  isInitializing = false;
  initPromise = null;
  warmupPromise = null;
  workerReadyPromise = null;
  workerReadyResolve = null;
  workerReadyReject = null;
  debug;
  isSupported() {
    return typeof Worker !== "undefined";
  }
  getWorker() {
    if (this.worker) return this.worker;
    if (!this.isSupported()) {
      throw new Error("Web Workers are not supported in this environment");
    }
    this.workerReadyPromise = new Promise((resolve, reject) => {
      this.workerReadyResolve = resolve;
      this.workerReadyReject = (error) => reject(error);
    });
    const workerUrl = this.debug && !this.options.workerUrl.includes("?") ? `${this.options.workerUrl}?dev=${Date.now()}` : this.options.workerUrl;
    this.worker = new Worker(workerUrl);
    this.worker.onmessage = (event) => {
      const { id, type, payload } = event.data;
      if (type === "worker-ready") {
        this.workerReadyResolve?.();
        this.workerReadyResolve = null;
        this.workerReadyReject = null;
        logRuntimeDiagnostic("info", {
          component: "JavaWorkerClient",
          runtime: "java",
          phase: "worker-ready",
          message: "Java worker is ready."
        }, { enabled: this.debug });
        return;
      }
      if (type === "idle-timeout") {
        logRuntimeDiagnostic("info", {
          component: "JavaWorkerClient",
          runtime: "java",
          phase: "idle-timeout",
          message: "Java worker closed after idle timeout."
        }, { enabled: this.debug });
        this.terminateAndReset(new Error("Java worker closed after idle timeout"));
        return;
      }
      if (!id) return;
      const pending = this.pendingMessages.get(id);
      if (!pending) return;
      this.pendingMessages.delete(id);
      if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
      if (type === "error") {
        pending.reject(new Error(payload.error));
        return;
      }
      pending.resolve(payload);
    };
    this.worker.onerror = (error) => {
      logRuntimeDiagnostic("error", {
        component: "JavaWorkerClient",
        runtime: "java",
        phase: "worker-error",
        message: "Java worker emitted an error event.",
        detail: {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno
        }
      });
      const workerError = new Error(error.message || "Java worker error");
      this.workerReadyReject?.(workerError);
      this.workerReadyResolve = null;
      this.workerReadyReject = null;
      for (const [, pending] of this.pendingMessages) {
        if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
        pending.reject(workerError);
      }
      this.pendingMessages.clear();
      this.terminateAndReset(workerError);
    };
    return this.worker;
  }
  async waitForWorkerReady() {
    const readyPromise = this.workerReadyPromise;
    if (!readyPromise) return;
    await new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        const timeoutError = new Error(
          `Java worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS2 / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "JavaWorkerClient",
          runtime: "java",
          phase: "worker-ready-timeout",
          message: "Java worker did not send worker-ready before the timeout.",
          detail: { timeoutMs: WORKER_READY_TIMEOUT_MS2 }
        }, { enabled: this.debug });
        this.terminateAndReset(timeoutError);
        reject(timeoutError);
      }, WORKER_READY_TIMEOUT_MS2);
      readyPromise.then(() => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve();
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }
  async sendMessage(type, payload, timeoutMs = MESSAGE_TIMEOUT_MS2) {
    const worker = this.getWorker();
    await this.waitForWorkerReady();
    const id = String(++this.messageId);
    return new Promise((resolve, reject) => {
      this.pendingMessages.set(id, {
        resolve,
        reject
      });
      const timeoutId = globalThis.setTimeout(() => {
        const pending2 = this.pendingMessages.get(id);
        if (!pending2) return;
        this.pendingMessages.delete(id);
        logRuntimeDiagnostic("warn", {
          component: "JavaWorkerClient",
          runtime: "java",
          phase: "worker-request-timeout",
          message: "Java worker request timed out.",
          detail: { id, type, timeoutMs }
        }, { enabled: this.debug });
        pending2.reject(new Error(`Worker request timed out: ${type}`));
      }, timeoutMs);
      const pending = this.pendingMessages.get(id);
      if (pending) pending.timeoutId = timeoutId;
      worker.postMessage({ id, type, payload });
    });
  }
  async executeWithTimeout(executor, timeoutMs) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        logRuntimeDiagnostic("warn", {
          component: "JavaWorkerClient",
          runtime: "java",
          phase: "execution-timeout",
          message: "Java execution timed out; terminating worker.",
          detail: { timeoutMs }
        }, { enabled: this.debug });
        this.terminateAndReset();
        reject(
          new Error(
            `Java execution timed out after ${Math.round(timeoutMs / 1e3)} seconds.`
          )
        );
      }, timeoutMs);
      executor().then((result) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve(result);
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error);
      });
    });
  }
  terminateAndReset(reason = new Error("Worker was terminated")) {
    this.workerReadyReject?.(reason);
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.initPromise = null;
    this.warmupPromise = null;
    this.isInitializing = false;
    this.workerReadyPromise = null;
    this.workerReadyResolve = null;
    this.workerReadyReject = null;
    for (const [, pending] of this.pendingMessages) {
      if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
      pending.reject(reason);
    }
    this.pendingMessages.clear();
  }
  async init() {
    if (this.initPromise) return this.initPromise;
    if (this.isInitializing) {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
      return this.init();
    }
    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        return await this.sendMessage("init", this.workerOptionsPayload(), INIT_TIMEOUT_MS2);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const shouldRetry = message.includes("Worker request timed out: init") || message.includes("Worker was terminated") || message.includes("Java worker error") || message.includes("failed to initialize in time");
        if (!shouldRetry) {
          throw error;
        }
        logRuntimeDiagnostic("warn", {
          component: "JavaWorkerClient",
          runtime: "java",
          phase: "init-retry",
          message: "Java worker init failed; resetting worker and retrying once.",
          detail: { message }
        }, { enabled: this.debug });
        this.terminateAndReset(error instanceof Error ? error : new Error(message));
        return this.sendMessage("init", this.workerOptionsPayload(), INIT_TIMEOUT_MS2);
      }
    })();
    try {
      return await this.initPromise;
    } catch (error) {
      this.initPromise = null;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }
  workerOptionsPayload() {
    return this.options.workerIdleTimeoutMs === void 0 ? {} : { idleTimeoutMs: this.options.workerIdleTimeoutMs };
  }
  async warmup() {
    if (this.warmupPromise) return this.warmupPromise;
    this.warmupPromise = (async () => {
      try {
        await this.init();
        return await this.sendMessage(
          "warmup",
          this.workerOptionsPayload(),
          INIT_TIMEOUT_MS2
        );
      } catch (error) {
        this.warmupPromise = null;
        throw error;
      }
    })();
    return this.warmupPromise;
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle) {
    await this.init();
    const result = await this.executeWithTimeout(
      () => this.sendMessage(
        "execute-with-tracing",
        { code, functionName, inputs, options, executionStyle },
        TRACING_TIMEOUT_MS2 + 5e3
      ),
      TRACING_TIMEOUT_MS2
    );
    return {
      ...result,
      trace: result.success ? javaTraceHooksEventsToRuntimeTrace(result.events, result.sourceText, {
        runId: "java:run",
        file: JAVA_DEFAULT_FILE
      }) : createEmptyRuntimeTrace("java", { runId: "java:run", file: JAVA_DEFAULT_FILE })
    };
  }
  async executeCode(code, functionName, inputs, options, executionStyle) {
    return this.executeCodeMessage("execute-code", code, functionName, inputs, options, executionStyle);
  }
  async executeCodeMessage(type, code, functionName, inputs, options, executionStyle) {
    await this.init();
    const result = await this.executeWithTimeout(
      () => this.sendMessage(
        type,
        { code, functionName, inputs, options, executionStyle },
        EXECUTION_TIMEOUT_MS2 + 5e3
      ),
      EXECUTION_TIMEOUT_MS2
    );
    if (!result.success) {
      return {
        success: false,
        output: null,
        error: result.error ?? "Java execution failed",
        ...result.errorLine !== void 0 ? { errorLine: result.errorLine } : {},
        consoleOutput: result.consoleOutput ?? [],
        timings: result.timings
      };
    }
    return {
      success: true,
      output: result.output,
      consoleOutput: result.consoleOutput ?? [],
      timings: result.timings
    };
  }
  async executeCodeInterviewMode(code, functionName, inputs, options, executionStyle) {
    return this.executeCodeMessage("execute-code-interview", code, functionName, inputs, options, executionStyle);
  }
  terminate() {
    this.terminateAndReset();
  }
};

// packages/harness-browser/src/java-runtime-client.ts
var JAVA_DEFAULT_FILE2 = "solution.java";
var JavaRuntimeClient = class {
  constructor(workerClient) {
    this.workerClient = workerClient;
  }
  async init() {
    return this.workerClient.init();
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("java"), {
      request: "trace",
      executionStyle,
      functionName
    });
    const rawResult = await this.workerClient.executeWithTracing(
      code,
      functionName ?? "",
      inputs,
      options,
      executionStyle
    );
    if (!rawResult.success) {
      return {
        success: false,
        error: rawResult.error ?? "Java tracing failed",
        ...rawResult.errorLine !== void 0 ? { errorLine: rawResult.errorLine } : {},
        trace: createEmptyRuntimeTrace("java", { runId: "java:run", file: JAVA_DEFAULT_FILE2 }),
        executionTimeMs: rawResult.executionTimeMs,
        consoleOutput: rawResult.consoleOutput,
        ...rawResult.traceLimitExceeded !== void 0 ? { traceLimitExceeded: rawResult.traceLimitExceeded } : {},
        ...rawResult.timeoutReason ? { timeoutReason: rawResult.timeoutReason } : {},
        lineEventCount: 0,
        traceStepCount: 0,
        timings: rawResult.timings
      };
    }
    return {
      success: true,
      output: rawResult.output,
      trace: rawResult.trace,
      consoleOutput: rawResult.consoleOutput,
      executionTimeMs: rawResult.executionTimeMs,
      ...rawResult.traceLimitExceeded !== void 0 ? { traceLimitExceeded: rawResult.traceLimitExceeded } : {},
      ...rawResult.timeoutReason ? { timeoutReason: rawResult.timeoutReason } : {},
      lineEventCount: rawResult.trace.lineEventCount,
      traceStepCount: rawResult.trace.traceStepCount,
      timings: rawResult.timings
    };
  }
  async executeCode(code, functionName, inputs, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("java"), {
      request: "execute",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCode(
      code,
      functionName,
      inputs,
      void 0,
      executionStyle
    );
  }
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("java"), {
      request: "interview",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCodeInterviewMode(
      code,
      functionName,
      inputs,
      void 0,
      executionStyle
    );
  }
};
function createJavaRuntimeClient(workerClient) {
  return new JavaRuntimeClient(workerClient);
}

// packages/harness-browser/src/csharp-worker-client.ts
var EXECUTION_TIMEOUT_MS3 = 2e4;
var TRACING_TIMEOUT_MS3 = 2e4;
var INTERVIEW_MODE_TIMEOUT_MS2 = 5e3;
var INIT_TIMEOUT_MS3 = 45e3;
var MESSAGE_TIMEOUT_MS3 = 3e4;
var WORKER_READY_TIMEOUT_MS3 = 1e4;
var CSHARP_DEFAULT_FILE = "solution.cs";
var CSHARP_LEGACY_USER_FILE = "UserCode.cs";
function isCSharpUserFile(file) {
  return Boolean(file?.endsWith(CSHARP_DEFAULT_FILE) || file?.endsWith(CSHARP_LEGACY_USER_FILE));
}
function isCSharpUserDiagnostic(diagnostic) {
  return isCSharpUserFile(diagnostic.file);
}
function normalizeCSharpTraceEventFile(event) {
  return isCSharpUserFile(event.file) ? { ...event, file: CSHARP_DEFAULT_FILE } : event;
}
var CSharpWorkerClient = class {
  constructor(options) {
    this.options = options;
    this.debug = options.debug ?? process.env.NODE_ENV === "development";
    this.initTimeoutMs = options.initTimeoutMs ?? INIT_TIMEOUT_MS3;
    this.executionTimeoutMs = options.executionTimeoutMs ?? EXECUTION_TIMEOUT_MS3;
    this.tracingTimeoutMs = options.tracingTimeoutMs ?? TRACING_TIMEOUT_MS3;
    this.interviewTimeoutMs = options.interviewTimeoutMs ?? INTERVIEW_MODE_TIMEOUT_MS2;
  }
  worker = null;
  pendingMessages = /* @__PURE__ */ new Map();
  messageId = 0;
  isInitializing = false;
  initPromise = null;
  warmupPromise = null;
  workerReadyPromise = null;
  workerReadyResolve = null;
  workerReadyReject = null;
  debug;
  initTimeoutMs;
  executionTimeoutMs;
  tracingTimeoutMs;
  interviewTimeoutMs;
  isSupported() {
    return typeof Worker !== "undefined";
  }
  getWorker() {
    if (this.worker) return this.worker;
    if (!this.isSupported()) {
      throw new Error("Web Workers are not supported in this environment");
    }
    this.workerReadyPromise = new Promise((resolve, reject) => {
      this.workerReadyResolve = resolve;
      this.workerReadyReject = (error) => reject(error);
    });
    const workerUrl = this.debug && !this.options.workerUrl.includes("?") ? `${this.options.workerUrl}?dev=${Date.now()}` : this.options.workerUrl;
    this.worker = new Worker(workerUrl, { type: "module" });
    this.worker.onmessage = (event) => {
      const { id, type, payload } = event.data;
      if (type === "worker-ready") {
        this.workerReadyResolve?.();
        this.workerReadyResolve = null;
        this.workerReadyReject = null;
        logRuntimeDiagnostic("info", {
          component: "CSharpWorkerClient",
          runtime: "csharp",
          phase: "worker-ready",
          message: "C# worker is ready."
        }, { enabled: this.debug });
        return;
      }
      if (type === "idle-timeout") {
        logRuntimeDiagnostic("info", {
          component: "CSharpWorkerClient",
          runtime: "csharp",
          phase: "idle-timeout",
          message: "C# worker closed after idle timeout."
        }, { enabled: this.debug });
        this.terminateAndReset(new Error("C# worker closed after idle timeout"));
        return;
      }
      if (!id) return;
      const pending = this.pendingMessages.get(id);
      if (!pending) return;
      this.pendingMessages.delete(id);
      if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
      if (type === "error") {
        pending.reject(new Error(payload.error));
        return;
      }
      pending.resolve(payload);
    };
    this.worker.onerror = (error) => {
      logRuntimeDiagnostic("error", {
        component: "CSharpWorkerClient",
        runtime: "csharp",
        phase: "worker-error",
        message: "C# worker emitted an error event.",
        detail: {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno
        }
      });
      const workerError = new Error(error.message || "C# worker error");
      this.workerReadyReject?.(workerError);
      this.workerReadyResolve = null;
      this.workerReadyReject = null;
      for (const [, pending] of this.pendingMessages) {
        if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
        pending.reject(workerError);
      }
      this.pendingMessages.clear();
      this.terminateAndReset(workerError);
    };
    return this.worker;
  }
  async waitForWorkerReady() {
    const readyPromise = this.workerReadyPromise;
    if (!readyPromise) return;
    await new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        const timeoutError = new Error(
          `C# worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS3 / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "CSharpWorkerClient",
          runtime: "csharp",
          phase: "worker-ready-timeout",
          message: "C# worker did not send worker-ready before the timeout.",
          detail: { timeoutMs: WORKER_READY_TIMEOUT_MS3 }
        }, { enabled: this.debug });
        this.terminateAndReset(timeoutError);
        reject(timeoutError);
      }, WORKER_READY_TIMEOUT_MS3);
      readyPromise.then(() => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve();
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }
  async sendMessage(type, payload, timeoutMs = MESSAGE_TIMEOUT_MS3) {
    const worker = this.getWorker();
    await this.waitForWorkerReady();
    const id = String(++this.messageId);
    return new Promise((resolve, reject) => {
      this.pendingMessages.set(id, {
        resolve,
        reject
      });
      const timeoutId = globalThis.setTimeout(() => {
        const pending2 = this.pendingMessages.get(id);
        if (!pending2) return;
        this.pendingMessages.delete(id);
        logRuntimeDiagnostic("warn", {
          component: "CSharpWorkerClient",
          runtime: "csharp",
          phase: "worker-request-timeout",
          message: "C# worker request timed out.",
          detail: { id, type, timeoutMs }
        }, { enabled: this.debug });
        pending2.reject(new Error(`Worker request timed out: ${type}`));
      }, timeoutMs);
      const pending = this.pendingMessages.get(id);
      if (pending) pending.timeoutId = timeoutId;
      worker.postMessage({ id, type, payload });
    });
  }
  async executeWithTimeout(executor, timeoutMs) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        logRuntimeDiagnostic("warn", {
          component: "CSharpWorkerClient",
          runtime: "csharp",
          phase: "execution-timeout",
          message: "C# execution timed out; terminating worker.",
          detail: { timeoutMs }
        }, { enabled: this.debug });
        this.terminateAndReset();
        reject(new Error(`C# execution timed out after ${Math.round(timeoutMs / 1e3)} seconds.`));
      }, timeoutMs);
      executor().then((result) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve(result);
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error);
      });
    });
  }
  terminateAndReset(reason = new Error("Worker was terminated")) {
    this.workerReadyReject?.(reason);
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.initPromise = null;
    this.warmupPromise = null;
    this.isInitializing = false;
    this.workerReadyPromise = null;
    this.workerReadyResolve = null;
    this.workerReadyReject = null;
    for (const [, pending] of this.pendingMessages) {
      if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
      pending.reject(reason);
    }
    this.pendingMessages.clear();
  }
  shouldRetryInit(error) {
    const message = error instanceof Error ? error.message : String(error);
    return message.includes("timed out") || message.includes("Worker request timed out") || message.includes("worker error") || message.includes("Failed to fetch") || message.includes("was terminated") || message.includes("closed after idle timeout");
  }
  sendInitMessage() {
    return this.sendMessage(
      "init",
      { assetBaseUrl: this.options.assetBaseUrl, ...this.workerOptionsPayload() },
      this.initTimeoutMs
    );
  }
  workerOptionsPayload() {
    return this.options.workerIdleTimeoutMs === void 0 ? {} : { idleTimeoutMs: this.options.workerIdleTimeoutMs };
  }
  async init() {
    if (this.initPromise) return this.initPromise;
    if (this.isInitializing) {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
      return this.init();
    }
    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        return await this.sendInitMessage();
      } catch (error) {
        if (!this.shouldRetryInit(error)) throw error;
        this.terminateAndReset(error instanceof Error ? error : new Error(String(error)));
        return this.sendInitMessage();
      }
    })();
    try {
      return await this.initPromise;
    } catch (error) {
      this.initPromise = null;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }
  async warmup() {
    if (this.warmupPromise) return this.warmupPromise;
    this.warmupPromise = (async () => {
      try {
        await this.init();
        return await this.sendMessage(
          "warmup",
          { assetBaseUrl: this.options.assetBaseUrl, ...this.workerOptionsPayload() },
          this.initTimeoutMs
        );
      } catch (error) {
        this.warmupPromise = null;
        throw error;
      }
    })();
    return this.warmupPromise;
  }
  async executeCode(code, functionName, inputs, executionStyle) {
    await this.init();
    const result = await this.executeWithTimeout(
      () => this.sendMessage(
        "execute-code",
        {
          code,
          functionName,
          inputs,
          executionStyle,
          assetBaseUrl: this.options.assetBaseUrl,
          timeoutMs: Math.max(100, this.executionTimeoutMs - 1e3),
          ...this.workerOptionsPayload()
        },
        this.executionTimeoutMs + 5e3
      ),
      this.executionTimeoutMs
    );
    if (!result.success) {
      const firstUserDiagnostic = result.diagnostics?.find(isCSharpUserDiagnostic);
      return {
        success: false,
        output: null,
        error: result.error ?? "C# execution failed",
        ...firstUserDiagnostic ? { errorLine: firstUserDiagnostic.line } : {},
        consoleOutput: result.consoleOutput ?? [],
        timings: result.timings
      };
    }
    return {
      success: true,
      output: result.output,
      consoleOutput: result.consoleOutput ?? [],
      timings: result.timings
    };
  }
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle) {
    await this.init();
    let result;
    try {
      result = await this.executeWithTimeout(
        () => this.sendMessage(
          "execute-code-interview",
          {
            code,
            functionName,
            inputs,
            executionStyle,
            assetBaseUrl: this.options.assetBaseUrl,
            timeoutMs: Math.max(100, this.interviewTimeoutMs - 1e3),
            ...this.workerOptionsPayload()
          },
          this.interviewTimeoutMs + 5e3
        ),
        this.interviewTimeoutMs
      );
    } catch {
      return {
        success: false,
        output: null,
        error: "Time Limit Exceeded",
        timeoutReason: "client-timeout",
        diagnosticStage: "interview",
        consoleOutput: [],
        timings: { totalMs: this.interviewTimeoutMs }
      };
    }
    if (!result.success) {
      const firstUserDiagnostic = result.diagnostics?.find(isCSharpUserDiagnostic);
      if (this.isInterviewTimeoutLike(result)) {
        return {
          success: false,
          output: null,
          error: "Time Limit Exceeded",
          timeoutReason: result.timeoutReason ?? "client-timeout",
          diagnosticStage: "interview",
          consoleOutput: result.consoleOutput ?? [],
          timings: result.timings
        };
      }
      return {
        success: false,
        output: null,
        error: result.error ?? "C# execution failed",
        ...firstUserDiagnostic ? { errorLine: firstUserDiagnostic.line } : {},
        consoleOutput: result.consoleOutput ?? [],
        timings: result.timings
      };
    }
    return {
      success: true,
      output: result.output,
      consoleOutput: result.consoleOutput ?? [],
      timings: result.timings
    };
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle) {
    await this.init();
    let result;
    try {
      result = await this.executeWithTimeout(
        () => this.sendMessage(
          "execute-with-tracing",
          {
            code,
            functionName,
            inputs,
            executionStyle,
            assetBaseUrl: this.options.assetBaseUrl,
            timeoutMs: Math.max(100, this.tracingTimeoutMs - 1e3),
            maxTraceSteps: options?.maxTraceSteps,
            maxLineEvents: options?.maxLineEvents,
            maxSingleLineHits: options?.maxSingleLineHits,
            maxStoredEvents: options?.maxStoredEvents,
            minimalTrace: options?.minimalTrace,
            ...this.workerOptionsPayload()
          },
          this.tracingTimeoutMs + 5e3
        ),
        this.tracingTimeoutMs
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const trace2 = this.createTrace([
        {
          kind: "timeout",
          runId: "csharp:run",
          file: CSHARP_DEFAULT_FILE,
          message
        }
      ]);
      return {
        success: false,
        output: null,
        error: message,
        trace: trace2,
        executionTimeMs: this.tracingTimeoutMs,
        consoleOutput: [],
        traceLimitExceeded: true,
        timeoutReason: "client-timeout",
        lineEventCount: trace2.lineEventCount,
        traceStepCount: trace2.traceStepCount,
        timings: { totalMs: this.tracingTimeoutMs }
      };
    }
    const consoleOutput = result.consoleOutput ?? [];
    const events = [
      ...result.events ?? [],
      ...consoleOutput.map((text) => ({
        kind: "stdout",
        runId: "csharp:run",
        file: CSHARP_DEFAULT_FILE,
        text
      }))
    ];
    const trace = this.createTrace(events);
    if (!result.success) {
      const firstUserDiagnostic = result.diagnostics?.find(isCSharpUserDiagnostic);
      return {
        success: false,
        output: null,
        error: result.error ?? "C# execution failed",
        ...firstUserDiagnostic ? { errorLine: firstUserDiagnostic.line } : {},
        trace,
        executionTimeMs: result.executionTimeMs ?? 0,
        consoleOutput,
        ...result.traceLimitExceeded !== void 0 ? { traceLimitExceeded: result.traceLimitExceeded } : {},
        ...result.timeoutReason ? { timeoutReason: result.timeoutReason } : {},
        lineEventCount: trace.lineEventCount,
        traceStepCount: trace.traceStepCount,
        timings: result.timings
      };
    }
    return {
      success: true,
      output: result.output,
      trace,
      executionTimeMs: result.executionTimeMs ?? 0,
      consoleOutput,
      ...result.traceLimitExceeded !== void 0 ? { traceLimitExceeded: result.traceLimitExceeded } : {},
      ...result.timeoutReason ? { timeoutReason: result.timeoutReason } : {},
      lineEventCount: trace.lineEventCount,
      traceStepCount: trace.traceStepCount,
      timings: result.timings
    };
  }
  createTrace(events) {
    return {
      schemaVersion: RUNTIME_TRACE_SCHEMA_VERSION,
      language: "csharp",
      runId: "csharp:run",
      events: events.map(normalizeCSharpTraceEventFile),
      lineEventCount: events.filter((event) => event.kind === "line").length,
      traceStepCount: events.length
    };
  }
  isInterviewTimeoutLike(result) {
    if (result.timeoutReason) return true;
    const normalized = String(result.error ?? "").toLowerCase();
    return normalized.includes("timed out") || normalized.includes("trace-limit") || normalized.includes("line-limit") || normalized.includes("single-line-limit") || normalized.includes("recursion-limit") || normalized.includes("memory-limit");
  }
  terminate() {
    this.terminateAndReset();
  }
};

// packages/harness-browser/src/csharp-runtime-client.ts
var CSharpRuntimeClient = class {
  constructor(workerClient) {
    this.workerClient = workerClient;
  }
  async init() {
    return this.workerClient.init();
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle = "solution-method") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("csharp"), {
      request: "trace",
      executionStyle,
      functionName
    });
    return this.workerClient.executeWithTracing(
      code,
      functionName ?? "",
      inputs,
      options,
      executionStyle
    );
  }
  async executeCode(code, functionName, inputs, executionStyle = "solution-method") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("csharp"), {
      request: "execute",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCode(
      code,
      functionName,
      inputs,
      executionStyle
    );
  }
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle = "solution-method") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("csharp"), {
      request: "interview",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCodeInterviewMode(
      code,
      functionName,
      inputs,
      executionStyle
    );
  }
};
function createCSharpRuntimeClient(workerClient) {
  return new CSharpRuntimeClient(workerClient);
}

// packages/harness-browser/src/cpp-worker-client.ts
var CppClientTimeoutError = class extends Error {
  constructor(message, stage, timeoutMs) {
    super(message);
    this.stage = stage;
    this.timeoutMs = timeoutMs;
    this.name = "CppClientTimeoutError";
  }
};
var INIT_TIMEOUT_MS4 = 12e4;
var EXECUTION_TIMEOUT_MS4 = 6e4;
var TRACING_TIMEOUT_MS4 = 6e4;
var INTERVIEW_MODE_TIMEOUT_MS3 = 3e4;
var MESSAGE_TIMEOUT_MS4 = 3e4;
var WORKER_READY_TIMEOUT_MS4 = 1e4;
var CPP_DEFAULT_FILE = "solution.cpp";
var CppWorkerClient = class {
  constructor(options) {
    this.options = options;
    this.debug = options.debug ?? process.env.NODE_ENV === "development";
    this.initTimeoutMs = options.initTimeoutMs ?? INIT_TIMEOUT_MS4;
    this.executionTimeoutMs = options.executionTimeoutMs ?? EXECUTION_TIMEOUT_MS4;
    this.tracingTimeoutMs = options.tracingTimeoutMs ?? TRACING_TIMEOUT_MS4;
    this.interviewTimeoutMs = options.interviewTimeoutMs ?? INTERVIEW_MODE_TIMEOUT_MS3;
    this.compilerFrameUrl = options.compilerFrameUrl;
  }
  worker = null;
  pendingMessages = /* @__PURE__ */ new Map();
  messageId = 0;
  initPromise = null;
  warmupPromise = null;
  workerReadyPromise = null;
  workerReadyResolve = null;
  workerReadyReject = null;
  debug;
  initTimeoutMs;
  executionTimeoutMs;
  tracingTimeoutMs;
  interviewTimeoutMs;
  compilerFrameUrl;
  activeCompilerFrames = /* @__PURE__ */ new Set();
  compilerFrame = null;
  compilerFrameReadyPromise = null;
  compilerFrameReadyResolve = null;
  compilerFrameReadyReject = null;
  compilerFrameTargetOrigin = "";
  compilerFrameRequestId = 0;
  compilerFrameMessageHandler = null;
  pendingCompilerFrameRequests = /* @__PURE__ */ new Map();
  isSupported() {
    return typeof Worker !== "undefined";
  }
  getWorker() {
    if (this.worker) return this.worker;
    if (!this.isSupported()) {
      throw new Error("Web Workers are not supported in this environment");
    }
    this.workerReadyPromise = new Promise((resolve, reject) => {
      this.workerReadyResolve = resolve;
      this.workerReadyReject = (error) => reject(error);
    });
    const workerUrl = this.debug && !this.options.workerUrl.includes("?") ? `${this.options.workerUrl}?dev=${Date.now()}` : this.options.workerUrl;
    this.worker = new Worker(workerUrl, { type: "module" });
    this.worker.onmessage = (event) => {
      const { id, type, payload } = event.data;
      if (type === "worker-ready") {
        this.workerReadyResolve?.();
        this.workerReadyResolve = null;
        this.workerReadyReject = null;
        logRuntimeDiagnostic("info", {
          component: "CppWorkerClient",
          runtime: "cpp",
          phase: "worker-ready",
          message: "C++ worker is ready."
        }, { enabled: this.debug });
        return;
      }
      if (type === "idle-timeout") {
        logRuntimeDiagnostic("info", {
          component: "CppWorkerClient",
          runtime: "cpp",
          phase: "idle-timeout",
          message: "C++ worker closed after idle timeout."
        }, { enabled: this.debug });
        this.terminateAndReset(new Error("C++ worker closed after idle timeout"));
        return;
      }
      if (type === "compile-request") {
        this.handleCompileRequest(event.data).catch((error) => {
          if (!event.data.requestId) return;
          this.worker?.postMessage({
            type: "compile-response",
            requestId: event.data.requestId,
            payload: { success: false, error: error instanceof Error ? error.message : String(error) }
          });
        });
        return;
      }
      if (!id) return;
      const pending = this.pendingMessages.get(id);
      if (!pending) return;
      this.pendingMessages.delete(id);
      if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
      if (type === "error") {
        pending.reject(new Error(payload.error));
        return;
      }
      pending.resolve(payload);
    };
    this.worker.onerror = (error) => {
      logRuntimeDiagnostic("error", {
        component: "CppWorkerClient",
        runtime: "cpp",
        phase: "worker-error",
        message: "C++ worker emitted an error event.",
        detail: {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno
        }
      });
      const workerError = new Error(error.message || "C++ worker error");
      this.workerReadyReject?.(workerError);
      this.workerReadyResolve = null;
      this.workerReadyReject = null;
      this.terminateAndReset(workerError);
    };
    return this.worker;
  }
  async waitForWorkerReady() {
    const readyPromise = this.workerReadyPromise;
    if (!readyPromise) return;
    await new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        const timeoutError = new Error(
          `C++ worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS4 / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "CppWorkerClient",
          runtime: "cpp",
          phase: "worker-ready-timeout",
          message: "C++ worker did not send worker-ready before the timeout.",
          detail: { timeoutMs: WORKER_READY_TIMEOUT_MS4 }
        }, { enabled: this.debug });
        this.terminateAndReset(timeoutError);
        reject(timeoutError);
      }, WORKER_READY_TIMEOUT_MS4);
      readyPromise.then(() => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve();
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }
  async sendMessage(type, payload, timeoutMs = MESSAGE_TIMEOUT_MS4) {
    const worker = this.getWorker();
    await this.waitForWorkerReady();
    const id = String(++this.messageId);
    return new Promise((resolve, reject) => {
      this.pendingMessages.set(id, {
        resolve,
        reject
      });
      const timeoutId = globalThis.setTimeout(() => {
        const pending2 = this.pendingMessages.get(id);
        if (!pending2) return;
        this.pendingMessages.delete(id);
        logRuntimeDiagnostic("warn", {
          component: "CppWorkerClient",
          runtime: "cpp",
          phase: "worker-request-timeout",
          message: "C++ worker request timed out.",
          detail: { id, type, timeoutMs }
        }, { enabled: this.debug });
        pending2.reject(new Error(`Worker request timed out: ${type}`));
      }, timeoutMs);
      const pending = this.pendingMessages.get(id);
      if (pending) pending.timeoutId = timeoutId;
      worker.postMessage({ id, type, payload });
    });
  }
  async executeWithTimeout(executor, timeoutMs, stage) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        const timeoutLabel = stage === "trace" ? "tracing" : stage === "interview" ? "interview execution" : "compile/run";
        const timeoutError = new CppClientTimeoutError(
          `C++ ${timeoutLabel} timed out after ${Math.round(timeoutMs / 1e3)} seconds.`,
          stage,
          timeoutMs
        );
        logRuntimeDiagnostic("warn", {
          component: "CppWorkerClient",
          runtime: "cpp",
          phase: "execution-timeout",
          message: "C++ execution timed out; terminating worker.",
          detail: { timeoutMs, stage }
        }, { enabled: this.debug });
        this.terminateAndReset(timeoutError);
        reject(timeoutError);
      }, timeoutMs);
      executor().then((result) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve(result);
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error);
      });
    });
  }
  isClientTimeout(error) {
    return error instanceof CppClientTimeoutError || error instanceof Error && error.message.includes("C++") && error.message.includes("timed out");
  }
  timeoutCodeResult(error) {
    const timeoutError = error instanceof CppClientTimeoutError ? error : null;
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : String(error),
      consoleOutput: [],
      timeoutReason: "client-timeout",
      diagnosticStage: timeoutError?.stage === "interview" ? "interview" : "runtime",
      timings: { totalMs: timeoutError?.timeoutMs ?? this.executionTimeoutMs }
    };
  }
  timeoutTraceResult(error) {
    const timeoutError = error instanceof CppClientTimeoutError ? error : null;
    const trace = createEmptyRuntimeTrace("cpp", { runId: "cpp:run", file: CPP_DEFAULT_FILE });
    trace.events = [
      {
        kind: "timeout",
        runId: "cpp:run",
        file: CPP_DEFAULT_FILE,
        message: error instanceof Error ? error.message : String(error)
      }
    ];
    trace.traceStepCount = 1;
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : String(error),
      trace,
      executionTimeMs: timeoutError?.timeoutMs ?? this.tracingTimeoutMs,
      consoleOutput: [],
      traceLimitExceeded: true,
      timeoutReason: "client-timeout",
      lineEventCount: 0,
      traceStepCount: 1,
      timings: { totalMs: timeoutError?.timeoutMs ?? this.tracingTimeoutMs }
    };
  }
  terminateAndReset(reason = new Error("Worker was terminated")) {
    this.workerReadyReject?.(reason);
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.initPromise = null;
    this.warmupPromise = null;
    this.workerReadyPromise = null;
    this.workerReadyResolve = null;
    this.workerReadyReject = null;
    for (const [, pending] of this.pendingMessages) {
      if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
      pending.reject(reason);
    }
    this.pendingMessages.clear();
    this.clearCompilerFrames();
  }
  shouldRetryInit(error) {
    const message = error instanceof Error ? error.message : String(error);
    return message.includes("timed out") || message.includes("Worker request timed out") || message.includes("worker error") || message.includes("Failed to fetch") || message.includes("was terminated") || message.includes("closed after idle timeout");
  }
  sendInitMessage() {
    return this.sendMessage(
      "init",
      {
        assets: {
          clangWasmUrl: this.options.clangWasmUrl,
          lldWasmUrl: this.options.lldWasmUrl,
          sysrootUrl: this.options.sysrootUrl,
          runtimeHeaderUrl: this.options.runtimeHeaderUrl,
          compilerBundleUrl: this.options.compilerBundleUrl,
          compilerFrameEnabled: Boolean(this.compilerFrameUrl && typeof document !== "undefined"),
          compilerFrameUrl: this.compilerFrameUrl,
          compilerWorkerUrl: this.options.compilerWorkerUrl
        },
        ...this.workerOptionsPayload()
      },
      this.initTimeoutMs
    );
  }
  async init() {
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      try {
        return await this.sendInitMessage();
      } catch (error) {
        if (!this.shouldRetryInit(error)) throw error;
        this.terminateAndReset(error instanceof Error ? error : new Error(String(error)));
        return this.sendInitMessage();
      }
    })();
    try {
      return await this.initPromise;
    } catch (error) {
      this.initPromise = null;
      throw error;
    }
  }
  workerOptionsPayload() {
    return this.options.workerIdleTimeoutMs === void 0 ? {} : { idleTimeoutMs: this.options.workerIdleTimeoutMs };
  }
  async warmup() {
    if (this.warmupPromise) return this.warmupPromise;
    this.warmupPromise = (async () => {
      try {
        await this.init();
        return await this.sendMessage("warmup", this.workerOptionsPayload(), this.initTimeoutMs);
      } catch (error) {
        this.warmupPromise = null;
        throw error;
      }
    })();
    return this.warmupPromise;
  }
  clearCompilerFrames(reason = new Error("C++ compiler frame was closed")) {
    this.compilerFrameReadyReject?.(reason);
    this.compilerFrameReadyPromise = null;
    this.compilerFrameReadyResolve = null;
    this.compilerFrameReadyReject = null;
    if (this.compilerFrameMessageHandler) {
      globalThis.removeEventListener("message", this.compilerFrameMessageHandler);
      this.compilerFrameMessageHandler = null;
    }
    for (const [, pending] of this.pendingCompilerFrameRequests) {
      globalThis.clearTimeout(pending.timeoutId);
      pending.resolve({ success: false, error: reason.message });
    }
    this.pendingCompilerFrameRequests.clear();
    this.compilerFrame = null;
    this.compilerFrameTargetOrigin = "";
    for (const frame of this.activeCompilerFrames) {
      frame.remove();
    }
    this.activeCompilerFrames.clear();
  }
  async handleCompileRequest(message) {
    if (!message.requestId) return;
    const worker = this.worker;
    if (!worker) return;
    const result = await this.compileInFrame(message.payload);
    const transfer = result?.programBuffer instanceof ArrayBuffer ? [result.programBuffer] : [];
    worker.postMessage(
      {
        type: "compile-response",
        requestId: message.requestId,
        payload: result
      },
      transfer
    );
  }
  ensureCompilerFrame() {
    if (!this.compilerFrameUrl || typeof document === "undefined") {
      return Promise.reject(new Error("C++ compiler frame is not available."));
    }
    if (this.compilerFrame && this.compilerFrameReadyPromise) return this.compilerFrameReadyPromise;
    const frameUrl = new URL(this.compilerFrameUrl, globalThis.location?.href);
    this.compilerFrameTargetOrigin = frameUrl.origin;
    const iframe = document.createElement("iframe");
    iframe.src = frameUrl.href;
    iframe.style.display = "none";
    iframe.setAttribute("aria-hidden", "true");
    this.compilerFrame = iframe;
    this.activeCompilerFrames.add(iframe);
    this.compilerFrameReadyPromise = new Promise((resolve, reject) => {
      let settled = false;
      let timeoutId;
      const finishReady = () => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        this.compilerFrameReadyResolve = null;
        this.compilerFrameReadyReject = null;
        resolve();
      };
      const onMessage = (event) => {
        if (event.source !== iframe.contentWindow) return;
        if (event.origin !== this.compilerFrameTargetOrigin) return;
        if (event.data?.type === "frame-ready") {
          finishReady();
          return;
        }
        const requestId = event.data?.id;
        if (!requestId) return;
        const pending = this.pendingCompilerFrameRequests.get(requestId);
        if (!pending) return;
        this.pendingCompilerFrameRequests.delete(requestId);
        globalThis.clearTimeout(pending.timeoutId);
        const response = event.data;
        pending.resolve(response.payload ?? { success: false, error: "C++ compiler frame returned an empty response." });
      };
      this.compilerFrameMessageHandler = onMessage;
      timeoutId = globalThis.setTimeout(() => {
        const error = new Error("C++ compiler frame request timed out.");
        this.clearCompilerFrames(error);
        reject(error);
      }, this.initTimeoutMs);
      this.compilerFrameReadyResolve = finishReady;
      this.compilerFrameReadyReject = (error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error);
      };
      globalThis.addEventListener("message", onMessage);
      document.body.appendChild(iframe);
    });
    return this.compilerFrameReadyPromise;
  }
  async compileInFrame(payload) {
    try {
      await this.ensureCompilerFrame();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
    const iframe = this.compilerFrame;
    const frameWindow = iframe?.contentWindow;
    if (!frameWindow) {
      return { success: false, error: "C++ compiler frame is not available." };
    }
    return new Promise((resolve) => {
      const requestId = `compile-${++this.compilerFrameRequestId}`;
      const timeoutId = globalThis.setTimeout(() => {
        this.pendingCompilerFrameRequests.delete(requestId);
        resolve({ success: false, error: "C++ compiler frame request timed out." });
      }, this.initTimeoutMs);
      this.pendingCompilerFrameRequests.set(requestId, { resolve, timeoutId });
      frameWindow.postMessage(
        {
          id: requestId,
          type: "compile",
          payload
        },
        this.compilerFrameTargetOrigin
      );
    });
  }
  async executeCode(code, functionName, inputs, executionStyle) {
    await this.init();
    try {
      return await this.executeWithTimeout(
        () => this.sendMessage(
          "compile-run",
          { code, functionName, inputs, executionStyle },
          this.executionTimeoutMs + 5e3
        ),
        this.executionTimeoutMs,
        "compile-run"
      );
    } catch (error) {
      if (this.isClientTimeout(error)) return this.timeoutCodeResult(error);
      throw error;
    }
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle) {
    await this.init();
    try {
      return await this.executeWithTimeout(
        () => this.sendMessage(
          "execute-with-tracing",
          { code, functionName, inputs, options, executionStyle },
          this.tracingTimeoutMs + 5e3
        ),
        this.tracingTimeoutMs,
        "trace"
      );
    } catch (error) {
      if (this.isClientTimeout(error)) return this.timeoutTraceResult(error);
      throw error;
    }
  }
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle) {
    await this.init();
    try {
      return await this.executeWithTimeout(
        () => this.sendMessage(
          "execute-code-interview",
          { code, functionName, inputs, executionStyle },
          this.interviewTimeoutMs + 5e3
        ),
        this.interviewTimeoutMs,
        "interview"
      );
    } catch {
      return {
        success: false,
        output: null,
        error: "Time Limit Exceeded",
        timeoutReason: "client-timeout",
        diagnosticStage: "interview",
        consoleOutput: [],
        timings: { totalMs: this.interviewTimeoutMs }
      };
    }
  }
  terminate() {
    this.terminateAndReset();
  }
};

// packages/harness-browser/src/cpp-runtime-client.ts
var CppRuntimeClient = class {
  constructor(workerClient) {
    this.workerClient = workerClient;
  }
  async init() {
    return this.workerClient.init();
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle = "solution-method") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("cpp"), {
      request: "trace",
      executionStyle,
      functionName
    });
    return this.workerClient.executeWithTracing(
      code,
      functionName ?? "",
      inputs,
      options,
      executionStyle
    );
  }
  async executeCode(code, functionName, inputs, executionStyle = "solution-method") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("cpp"), {
      request: "execute",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCode(
      code,
      functionName,
      inputs,
      executionStyle
    );
  }
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle = "solution-method") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("cpp"), {
      request: "interview",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCodeInterviewMode(
      code,
      functionName,
      inputs,
      executionStyle
    );
  }
};
function createCppRuntimeClient(workerClient) {
  return new CppRuntimeClient(workerClient);
}

// packages/harness-browser/src/pyodide-worker-client.ts
var EXECUTION_TIMEOUT_MS5 = 1e4;
var INTERVIEW_MODE_TIMEOUT_MS4 = 5e3;
var TRACING_TIMEOUT_MS5 = 3e4;
var INIT_TIMEOUT_MS5 = 12e4;
var MESSAGE_TIMEOUT_MS5 = 2e4;
var WORKER_READY_TIMEOUT_MS5 = 1e4;
var PythonWorkerClient = class {
  constructor(options) {
    this.options = options;
    this.debug = options.debug ?? process.env.NODE_ENV === "development";
  }
  worker = null;
  pendingMessages = /* @__PURE__ */ new Map();
  messageId = 0;
  isInitializing = false;
  initPromise = null;
  warmupPromise = null;
  workerReadyPromise = null;
  workerReadyResolve = null;
  workerReadyReject = null;
  debug;
  /**
   * Check if Web Workers are supported
   */
  isSupported() {
    return typeof Worker !== "undefined";
  }
  /**
   * Get or create the worker instance
   */
  getWorker() {
    if (this.worker) return this.worker;
    if (!this.isSupported()) {
      throw new Error("Web Workers are not supported in this environment");
    }
    this.workerReadyPromise = new Promise((resolve, reject) => {
      this.workerReadyResolve = resolve;
      this.workerReadyReject = (error) => reject(error);
    });
    const workerUrl = this.debug && !this.options.workerUrl.includes("?") ? `${this.options.workerUrl}?dev=${Date.now()}` : this.options.workerUrl;
    this.worker = new Worker(workerUrl);
    this.worker.onmessage = (event) => {
      const { id, type, payload } = event.data;
      if (type === "worker-ready") {
        this.workerReadyResolve?.();
        this.workerReadyResolve = null;
        this.workerReadyReject = null;
        logRuntimeDiagnostic("info", {
          component: "PythonWorkerClient",
          runtime: "python",
          phase: "worker-ready",
          message: "Python worker is ready."
        }, { enabled: this.debug });
        return;
      }
      if (this.debug && !id) {
        logRuntimeDiagnostic("debug", {
          component: "PythonWorkerClient",
          runtime: "python",
          phase: "worker-event",
          message: "Python worker emitted an unsolicited event.",
          detail: { type, payload }
        }, { enabled: this.debug });
      }
      if (id) {
        const pending = this.pendingMessages.get(id);
        if (pending) {
          this.pendingMessages.delete(id);
          if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
          if (type === "error") {
            pending.reject(new Error(payload.error));
          } else {
            logRuntimeDiagnostic("debug", {
              component: "PythonWorkerClient",
              runtime: "python",
              phase: "worker-response",
              message: "Python worker response received.",
              detail: { id, type }
            }, { enabled: this.debug });
            pending.resolve(payload);
          }
        }
      }
    };
    this.worker.onerror = (error) => {
      logRuntimeDiagnostic("error", {
        component: "PythonWorkerClient",
        runtime: "python",
        phase: "worker-error",
        message: "Python worker emitted an error event.",
        detail: {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno
        }
      });
      const workerError = new Error("Worker error");
      this.workerReadyReject?.(workerError);
      this.workerReadyResolve = null;
      this.workerReadyReject = null;
      for (const [id, pending] of this.pendingMessages) {
        if (pending.timeoutId) {
          globalThis.clearTimeout(pending.timeoutId);
        }
        pending.reject(workerError);
        this.pendingMessages.delete(id);
      }
    };
    return this.worker;
  }
  /**
   * Wait for worker bootstrap signal with timeout.
   * Guards against deadlocks when the worker script fails before posting "worker-ready".
   */
  async waitForWorkerReady() {
    const readyPromise = this.workerReadyPromise;
    if (!readyPromise) return;
    await new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        const timeoutError = new Error(
          `Python worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS5 / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "PythonWorkerClient",
          runtime: "python",
          phase: "worker-ready-timeout",
          message: "Python worker did not send worker-ready before the timeout.",
          detail: { timeoutMs: WORKER_READY_TIMEOUT_MS5 }
        }, { enabled: this.debug });
        this.terminateAndReset(timeoutError);
        reject(timeoutError);
      }, WORKER_READY_TIMEOUT_MS5);
      readyPromise.then(() => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve();
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }
  /**
   * Send a message to the worker and wait for a response
   */
  async sendMessage(type, payload, timeoutMs = MESSAGE_TIMEOUT_MS5) {
    const worker = this.getWorker();
    await this.waitForWorkerReady();
    const id = String(++this.messageId);
    return new Promise((resolve, reject) => {
      this.pendingMessages.set(id, {
        resolve,
        reject
      });
      logRuntimeDiagnostic("debug", {
        component: "PythonWorkerClient",
        runtime: "python",
        phase: "worker-request",
        message: "Sending request to Python worker.",
        detail: { id, type }
      }, { enabled: this.debug });
      const timeoutId = globalThis.setTimeout(() => {
        const pending2 = this.pendingMessages.get(id);
        if (!pending2) return;
        this.pendingMessages.delete(id);
        logRuntimeDiagnostic("warn", {
          component: "PythonWorkerClient",
          runtime: "python",
          phase: "worker-request-timeout",
          message: "Python worker request timed out.",
          detail: { id, type, timeoutMs }
        }, { enabled: this.debug });
        pending2.reject(new Error(`Worker request timed out: ${type}`));
      }, timeoutMs);
      const pending = this.pendingMessages.get(id);
      if (pending) pending.timeoutId = timeoutId;
      worker.postMessage({ id, type, payload });
    });
  }
  /**
   * Execute code with a timeout - terminates worker if execution takes too long
   */
  async executeWithTimeout(executor, timeoutMs = EXECUTION_TIMEOUT_MS5) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = globalThis.setTimeout(() => {
        if (settled) return;
        settled = true;
        logRuntimeDiagnostic("warn", {
          component: "PythonWorkerClient",
          runtime: "python",
          phase: "execution-timeout",
          message: "Python execution timed out; terminating worker.",
          detail: { timeoutMs }
        }, { enabled: this.debug });
        this.terminateAndReset();
        const seconds = Math.round(timeoutMs / 1e3);
        reject(new Error(`Execution timed out (possible infinite loop). Code execution was stopped after ${seconds} seconds.`));
      }, timeoutMs);
      executor().then((result) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        resolve(result);
      }).catch((error) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);
        reject(error);
      });
    });
  }
  /**
   * Terminate the worker and reset state for recreation
   */
  terminateAndReset(reason = new Error("Worker was terminated")) {
    this.workerReadyReject?.(reason);
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.initPromise = null;
    this.warmupPromise = null;
    this.isInitializing = false;
    this.workerReadyPromise = null;
    this.workerReadyResolve = null;
    for (const [, pending] of this.pendingMessages) {
      if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
      pending.reject(reason);
    }
    this.pendingMessages.clear();
  }
  /**
   * Initialize the Python worker. Runtime loading is lazy unless warmup() is called.
   */
  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }
    if (this.isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.init();
    }
    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        return await this.sendMessage("init", void 0, INIT_TIMEOUT_MS5);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const shouldRetry = message.includes("Worker request timed out: init") || message.includes("Worker was terminated") || message.includes("Worker error") || message.includes("failed to initialize in time");
        if (!shouldRetry) {
          throw error;
        }
        logRuntimeDiagnostic("warn", {
          component: "PythonWorkerClient",
          runtime: "python",
          phase: "init-retry",
          message: "Python worker init failed; resetting worker and retrying once.",
          detail: { message }
        }, { enabled: this.debug });
        this.terminateAndReset();
        return this.sendMessage("init", void 0, INIT_TIMEOUT_MS5);
      }
    })();
    try {
      const result = await this.initPromise;
      return result;
    } catch (error) {
      this.initPromise = null;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }
  async warmup() {
    if (this.warmupPromise) return this.warmupPromise;
    this.warmupPromise = (async () => {
      try {
        await this.init();
        return await this.sendMessage("warmup", void 0, INIT_TIMEOUT_MS5);
      } catch (error) {
        this.warmupPromise = null;
        throw error;
      }
    })();
    return this.warmupPromise;
  }
  /**
   * Execute Python code with tracing for step-by-step visualization
   * @param options.maxLineEvents - Max line events before abort (for complexity analysis, use higher values)
   */
  async executeWithTracing(code, functionName, inputs, options, executionStyle = "function") {
    await this.init();
    try {
      return await this.executeWithTimeout(
        () => this.sendMessage("execute-with-tracing", {
          code,
          functionName,
          inputs,
          executionStyle,
          options
        }, TRACING_TIMEOUT_MS5 + 5e3),
        // Message timeout slightly longer than execution timeout
        TRACING_TIMEOUT_MS5
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isClientTimeout = errorMessage.includes("Execution timed out") || errorMessage.includes("possible infinite loop");
      if (isClientTimeout) {
        return {
          success: false,
          error: errorMessage,
          trace: createEmptyRuntimeTrace("python", { runId: "python:run", file: "solution.py" }),
          executionTimeMs: TRACING_TIMEOUT_MS5,
          consoleOutput: [],
          traceLimitExceeded: true,
          timeoutReason: "client-timeout",
          lineEventCount: 0,
          traceStepCount: 0
        };
      }
      throw error;
    }
  }
  /**
   * Execute Python code without tracing (for running tests)
   */
  async executeCode(code, functionName, inputs, executionStyle = "function") {
    await this.init();
    return this.executeWithTimeout(
      () => this.sendMessage("execute-code", {
        code,
        functionName,
        inputs,
        executionStyle
      }, EXECUTION_TIMEOUT_MS5 + 5e3),
      EXECUTION_TIMEOUT_MS5
    );
  }
  /**
   * Execute Python code in interview mode - 5 second timeout, generic error messages
   * Does not reveal which line caused the timeout
   */
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle = "function") {
    await this.init();
    try {
      const result = await this.executeWithTimeout(
        () => this.sendMessage("execute-code-interview", {
          code,
          functionName,
          inputs,
          executionStyle
        }, INTERVIEW_MODE_TIMEOUT_MS4 + 2e3),
        INTERVIEW_MODE_TIMEOUT_MS4
      );
      if (!result.success && result.error) {
        const normalizedError = result.error.toLowerCase();
        const isTimeoutOrResourceLimit = normalizedError.includes("timed out") || normalizedError.includes("execution timeout") || normalizedError.includes("infinite loop") || normalizedError.includes("interview_guard_triggered") || normalizedError.includes("memory-limit") || normalizedError.includes("line-limit") || normalizedError.includes("single-line-limit") || normalizedError.includes("recursion-limit");
        if (isTimeoutOrResourceLimit) {
          return {
            success: false,
            output: null,
            error: "Time Limit Exceeded",
            consoleOutput: result.consoleOutput ?? []
          };
        }
      }
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes("timed out") || errorMsg.includes("Execution timeout")) {
        return {
          success: false,
          output: null,
          error: "Time Limit Exceeded",
          consoleOutput: []
        };
      }
      return {
        success: false,
        output: null,
        error: errorMsg,
        consoleOutput: []
      };
    }
  }
  /**
   * Check the status of the worker
   */
  async getStatus() {
    return this.sendMessage("status");
  }
  /**
   * Analyze Python code using AST (off main thread)
   * Returns CodeFacts with semantic information about the code
   */
  async analyzeCode(code) {
    await this.init();
    return this.sendMessage("analyze-code", { code }, 5e3);
  }
  /**
   * Terminate the worker and clean up resources
   */
  terminate() {
    this.terminateAndReset();
  }
};

// packages/harness-browser/src/python-runtime-client.ts
var PythonRuntimeClient = class {
  constructor(workerClient) {
    this.workerClient = workerClient;
  }
  async init() {
    return this.workerClient.init();
  }
  async executeWithTracing(code, functionName, inputs, options, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("python"), {
      request: "trace",
      executionStyle,
      functionName
    });
    return this.workerClient.executeWithTracing(
      code,
      functionName,
      inputs,
      options,
      executionStyle
    );
  }
  async executeCode(code, functionName, inputs, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("python"), {
      request: "execute",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCode(
      code,
      functionName,
      inputs,
      executionStyle
    );
  }
  async executeCodeInterviewMode(code, functionName, inputs, executionStyle = "function") {
    assertRuntimeRequestSupported(getLanguageRuntimeProfile("python"), {
      request: "interview",
      executionStyle,
      functionName
    });
    return this.workerClient.executeCodeInterviewMode(
      code,
      functionName,
      inputs,
      executionStyle
    );
  }
};
function createPythonRuntimeClient(workerClient) {
  return new PythonRuntimeClient(workerClient);
}

// packages/harness-browser/src/runtime-assets.ts
var DEFAULT_ASSET_BASE_URL = "/workers";
var DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS = Object.freeze({
  pythonWorker: "pyodide-worker.js",
  pythonRuntimeCore: "pyodide/runtime-core.js",
  pythonSnippets: "generated-python-harness-snippets.js",
  javascriptWorker: "javascript-worker.js",
  javaWorker: "java-worker.js",
  csharpWorker: "csharp-worker.js",
  csharpAssetBaseUrl: "vendor/csharp",
  typescriptCompiler: "vendor/typescript.js",
  cppWorker: "cpp-worker.js",
  cppCompilerFrame: "cpp-compiler-frame.html",
  cppCompilerWorker: "cpp-compiler-worker.js",
  cppClangWasm: "",
  cppLldWasm: "",
  cppSysroot: "",
  cppRuntimeHeader: "cpp/tracecode_runtime.hpp",
  cppCompilerBundle: "vendor/cpp/yowasp/bundle.js"
});
function isExplicitAssetPath(pathname) {
  return pathname.startsWith("/") || pathname.startsWith("./") || pathname.startsWith("../") || pathname.startsWith("http://") || pathname.startsWith("https://") || pathname.startsWith("data:") || pathname.startsWith("blob:");
}
function stripTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}
function trimLeadingSlash(value) {
  return value.replace(/^\/+/, "");
}
function resolveAssetPath(baseUrl, pathname) {
  if (pathname === "") {
    return "";
  }
  if (isExplicitAssetPath(pathname)) {
    return pathname;
  }
  const normalizedBase = stripTrailingSlash(baseUrl || DEFAULT_ASSET_BASE_URL);
  const normalizedPath = trimLeadingSlash(pathname);
  return `${normalizedBase}/${normalizedPath}`;
}
function resolveBrowserHarnessAssets(options = {}) {
  const assetBaseUrl = options.assetBaseUrl ?? DEFAULT_ASSET_BASE_URL;
  const assets = options.assets ?? {};
  return {
    pythonWorker: resolveAssetPath(assetBaseUrl, assets.pythonWorker ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.pythonWorker),
    pythonRuntimeCore: resolveAssetPath(
      assetBaseUrl,
      assets.pythonRuntimeCore ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.pythonRuntimeCore
    ),
    pythonSnippets: resolveAssetPath(assetBaseUrl, assets.pythonSnippets ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.pythonSnippets),
    javascriptWorker: resolveAssetPath(
      assetBaseUrl,
      assets.javascriptWorker ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.javascriptWorker
    ),
    javaWorker: resolveAssetPath(assetBaseUrl, assets.javaWorker ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.javaWorker),
    csharpWorker: resolveAssetPath(assetBaseUrl, assets.csharpWorker ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.csharpWorker),
    csharpAssetBaseUrl: resolveAssetPath(
      assetBaseUrl,
      assets.csharpAssetBaseUrl ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.csharpAssetBaseUrl
    ),
    typescriptCompiler: resolveAssetPath(
      assetBaseUrl,
      assets.typescriptCompiler ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.typescriptCompiler
    ),
    cppWorker: resolveAssetPath(assetBaseUrl, assets.cppWorker ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.cppWorker),
    cppCompilerFrame: resolveAssetPath(
      assetBaseUrl,
      assets.cppCompilerFrame ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.cppCompilerFrame
    ),
    cppCompilerWorker: resolveAssetPath(
      assetBaseUrl,
      assets.cppCompilerWorker ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.cppCompilerWorker
    ),
    cppClangWasm: resolveAssetPath(assetBaseUrl, assets.cppClangWasm ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.cppClangWasm),
    cppLldWasm: resolveAssetPath(assetBaseUrl, assets.cppLldWasm ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.cppLldWasm),
    cppSysroot: resolveAssetPath(assetBaseUrl, assets.cppSysroot ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.cppSysroot),
    cppRuntimeHeader: resolveAssetPath(
      assetBaseUrl,
      assets.cppRuntimeHeader ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.cppRuntimeHeader
    ),
    cppCompilerBundle: resolveAssetPath(
      assetBaseUrl,
      assets.cppCompilerBundle ?? DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS.cppCompilerBundle
    )
  };
}

// packages/harness-browser/src/browser-harness.ts
var BrowserHarnessRuntime = class {
  assets;
  supportedLanguages = SUPPORTED_LANGUAGES;
  pythonWorkerClient;
  javaScriptWorkerClient;
  javaWorkerClient;
  csharpWorkerClient;
  cppWorkerClient;
  clients;
  constructor(options = {}) {
    this.assets = resolveBrowserHarnessAssets(options);
    this.pythonWorkerClient = new PythonWorkerClient({
      workerUrl: this.assets.pythonWorker,
      debug: options.debug
    });
    this.javaScriptWorkerClient = new JavaScriptWorkerClient({
      workerUrl: this.assets.javascriptWorker,
      debug: options.debug
    });
    this.javaWorkerClient = new JavaWorkerClient({
      workerUrl: this.assets.javaWorker,
      debug: options.debug,
      workerIdleTimeoutMs: options.java?.workerIdleTimeoutMs
    });
    this.csharpWorkerClient = new CSharpWorkerClient({
      workerUrl: this.assets.csharpWorker,
      assetBaseUrl: this.assets.csharpAssetBaseUrl,
      debug: options.debug,
      workerIdleTimeoutMs: options.csharp?.workerIdleTimeoutMs
    });
    this.cppWorkerClient = new CppWorkerClient({
      workerUrl: this.assets.cppWorker,
      compilerFrameUrl: this.assets.cppCompilerFrame,
      compilerWorkerUrl: this.assets.cppCompilerWorker,
      clangWasmUrl: this.assets.cppClangWasm,
      lldWasmUrl: this.assets.cppLldWasm,
      sysrootUrl: this.assets.cppSysroot,
      runtimeHeaderUrl: this.assets.cppRuntimeHeader,
      compilerBundleUrl: this.assets.cppCompilerBundle,
      debug: options.debug,
      initTimeoutMs: options.cpp?.initTimeoutMs,
      executionTimeoutMs: options.cpp?.executionTimeoutMs,
      tracingTimeoutMs: options.cpp?.tracingTimeoutMs,
      interviewTimeoutMs: options.cpp?.interviewTimeoutMs,
      workerIdleTimeoutMs: options.cpp?.workerIdleTimeoutMs
    });
    this.clients = {
      python: createPythonRuntimeClient(this.pythonWorkerClient),
      javascript: createJavaScriptRuntimeClient("javascript", this.javaScriptWorkerClient),
      typescript: createJavaScriptRuntimeClient("typescript", this.javaScriptWorkerClient),
      java: createJavaRuntimeClient(this.javaWorkerClient),
      csharp: createCSharpRuntimeClient(this.csharpWorkerClient),
      cpp: createCppRuntimeClient(this.cppWorkerClient)
    };
  }
  getClient(language) {
    const client = this.clients[language];
    if (!client) {
      throw new Error(`Runtime for language "${language}" is not implemented yet.`);
    }
    return client;
  }
  getProfile(language) {
    return getLanguageRuntimeProfile(language);
  }
  getSupportedLanguageProfiles() {
    return getSupportedLanguageProfiles();
  }
  getLanguageInfo(language) {
    return getLanguageRuntimeInfo(language);
  }
  getSupportedLanguageInfos() {
    return getSupportedLanguageRuntimeInfos();
  }
  isLanguageSupported(language) {
    return isLanguageSupported(language);
  }
  warmLanguage(language) {
    if (language === "python") {
      return this.pythonWorkerClient.warmup();
    }
    if (language === "java") {
      return this.javaWorkerClient.warmup();
    }
    if (language === "cpp") {
      return this.cppWorkerClient.warmup();
    }
    if (language === "csharp") {
      return this.csharpWorkerClient.warmup();
    }
    if (language === "typescript") {
      return this.javaScriptWorkerClient.warmup("typescript");
    }
    return this.getClient(language).init();
  }
  disposeLanguage(language) {
    if (language === "python") {
      this.pythonWorkerClient.terminate();
      return;
    }
    if (language === "java") {
      this.javaWorkerClient.terminate();
      return;
    }
    if (language === "csharp") {
      this.csharpWorkerClient.terminate();
      return;
    }
    if (language === "cpp") {
      this.cppWorkerClient.terminate();
      return;
    }
    this.javaScriptWorkerClient.terminate();
  }
  dispose() {
    this.pythonWorkerClient.terminate();
    this.javaScriptWorkerClient.terminate();
    this.javaWorkerClient.terminate();
    this.csharpWorkerClient.terminate();
    this.cppWorkerClient.terminate();
  }
};
function createBrowserHarness(options = {}) {
  return new BrowserHarnessRuntime(options);
}
export {
  DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS,
  LANGUAGE_RUNTIME_INFOS,
  LANGUAGE_RUNTIME_PROFILES,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_RUNTIME_INFOS,
  assertRuntimeRequestSupported,
  createBrowserHarness,
  getLanguageRuntimeInfo,
  getLanguageRuntimeProfile,
  getSupportedLanguageProfiles,
  getSupportedLanguageRuntimeInfos,
  isLanguageSupported,
  resolveBrowserHarnessAssets
};
//# sourceMappingURL=browser.js.map