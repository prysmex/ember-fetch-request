const completeUrlRegex = /^(http|https)/;

export function isFullURL(url: string): boolean {
  return completeUrlRegex.test(url);
}

export function haveSameHost(a: string, b: string): boolean {
  const urlA = new URL(a);
  const urlB = new URL(b);

  return (
    urlA.protocol === urlB.protocol &&
    urlA.hostname === urlB.hostname &&
    urlA.port === urlB.port
  );
}

type ParamInput =
  | Record<string, unknown>
  | Array<{ name: string; value: unknown }>
  | null
  | undefined;

type AddFn = (key: string, value: unknown) => void;

function isFunction(obj: unknown): obj is (...args: unknown[]) => unknown {
  return (
    typeof obj === 'function' &&
    typeof (obj as { nodeType?: unknown }).nodeType !== 'number'
  );
}

function paramValue(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return value.toString();
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return '';
}

function buildParams(prefix: string, obj: unknown, add: AddFn): void {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      buildParams(
        prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
        v,
        add,
      );
    });
  } else if (typeof obj === 'object' && obj !== null) {
    for (const name in obj as Record<string, unknown>) {
      buildParams(
        prefix + '[' + name + ']',
        (obj as Record<string, unknown>)[name],
        add,
      );
    }
  } else {
    add(prefix, obj);
  }
}

/**
 * Serialize a hash or array of form elements to a URL-encoded query string,
 * matching jQuery's `$.param()` algorithm.
 */
export function param(a: ParamInput): string {
  const s: string[] = [];
  const add: AddFn = (key, valueOrFunction) => {
    const value = isFunction(valueOrFunction)
      ? valueOrFunction()
      : valueOrFunction;
    s.push(
      encodeURIComponent(key) + '=' + encodeURIComponent(paramValue(value)),
    );
  };

  if (a == null) {
    return '';
  }

  if (Array.isArray(a)) {
    a.forEach((item) => {
      add(item.name, item.value);
    });
  } else {
    for (const prefix in a) {
      buildParams(prefix, a[prefix], add);
    }
  }

  return s.join('&');
}
