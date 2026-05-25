/**
 * Do a case-insensitive lookup of an HTTP header.
 */
export default function getHeader(
  headers: Record<string, string> | null | undefined,
  name: string | null | undefined,
): string | undefined {
  if (headers == null || name == null) {
    return undefined;
  }

  const target = name.toLowerCase();
  const matchedKey = Object.keys(headers).find(
    (key) => key.toLowerCase() === target,
  );

  return matchedKey ? headers[matchedKey] : undefined;
}
