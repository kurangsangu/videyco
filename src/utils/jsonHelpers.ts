/**
 * Safe JSON stringify helper that handles circular references,
 * DOM Elements (HTMLVideoElement, HTMLDivElement, etc.), and React Fiber nodes gracefully.
 */
export function safeJsonStringify(value: unknown, indent?: number): string {
  const seen = new WeakSet();

  const replacer = (_key: string, val: unknown) => {
    if (typeof val === 'object' && val !== null) {
      // Filter out DOM Nodes, Window, Event targets, and React internal Fiber properties
      if (
        (typeof Node !== 'undefined' && val instanceof Node) ||
        (typeof Window !== 'undefined' && val instanceof Window) ||
        (typeof Event !== 'undefined' && val instanceof Event) ||
        'stateNode' in val ||
        '_reactRootContainer' in val
      ) {
        return undefined;
      }

      if (seen.has(val)) {
        return undefined;
      }
      seen.add(val);
    }
    return val;
  };

  try {
    return JSON.stringify(value, replacer, indent);
  } catch (err) {
    console.warn('[SafeStorage] JSON stringify error prevented:', err);
    return '{}';
  }
}

export function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (err) {
    console.warn('[SafeStorage] JSON parse error, using fallback:', err);
    return fallback;
  }
}
