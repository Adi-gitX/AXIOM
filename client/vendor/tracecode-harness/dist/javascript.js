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
export {
  JavaScriptWorkerClient,
  TYPESCRIPT_RUNTIME_DECLARATIONS,
  createJavaScriptRuntimeClient,
  executeJavaScriptCode,
  executeJavaScriptWithTracing,
  executeTypeScriptCode,
  withTypeScriptRuntimeDeclarations
};
//# sourceMappingURL=javascript.js.map