/**
 * Do a case-insensitive lookup of an HTTP header.
 */
function getHeader(headers, name) {
  if (headers == null || name == null) {
    return undefined;
  }
  const target = name.toLowerCase();
  const matchedKey = Object.keys(headers).find(key => key.toLowerCase() === target);
  return matchedKey ? headers[matchedKey] : undefined;
}

export { getHeader as default };
//# sourceMappingURL=get-header.js.map
