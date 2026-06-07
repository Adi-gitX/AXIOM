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

// packages/harness-browser/src/pyodide-worker-client.ts
var EXECUTION_TIMEOUT_MS = 1e4;
var INTERVIEW_MODE_TIMEOUT_MS = 5e3;
var TRACING_TIMEOUT_MS = 3e4;
var INIT_TIMEOUT_MS = 12e4;
var MESSAGE_TIMEOUT_MS = 2e4;
var WORKER_READY_TIMEOUT_MS = 1e4;
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
          `Python worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "PythonWorkerClient",
          runtime: "python",
          phase: "worker-ready-timeout",
          message: "Python worker did not send worker-ready before the timeout.",
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
  /**
   * Send a message to the worker and wait for a response
   */
  async sendMessage(type, payload, timeoutMs = MESSAGE_TIMEOUT_MS) {
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
  async executeWithTimeout(executor, timeoutMs = EXECUTION_TIMEOUT_MS) {
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
        return await this.sendMessage("init", void 0, INIT_TIMEOUT_MS);
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
        return this.sendMessage("init", void 0, INIT_TIMEOUT_MS);
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
        return await this.sendMessage("warmup", void 0, INIT_TIMEOUT_MS);
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
        }, TRACING_TIMEOUT_MS + 5e3),
        // Message timeout slightly longer than execution timeout
        TRACING_TIMEOUT_MS
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isClientTimeout = errorMessage.includes("Execution timed out") || errorMessage.includes("possible infinite loop");
      if (isClientTimeout) {
        return {
          success: false,
          error: errorMessage,
          trace: createEmptyRuntimeTrace("python", { runId: "python:run", file: "solution.py" }),
          executionTimeMs: TRACING_TIMEOUT_MS,
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
      }, EXECUTION_TIMEOUT_MS + 5e3),
      EXECUTION_TIMEOUT_MS
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
        }, INTERVIEW_MODE_TIMEOUT_MS + 2e3),
        INTERVIEW_MODE_TIMEOUT_MS
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
function isWorkerSupported() {
  return typeof Worker !== "undefined";
}

// packages/harness-browser/src/javascript-worker-client.ts
var EXECUTION_TIMEOUT_MS2 = 2e4;
var INTERVIEW_MODE_TIMEOUT_MS2 = 5e3;
var TRACING_TIMEOUT_MS2 = 2e4;
var INIT_TIMEOUT_MS2 = 1e4;
var TYPESCRIPT_WARMUP_TIMEOUT_MS = 3e4;
var MESSAGE_TIMEOUT_MS2 = 12e3;
var WORKER_READY_TIMEOUT_MS2 = 1e4;
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
          `JavaScript worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS2 / 1e3)}s)`
        );
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
    this.initPromise = this.sendMessage("init", void 0, INIT_TIMEOUT_MS2);
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
        language === "typescript" ? TYPESCRIPT_WARMUP_TIMEOUT_MS : INIT_TIMEOUT_MS2
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
        TRACING_TIMEOUT_MS2 + 2e3
      ),
      TRACING_TIMEOUT_MS2
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
        EXECUTION_TIMEOUT_MS2 + 2e3
      ),
      EXECUTION_TIMEOUT_MS2
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
          INTERVIEW_MODE_TIMEOUT_MS2 + 2e3
        ),
        INTERVIEW_MODE_TIMEOUT_MS2
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
function isJavaScriptWorkerSupported() {
  return typeof Worker !== "undefined";
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
var EXECUTION_TIMEOUT_MS3 = 2e4;
var TRACING_TIMEOUT_MS3 = 25e3;
var INIT_TIMEOUT_MS3 = 12e4;
var MESSAGE_TIMEOUT_MS3 = 3e4;
var WORKER_READY_TIMEOUT_MS3 = 1e4;
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
          `Java worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS3 / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "JavaWorkerClient",
          runtime: "java",
          phase: "worker-ready-timeout",
          message: "Java worker did not send worker-ready before the timeout.",
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
        return await this.sendMessage("init", this.workerOptionsPayload(), INIT_TIMEOUT_MS3);
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
        return this.sendMessage("init", this.workerOptionsPayload(), INIT_TIMEOUT_MS3);
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
          INIT_TIMEOUT_MS3
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
        TRACING_TIMEOUT_MS3 + 5e3
      ),
      TRACING_TIMEOUT_MS3
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
        EXECUTION_TIMEOUT_MS3 + 5e3
      ),
      EXECUTION_TIMEOUT_MS3
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

// packages/harness-browser/src/csharp-worker-client.ts
var EXECUTION_TIMEOUT_MS4 = 2e4;
var TRACING_TIMEOUT_MS4 = 2e4;
var INTERVIEW_MODE_TIMEOUT_MS3 = 5e3;
var INIT_TIMEOUT_MS4 = 45e3;
var MESSAGE_TIMEOUT_MS4 = 3e4;
var WORKER_READY_TIMEOUT_MS4 = 1e4;
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
    this.initTimeoutMs = options.initTimeoutMs ?? INIT_TIMEOUT_MS4;
    this.executionTimeoutMs = options.executionTimeoutMs ?? EXECUTION_TIMEOUT_MS4;
    this.tracingTimeoutMs = options.tracingTimeoutMs ?? TRACING_TIMEOUT_MS4;
    this.interviewTimeoutMs = options.interviewTimeoutMs ?? INTERVIEW_MODE_TIMEOUT_MS3;
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
          `C# worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS4 / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "CSharpWorkerClient",
          runtime: "csharp",
          phase: "worker-ready-timeout",
          message: "C# worker did not send worker-ready before the timeout.",
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

// packages/harness-browser/src/cpp-worker-client.ts
var CppClientTimeoutError = class extends Error {
  constructor(message, stage, timeoutMs) {
    super(message);
    this.stage = stage;
    this.timeoutMs = timeoutMs;
    this.name = "CppClientTimeoutError";
  }
};
var INIT_TIMEOUT_MS5 = 12e4;
var EXECUTION_TIMEOUT_MS5 = 6e4;
var TRACING_TIMEOUT_MS5 = 6e4;
var INTERVIEW_MODE_TIMEOUT_MS4 = 3e4;
var MESSAGE_TIMEOUT_MS5 = 3e4;
var WORKER_READY_TIMEOUT_MS5 = 1e4;
var CPP_DEFAULT_FILE = "solution.cpp";
var CppWorkerClient = class {
  constructor(options) {
    this.options = options;
    this.debug = options.debug ?? process.env.NODE_ENV === "development";
    this.initTimeoutMs = options.initTimeoutMs ?? INIT_TIMEOUT_MS5;
    this.executionTimeoutMs = options.executionTimeoutMs ?? EXECUTION_TIMEOUT_MS5;
    this.tracingTimeoutMs = options.tracingTimeoutMs ?? TRACING_TIMEOUT_MS5;
    this.interviewTimeoutMs = options.interviewTimeoutMs ?? INTERVIEW_MODE_TIMEOUT_MS4;
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
          `C++ worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS5 / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "CppWorkerClient",
          runtime: "cpp",
          phase: "worker-ready-timeout",
          message: "C++ worker did not send worker-ready before the timeout.",
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
  async sendMessage(type, payload, timeoutMs = MESSAGE_TIMEOUT_MS5) {
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
export {
  CSharpWorkerClient,
  CppWorkerClient,
  JavaScriptWorkerClient,
  JavaWorkerClient,
  PythonWorkerClient as PyodideWorkerClient,
  PythonWorkerClient,
  isJavaScriptWorkerSupported,
  isWorkerSupported
};
//# sourceMappingURL=browser.js.map