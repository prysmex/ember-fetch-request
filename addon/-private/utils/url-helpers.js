const completeUrlRegex = /^(http|https)/;

/**
 * Parse a URL string into an object that defines its structure
 *
 * The returned object will have the following properties:
 *
 *   href: the full URL
 *   protocol: the request protocol
 *   hostname: the target for the request
 *   port: the port for the request
 *   pathname: any URL after the host
 *   search: query parameters
 *   hash: the URL hash
 *
 * @function parseURL
 * @private
 */
export function parseURL(str) {
  let fullObject;

  if (typeof FastBoot === 'undefined') {
    const element = document.createElement('a');
    element.href = str;
    fullObject = element;
  } else {
    fullObject = FastBoot.require('url').parse(str);
  }

  const desiredProps = {
    href: fullObject.href,
    protocol: fullObject.protocol,
    hostname: fullObject.hostname,
    port: fullObject.port,
    pathname: fullObject.pathname,
    search: fullObject.search,
    hash: fullObject.hash
  };

  return desiredProps;
}

export function isFullURL(url) {
  return !!url.match(completeUrlRegex);
}

export function haveSameHost(a, b) {
  const urlA = parseURL(a);
  const urlB = parseURL(b);

  return (
    urlA.protocol === urlB.protocol &&
    urlA.hostname === urlB.hostname &&
    urlA.port === urlB.port
  );
}

export function param(a) {
  var prefix,
    s = [],
    add = function (key, valueOrFunction) {

      // If value is a function, invoke it and use its return value
      var value = isFunction(valueOrFunction) ?
        valueOrFunction() :
        valueOrFunction;

      s[s.length] = encodeURIComponent(key) + "=" +
        encodeURIComponent(value == null ? "" : value);
    };

  if (a == null) {
    return "";
  }

  // If an array was passed in, assume that it is an array of form elements.
  if (Array.isArray(a)) {

    // Serialize the form elements
    a.forEach(function () {
      add(this.name, this.value);
    });

  } else {
    for (prefix in a) {
      buildParams(prefix, a[prefix], add);
    }
  }

  // Return the resulting serialization
  return s.join("&");
}

function isFunction(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}

function buildParams(prefix, obj, add) {
  var name;

  if (Array.isArray(obj)) {

    // Serialize array item.
    obj.forEach(function (v, i) {
      // Item is non-scalar (array or object), encode its numeric index.
      buildParams(
        prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
        v,
        add
      );
    });

  } else if (typeof obj === "object") {

    // Serialize object item.
    for (name in obj) {
      buildParams(prefix + "[" + name + "]", obj[name], add);
    }

  } else {

    // Serialize scalar item.
    add(prefix, obj);
  }
}