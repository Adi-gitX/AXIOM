"use strict";
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

// packages/harness-python/src/index.ts
var src_exports = {};
__export(src_exports, {
  PYTHON_CLASS_DEFINITIONS: () => PYTHON_CLASS_DEFINITIONS,
  PYTHON_CONVERSION_HELPERS: () => PYTHON_CONVERSION_HELPERS,
  PYTHON_EXECUTE_SERIALIZE_FUNCTION: () => PYTHON_EXECUTE_SERIALIZE_FUNCTION,
  PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION: () => PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION,
  PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION: () => PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION,
  PYTHON_SERIALIZE_FUNCTION: () => PYTHON_SERIALIZE_FUNCTION,
  PYTHON_TRACE_SERIALIZE_FUNCTION: () => PYTHON_TRACE_SERIALIZE_FUNCTION,
  PyodideWorkerClient: () => PythonWorkerClient,
  PythonWorkerClient: () => PythonWorkerClient,
  TEMPLATE_PYTHON_CLASS_DEFINITIONS: () => TEMPLATE_PYTHON_CLASS_DEFINITIONS,
  TEMPLATE_PYTHON_CONVERSION_HELPERS: () => TEMPLATE_PYTHON_CONVERSION_HELPERS,
  TEMPLATE_PYTHON_EXECUTE_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_EXECUTE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_TRACE_SERIALIZE_FUNCTION: () => TEMPLATE_PYTHON_TRACE_SERIALIZE_FUNCTION,
  createPythonRuntimeClient: () => createPythonRuntimeClient,
  generateConversionCode: () => generateConversionCode,
  generateInputSetup: () => generateInputSetup,
  generateSolutionScript: () => generateSolutionScript,
  identifyConversions: () => identifyConversions,
  templateToPythonLiteral: () => templateToPythonLiteral,
  toPythonLiteral: () => toPythonLiteral
});
module.exports = __toCommonJS(src_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PYTHON_CLASS_DEFINITIONS,
  PYTHON_CONVERSION_HELPERS,
  PYTHON_EXECUTE_SERIALIZE_FUNCTION,
  PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION,
  PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION,
  PYTHON_SERIALIZE_FUNCTION,
  PYTHON_TRACE_SERIALIZE_FUNCTION,
  PyodideWorkerClient,
  PythonWorkerClient,
  TEMPLATE_PYTHON_CLASS_DEFINITIONS,
  TEMPLATE_PYTHON_CONVERSION_HELPERS,
  TEMPLATE_PYTHON_EXECUTE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_INTERVIEW_MATERIALIZE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_PRACTICE_MATERIALIZE_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_SERIALIZE_FUNCTION,
  TEMPLATE_PYTHON_TRACE_SERIALIZE_FUNCTION,
  createPythonRuntimeClient,
  generateConversionCode,
  generateInputSetup,
  generateSolutionScript,
  identifyConversions,
  templateToPythonLiteral,
  toPythonLiteral
});
//# sourceMappingURL=python.cjs.map