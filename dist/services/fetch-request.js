import Service from '@ember/service';
import { NetworkError, ServerError, ConflictError, AbortError, TimeoutError, GoneError, NotFoundError, BadRequestError, ForbiddenError, UnauthorizedError, InvalidError } from '../errors.js';
import getHeader from '../-private/utils/get-header.js';
import isString from '../-private/utils/is-string.js';
import { param, isFullURL, haveSameHost } from '../-private/utils/url-helpers.js';

const JSONContentType = /^application\/(?:vnd\.api\+)?json/i;
function isJSONContentType(header) {
  if (!isString(header)) {
    return false;
  }
  return JSONContentType.test(header);
}
function isJSONStringifyable(settings) {
  if (settings.method === 'GET') {
    return false;
  }
  if (!isJSONContentType(settings.contentType) && !isJSONContentType(getHeader(settings.headers, 'Content-Type'))) {
    return false;
  }
  if (typeof settings.body !== 'object') {
    return false;
  }
  return true;
}
function endsWithSlash(str) {
  return str.charAt(str.length - 1) === '/';
}
function removeTrailingSlash(str) {
  return str.slice(0, -1);
}
function startsWithSlash(str) {
  return str.charAt(0) === '/';
}
function removeLeadingSlash(str) {
  return str.substring(1);
}
function stripSlashes(path) {
  let result = path;
  if (startsWithSlash(result)) {
    result = removeLeadingSlash(result);
  }
  if (endsWithSlash(result)) {
    result = removeTrailingSlash(result);
  }
  return result;
}
class FetchRequestService extends Service {
  /**
   * The request can target other hosts by setting the `host` property.
   */

  /**
   * The request can target another namespace by setting the `namespace` property.
   */

  /**
   * The request can merge custom/dynamic headers by setting the `headers` property.
   */

  async request(endpoint, settings) {
    const normalized = this.options(endpoint, settings);
    const response = await fetch(normalized.url, normalized);
    if (response.status === null || response.status === undefined) {
      throw new NetworkError(response);
    }
    if (!response.ok) {
      try {
        this._handleErrors(response);
      } catch (error) {
        if (!response.bodyUsed) {
          error.payload = await this.getBody(response);
        }
        throw error;
      }
    }
    if (normalized.returnRawResponse === true) {
      return response;
    }
    return this.getBody(response);
  }
  async getBody(response) {
    const contentType = response.headers.get('content-type');
    if (contentType === null) {
      return null;
    }

    // For application/json and application/vnd.api+json
    if (contentType.includes('json')) {
      return response.json();
    }

    // For text/plain and text/html
    if (contentType.includes('text')) {
      return response.text();
    }
    throw new Error(`Unsupported response content-type: ${contentType}, url: ${response.url}`);
  }
  _handleErrors(response) {
    switch (response.status) {
      case 422:
        throw new InvalidError();
      case 401:
        throw new UnauthorizedError();
      case 403:
        throw new ForbiddenError();
      case 400:
        throw new BadRequestError();
      case 404:
        throw new NotFoundError();
      case 410:
        throw new GoneError();
      case -1:
        throw new TimeoutError();
      case 0:
        throw new AbortError();
      case 409:
        throw new ConflictError();
      case 500:
        throw new ServerError(null, 500);
      default:
        throw new ServerError(null, response.status);
    }
  }

  /**
   * Create a normalized set of options from the per-request and service-level settings.
   */
  options(url, options = {}) {
    const normalized = {
      ...options,
      url: this._buildURL(url, options),
      method: options.method ?? 'GET',
      headers: {}
    };
    if (this._shouldSendHeaders({
      url: normalized.url,
      host: options.host
    })) {
      normalized.headers = this._getFullHeadersHash(options.headers);
    } else {
      normalized.headers = options.headers ?? {};
    }
    if (options.contentType != null && options.contentType !== '') {
      normalized.headers['Content-Type'] = options.contentType;
    }
    if (normalized.body !== undefined && normalized.body !== null) {
      if (isJSONStringifyable({
        method: normalized.method,
        contentType: options.contentType,
        body: normalized.body,
        headers: normalized.headers
      })) {
        normalized.body = JSON.stringify(normalized.body);
      } else if (normalized.method === 'GET') {
        normalized.url = normalized.url + '?' + param(normalized.body);
        delete normalized.body;
      }
    }
    return normalized;
  }

  /**
   * Build a URL for a request.
   *
   * If the provided `url` is deemed to be a complete URL, it is returned
   * directly. Otherwise it is combined with the `host` and `namespace`
   * options of the request class to create the full URL.
   */
  _buildURL(url, options = {}) {
    if (isFullURL(url)) {
      return url;
    }
    const urlParts = [];
    let host = options.host ?? this.host;
    if (host) {
      host = endsWithSlash(host) ? removeTrailingSlash(host) : host;
      urlParts.push(host);
    }
    let namespace = options.namespace ?? this.namespace;
    if (namespace) {
      // If host is given then we need to strip leading slash too (as it will be added through join)
      if (host) {
        namespace = stripSlashes(namespace);
      } else if (endsWithSlash(namespace)) {
        namespace = removeTrailingSlash(namespace);
      }

      // If the URL has already been constructed (presumably, by Ember Data), then we should just leave it alone
      const hasNamespaceRegex = new RegExp(`^(/)?${stripSlashes(namespace)}/`);
      if (!hasNamespaceRegex.test(url)) {
        urlParts.push(namespace);
      }
    }
    let finalUrl = url;

    // *Only* remove a leading slash when there is host or namespace -- we need to maintain a trailing slash for
    // APIs that differentiate between it being and not being present
    if (startsWithSlash(finalUrl) && urlParts.length !== 0) {
      finalUrl = removeLeadingSlash(finalUrl);
    }
    urlParts.push(finalUrl);
    return urlParts.join('/');
  }
  _shouldSendHeaders({
    url,
    host
  }) {
    const finalUrl = url ?? '';
    const finalHost = host ?? this.host ?? '';

    // Add headers on relative URLs
    if (!isFullURL(finalUrl)) {
      return true;
    }

    // Add headers on matching host
    return haveSameHost(finalUrl, finalHost);
  }

  /**
   * Get the full headers hash, combining the service-defined headers with
   * the ones provided for the request.
   */
  _getFullHeadersHash(headers = {}) {
    return {
      ...this.headers,
      ...headers
    };
  }
}

export { FetchRequestService as default };
//# sourceMappingURL=fetch-request.js.map
