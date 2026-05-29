/**
 * Per-request and service-level options accepted by `FetchRequestService.request()`.
 *
 * Extends the standard `RequestInit` so any native `fetch` option (e.g. `signal`,
 * `credentials`, `mode`, etc.) can be passed through. The `body` is widened to
 * `unknown` because the service stringifies plain objects when the content type
 * is JSON, and serializes them as query params on GET requests.
 */
export interface FetchRequestOptions extends Omit<
  RequestInit,
  'body' | 'headers'
> {
  host?: string;
  namespace?: string;
  contentType?: string;
  headers?: Record<string, string>;
  body?: unknown;
  returnRawResponse?: boolean;
}

/**
 * Internal shape of options after `FetchRequestService.options()` has normalized them.
 */
export interface NormalizedSettings extends Omit<
  FetchRequestOptions,
  'headers'
> {
  url: string;
  method: string;
  headers: Record<string, string>;
}
