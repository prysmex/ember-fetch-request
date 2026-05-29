class FetchError extends Error {
  payload;
  status;
  constructor(payload = null, message = 'Fetch operation failed', status = null) {
    super(message);
    this.payload = payload;
    this.status = status;
  }
}
class InvalidError extends FetchError {
  constructor(payload) {
    super(payload, 'Request was rejected because it was invalid', 422);
  }
}
class UnauthorizedError extends FetchError {
  constructor(payload) {
    super(payload, 'Fetch authorization failed', 401);
  }
}
class ForbiddenError extends FetchError {
  constructor(payload) {
    super(payload, 'Request was rejected because user is not permitted to perform this operation.', 403);
  }
}
class BadRequestError extends FetchError {
  constructor(payload) {
    super(payload, 'Request was formatted incorrectly.', 400);
  }
}
class NotFoundError extends FetchError {
  constructor(payload) {
    super(payload, 'Resource was not found.', 404);
  }
}
class GoneError extends FetchError {
  constructor(payload) {
    super(payload, 'Resource is no longer available.', 410);
  }
}
class NetworkError extends FetchError {
  constructor(payload) {
    const message = payload?.message ?? 'A network error occurred';
    super(payload, message, null);
  }
}
class TimeoutError extends FetchError {
  constructor() {
    super(null, 'The Fetch operation timed out', -1);
  }
}
class AbortError extends FetchError {
  constructor() {
    super(null, 'The Fetch operation was aborted', 0);
  }
}
class ConflictError extends FetchError {
  constructor(payload) {
    super(payload, 'The Fetch operation failed due to a conflict', 409);
  }
}
class ServerError extends FetchError {
  constructor(payload, status = 500) {
    super(payload, 'Request was rejected due to server error', status);
  }
}

/**
 * Checks if the given error is or inherits from `FetchError`.
 */
function isFetchError(error) {
  return error instanceof FetchError;
}

/**
 * Checks if the given status code or `FetchError` object represents an
 * unauthorized request error.
 */
function isUnauthorizedError(error) {
  if (isFetchError(error)) {
    return error instanceof UnauthorizedError;
  }
  return error === 401;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * forbidden request error.
 */
function isForbiddenError(error) {
  if (isFetchError(error)) {
    return error instanceof ForbiddenError;
  }
  return error === 403;
}

/**
 * Checks if the given status code or `FetchError` object represents an
 * invalid request error.
 */
function isInvalidError(error) {
  if (isFetchError(error)) {
    return error instanceof InvalidError;
  }
  return error === 422;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * bad request error.
 */
function isBadRequestError(error) {
  if (isFetchError(error)) {
    return error instanceof BadRequestError;
  }
  return error === 400;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * "not found" error.
 */
function isNotFoundError(error) {
  if (isFetchError(error)) {
    return error instanceof NotFoundError;
  }
  return error === 404;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * "gone" error.
 */
function isGoneError(error) {
  if (isFetchError(error)) {
    return error instanceof GoneError;
  }
  return error === 410;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * network error.
 */
function isNetworkError(error) {
  if (isFetchError(error)) {
    return error instanceof NetworkError;
  }
  return error === null;
}

/**
 * Checks if the given object represents a "timeout" error.
 */
function isTimeoutError(error) {
  return error instanceof TimeoutError;
}

/**
 * Checks if the given status code or `FetchError` object represents an
 * "abort" error.
 */
function isAbortError(error) {
  if (isFetchError(error)) {
    return error instanceof AbortError;
  }
  return error === 0;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * conflict error.
 */
function isConflictError(error) {
  if (isFetchError(error)) {
    return error instanceof ConflictError;
  }
  return error === 409;
}

/**
 * Checks if the given status code or `FetchError` object represents a
 * server error.
 */
function isServerError(error) {
  if (isFetchError(error)) {
    return error instanceof ServerError;
  }
  return typeof error === 'number' && error >= 500 && error < 600;
}

/**
 * Checks if the given status code represents a successful request.
 */
function isSuccess(status) {
  const s = typeof status === 'string' ? parseInt(status, 10) : status;
  return s >= 200 && s < 300 || s === 304;
}

export { AbortError, BadRequestError, ConflictError, FetchError, ForbiddenError, GoneError, InvalidError, NetworkError, NotFoundError, ServerError, TimeoutError, UnauthorizedError, isAbortError, isBadRequestError, isConflictError, isFetchError, isForbiddenError, isGoneError, isInvalidError, isNetworkError, isNotFoundError, isServerError, isSuccess, isTimeoutError, isUnauthorizedError };
//# sourceMappingURL=errors.js.map
