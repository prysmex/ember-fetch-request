export declare class FetchError extends Error {
    payload: unknown;
    status: number | null;
    constructor(payload?: unknown, message?: string, status?: number | null);
}
export declare class InvalidError extends FetchError {
    constructor(payload?: unknown);
}
export declare class UnauthorizedError extends FetchError {
    constructor(payload?: unknown);
}
export declare class ForbiddenError extends FetchError {
    constructor(payload?: unknown);
}
export declare class BadRequestError extends FetchError {
    constructor(payload?: unknown);
}
export declare class NotFoundError extends FetchError {
    constructor(payload?: unknown);
}
export declare class GoneError extends FetchError {
    constructor(payload?: unknown);
}
export declare class NetworkError extends FetchError {
    constructor(payload?: unknown);
}
export declare class TimeoutError extends FetchError {
    constructor();
}
export declare class AbortError extends FetchError {
    constructor();
}
export declare class ConflictError extends FetchError {
    constructor(payload?: unknown);
}
export declare class ServerError extends FetchError {
    constructor(payload?: unknown, status?: number | null);
}
/**
 * Checks if the given error is or inherits from `FetchError`.
 */
export declare function isFetchError(error: unknown): error is FetchError;
/**
 * Checks if the given status code or `FetchError` object represents an
 * unauthorized request error.
 */
export declare function isUnauthorizedError(error: unknown): boolean;
/**
 * Checks if the given status code or `FetchError` object represents a
 * forbidden request error.
 */
export declare function isForbiddenError(error: unknown): boolean;
/**
 * Checks if the given status code or `FetchError` object represents an
 * invalid request error.
 */
export declare function isInvalidError(error: unknown): boolean;
/**
 * Checks if the given status code or `FetchError` object represents a
 * bad request error.
 */
export declare function isBadRequestError(error: unknown): boolean;
/**
 * Checks if the given status code or `FetchError` object represents a
 * "not found" error.
 */
export declare function isNotFoundError(error: unknown): boolean;
/**
 * Checks if the given status code or `FetchError` object represents a
 * "gone" error.
 */
export declare function isGoneError(error: unknown): boolean;
/**
 * Checks if the given status code or `FetchError` object represents a
 * network error.
 */
export declare function isNetworkError(error: unknown): boolean;
/**
 * Checks if the given object represents a "timeout" error.
 */
export declare function isTimeoutError(error: unknown): error is TimeoutError;
/**
 * Checks if the given status code or `FetchError` object represents an
 * "abort" error.
 */
export declare function isAbortError(error: unknown): boolean;
/**
 * Checks if the given status code or `FetchError` object represents a
 * conflict error.
 */
export declare function isConflictError(error: unknown): boolean;
/**
 * Checks if the given status code or `FetchError` object represents a
 * server error.
 */
export declare function isServerError(error: unknown): boolean;
/**
 * Checks if the given status code represents a successful request.
 */
export declare function isSuccess(status: number | string): boolean;
//# sourceMappingURL=errors.d.ts.map