var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CSharpWorkerClient: () => CSharpWorkerClient,
  CppWorkerClient: () => CppWorkerClient,
  DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS: () => DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS,
  JavaScriptWorkerClient: () => JavaScriptWorkerClient,
  JavaWorkerClient: () => JavaWorkerClient,
  LANGUAGE_RUNTIME_INFOS: () => LANGUAGE_RUNTIME_INFOS,
  LANGUAGE_RUNTIME_PROFILES: () => LANGUAGE_RUNTIME_PROFILES,
  PYTHON_CLASS_DEFINITIONS: () => PYTHON_CLASS_DEFINITIONS,
  PYTHON_CONVERSION_HELPERS: () => PYTHON_CONVERSION_HELPERS,
  PYTHON_EXECUTE_SERIALIZE_FUNCTION: () => PYTHON_EXECUTE_SERIALIZE_FUNCTION,
  PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION: () => PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION,
  PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION: () => PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION,
  PYTHON_SERIALIZE_FUNCTION: () => PYTHON_SERIALIZE_FUNCTION,
  PYTHON_TRACE_SERIALIZE_FUNCTION: () => PYTHON_TRACE_SERIALIZE_FUNCTION,
  PyodideWorkerClient: () => PythonWorkerClient,
  PythonWorkerClient: () => PythonWorkerClient,
  RUNTIME_TRACE_SCHEMA_VERSION: () => RUNTIME_TRACE_SCHEMA_VERSION,
  SUPPORTED_LANGUAGES: () => SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_RUNTIME_INFOS: () => SUPPORTED_LANGUAGE_RUNTIME_INFOS,
  TEMPLATE_PYTHON_CLASS_DEFINITIONS: () => TEMPLATE_PYTHON_CLASS_DEFINITIONS,
  TEMPLATE_PYTHON_CONVERSION_HELPERS: () => TEMPLATE_PYTHON_CONVERSION_HELPERS,
  TEMPLATE_PYTHON_EXECUTE_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_EXECUTE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_TRACE_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_TRACE_SERIALIZE_FUNCTION,
  TYPESCRIPT_RUNTIME_DECLARATIONS: () => TYPESCRIPT_RUNTIME_DECLARATIONS,
  assertRuntimeRequestSupported: () => assertRuntimeRequestSupported,
  assertSupportedRawEmissions: () => assertSupportedRawEmissions,
  buildRuntimeTraceParitySignature: () => buildRuntimeTraceParitySignature,
  compareRawEmissionParity: () => compareRawEmissionParity,
  createBrowserHarness: () => createBrowserHarness,
  createCSharpRuntimeClient: () => createCSharpRuntimeClient,
  createCppRuntimeClient: () => createCppRuntimeClient,
  createEmptyRuntimeTrace: () => createEmptyRuntimeTrace,
  createJavaRuntimeClient: () => createJavaRuntimeClient,
  createJavaScriptRuntimeClient: () => createJavaScriptRuntimeClient,
  createPythonRuntimeClient: () => createPythonRuntimeClient,
  executeJavaScriptCode: () => executeJavaScriptCode,
  executeJavaScriptWithTracing: () => executeJavaScriptWithTracing,
  executeTypeScriptCode: () => executeTypeScriptCode,
  generateConversionCode: () => generateConversionCode,
  generateInputSetup: () => generateInputSetup,
  generateSolutionScript: () => generateSolutionScript,
  getLanguageRuntimeInfo: () => getLanguageRuntimeInfo,
  getLanguageRuntimeProfile: () => getLanguageRuntimeProfile,
  getSupportedLanguageProfiles: () => getSupportedLanguageProfiles,
  getSupportedLanguageRuntimeInfos: () => getSupportedLanguageRuntimeInfos,
  identifyConversions: () => identifyConversions,
  isLanguageSupported: () => isLanguageSupported,
  javaTraceHooksEventsToRuntimeTrace: () => javaTraceHooksEventsToRuntimeTrace,
  normalizeJavaNativeTraceJsonPayload: () => normalizeJavaNativeTraceJsonPayload,
  normalizeJavaSerializedResult: () => normalizeJavaSerializedResult,
  resolveBrowserHarnessAssets: () => resolveBrowserHarnessAssets,
  summarizeJavaRawEmissions: () => summarizeJavaRawEmissions,
  summarizeRuntimeTraceEmissions: () => summarizeRuntimeTraceEmissions,
  templateToPythonLiteral: () => templateToPythonLiteral,
  toPythonLiteral: () => toPythonLiteral,
  withRuntimeTraceOptions: () => withRuntimeTraceOptions,
  withTypeScriptRuntimeDeclarations: () => withTypeScriptRuntimeDeclarations
});
module.exports = __toCommonJS(src_exports);

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

// packages/harness-python/src/generated/python-harness-snippets.ts
function toPythonLiteral(value) {
  if (value === null || value === void 0) {
    return "None";
  }
  if (typeof value === "boolean") {
    return value ? "True" : "False";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(toPythonLiteral).join(", ") + "]";
  }
  if (typeof value === "object") {
    const entries = Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}: ${toPythonLiteral(v)}`).join(", ");
    return "{" + entries + "}";
  }
  return JSON.stringify(value);
}
var PYTHON_CLASS_DEFINITIONS = `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.value = val
        self.left = left
        self.right = right
    def __getitem__(self, key):
        if key == 'val': return getattr(self, 'val', getattr(self, 'value', None))
        if key == 'value': return getattr(self, 'value', getattr(self, 'val', None))
        if key == 'left': return self.left
        if key == 'right': return self.right
        raise KeyError(key)
    def get(self, key, default=None):
        if key == 'val': return getattr(self, 'val', getattr(self, 'value', default))
        if key == 'value': return getattr(self, 'value', getattr(self, 'val', default))
        if key == 'left': return self.left
        if key == 'right': return self.right
        return default
    def __repr__(self):
        return f"TreeNode({getattr(self, 'val', getattr(self, 'value', None))})"

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.value = val
        self.next = next
    def __getitem__(self, key):
        if key == 'val': return getattr(self, 'val', getattr(self, 'value', None))
        if key == 'value': return getattr(self, 'value', getattr(self, 'val', None))
        if key == 'next': return self.next
        raise KeyError(key)
    def get(self, key, default=None):
        if key == 'val': return getattr(self, 'val', getattr(self, 'value', default))
        if key == 'value': return getattr(self, 'value', getattr(self, 'val', default))
        if key == 'next': return self.next
        return default
    def __repr__(self):
        return f"ListNode({getattr(self, 'val', getattr(self, 'value', None))})"
`;
var PYTHON_CONVERSION_HELPERS = "\ndef _ensure_node_value_aliases(node):\n    if node is None:\n        return node\n    try:\n        has_val = hasattr(node, 'val')\n        has_value = hasattr(node, 'value')\n        if has_value and not has_val:\n            try:\n                setattr(node, 'val', getattr(node, 'value'))\n            except Exception:\n                pass\n        elif has_val and not has_value:\n            try:\n                setattr(node, 'value', getattr(node, 'val'))\n            except Exception:\n                pass\n    except Exception:\n        pass\n    return node\n\ndef _dict_to_tree(d):\n    if d is None:\n        return None\n    if not isinstance(d, _builtins.dict):\n        return d\n    if 'val' not in d and 'value' not in d:\n        return d\n    node = TreeNode(d.get('val', d.get('value', 0)))\n    _ensure_node_value_aliases(node)\n    node.left = _dict_to_tree(d.get('left'))\n    node.right = _dict_to_tree(d.get('right'))\n    return node\n\ndef _dict_to_list(d, _refs=None):\n    if _refs is None:\n        _refs = {}\n    if d is None:\n        return None\n    if not isinstance(d, _builtins.dict):\n        return d\n    if '__ref__' in d:\n        return _refs.get(d.get('__ref__'))\n    if 'val' not in d and 'value' not in d:\n        return d\n    node = ListNode(d.get('val', d.get('value', 0)))\n    _ensure_node_value_aliases(node)\n    node_id = d.get('__id__')\n    if isinstance(node_id, _builtins.str) and node_id:\n        _refs[node_id] = node\n    node.next = _dict_to_list(d.get('next'), _refs)\n    return node\n";
var PYTHON_TRACE_SERIALIZE_FUNCTION = `
# Sentinel to mark skipped values (functions, etc.) - distinct from None
_SKIP_SENTINEL = "__TRACECODE_SKIP__"
_MAX_SERIALIZE_DEPTH = 48
_MAX_SERIALIZED_ITEMS = 64
_MAX_OBJECT_FIELDS = 32
_tracecode_global_object_refs = {}
_tracecode_next_object_ref_id = 0

def _tracecode_ref_id(obj_ref, node_refs):
    global _tracecode_next_object_ref_id
    if obj_ref in node_refs:
        return node_refs[obj_ref]
    if obj_ref in _tracecode_global_object_refs:
        node_id = _tracecode_global_object_refs[obj_ref]
    else:
        node_id = f"ref-{_tracecode_next_object_ref_id}"
        _tracecode_global_object_refs[obj_ref] = node_id
        _tracecode_next_object_ref_id += 1
    node_refs[obj_ref] = node_id
    return node_id

def _truncation_marker(total, emitted):
    return {"__truncated__": True, "remaining": max(0, total - emitted)}

def _serialize_sequence(values, depth, node_refs):
    values_list = _builtins.list(values)
    emitted = min(len(values_list), _MAX_SERIALIZED_ITEMS)
    result = [_serialize(x, depth + 1, node_refs) for x in values_list[:emitted]]
    if emitted < len(values_list):
        result.append(_truncation_marker(len(values_list), emitted))
    return result

def _serialize(obj, depth=0, node_refs=None):
    if node_refs is None:
        node_refs = {}
    if isinstance(obj, (bool, int, str, type(None))):
        return obj
    elif isinstance(obj, float):
        if not math.isfinite(obj):
            if math.isnan(obj):
                return "NaN"
            return "Infinity" if obj > 0 else "-Infinity"
        return obj
    if depth > _MAX_SERIALIZE_DEPTH:
        return "<max depth>"
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return _serialize_sequence(obj, depth, node_refs)
    elif getattr(obj, '__class__', None) and getattr(obj.__class__, '__name__', '') == 'deque':
        return _serialize_sequence(obj, depth, node_refs)
    elif isinstance(obj, _builtins.dict):
        items = _builtins.list(obj.items())
        emitted = min(len(items), _MAX_SERIALIZED_ITEMS)
        result = {str(k): _serialize(v, depth + 1, node_refs) for k, v in items[:emitted]}
        if emitted < len(items):
            result["__truncated__"] = True
            result["remaining"] = len(items) - emitted
        return result
    elif isinstance(obj, set):
        # Use try/except for sorting to handle heterogeneous sets
        values = _builtins.list(obj)
        emitted = min(len(values), _MAX_SERIALIZED_ITEMS)
        try:
            sorted_vals = sorted([_serialize(x, depth + 1, node_refs) for x in values[:emitted]])
        except TypeError:
            sorted_vals = [_serialize(x, depth + 1, node_refs) for x in values[:emitted]]
        result = {"__type__": "set", "values": sorted_vals}
        if emitted < len(values):
            result["__truncated__"] = True
            result["remaining"] = len(values) - emitted
        return result
    elif isinstance(obj, TreeNode):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        result = {
            "__type__": "TreeNode",
            "__id__": node_id,
            "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, node_refs),
        }
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1, node_refs)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1, node_refs)
        return result
    elif isinstance(obj, ListNode):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        result = {
            "__type__": "ListNode",
            "__id__": node_id,
            "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, node_refs),
        }
        result["next"] = _serialize(obj.next, depth + 1, node_refs)
        return result
    elif callable(obj):
        # Skip functions entirely - return sentinel
        return _SKIP_SENTINEL
    elif hasattr(obj, '__dict__'):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        class_name = getattr(getattr(obj, '__class__', None), '__name__', 'object')
        result = {
            "__type__": class_name,
            "__class__": class_name,
            "__id__": node_id,
        }
        try:
            raw_fields = getattr(obj, '__dict__', None)
        except Exception:
            raw_fields = None
        if isinstance(raw_fields, _builtins.dict):
            fields = []
            for key, value in raw_fields.items():
                key_str = str(key)
                if key_str.startswith('_'):
                    continue
                if callable(value):
                    continue
                fields.append((key_str, value))
            for key_str, value in fields[:_MAX_OBJECT_FIELDS]:
                result[key_str] = _serialize(value, depth + 1, node_refs)
            if len(fields) > _MAX_OBJECT_FIELDS:
                result["__truncated__"] = True
                result["remaining"] = len(fields) - _MAX_OBJECT_FIELDS
        return result
    else:
        repr_str = repr(obj)
        # Filter out function-like representations (e.g., <function foo at 0x...>)
        if repr_str.startswith('<') and repr_str.endswith('>'):
            return _SKIP_SENTINEL
        return repr_str

def _serialize_output(obj, depth=0, node_refs=None):
    if node_refs is None:
        node_refs = {}
    if isinstance(obj, (bool, int, str, type(None))):
        return obj
    elif isinstance(obj, float):
        if not math.isfinite(obj):
            if math.isnan(obj):
                return "NaN"
            return "Infinity" if obj > 0 else "-Infinity"
        return obj
    if depth > _MAX_SERIALIZE_DEPTH:
        return "<max depth>"
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize_output(x, depth + 1, node_refs) for x in obj]
    elif getattr(obj, '__class__', None) and getattr(obj.__class__, '__name__', '') == 'deque':
        return [_serialize_output(x, depth + 1, node_refs) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize_output(v, depth + 1, node_refs) for k, v in obj.items()}
    elif isinstance(obj, set):
        try:
            sorted_vals = sorted([_serialize_output(x, depth + 1, node_refs) for x in obj])
        except TypeError:
            sorted_vals = [_serialize_output(x, depth + 1, node_refs) for x in obj]
        return {"__type__": "set", "values": sorted_vals}
    elif isinstance(obj, TreeNode):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        result = {
            "__type__": "TreeNode",
            "__id__": node_id,
            "val": _serialize_output(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, node_refs),
        }
        if hasattr(obj, 'left'):
            result["left"] = _serialize_output(obj.left, depth + 1, node_refs)
        if hasattr(obj, 'right'):
            result["right"] = _serialize_output(obj.right, depth + 1, node_refs)
        return result
    elif isinstance(obj, ListNode):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        result = {
            "__type__": "ListNode",
            "__id__": node_id,
            "val": _serialize_output(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, node_refs),
        }
        result["next"] = _serialize_output(obj.next, depth + 1, node_refs)
        return result
    elif callable(obj):
        return _SKIP_SENTINEL
    elif hasattr(obj, '__dict__'):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        class_name = getattr(getattr(obj, '__class__', None), '__name__', 'object')
        result = {
            "__type__": class_name,
            "__class__": class_name,
            "__id__": node_id,
        }
        try:
            raw_fields = getattr(obj, '__dict__', None)
        except Exception:
            raw_fields = None
        if isinstance(raw_fields, _builtins.dict):
            for key, value in raw_fields.items():
                key_str = str(key)
                if key_str.startswith('_') or callable(value):
                    continue
                result[key_str] = _serialize_output(value, depth + 1, node_refs)
        return result
    else:
        repr_str = repr(obj)
        if repr_str.startswith('<') and repr_str.endswith('>'):
            return _SKIP_SENTINEL
        return repr_str
`;
var PYTHON_EXECUTE_SERIALIZE_FUNCTION = `
_MAX_SERIALIZE_DEPTH = 48

def _serialize(obj, depth=0):
    if isinstance(obj, (bool, int, str, type(None))):
        return obj
    elif isinstance(obj, float):
        if not math.isfinite(obj):
            if math.isnan(obj):
                return "NaN"
            return "Infinity" if obj > 0 else "-Infinity"
        return obj
    if depth > _MAX_SERIALIZE_DEPTH:
        return "<max depth>"
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize(x, depth + 1) for x in obj]
    elif getattr(obj, '__class__', None) and getattr(obj.__class__, '__name__', '') == 'deque':
        return [_serialize(x, depth + 1) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize(v, depth + 1) for k, v in obj.items()}
    elif isinstance(obj, set):
        try:
            return {"__type__": "set", "values": sorted([_serialize(x, depth + 1) for x in obj])}
        except TypeError:
            return {"__type__": "set", "values": [_serialize(x, depth + 1) for x in obj]}
    elif isinstance(obj, TreeNode):
        result = {"__type__": "TreeNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1)}
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1)
        return result
    elif isinstance(obj, ListNode):
        result = {"__type__": "ListNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1)}
        result["next"] = _serialize(obj.next, depth + 1)
        return result
    elif callable(obj):
        return None
    elif hasattr(obj, '__dict__'):
        class_name = getattr(getattr(obj, '__class__', None), '__name__', 'object')
        result = {"__type__": class_name, "__class__": class_name}
        try:
            raw_fields = getattr(obj, '__dict__', None)
        except Exception:
            raw_fields = None
        if isinstance(raw_fields, _builtins.dict):
            for key, value in raw_fields.items():
                key_str = str(key)
                if key_str.startswith('_') or callable(value):
                    continue
                result[key_str] = _serialize(value, depth + 1)
        return result
    else:
        repr_str = repr(obj)
        if repr_str.startswith('<') and repr_str.endswith('>'):
            return None
        return repr_str
`;
var PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION = `
def _serialize(obj, depth=0, state=None):
    if state is None:
        state = {"nodes": 0, "seen": set()}
    if depth > 64:
        return "__MAX_DEPTH__"
    if isinstance(obj, (int, float, str, bool, type(None))):
        return obj

    state["nodes"] += 1
    if state["nodes"] > 600:
        return "__MAX_NODES__"

    if isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize(x, depth + 1, state) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize(v, depth + 1, state) for k, v in obj.items()}
    elif isinstance(obj, set):
        serialized = [_serialize(x, depth + 1, state) for x in obj]
        try:
            serialized = sorted(serialized)
        except TypeError:
            pass
        return {"__type__": "set", "values": serialized}
    elif (hasattr(obj, 'val') or hasattr(obj, 'value')) and (hasattr(obj, 'left') or hasattr(obj, 'right')):
        obj_id = _builtins.id(obj)
        if obj_id in state["seen"]:
            return "__CYCLE__"
        state["seen"].add(obj_id)
        result = {"__type__": "TreeNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, state)}
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1, state)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1, state)
        state["seen"].remove(obj_id)
        return result
    elif (hasattr(obj, 'val') or hasattr(obj, 'value')) and hasattr(obj, 'next'):
        obj_id = _builtins.id(obj)
        if obj_id in state["seen"]:
            return "__CYCLE__"
        state["seen"].add(obj_id)
        result = {"__type__": "ListNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, state)}
        result["next"] = _serialize(obj.next, depth + 1, state)
        state["seen"].remove(obj_id)
        return result
    else:
        return repr(obj)
`;
var PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION = `
def _serialize(obj, depth=0):
    if depth > 10:
        return "<max depth>"
    if isinstance(obj, (int, float, str, bool, type(None))):
        return obj
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize(x, depth + 1) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize(v, depth + 1) for k, v in obj.items()}
    elif isinstance(obj, set):
        try:
            return {"__type__": "set", "values": sorted([_serialize(x, depth + 1) for x in obj])}
        except TypeError:
            return {"__type__": "set", "values": [_serialize(x, depth + 1) for x in obj]}
    elif isinstance(obj, TreeNode):
        result = {"__type__": "TreeNode", "val": _serialize(getattr(obj, 'val', None), depth + 1)}
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1)
        return result
    elif isinstance(obj, ListNode):
        result = {"__type__": "ListNode", "val": _serialize(getattr(obj, 'val', None), depth + 1)}
        result["next"] = _serialize(obj.next, depth + 1)
        return result
    else:
        return repr(obj)
`;
var PYTHON_SERIALIZE_FUNCTION = `
_MAX_SERIALIZE_DEPTH = 48

def _serialize(obj, depth=0):
    if isinstance(obj, (bool, int, str, type(None))):
        return obj
    elif isinstance(obj, float):
        if not math.isfinite(obj):
            if math.isnan(obj):
                return "NaN"
            return "Infinity" if obj > 0 else "-Infinity"
        return obj
    if depth > _MAX_SERIALIZE_DEPTH:
        return "<max depth>"
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize(x, depth + 1) for x in obj]
    elif getattr(obj, '__class__', None) and getattr(obj.__class__, '__name__', '') == 'deque':
        return [_serialize(x, depth + 1) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize(v, depth + 1) for k, v in obj.items()}
    elif isinstance(obj, set):
        try:
            return {"__type__": "set", "values": sorted([_serialize(x, depth + 1) for x in obj])}
        except TypeError:
            return {"__type__": "set", "values": [_serialize(x, depth + 1) for x in obj]}
    elif isinstance(obj, TreeNode):
        result = {"__type__": "TreeNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1)}
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1)
        return result
    elif isinstance(obj, ListNode):
        result = {"__type__": "ListNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1)}
        result["next"] = _serialize(obj.next, depth + 1)
        return result
    elif callable(obj):
        return None
    elif hasattr(obj, '__dict__'):
        class_name = getattr(getattr(obj, '__class__', None), '__name__', 'object')
        result = {"__type__": class_name, "__class__": class_name}
        try:
            raw_fields = getattr(obj, '__dict__', None)
        except Exception:
            raw_fields = None
        if isinstance(raw_fields, _builtins.dict):
            for key, value in raw_fields.items():
                key_str = str(key)
                if key_str.startswith('_') or callable(value):
                    continue
                result[key_str] = _serialize(value, depth + 1)
        return result
    else:
        repr_str = repr(obj)
        if repr_str.startswith('<') and repr_str.endswith('>'):
            return None
        return repr_str
`;

// packages/harness-python/src/python-harness.ts
function identifyConversions(inputs) {
  const treeKeys = [];
  const listKeys = [];
  for (const [key, value] of Object.entries(inputs)) {
    if (value && typeof value === "object" && !Array.isArray(value) && ("val" in value || "value" in value)) {
      const obj = value;
      const hasLeft = "left" in obj;
      const hasRight = "right" in obj;
      const hasNext = "next" in obj;
      if (hasLeft || hasRight) {
        treeKeys.push(key);
      } else if (hasNext) {
        listKeys.push(key);
      } else {
        treeKeys.push(key);
      }
    }
  }
  return { treeKeys, listKeys };
}
function generateConversionCode(inputs) {
  const { treeKeys, listKeys } = identifyConversions(inputs);
  const lines = [];
  for (const key of treeKeys) {
    lines.push(`${key} = _dict_to_tree(${key})`);
  }
  for (const key of listKeys) {
    lines.push(`${key} = _dict_to_list(${key})`);
  }
  return lines.join("\n");
}
function generateInputSetup(inputs) {
  return Object.entries(inputs).map(([key, value]) => `${key} = ${toPythonLiteral(value)}`).join("\n");
}
function generateSolutionScript(solutionCode, functionName, inputs) {
  const inputSetup = generateInputSetup(inputs);
  const conversionCode = generateConversionCode(inputs);
  const paramList = Object.keys(inputs).map((key) => `${key}=${key}`).join(", ");
  return `
import json
import math
import sys
import builtins as _builtins
from typing import *

${PYTHON_CLASS_DEFINITIONS}

${PYTHON_CONVERSION_HELPERS}

${PYTHON_SERIALIZE_FUNCTION}

# Solution code
${solutionCode}

# Set up inputs
${inputSetup}

# Convert tree/list inputs
${conversionCode}

# Run the function
try:
    _result = ${functionName}(${paramList})
    print(json.dumps({"success": True, "output": _serialize(_result)}))
except Exception as e:
    print(json.dumps({"success": False, "error": f"{type(e).__name__}: {str(e)}"}))
`;
}

// packages/harness-python/src/python-harness-template.ts
function templateToPythonLiteral(value) {
  if (value === null || value === void 0) {
    return "None";
  }
  if (typeof value === "boolean") {
    return value ? "True" : "False";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(templateToPythonLiteral).join(", ") + "]";
  }
  if (typeof value === "object") {
    const entries = Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}: ${templateToPythonLiteral(v)}`).join(", ");
    return "{" + entries + "}";
  }
  return JSON.stringify(value);
}
var TEMPLATE_PYTHON_CLASS_DEFINITIONS = `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.value = val
        self.left = left
        self.right = right
    def __getitem__(self, key):
        if key == 'val': return getattr(self, 'val', getattr(self, 'value', None))
        if key == 'value': return getattr(self, 'value', getattr(self, 'val', None))
        if key == 'left': return self.left
        if key == 'right': return self.right
        raise KeyError(key)
    def get(self, key, default=None):
        if key == 'val': return getattr(self, 'val', getattr(self, 'value', default))
        if key == 'value': return getattr(self, 'value', getattr(self, 'val', default))
        if key == 'left': return self.left
        if key == 'right': return self.right
        return default
    def __repr__(self):
        return f"TreeNode({getattr(self, 'val', getattr(self, 'value', None))})"

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.value = val
        self.next = next
    def __getitem__(self, key):
        if key == 'val': return getattr(self, 'val', getattr(self, 'value', None))
        if key == 'value': return getattr(self, 'value', getattr(self, 'val', None))
        if key == 'next': return self.next
        raise KeyError(key)
    def get(self, key, default=None):
        if key == 'val': return getattr(self, 'val', getattr(self, 'value', default))
        if key == 'value': return getattr(self, 'value', getattr(self, 'val', default))
        if key == 'next': return self.next
        return default
    def __repr__(self):
        return f"ListNode({getattr(self, 'val', getattr(self, 'value', None))})"
`;
var TEMPLATE_PYTHON_CONVERSION_HELPERS = `
def _ensure_node_value_aliases(node):
    if node is None:
        return node
    try:
        has_val = hasattr(node, 'val')
        has_value = hasattr(node, 'value')
        if has_value and not has_val:
            try:
                setattr(node, 'val', getattr(node, 'value'))
            except Exception:
                pass
        elif has_val and not has_value:
            try:
                setattr(node, 'value', getattr(node, 'val'))
            except Exception:
                pass
    except Exception:
        pass
    return node

def _dict_to_tree(d):
    if d is None:
        return None
    if not isinstance(d, _builtins.dict):
        return d
    if 'val' not in d and 'value' not in d:
        return d
    node = TreeNode(d.get('val', d.get('value', 0)))
    _ensure_node_value_aliases(node)
    node.left = _dict_to_tree(d.get('left'))
    node.right = _dict_to_tree(d.get('right'))
    return node

def _dict_to_list(d, _refs=None):
    if _refs is None:
        _refs = {}
    if d is None:
        return None
    if not isinstance(d, _builtins.dict):
        return d
    if '__ref__' in d:
        return _refs.get(d.get('__ref__'))
    if 'val' not in d and 'value' not in d:
        return d
    node = ListNode(d.get('val', d.get('value', 0)))
    _ensure_node_value_aliases(node)
    node_id = d.get('__id__')
    if isinstance(node_id, _builtins.str) and node_id:
        _refs[node_id] = node
    node.next = _dict_to_list(d.get('next'), _refs)
    return node
`;
var TEMPLATE_PYTHON_TRACE_SERIALIZE_FUNCTION = `
# Sentinel to mark skipped values (functions, etc.) - distinct from None
_SKIP_SENTINEL = "__TRACECODE_SKIP__"
_MAX_SERIALIZE_DEPTH = 48
_MAX_SERIALIZED_ITEMS = 64
_MAX_OBJECT_FIELDS = 32
_tracecode_global_object_refs = {}
_tracecode_next_object_ref_id = 0

def _tracecode_ref_id(obj_ref, node_refs):
    global _tracecode_next_object_ref_id
    if obj_ref in node_refs:
        return node_refs[obj_ref]
    if obj_ref in _tracecode_global_object_refs:
        node_id = _tracecode_global_object_refs[obj_ref]
    else:
        node_id = f"ref-{_tracecode_next_object_ref_id}"
        _tracecode_global_object_refs[obj_ref] = node_id
        _tracecode_next_object_ref_id += 1
    node_refs[obj_ref] = node_id
    return node_id

def _truncation_marker(total, emitted):
    return {"__truncated__": True, "remaining": max(0, total - emitted)}

def _serialize_sequence(values, depth, node_refs):
    values_list = _builtins.list(values)
    emitted = min(len(values_list), _MAX_SERIALIZED_ITEMS)
    result = [_serialize(x, depth + 1, node_refs) for x in values_list[:emitted]]
    if emitted < len(values_list):
        result.append(_truncation_marker(len(values_list), emitted))
    return result

def _serialize(obj, depth=0, node_refs=None):
    if node_refs is None:
        node_refs = {}
    if isinstance(obj, (bool, int, str, type(None))):
        return obj
    elif isinstance(obj, float):
        if not math.isfinite(obj):
            if math.isnan(obj):
                return "NaN"
            return "Infinity" if obj > 0 else "-Infinity"
        return obj
    if depth > _MAX_SERIALIZE_DEPTH:
        return "<max depth>"
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return _serialize_sequence(obj, depth, node_refs)
    elif getattr(obj, '__class__', None) and getattr(obj.__class__, '__name__', '') == 'deque':
        return _serialize_sequence(obj, depth, node_refs)
    elif isinstance(obj, _builtins.dict):
        items = _builtins.list(obj.items())
        emitted = min(len(items), _MAX_SERIALIZED_ITEMS)
        result = {str(k): _serialize(v, depth + 1, node_refs) for k, v in items[:emitted]}
        if emitted < len(items):
            result["__truncated__"] = True
            result["remaining"] = len(items) - emitted
        return result
    elif isinstance(obj, set):
        # Use try/except for sorting to handle heterogeneous sets
        values = _builtins.list(obj)
        emitted = min(len(values), _MAX_SERIALIZED_ITEMS)
        try:
            sorted_vals = sorted([_serialize(x, depth + 1, node_refs) for x in values[:emitted]])
        except TypeError:
            sorted_vals = [_serialize(x, depth + 1, node_refs) for x in values[:emitted]]
        result = {"__type__": "set", "values": sorted_vals}
        if emitted < len(values):
            result["__truncated__"] = True
            result["remaining"] = len(values) - emitted
        return result
    elif isinstance(obj, TreeNode):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        result = {
            "__type__": "TreeNode",
            "__id__": node_id,
            "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, node_refs),
        }
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1, node_refs)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1, node_refs)
        return result
    elif isinstance(obj, ListNode):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        result = {
            "__type__": "ListNode",
            "__id__": node_id,
            "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, node_refs),
        }
        result["next"] = _serialize(obj.next, depth + 1, node_refs)
        return result
    elif callable(obj):
        # Skip functions entirely - return sentinel
        return _SKIP_SENTINEL
    elif hasattr(obj, '__dict__'):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        class_name = getattr(getattr(obj, '__class__', None), '__name__', 'object')
        result = {
            "__type__": class_name,
            "__class__": class_name,
            "__id__": node_id,
        }
        try:
            raw_fields = getattr(obj, '__dict__', None)
        except Exception:
            raw_fields = None
        if isinstance(raw_fields, _builtins.dict):
            fields = []
            for key, value in raw_fields.items():
                key_str = str(key)
                if key_str.startswith('_'):
                    continue
                if callable(value):
                    continue
                fields.append((key_str, value))
            for key_str, value in fields[:_MAX_OBJECT_FIELDS]:
                result[key_str] = _serialize(value, depth + 1, node_refs)
            if len(fields) > _MAX_OBJECT_FIELDS:
                result["__truncated__"] = True
                result["remaining"] = len(fields) - _MAX_OBJECT_FIELDS
        return result
    else:
        repr_str = repr(obj)
        # Filter out function-like representations (e.g., <function foo at 0x...>)
        if repr_str.startswith('<') and repr_str.endswith('>'):
            return _SKIP_SENTINEL
        return repr_str

def _serialize_output(obj, depth=0, node_refs=None):
    if node_refs is None:
        node_refs = {}
    if isinstance(obj, (bool, int, str, type(None))):
        return obj
    elif isinstance(obj, float):
        if not math.isfinite(obj):
            if math.isnan(obj):
                return "NaN"
            return "Infinity" if obj > 0 else "-Infinity"
        return obj
    if depth > _MAX_SERIALIZE_DEPTH:
        return "<max depth>"
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize_output(x, depth + 1, node_refs) for x in obj]
    elif getattr(obj, '__class__', None) and getattr(obj.__class__, '__name__', '') == 'deque':
        return [_serialize_output(x, depth + 1, node_refs) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize_output(v, depth + 1, node_refs) for k, v in obj.items()}
    elif isinstance(obj, set):
        try:
            sorted_vals = sorted([_serialize_output(x, depth + 1, node_refs) for x in obj])
        except TypeError:
            sorted_vals = [_serialize_output(x, depth + 1, node_refs) for x in obj]
        return {"__type__": "set", "values": sorted_vals}
    elif isinstance(obj, TreeNode):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        result = {
            "__type__": "TreeNode",
            "__id__": node_id,
            "val": _serialize_output(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, node_refs),
        }
        if hasattr(obj, 'left'):
            result["left"] = _serialize_output(obj.left, depth + 1, node_refs)
        if hasattr(obj, 'right'):
            result["right"] = _serialize_output(obj.right, depth + 1, node_refs)
        return result
    elif isinstance(obj, ListNode):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        result = {
            "__type__": "ListNode",
            "__id__": node_id,
            "val": _serialize_output(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, node_refs),
        }
        result["next"] = _serialize_output(obj.next, depth + 1, node_refs)
        return result
    elif callable(obj):
        return _SKIP_SENTINEL
    elif hasattr(obj, '__dict__'):
        obj_ref = _builtins.id(obj)
        if obj_ref in node_refs:
            return {"__ref__": node_refs[obj_ref]}
        node_id = _tracecode_ref_id(obj_ref, node_refs)
        class_name = getattr(getattr(obj, '__class__', None), '__name__', 'object')
        result = {
            "__type__": class_name,
            "__class__": class_name,
            "__id__": node_id,
        }
        try:
            raw_fields = getattr(obj, '__dict__', None)
        except Exception:
            raw_fields = None
        if isinstance(raw_fields, _builtins.dict):
            for key, value in raw_fields.items():
                key_str = str(key)
                if key_str.startswith('_') or callable(value):
                    continue
                result[key_str] = _serialize_output(value, depth + 1, node_refs)
        return result
    else:
        repr_str = repr(obj)
        if repr_str.startswith('<') and repr_str.endswith('>'):
            return _SKIP_SENTINEL
        return repr_str
`;
var TEMPLATE_PYTHON_EXECUTE_SERIALIZE_FUNCTION = `
_MAX_SERIALIZE_DEPTH = 48

def _serialize(obj, depth=0):
    if isinstance(obj, (bool, int, str, type(None))):
        return obj
    elif isinstance(obj, float):
        if not math.isfinite(obj):
            if math.isnan(obj):
                return "NaN"
            return "Infinity" if obj > 0 else "-Infinity"
        return obj
    if depth > _MAX_SERIALIZE_DEPTH:
        return "<max depth>"
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize(x, depth + 1) for x in obj]
    elif getattr(obj, '__class__', None) and getattr(obj.__class__, '__name__', '') == 'deque':
        return [_serialize(x, depth + 1) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize(v, depth + 1) for k, v in obj.items()}
    elif isinstance(obj, set):
        try:
            return {"__type__": "set", "values": sorted([_serialize(x, depth + 1) for x in obj])}
        except TypeError:
            return {"__type__": "set", "values": [_serialize(x, depth + 1) for x in obj]}
    elif isinstance(obj, TreeNode):
        result = {"__type__": "TreeNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1)}
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1)
        return result
    elif isinstance(obj, ListNode):
        result = {"__type__": "ListNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1)}
        result["next"] = _serialize(obj.next, depth + 1)
        return result
    elif callable(obj):
        return None
    elif hasattr(obj, '__dict__'):
        class_name = getattr(getattr(obj, '__class__', None), '__name__', 'object')
        result = {"__type__": class_name, "__class__": class_name}
        try:
            raw_fields = getattr(obj, '__dict__', None)
        except Exception:
            raw_fields = None
        if isinstance(raw_fields, _builtins.dict):
            for key, value in raw_fields.items():
                key_str = str(key)
                if key_str.startswith('_') or callable(value):
                    continue
                result[key_str] = _serialize(value, depth + 1)
        return result
    else:
        repr_str = repr(obj)
        if repr_str.startswith('<') and repr_str.endswith('>'):
            return None
        return repr_str
`;
var TEMPLATE_PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION = `
def _serialize(obj, depth=0, state=None):
    if state is None:
        state = {"nodes": 0, "seen": set()}
    if depth > 64:
        return "__MAX_DEPTH__"
    if isinstance(obj, (int, float, str, bool, type(None))):
        return obj

    state["nodes"] += 1
    if state["nodes"] > 600:
        return "__MAX_NODES__"

    if isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize(x, depth + 1, state) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize(v, depth + 1, state) for k, v in obj.items()}
    elif isinstance(obj, set):
        serialized = [_serialize(x, depth + 1, state) for x in obj]
        try:
            serialized = sorted(serialized)
        except TypeError:
            pass
        return {"__type__": "set", "values": serialized}
    elif (hasattr(obj, 'val') or hasattr(obj, 'value')) and (hasattr(obj, 'left') or hasattr(obj, 'right')):
        obj_id = _builtins.id(obj)
        if obj_id in state["seen"]:
            return "__CYCLE__"
        state["seen"].add(obj_id)
        result = {"__type__": "TreeNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, state)}
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1, state)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1, state)
        state["seen"].remove(obj_id)
        return result
    elif (hasattr(obj, 'val') or hasattr(obj, 'value')) and hasattr(obj, 'next'):
        obj_id = _builtins.id(obj)
        if obj_id in state["seen"]:
            return "__CYCLE__"
        state["seen"].add(obj_id)
        result = {"__type__": "ListNode", "val": _serialize(getattr(obj, 'val', getattr(obj, 'value', None)), depth + 1, state)}
        result["next"] = _serialize(obj.next, depth + 1, state)
        state["seen"].remove(obj_id)
        return result
    else:
        return repr(obj)
`;
var TEMPLATE_PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION = `
def _serialize(obj, depth=0):
    if depth > 10:
        return "<max depth>"
    if isinstance(obj, (int, float, str, bool, type(None))):
        return obj
    elif isinstance(obj, (_builtins.list, _builtins.tuple)):
        return [_serialize(x, depth + 1) for x in obj]
    elif isinstance(obj, _builtins.dict):
        return {str(k): _serialize(v, depth + 1) for k, v in obj.items()}
    elif isinstance(obj, set):
        try:
            return {"__type__": "set", "values": sorted([_serialize(x, depth + 1) for x in obj])}
        except TypeError:
            return {"__type__": "set", "values": [_serialize(x, depth + 1) for x in obj]}
    elif isinstance(obj, TreeNode):
        result = {"__type__": "TreeNode", "val": _serialize(getattr(obj, 'val', None), depth + 1)}
        if hasattr(obj, 'left'):
            result["left"] = _serialize(obj.left, depth + 1)
        if hasattr(obj, 'right'):
            result["right"] = _serialize(obj.right, depth + 1)
        return result
    elif isinstance(obj, ListNode):
        result = {"__type__": "ListNode", "val": _serialize(getattr(obj, 'val', None), depth + 1)}
        result["next"] = _serialize(obj.next, depth + 1)
        return result
    else:
        return repr(obj)
`;
var TEMPLATE_PYTHON_SERIALIZE_FUNCTION = TEMPLATE_PYTHON_EXECUTE_SERIALIZE_FUNCTION;

// packages/harness-javascript/src/typescript-runtime-declarations.ts
var TYPESCRIPT_RUNTIME_DECLARATIONS = `
declare class ListNode {
  val: any;
  value: any;
  next: ListNode | SerializedListNode | SerializedRef | null;
  prev?: ListNode | SerializedListNode | SerializedRef | null;
  constructor(val?: any, next?: ListNode | null);
}

declare class TreeNode {
  val: any;
  value: any;
  left: TreeNode | SerializedTreeNode | SerializedRef | null;
  right: TreeNode | SerializedTreeNode | SerializedRef | null;
  constructor(val?: any, left?: TreeNode | null, right?: TreeNode | null);
}

type SerializedRef = { __ref__: string };

type SerializedListNode = {
  __id__?: string;
  __type__?: 'ListNode';
  val?: any;
  value?: any;
  next?: SerializedListNode | SerializedRef | ListNode | null;
  prev?: SerializedListNode | SerializedRef | ListNode | null;
};

type SerializedTreeNode = {
  __id__?: string;
  __type__?: 'TreeNode';
  val?: any;
  value?: any;
  left?: SerializedTreeNode | SerializedRef | TreeNode | null;
  right?: SerializedTreeNode | SerializedRef | TreeNode | null;
};
`;
function withTypeScriptRuntimeDeclarations(sourceCode) {
  return `${sourceCode}

${TYPESCRIPT_RUNTIME_DECLARATIONS}
`;
}

// packages/harness-javascript/src/javascript-executor.ts
var typeScriptModulePromise = null;
var javascriptLibraryPromise = null;
async function getTypeScriptModule() {
  if (!typeScriptModulePromise) {
    const specifier = "typescript";
    typeScriptModulePromise = import(
      /* webpackIgnore: true */
      specifier
    );
  }
  return typeScriptModulePromise;
}
async function tryImportJavaScriptLibraryModule(specifier) {
  try {
    return await import(
      /* webpackIgnore: true */
      specifier
    );
  } catch {
    return void 0;
  }
}
function normalizeCommonJsLikeModule(moduleValue) {
  if (!moduleValue || typeof moduleValue !== "object") return moduleValue;
  const record = moduleValue;
  const namedKeys = Object.keys(record).filter((key) => key !== "default");
  if (namedKeys.length === 0 && "default" in record) {
    return record.default;
  }
  if (record.default && typeof record.default === "object") {
    return { ...record.default, ...record };
  }
  return record;
}
function moduleMember(moduleValue, name) {
  if (!moduleValue || typeof moduleValue !== "object") return void 0;
  const record = moduleValue;
  return record[name];
}
async function getJavaScriptLibraryEnvironment() {
  if (!javascriptLibraryPromise) {
    javascriptLibraryPromise = (async () => {
      const [
        lodashModule,
        binarySearchTreeModule,
        dequeModule,
        graphModule,
        heapModule,
        linkedListModule,
        priorityQueueModule,
        queueModule,
        enhancedSetModule,
        stackModule,
        trieModule
      ] = await Promise.all([
        tryImportJavaScriptLibraryModule("lodash"),
        tryImportJavaScriptLibraryModule("@datastructures-js/binary-search-tree"),
        tryImportJavaScriptLibraryModule("@datastructures-js/deque"),
        tryImportJavaScriptLibraryModule("@datastructures-js/graph"),
        tryImportJavaScriptLibraryModule("@datastructures-js/heap"),
        tryImportJavaScriptLibraryModule("@datastructures-js/linked-list"),
        tryImportJavaScriptLibraryModule("@datastructures-js/priority-queue"),
        tryImportJavaScriptLibraryModule("@datastructures-js/queue"),
        tryImportJavaScriptLibraryModule("@datastructures-js/set"),
        tryImportJavaScriptLibraryModule("@datastructures-js/stack"),
        tryImportJavaScriptLibraryModule("@datastructures-js/trie")
      ]);
      const lodash = normalizeCommonJsLikeModule(lodashModule);
      const binarySearchTree = normalizeCommonJsLikeModule(binarySearchTreeModule);
      const deque = normalizeCommonJsLikeModule(dequeModule);
      const graph = normalizeCommonJsLikeModule(graphModule);
      const heap = normalizeCommonJsLikeModule(heapModule);
      const linkedList = normalizeCommonJsLikeModule(linkedListModule);
      const priorityQueue = normalizeCommonJsLikeModule(priorityQueueModule);
      const queue = normalizeCommonJsLikeModule(queueModule);
      const enhancedSet = normalizeCommonJsLikeModule(enhancedSetModule);
      const stack = normalizeCommonJsLikeModule(stackModule);
      const trie = normalizeCommonJsLikeModule(trieModule);
      const moduleEntries = [
        ["lodash", lodash],
        ["lodash.js", lodash],
        ["@datastructures-js/binary-search-tree", binarySearchTree],
        ["@datastructures-js/deque", deque],
        ["@datastructures-js/graph", graph],
        ["@datastructures-js/heap", heap],
        ["@datastructures-js/linked-list", linkedList],
        ["@datastructures-js/priority-queue", priorityQueue],
        ["@datastructures-js/queue", queue],
        ["@datastructures-js/set", enhancedSet],
        ["@datastructures-js/stack", stack],
        ["@datastructures-js/trie", trie]
      ].filter((entry) => entry[1] !== void 0);
      const globals = {
        _: lodash,
        lodash,
        Deque: moduleMember(deque, "Deque"),
        DoublyLinkedList: moduleMember(linkedList, "DoublyLinkedList"),
        DoublyLinkedListNode: moduleMember(linkedList, "DoublyLinkedListNode"),
        EnhancedSet: moduleMember(enhancedSet, "EnhancedSet"),
        Heap: moduleMember(heap, "Heap"),
        LinkedList: moduleMember(linkedList, "LinkedList"),
        LinkedListNode: moduleMember(linkedList, "LinkedListNode"),
        MaxHeap: moduleMember(heap, "MaxHeap"),
        MaxPriorityQueue: moduleMember(priorityQueue, "MaxPriorityQueue"),
        MinHeap: moduleMember(heap, "MinHeap"),
        MinPriorityQueue: moduleMember(priorityQueue, "MinPriorityQueue"),
        PriorityQueue: moduleMember(priorityQueue, "PriorityQueue"),
        Queue: moduleMember(queue, "Queue"),
        Stack: moduleMember(stack, "Stack")
      };
      for (const [key, value] of Object.entries(globals)) {
        if (value === void 0) delete globals[key];
      }
      return {
        modules: Object.fromEntries(moduleEntries),
        globals
      };
    })();
  }
  return javascriptLibraryPromise;
}
function installJavaScriptLibraryGlobals(environment) {
  const scope = globalThis;
  const descriptors = /* @__PURE__ */ new Map();
  const previousRequire = typeof scope.require === "function" ? scope.require : null;
  const moduleObject = { exports: {} };
  const requireFunction = (specifier) => {
    if (Object.prototype.hasOwnProperty.call(environment.modules, specifier)) {
      return environment.modules[specifier];
    }
    if (previousRequire && previousRequire !== requireFunction) {
      return previousRequire(specifier);
    }
    throw new Error(`Cannot find module '${specifier}'`);
  };
  const values = {
    ...environment.globals,
    __TRACECODE_JAVASCRIPT_LIBRARIES__: environment.modules,
    require: requireFunction,
    module: moduleObject,
    exports: moduleObject.exports
  };
  for (const [key, value] of Object.entries(values)) {
    descriptors.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(scope, key, {
      value,
      configurable: true,
      writable: true
    });
  }
  return () => {
    for (const [key, descriptor] of descriptors) {
      if (descriptor) {
        Object.defineProperty(scope, key, descriptor);
      } else {
        delete scope[key];
      }
    }
  };
}
function performanceNow() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}
function formatConsoleArg(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || value === null || value === void 0) {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
function createConsoleProxy(output) {
  const capture = (...args) => {
    output.push(args.map(formatConsoleArg).join(" "));
  };
  return {
    ...console,
    log: capture,
    info: capture,
    warn: capture,
    error: capture,
    debug: capture
  };
}
function isLikelyTreeNodeValue(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value;
  if (record.__type__ === "TreeNode") return true;
  const ctor = value.constructor;
  return ctor?.name === "TreeNode";
}
function isLikelyListNodeValue(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value;
  if (record.__type__ === "ListNode") return true;
  const ctor = value.constructor;
  return ctor?.name === "ListNode";
}
function getCustomClassName(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (value instanceof Map || value instanceof Set) return null;
  if (isLikelyTreeNodeValue(value) || isLikelyListNodeValue(value)) return null;
  const ctor = value.constructor;
  const name = typeof ctor?.name === "string" ? ctor.name : "";
  if (!name || name === "Object" || name === "Array" || name === "Map" || name === "Set") {
    return null;
  }
  return name;
}
var RUNTIME_VALUE_MAX_DEPTH = 48;
var RUNTIME_VALUE_MAX_ITEMS = 64;
var RUNTIME_VALUE_MAX_OBJECT_FIELDS = 32;
var TRACE_SERIALIZATION_LIMITS = { maxItems: RUNTIME_VALUE_MAX_ITEMS, maxFields: RUNTIME_VALUE_MAX_OBJECT_FIELDS };
var OUTPUT_SERIALIZATION_LIMITS = { maxItems: Number.POSITIVE_INFINITY, maxFields: Number.POSITIVE_INFINITY };
var activeSerializationLimits = TRACE_SERIALIZATION_LIMITS;
function truncationMarker(total, emitted) {
  return { __truncated__: true, remaining: Math.max(0, total - emitted) };
}
function limitedEntries(items, maxItems) {
  return {
    values: items.slice(0, maxItems),
    remaining: Math.max(0, items.length - maxItems)
  };
}
function serializeValue(value, depth = 0, seen = /* @__PURE__ */ new WeakSet(), nodeRefState = { ids: /* @__PURE__ */ new Map(), nextId: 1 }) {
  if (depth > RUNTIME_VALUE_MAX_DEPTH) return "<max depth>";
  if (value === null || value === void 0) return value;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "bigint") {
    return Number.isSafeInteger(Number(value)) ? Number(value) : String(value);
  }
  if (typeof value === "function") {
    return "<function>";
  }
  if (Array.isArray(value)) {
    const limited = limitedEntries(value, activeSerializationLimits.maxItems);
    const result = limited.values.map((item) => serializeValue(item, depth + 1, seen, nodeRefState));
    if (limited.remaining > 0) result.push(truncationMarker(value.length, limited.values.length));
    return result;
  }
  if (value instanceof Set) {
    const items = [...value];
    const limited = limitedEntries(items, activeSerializationLimits.maxItems);
    const result = {
      __type__: "set",
      values: limited.values.map((item) => serializeValue(item, depth + 1, seen, nodeRefState))
    };
    if (limited.remaining > 0) {
      result.__truncated__ = true;
      result.remaining = limited.remaining;
    }
    return result;
  }
  if (value instanceof Map) {
    const entries = [...value.entries()];
    const limited = limitedEntries(entries, activeSerializationLimits.maxItems);
    const result = {
      __type__: "map",
      entries: limited.values.map(([k, v]) => [
        serializeValue(k, depth + 1, seen, nodeRefState),
        serializeValue(v, depth + 1, seen, nodeRefState)
      ])
    };
    if (limited.remaining > 0) {
      result.__truncated__ = true;
      result.remaining = limited.remaining;
    }
    return result;
  }
  if (typeof value === "object") {
    if (isLikelyTreeNodeValue(value) || isLikelyListNodeValue(value)) {
      const objectValue = value;
      const nodeValue = value;
      const existingId = nodeRefState.ids.get(objectValue);
      if (existingId) {
        return { __ref__: existingId };
      }
      const isTree = isLikelyTreeNodeValue(value);
      const nodeId = `ref-${nodeRefState.nextId++}`;
      nodeRefState.ids.set(objectValue, nodeId);
      const out2 = isTree ? {
        __type__: "TreeNode",
        __id__: nodeId,
        val: serializeValue(nodeValue.val ?? nodeValue.value ?? null, depth + 1, seen, nodeRefState),
        left: serializeValue(nodeValue.left ?? null, depth + 1, seen, nodeRefState),
        right: serializeValue(nodeValue.right ?? null, depth + 1, seen, nodeRefState)
      } : {
        __type__: "ListNode",
        __id__: nodeId,
        val: serializeValue(nodeValue.val ?? nodeValue.value ?? null, depth + 1, seen, nodeRefState),
        next: serializeValue(nodeValue.next ?? null, depth + 1, seen, nodeRefState),
        ..."prev" in nodeValue ? { prev: serializeValue(nodeValue.prev ?? null, depth + 1, seen, nodeRefState) } : {}
      };
      const skipped = isTree ? /* @__PURE__ */ new Set(["__id__", "__type__", "__class__", "val", "value", "left", "right"]) : /* @__PURE__ */ new Set(["__id__", "__type__", "__class__", "val", "value", "next", "prev"]);
      const fields2 = Object.entries(nodeValue).filter(([k]) => !skipped.has(k));
      for (const [k, v] of fields2.slice(0, activeSerializationLimits.maxFields)) {
        out2[k] = serializeValue(v, depth + 1, seen, nodeRefState);
      }
      if (fields2.length > activeSerializationLimits.maxFields) {
        out2.__truncated__ = true;
        out2.remaining = fields2.length - activeSerializationLimits.maxFields;
      }
      return out2;
    }
    const customClassName = getCustomClassName(value);
    if (customClassName) {
      const objectValue = value;
      const existingId = nodeRefState.ids.get(objectValue);
      if (existingId) {
        return { __ref__: existingId };
      }
      const objectId = `ref-${nodeRefState.nextId++}`;
      nodeRefState.ids.set(objectValue, objectId);
      if (seen.has(objectValue)) return { __ref__: objectId };
      seen.add(objectValue);
      const out2 = {
        __type__: customClassName,
        __class__: customClassName,
        __id__: objectId
      };
      const fields2 = Object.entries(value);
      for (const [k, v] of fields2.slice(0, activeSerializationLimits.maxFields)) {
        out2[k] = serializeValue(v, depth + 1, seen, nodeRefState);
      }
      if (fields2.length > activeSerializationLimits.maxFields) {
        out2.__truncated__ = true;
        out2.remaining = fields2.length - activeSerializationLimits.maxFields;
      }
      seen.delete(objectValue);
      return out2;
    }
    if (seen.has(value)) return "<cycle>";
    seen.add(value);
    const out = {};
    const fields = Object.entries(value);
    for (const [k, v] of fields.slice(0, activeSerializationLimits.maxFields)) {
      out[k] = serializeValue(v, depth + 1, seen, nodeRefState);
    }
    if (fields.length > activeSerializationLimits.maxFields) {
      out.__truncated__ = true;
      out.remaining = fields.length - activeSerializationLimits.maxFields;
    }
    seen.delete(value);
    return out;
  }
  return String(value);
}
function withSerializationLimits(limits, serialize) {
  const previous = activeSerializationLimits;
  activeSerializationLimits = limits;
  try {
    return serialize();
  } finally {
    activeSerializationLimits = previous;
  }
}
function serializeOutputValue(value) {
  return withSerializationLimits(OUTPUT_SERIALIZATION_LIMITS, () => serializeValue(value));
}
function extractUserErrorLine(error) {
  if (typeof error === "object" && error && "__tracecodeLine" in error) {
    const line2 = Number(error.__tracecodeLine);
    if (Number.isFinite(line2)) return line2;
  }
  const stack = typeof error === "object" && error && "stack" in error ? String(error.stack ?? "") : "";
  if (!stack) return void 0;
  const match = stack.match(/<anonymous>:(\d+):\d+/);
  if (!match) return void 0;
  const line = Number.parseInt(match[1], 10);
  return Number.isFinite(line) ? line : void 0;
}
function isPlainObjectRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.prototype.toString.call(value) === "[object Object]";
}
function collectReferenceTargets(value, byId, seen) {
  if (value === null || value === void 0) return;
  if (typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      collectReferenceTargets(item, byId, seen);
    }
    return;
  }
  if (!isPlainObjectRecord(value)) return;
  if (typeof value.__id__ === "string" && value.__id__.length > 0 && !byId.has(value.__id__)) {
    byId.set(value.__id__, value);
  }
  for (const nested of Object.values(value)) {
    collectReferenceTargets(nested, byId, seen);
  }
}
function resolveReferenceGraph(value, byId, resolved) {
  if (value === null || value === void 0) return value;
  if (typeof value !== "object") return value;
  if (resolved.has(value)) {
    return resolved.get(value);
  }
  if (Array.isArray(value)) {
    const out2 = [];
    resolved.set(value, out2);
    for (const item of value) {
      out2.push(resolveReferenceGraph(item, byId, resolved));
    }
    return out2;
  }
  if (!isPlainObjectRecord(value)) {
    return value;
  }
  const keys = Object.keys(value);
  if (keys.length === 1 && typeof value.__ref__ === "string") {
    const target = byId.get(value.__ref__);
    if (!target) return null;
    return resolveReferenceGraph(target, byId, resolved);
  }
  const out = {};
  resolved.set(value, out);
  for (const [key, nested] of Object.entries(value)) {
    out[key] = resolveReferenceGraph(nested, byId, resolved);
  }
  return out;
}
function cloneInputGraph(value, cloned = /* @__PURE__ */ new WeakMap()) {
  if (value === null || value === void 0) return value;
  if (typeof value !== "object") return value;
  if (cloned.has(value)) {
    return cloned.get(value);
  }
  if (Array.isArray(value)) {
    const out2 = [];
    cloned.set(value, out2);
    for (const item of value) {
      out2.push(cloneInputGraph(item, cloned));
    }
    return out2;
  }
  if (!isPlainObjectRecord(value)) {
    return value;
  }
  const out = {};
  cloned.set(value, out);
  for (const [key, nested] of Object.entries(value)) {
    out[key] = cloneInputGraph(nested, cloned);
  }
  return out;
}
function normalizeInputs(inputs) {
  if (!inputs || typeof inputs !== "object" || Array.isArray(inputs)) return {};
  const byId = /* @__PURE__ */ new Map();
  collectReferenceTargets(inputs, byId, /* @__PURE__ */ new WeakSet());
  if (byId.size === 0) {
    return cloneInputGraph(inputs);
  }
  const hydrated = resolveReferenceGraph(inputs, byId, /* @__PURE__ */ new WeakMap());
  if (!hydrated || typeof hydrated !== "object" || Array.isArray(hydrated)) {
    return cloneInputGraph(inputs);
  }
  return hydrated;
}
function buildTreeNodeFromLevelOrder(values) {
  if (!Array.isArray(values) || values.length === 0) return null;
  const firstValue = values[0];
  if (firstValue === null || firstValue === void 0) return null;
  const root = {
    val: firstValue,
    value: firstValue,
    left: null,
    right: null
  };
  const queue = [root];
  let index = 1;
  while (queue.length > 0 && index < values.length) {
    const node = queue.shift();
    if (!node) break;
    const leftValue = values[index++];
    if (leftValue !== null && leftValue !== void 0) {
      const leftNode = {
        val: leftValue,
        value: leftValue,
        left: null,
        right: null
      };
      node.left = leftNode;
      queue.push(leftNode);
    }
    if (index >= values.length) break;
    const rightValue = values[index++];
    if (rightValue !== null && rightValue !== void 0) {
      const rightNode = {
        val: rightValue,
        value: rightValue,
        left: null,
        right: null
      };
      node.right = rightNode;
      queue.push(rightNode);
    }
  }
  return root;
}
function materializeTreeInput(value) {
  if (value === null || value === void 0) return value;
  if (Array.isArray(value)) {
    return buildTreeNodeFromLevelOrder(value);
  }
  if (!isPlainObjectRecord(value)) {
    return value;
  }
  const record = value;
  if (isLikelyTreeNodeValue(record)) {
    const node = {
      val: record.val ?? record.value ?? null,
      value: record.val ?? record.value ?? null,
      left: materializeTreeInput(record.left ?? null),
      right: materializeTreeInput(record.right ?? null)
    };
    for (const [key, nested] of Object.entries(record)) {
      if (key === "__id__" || key === "__type__" || key === "val" || key === "value" || key === "left" || key === "right") continue;
      node[key] = materializeTreeInput(nested);
    }
    return node;
  }
  const taggedRecord = value;
  if (taggedRecord.__type__ === "TreeNode") {
    const node = {
      val: taggedRecord.val ?? taggedRecord.value ?? null,
      value: taggedRecord.val ?? taggedRecord.value ?? null,
      left: materializeTreeInput(taggedRecord.left ?? null),
      right: materializeTreeInput(taggedRecord.right ?? null)
    };
    for (const [key, nested] of Object.entries(taggedRecord)) {
      if (key === "__id__" || key === "__type__" || key === "val" || key === "value" || key === "left" || key === "right") continue;
      node[key] = materializeTreeInput(nested);
    }
    return node;
  }
  return value;
}
function materializeListInput(value, refs = /* @__PURE__ */ new Map(), materialized = /* @__PURE__ */ new WeakMap()) {
  if (value === null || value === void 0) return value;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    const head = {
      val: value[0],
      value: value[0],
      next: null
    };
    let current = head;
    for (let i = 1; i < value.length; i++) {
      const nextNode = { val: value[i], value: value[i], next: null };
      current.next = nextNode;
      current = nextNode;
    }
    return head;
  }
  if (!isPlainObjectRecord(value)) {
    return value;
  }
  const record = value;
  if (typeof record.__ref__ === "string") {
    return refs.get(record.__ref__) ?? null;
  }
  const taggedRecord = value;
  if (isLikelyListNodeValue(record) || taggedRecord.__type__ === "ListNode") {
    const existingMaterialized = materialized.get(record);
    if (existingMaterialized) {
      return existingMaterialized;
    }
    const node = {
      val: taggedRecord.val ?? taggedRecord.value ?? null,
      value: taggedRecord.val ?? taggedRecord.value ?? null,
      next: null
    };
    materialized.set(record, node);
    if (typeof taggedRecord.__id__ === "string" && taggedRecord.__id__.length > 0) {
      refs.set(taggedRecord.__id__, node);
    }
    node.next = materializeListInput(taggedRecord.next ?? null, refs, materialized);
    for (const [key, nested] of Object.entries(taggedRecord)) {
      if (key === "__id__" || key === "__type__" || key === "__class__" || key === "val" || key === "value" || key === "next") continue;
      node[key] = materializeListInput(nested, refs, materialized);
    }
    return node;
  }
  return value;
}
function detectMaterializerKind(ts, typeNode) {
  if (!typeNode) return null;
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return detectMaterializerKind(ts, typeNode.type);
  }
  if (ts.isUnionTypeNode(typeNode)) {
    for (const child of typeNode.types) {
      const resolved = detectMaterializerKind(ts, child);
      if (resolved) return resolved;
    }
    return null;
  }
  if (ts.isTypeReferenceNode(typeNode)) {
    const typeNameText = typeNode.typeName.getText();
    if (typeNameText === "TreeNode") return "tree";
    if (typeNameText === "ListNode") return "list";
    return null;
  }
  return null;
}
function collectInputMaterializers(ts, functionLikeNode) {
  const out = {};
  for (const parameter of functionLikeNode.parameters ?? []) {
    if (!ts.isIdentifier(parameter.name)) continue;
    if (parameter.name.text === "this") continue;
    const kind = detectMaterializerKind(ts, parameter.type);
    if (kind) {
      out[parameter.name.text] = kind;
    }
  }
  return out;
}
async function resolveInputMaterializers(code, functionName, executionStyle, language) {
  if (!functionName || executionStyle === "ops-class" || language !== "typescript") {
    return {};
  }
  try {
    const ts = await getTypeScriptModule();
    const sourceFile = ts.createSourceFile(
      "runtime-input.ts",
      code,
      ts.ScriptTarget.ES2020,
      true,
      ts.ScriptKind.TS
    );
    const target = findFunctionLikeNode(ts, sourceFile, functionName, executionStyle);
    if (!target) return {};
    return collectInputMaterializers(ts, target);
  } catch {
    return {};
  }
}
function applyInputMaterializers(inputs, materializers) {
  if (Object.keys(materializers).length === 0) return inputs;
  const next = { ...inputs };
  for (const [name, kind] of Object.entries(materializers)) {
    if (!Object.prototype.hasOwnProperty.call(next, name)) continue;
    next[name] = kind === "tree" ? materializeTreeInput(next[name]) : materializeListInput(next[name]);
  }
  return next;
}
function collectSimpleParameterNames(ts, functionLikeNode) {
  const names = [];
  for (const parameter of functionLikeNode.parameters ?? []) {
    if (!ts.isIdentifier(parameter.name)) {
      return null;
    }
    if (parameter.name.text === "this") {
      continue;
    }
    names.push(parameter.name.text);
  }
  return names;
}
function getPropertyNameText(ts, name) {
  if (!name) return null;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}
function findFunctionLikeNode(ts, sourceFile, functionName, executionStyle) {
  let found = null;
  const visit = (node) => {
    if (found) return;
    if (executionStyle === "solution-method" && ts.isClassDeclaration(node) && node.name?.text === "Solution") {
      for (const member of node.members) {
        if (found) break;
        if (ts.isMethodDeclaration(member) && getPropertyNameText(ts, member.name) === functionName) {
          found = member;
          break;
        }
        if (ts.isPropertyDeclaration(member) && getPropertyNameText(ts, member.name) === functionName && member.initializer && (ts.isArrowFunction(member.initializer) || ts.isFunctionExpression(member.initializer))) {
          found = member.initializer;
          break;
        }
      }
      return;
    }
    if (executionStyle === "function") {
      if (ts.isFunctionDeclaration(node) && node.name?.text === functionName) {
        found = node;
        return;
      }
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === functionName && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
        found = node.initializer;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}
async function resolveOrderedInputKeys(code, functionName, inputs, executionStyle, language = "javascript") {
  const fallbackKeys = Object.keys(inputs);
  if (!functionName || executionStyle === "ops-class" || fallbackKeys.length <= 1) {
    return fallbackKeys;
  }
  try {
    const ts = await getTypeScriptModule();
    const sourceFile = ts.createSourceFile(
      `runtime-input.${language === "typescript" ? "ts" : "js"}`,
      code,
      ts.ScriptTarget.ES2020,
      true,
      language === "typescript" ? ts.ScriptKind.TS : ts.ScriptKind.JS
    );
    const target = findFunctionLikeNode(ts, sourceFile, functionName, executionStyle);
    if (!target) {
      return fallbackKeys;
    }
    const parameterNames = collectSimpleParameterNames(ts, target);
    if (!parameterNames || parameterNames.length === 0) {
      return fallbackKeys;
    }
    const matchedKeys = parameterNames.filter((name) => Object.prototype.hasOwnProperty.call(inputs, name));
    if (matchedKeys.length === 0) {
      return fallbackKeys;
    }
    const extras = fallbackKeys.filter((key) => !matchedKeys.includes(key));
    return [...matchedKeys, ...extras];
  } catch {
    return fallbackKeys;
  }
}
function buildRunner(code, executionStyle, argNames) {
  if (executionStyle === "function") {
    return new Function(
      "console",
      "__functionName",
      ...argNames,
      `"use strict";
${code}
let __target;
try {
  __target = eval(__functionName);
} catch (_err) {
  __target = undefined;
}
if (typeof __target !== 'function') {
  throw new Error('Function "' + __functionName + '" not found');
}
return __target(${argNames.join(", ")});`
    );
  }
  if (executionStyle === "solution-method") {
    return new Function(
      "console",
      "__functionName",
      ...argNames,
      `"use strict";
${code}
if (typeof Solution !== 'function') {
  throw new Error('Class "Solution" not found');
}
const __solver = new Solution();
const __method = __solver[__functionName];
if (typeof __method !== 'function') {
  throw new Error('Method "Solution.' + __functionName + '" not found');
}
return __method.call(__solver, ${argNames.join(", ")});`
    );
  }
  if (executionStyle === "ops-class") {
    return new Function(
      "console",
      "__className",
      "__operations",
      "__arguments",
      `"use strict";
${code}
if (!Array.isArray(__operations) || !Array.isArray(__arguments)) {
  throw new Error('ops-class execution requires inputs.operations and inputs.arguments (or ops/args)');
}
if (__operations.length !== __arguments.length) {
  throw new Error('operations and arguments must have the same length');
}
let __targetClass;
try {
  __targetClass = eval(__className);
} catch (_err) {
  __targetClass = undefined;
}
if (typeof __targetClass !== 'function') {
  throw new Error('Class "' + __className + '" not found');
}
let __instance = null;
const __out = [];
for (let __i = 0; __i < __operations.length; __i++) {
  const __op = __operations[__i];
  let __callArgs = __arguments[__i];
  if (__callArgs === null || __callArgs === undefined) {
    __callArgs = [];
  }
  if (!Array.isArray(__callArgs)) {
    __callArgs = [__callArgs];
  }
  if (__i === 0) {
    __instance = new __targetClass(...__callArgs);
    __out.push(null);
    continue;
  }
  if (!__instance || typeof __instance[__op] !== 'function') {
    throw new Error('Required method "' + __op + '" is not implemented on ' + (__className || 'target class'));
  }
  __out.push(__instance[__op](...__callArgs));
}
return __out;`
    );
  }
  throw new Error(`Execution style "${executionStyle}" is not supported for JavaScript runtime yet.`);
}
function getOpsClassInputs(inputs) {
  const operations = Array.isArray(inputs.operations) ? inputs.operations : Array.isArray(inputs.ops) ? inputs.ops : null;
  const argumentsList = Array.isArray(inputs.arguments) ? inputs.arguments : Array.isArray(inputs.args) ? inputs.args : null;
  return { operations, argumentsList };
}
async function transpileTypeScript(code) {
  const ts = await getTypeScriptModule();
  const transpileInput = withTypeScriptRuntimeDeclarations(code);
  const transpiled = ts.transpileModule(transpileInput, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: false,
      esModuleInterop: true
    },
    reportDiagnostics: true,
    fileName: "solution.ts"
  });
  const diagnostics = Array.isArray(transpiled.diagnostics) ? transpiled.diagnostics : [];
  const errors = diagnostics.filter((diag) => diag.category === ts.DiagnosticCategory.Error);
  if (errors.length > 0) {
    const first = errors[0];
    const messageText = ts.flattenDiagnosticMessageText(first.messageText, "\n");
    let lineNumber;
    if (first.file && typeof first.start === "number") {
      const position = first.file.getLineAndCharacterOfPosition(first.start);
      lineNumber = position.line + 1;
    }
    const error = new Error(
      lineNumber ? `TypeScript transpilation failed (line ${lineNumber}): ${messageText}` : `TypeScript transpilation failed: ${messageText}`
    );
    if (lineNumber) {
      error.__tracecodeLine = lineNumber;
    }
    throw error;
  }
  return transpiled.outputText;
}
async function executeJavaScriptCode(code, functionName, inputs, executionStyle = "function", language = "javascript") {
  const consoleOutput = [];
  const consoleProxy = createConsoleProxy(consoleOutput);
  const normalizedInputs = normalizeInputs(inputs);
  const materializers = await resolveInputMaterializers(code, functionName, executionStyle, language);
  const materializedInputs = applyInputMaterializers(normalizedInputs, materializers);
  const javascriptLibraryEnvironment = await getJavaScriptLibraryEnvironment();
  const restoreJavaScriptLibraryGlobals = installJavaScriptLibraryGlobals(javascriptLibraryEnvironment);
  try {
    let output;
    if (executionStyle === "ops-class") {
      const { operations, argumentsList } = getOpsClassInputs(materializedInputs);
      const runner = buildRunner(code, executionStyle, []);
      output = await Promise.resolve(runner(consoleProxy, functionName, operations, argumentsList));
    } else {
      const inputKeys = await resolveOrderedInputKeys(code, functionName, materializedInputs, executionStyle, language);
      const argNames = inputKeys.map((_, index) => `__arg${index}`);
      const argValues = inputKeys.map((key) => materializedInputs[key]);
      const runner = buildRunner(code, executionStyle, argNames);
      output = await Promise.resolve(runner(consoleProxy, functionName, ...argValues));
    }
    return {
      success: true,
      output: serializeOutputValue(output),
      consoleOutput
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : String(error),
      errorLine: extractUserErrorLine(error),
      consoleOutput
    };
  } finally {
    restoreJavaScriptLibraryGlobals();
  }
}
async function executeJavaScriptWithTracing(code, functionName, inputs, executionStyle = "function", language = "javascript") {
  const startedAt = performanceNow();
  const codeResult = await executeJavaScriptCode(code, functionName ?? "", inputs, executionStyle, language);
  const executionTimeMs = performanceNow() - startedAt;
  if (!codeResult.success) {
    return {
      success: false,
      error: codeResult.error,
      errorLine: codeResult.errorLine,
      trace: createEmptyRuntimeTrace(language),
      executionTimeMs,
      consoleOutput: codeResult.consoleOutput ?? [],
      lineEventCount: 0,
      traceStepCount: 0
    };
  }
  return {
    success: true,
    output: codeResult.output,
    trace: createEmptyRuntimeTrace(language),
    executionTimeMs,
    consoleOutput: codeResult.consoleOutput ?? [],
    lineEventCount: 0,
    traceStepCount: 0
  };
}
async function executeTypeScriptCode(code, functionName, inputs, executionStyle = "function") {
  const normalizedInputs = normalizeInputs(inputs);
  const materializers = await resolveInputMaterializers(code, functionName, executionStyle, "typescript");
  const materializedInputs = applyInputMaterializers(normalizedInputs, materializers);
  const transpiledCode = await transpileTypeScript(code);
  return executeJavaScriptCode(transpiledCode, functionName, materializedInputs, executionStyle, "typescript");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CSharpWorkerClient,
  CppWorkerClient,
  DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS,
  JavaScriptWorkerClient,
  JavaWorkerClient,
  LANGUAGE_RUNTIME_INFOS,
  LANGUAGE_RUNTIME_PROFILES,
  PYTHON_CLASS_DEFINITIONS,
  PYTHON_CONVERSION_HELPERS,
  PYTHON_EXECUTE_SERIALIZE_FUNCTION,
  PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION,
  PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION,
  PYTHON_SERIALIZE_FUNCTION,
  PYTHON_TRACE_SERIALIZE_FUNCTION,
  PyodideWorkerClient,
  PythonWorkerClient,
  RUNTIME_TRACE_SCHEMA_VERSION,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_RUNTIME_INFOS,
  TEMPLATE_PYTHON_CLASS_DEFINITIONS,
  TEMPLATE_PYTHON_CONVERSION_HELPERS,
  TEMPLATE_PYTHON_EXECUTE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_TRACE_SERIALIZE_FUNCTION,
  TYPESCRIPT_RUNTIME_DECLARATIONS,
  assertRuntimeRequestSupported,
  assertSupportedRawEmissions,
  buildRuntimeTraceParitySignature,
  compareRawEmissionParity,
  createBrowserHarness,
  createCSharpRuntimeClient,
  createCppRuntimeClient,
  createEmptyRuntimeTrace,
  createJavaRuntimeClient,
  createJavaScriptRuntimeClient,
  createPythonRuntimeClient,
  executeJavaScriptCode,
  executeJavaScriptWithTracing,
  executeTypeScriptCode,
  generateConversionCode,
  generateInputSetup,
  generateSolutionScript,
  getLanguageRuntimeInfo,
  getLanguageRuntimeProfile,
  getSupportedLanguageProfiles,
  getSupportedLanguageRuntimeInfos,
  identifyConversions,
  isLanguageSupported,
  javaTraceHooksEventsToRuntimeTrace,
  normalizeJavaNativeTraceJsonPayload,
  normalizeJavaSerializedResult,
  resolveBrowserHarnessAssets,
  summarizeJavaRawEmissions,
  summarizeRuntimeTraceEmissions,
  templateToPythonLiteral,
  toPythonLiteral,
  withRuntimeTraceOptions,
  withTypeScriptRuntimeDeclarations
});
//# sourceMappingURL=index.cjs.map