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

// packages/harness-core/src/runtime-trace.ts
var RUNTIME_TRACE_SCHEMA_VERSION = "runtime-trace-2026-04-28";

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

// packages/harness-browser/src/csharp-worker-client.ts
var EXECUTION_TIMEOUT_MS = 2e4;
var TRACING_TIMEOUT_MS = 2e4;
var INTERVIEW_MODE_TIMEOUT_MS = 5e3;
var INIT_TIMEOUT_MS = 45e3;
var MESSAGE_TIMEOUT_MS = 3e4;
var WORKER_READY_TIMEOUT_MS = 1e4;
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
    this.initTimeoutMs = options.initTimeoutMs ?? INIT_TIMEOUT_MS;
    this.executionTimeoutMs = options.executionTimeoutMs ?? EXECUTION_TIMEOUT_MS;
    this.tracingTimeoutMs = options.tracingTimeoutMs ?? TRACING_TIMEOUT_MS;
    this.interviewTimeoutMs = options.interviewTimeoutMs ?? INTERVIEW_MODE_TIMEOUT_MS;
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
          `C# worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "CSharpWorkerClient",
          runtime: "csharp",
          phase: "worker-ready-timeout",
          message: "C# worker did not send worker-ready before the timeout.",
          detail: { timeoutMs: WORKER_READY_TIMEOUT_MS }
        }, { enabled: this.debug });
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
export {
  CSharpWorkerClient,
  createCSharpRuntimeClient
};
//# sourceMappingURL=csharp.js.map