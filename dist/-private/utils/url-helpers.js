const completeUrlRegex = /^(http|https)/;
function isFullURL(url) {
  return completeUrlRegex.test(url);
}
function haveSameHost(a, b) {
  const urlA = new URL(a);
  const urlB = new URL(b);
  return urlA.protocol === urlB.protocol && urlA.hostname === urlB.hostname && urlA.port === urlB.port;
}
function isFunction(obj) {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number';
}
function paramValue(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return value.toString();
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return '';
}
function buildParams(prefix, obj, add) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      buildParams(prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']', v, add);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    for (const name in obj) {
      buildParams(prefix + '[' + name + ']', obj[name], add);
    }
  } else {
    add(prefix, obj);
  }
}

/**
 * Serialize a hash or array of form elements to a URL-encoded query string,
 * matching jQuery's `$.param()` algorithm.
 */
function param(a) {
  const s = [];
  const add = (key, valueOrFunction) => {
    const value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
    s.push(encodeURIComponent(key) + '=' + encodeURIComponent(paramValue(value)));
  };
  if (a == null) {
    return '';
  }
  if (Array.isArray(a)) {
    a.forEach(item => {
      add(item.name, item.value);
    });
  } else {
    for (const prefix in a) {
      buildParams(prefix, a[prefix], add);
    }
  }
  return s.join('&');
}

export { haveSameHost, isFullURL, param };
//# sourceMappingURL=url-helpers.js.map
