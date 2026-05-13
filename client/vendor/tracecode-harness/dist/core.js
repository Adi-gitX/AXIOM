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
function sortedUnique(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function sortedUniqueEventKinds(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function withRuntimeTraceOptions(trace, options = {}) {
  const runId = options.runId ?? trace.runId;
  return {
    ...trace,
    runId,
    events: trace.events.map((event) => ({
      ...event,
      runId,
      ...options.file ? { file: options.file } : {}
    }))
  };
}
function buildRuntimeTraceParitySignature(trace) {
  const lineSequence = [];
  const eventKindsByLine = /* @__PURE__ */ new Map();
  const variableSnapshotsByLine = /* @__PURE__ */ new Map();
  const accessTargetsByLine = /* @__PURE__ */ new Map();
  const callReturnShape = [];
  for (const event of trace.events) {
    if (event.kind === "line" && typeof event.line === "number") {
      lineSequence.push(event.line);
    }
    if (event.kind === "call" || event.kind === "return") {
      callReturnShape.push(event.kind);
    }
    if (typeof event.line === "number") {
      const kinds = eventKindsByLine.get(event.line) ?? [];
      kinds.push(event.kind);
      eventKindsByLine.set(event.line, kinds);
    }
    if (event.kind === "snapshot" && "variable" in event.target && typeof event.line === "number") {
      const variables = variableSnapshotsByLine.get(event.line) ?? [];
      variables.push(event.target.variable);
      variableSnapshotsByLine.set(event.line, variables);
    }
    if ((event.kind === "read" || event.kind === "write" || event.kind === "mutate") && "variable" in event.target && typeof event.line === "number") {
      const accesses = accessTargetsByLine.get(event.line) ?? [];
      accesses.push({
        kind: event.kind,
        variable: event.target.variable,
        pathDepth: "path" in event.target && Array.isArray(event.target.path) ? event.target.path.length : void 0
      });
      accessTargetsByLine.set(event.line, accesses);
    }
  }
  return {
    lineSequence,
    eventKindsByLine: Object.fromEntries(
      [...eventKindsByLine.entries()].map(([line, kinds]) => [
        line,
        sortedUniqueEventKinds(kinds)
      ])
    ),
    variableSnapshotsByLine: Object.fromEntries(
      [...variableSnapshotsByLine.entries()].map(([line, variables]) => [
        line,
        sortedUnique(variables)
      ])
    ),
    accessTargetsByLine: Object.fromEntries(
      [...accessTargetsByLine.entries()].map(([line, accesses]) => [
        line,
        accesses.sort((left, right) => {
          const leftKey = `${left.kind}:${left.variable ?? ""}:${left.pathDepth ?? 0}`;
          const rightKey = `${right.kind}:${right.variable ?? ""}:${right.pathDepth ?? 0}`;
          return leftKey.localeCompare(rightKey);
        })
      ])
    ),
    callReturnShape
  };
}

// packages/harness-core/src/runtime-raw-emission-contract.ts
function sortedUnique2(values) {
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
    kinds: sortedUnique2(kinds),
    unsupported
  };
}
function summarizeRuntimeTraceEmissions(trace) {
  const kinds = [];
  const unsupported = [];
  for (const [index, event] of trace.events.entries()) {
    const forbiddenPayload = unsupportedForbiddenPayload(`${trace.language} trace event ${index}`, event);
    if (forbiddenPayload) {
      unsupported.push(forbiddenPayload);
      continue;
    }
    switch (event.kind) {
      case "line":
      case "call":
      case "return":
      case "exception":
      case "timeout":
      case "stdout":
      case "snapshot":
      case "read":
      case "write":
      case "mutate":
        kinds.push(event.kind);
        break;
      default:
        unsupported.push(`${trace.language} trace event ${index} has unsupported kind "${String(event.kind)}"`);
    }
  }
  return {
    language: trace.language,
    kinds: sortedUnique2(kinds),
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
function parityKinds(summary) {
  return summary.kinds;
}
function compareRawEmissionParity(reference, summaries) {
  const expected = new Set(parityKinds(reference));
  const mismatches = [];
  for (const summary of summaries) {
    if (summary.language === reference.language) continue;
    const actual = new Set(parityKinds(summary));
    const missing = [...expected].filter((kind) => !actual.has(kind)).sort((left, right) => left.localeCompare(right));
    const extra = [...actual].filter((kind) => !expected.has(kind)).sort((left, right) => left.localeCompare(right));
    if (missing.length > 0 || extra.length > 0) {
      mismatches.push({ language: summary.language, missing, extra });
    }
  }
  return mismatches;
}

// packages/harness-core/src/trace-adapters/java.ts
function normalizeJavaSerializedResult(output) {
  if (typeof output !== "string") {
    return output;
  }
  try {
    return JSON.parse(output);
  } catch {
    return output;
  }
}
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
export {
  LANGUAGE_RUNTIME_INFOS,
  RUNTIME_TRACE_SCHEMA_VERSION,
  SUPPORTED_LANGUAGE_RUNTIME_INFOS,
  assertSupportedRawEmissions,
  buildRuntimeTraceParitySignature,
  compareRawEmissionParity,
  createEmptyRuntimeTrace,
  getLanguageRuntimeInfo,
  getSupportedLanguageRuntimeInfos,
  javaTraceHooksEventsToRuntimeTrace,
  normalizeJavaNativeTraceJsonPayload,
  normalizeJavaSerializedResult,
  summarizeJavaRawEmissions,
  summarizeRuntimeTraceEmissions,
  withRuntimeTraceOptions
};
//# sourceMappingURL=core.js.map