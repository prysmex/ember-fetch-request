import Service from '@ember/service';
import type { FetchRequestOptions, NormalizedSettings } from '../types.ts';
export default class FetchRequestService extends Service {
    /**
     * The request can target other hosts by setting the `host` property.
     */
    host?: string;
    /**
     * The request can target another namespace by setting the `namespace` property.
     */
    namespace?: string;
    /**
     * The request can merge custom/dynamic headers by setting the `headers` property.
     */
    headers?: Record<string, string>;
    request(endpoint: string, settings?: FetchRequestOptions): Promise<unknown>;
    getBody(response: Response): Promise<unknown>;
    _handleErrors(response: Response): never;
    /**
     * Create a normalized set of options from the per-request and service-level settings.
     */
    options(url: string, options?: FetchRequestOptions): NormalizedSettings;
    /**
     * Build a URL for a request.
     *
     * If the provided `url` is deemed to be a complete URL, it is returned
     * directly. Otherwise it is combined with the `host` and `namespace`
     * options of the request class to create the full URL.
     */
    _buildURL(url: string, options?: FetchRequestOptions): string;
    _shouldSendHeaders({ url, host }: {
        url?: string;
        host?: string;
    }): boolean;
    /**
     * Get the full headers hash, combining the service-defined headers with
     * the ones provided for the request.
     */
    _getFullHeadersHash(headers?: Record<string, string>): Record<string, string>;
}
//# sourceMappingURL=fetch-request.d.ts.map