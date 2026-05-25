export class FetchError extends Error {
  payload: unknown;
  status: number | null;

  constructor(
    payload: unknown = null,
    message = 'Fetch operation failed',
    status: number | null = null,
  ) {
    super(message);
    this.payload = payload;
    this.status = status;
  }
}

export class InvalidError extends FetchError {
  constructor(payload?: unknown) {
    super(payload, 'Request was rejected because it was invalid', 422);
  }
}

export class UnauthorizedError extends FetchError {
  constructor(payload?: unknown) {
    super(payload, 'Fetch authorization failed', 401);
  }
}

export class ForbiddenError extends FetchError {
  constructor(payload?: unknown) {
    super(
      payload,
      'Request was rejected because user is not permitted to perform this operation.',
      403,
    );
  }
}

export class BadRequestError extends FetchError {
  constructor(payload?: unknown) {
    super(payload, 'Request was formatted incorrectly.', 400);
  }
}

export class NotFoundError extends FetchError {
  constructor(payload?: unknown) {
    super(payload, 'Resource was not found.', 404);
  }
}

export class GoneError extends FetchError {
  constructor(payload?: unknown) {
    super(payload, 'Resource is no longer available.', 410);
  }
}

export class NetworkError extends FetchError {
  constructor(payload?: unknown) {
    const message =
      (payload as { message?: string } | null)?.message ??
      'A network error occurred';
    super(payload, message, null);
  }
}

export class TimeoutError extends FetchError {
  constructor() {
    super(null, 'The Fetch operation timed out', -1);
  }
}

export class AbortError extends FetchError {
  constructor() {
    super(null, 'The Fetch operation was aborted', 0);
  }
}

export class ConflictError extends FetchError {
  constructor(payload?: unknown) {
    super(payload, 'The Fetch operation failed due to a conflict', 409);
  }
}

export class ServerError extends FetchError {
  constructor(payload?: unknown, status: number | null = 500) {
    super(payload, 'Request was rejected due to server error', status);
  }
}

/**
 * Checks if the given error is or inherits from `FetchError`.
 */
export function isFetchError(error: unknown): error is FetchError {
  return error instanceof FetchError;
}

/**
 * Checks if the given status code or `FetchError` object represents an
 * unauthorized request error.
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof UnauthorizedError;
  }
  return error === 401;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * forbidden request error.
 */
export function isForbiddenError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof ForbiddenError;
  }
  return error === 403;
}

/**
 * Checks if the given status code or `FetchError` object represents an
 * invalid request error.
 */
export function isInvalidError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof InvalidError;
  }
  return error === 422;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * bad request error.
 */
export function isBadRequestError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof BadRequestError;
  }
  return error === 400;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * "not found" error.
 */
export function isNotFoundError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof NotFoundError;
  }
  return error === 404;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * "gone" error.
 */
export function isGoneError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof GoneError;
  }
  return error === 410;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * network error.
 */
export function isNetworkError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof NetworkError;
  }
  return error === null;
}

/**
 * Checks if the given object represents a "timeout" error.
 */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

/**
 * Checks if the given status code or `FetchError` object represents an
 * "abort" error.
 */
export function isAbortError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof AbortError;
  }
  return error === 0;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * conflict error.
 */
export function isConflictError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof ConflictError;
  }
  return error === 409;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * server error.
 */
export function isServerError(error: unknown): boolean {
  if (isFetchError(error)) {
    return error instanceof ServerError;
  }
  return typeof error === 'number' && error >= 500 && error < 600;
}

/**
 * Checks if the given status code represents a successful request.
 */
export function isSuccess(status: number | string): boolean {
  const s = typeof status === 'string' ? parseInt(status, 10) : status;
  return (s >= 200 && s < 300) || s === 304;
}
