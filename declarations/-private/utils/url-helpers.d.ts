export declare function isFullURL(url: string): boolean;
export declare function haveSameHost(a: string, b: string): boolean;
type ParamInput = Record<string, unknown> | Array<{
    name: string;
    value: unknown;
}> | null | undefined;
/**
 * Serialize a hash or array of form elements to a URL-encoded query string,
 * matching jQuery's `$.param()` algorithm.
 */
export declare function param(a: ParamInput): string;
export {};
//# sourceMappingURL=url-helpers.d.ts.map