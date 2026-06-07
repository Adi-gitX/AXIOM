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

// packages/harness-browser/src/java-runtime-client.ts
var JAVA_DEFAULT_FILE = "solution.java";
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
        trace: createEmptyRuntimeTrace("java", { runId: "java:run", file: JAVA_DEFAULT_FILE }),
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

// packages/harness-browser/src/java-worker-client.ts
var EXECUTION_TIMEOUT_MS = 2e4;
var TRACING_TIMEOUT_MS = 25e3;
var INIT_TIMEOUT_MS = 12e4;
var MESSAGE_TIMEOUT_MS = 3e4;
var WORKER_READY_TIMEOUT_MS = 1e4;
var JAVA_DEFAULT_FILE2 = "solution.java";
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
          `Java worker failed to initialize in time (${Math.round(WORKER_READY_TIMEOUT_MS / 1e3)}s)`
        );
        logRuntimeDiagnostic("warn", {
          component: "JavaWorkerClient",
          runtime: "java",
          phase: "worker-ready-timeout",
          message: "Java worker did not send worker-ready before the timeout.",
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
        return await this.sendMessage("init", this.workerOptionsPayload(), INIT_TIMEOUT_MS);
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
        return this.sendMessage("init", this.workerOptionsPayload(), INIT_TIMEOUT_MS);
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
          INIT_TIMEOUT_MS
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
        TRACING_TIMEOUT_MS + 5e3
      ),
      TRACING_TIMEOUT_MS
    );
    return {
      ...result,
      trace: result.success ? javaTraceHooksEventsToRuntimeTrace(result.events, result.sourceText, {
        runId: "java:run",
        file: JAVA_DEFAULT_FILE2
      }) : createEmptyRuntimeTrace("java", { runId: "java:run", file: JAVA_DEFAULT_FILE2 })
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
        EXECUTION_TIMEOUT_MS + 5e3
      ),
      EXECUTION_TIMEOUT_MS
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
export {
  JavaWorkerClient,
  createJavaRuntimeClient
};
//# sourceMappingURL=java.js.map