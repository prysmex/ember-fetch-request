import Service from '@ember/service';
import fetch from 'fetch';
import { assign } from '@ember/polyfills';
import { get, set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import {
  InvalidError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
  GoneError,
  NetworkError,
  TimeoutError,
  AbortError,
  ConflictError,
  ServerError
} from '../errors';
import {
  isFullURL,
  haveSameHost,
  param
} from '../-private/utils/url-helpers';
import isString from '../-private/utils/is-string';
import getHeader from '../-private/utils/get-header';

const JSONContentType = /^application\/(?:vnd\.api\+)?json/i;

function isJSONContentType(header) {
  if (!isString(header)) {
    return false;
  }

  return !!header.match(JSONContentType);
}

function isJSONStringifyable({ method, contentType, body, headers }) {
  if (method === 'GET') {
    return false;
  }

  if (
    !isJSONContentType(contentType) &&
    !isJSONContentType(getHeader(headers, 'Content-Type'))
  ) {
    return false;
  }

  if (typeof body !== 'object') {
    return false;
  }

  return true;
}

function endsWithSlash(string) {
  return string.charAt(string.length - 1) === '/';
}

function removeTrailingSlash(string) {
  return string.slice(0, -1);
}

function startsWithSlash(string) {
  return string.charAt(0) === '/';
}

function removeLeadingSlash(string) {
  return string.substring(1);
}

function stripSlashes(path) {
  // make sure path starts with `/`
  if (startsWithSlash(path)) {
    path = removeLeadingSlash(path);
  }

  // remove end `/`
  if (endsWithSlash(path)) {
    path = removeTrailingSlash(path);
  }
  return path;
}

export default class FetchRequestService extends Service {

  /**
    The request can target other hosts by setting the `host` property.
    @property host
    @type {String}
  */

  /**
    The request can target other hosts by setting the `host` property.
    @property host
    @type {String}
  */

  /**
    The request can target another namespace by setting the `namespace` property.
    @property namespace
    @type {String}
  */

  /**
    The request can merge custom/dynamic headers by setting the `headers` property.
    @property headers
    @type {Object}
  */

  async request(endpoint, settings) {
    settings = this.options(endpoint, settings);
    let response = await fetch(settings.url, settings);

    if (response.status === null || response.status === undefined) {
      throw new NetworkError(response);
    }
    
    let payload = this.getBody(response);

    try {
      if (!response.ok) {
        this._handleErrors(response);
      }

      return payload;
    } catch(error) {
      throw error(payload)
    }
  }

  async getBody(response) {
    const contentType = response.headers.get('content-type');
    if (contentType === null) {
      return new Promise(() => null);
    }

    // For application/json and application/vnd.api+json
    if (contentType.includes('json')) {
      return await response.json();
    }

    // For text/plain and text/html
    if (contentType.includes('text')) {
      return await response.text();
    }

    throw new Error(`Unsupported response content-type: ${contentType}`);
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
        throw new ServerError();
      default:
        throw new ServerError();
    }
  }

  /**
   * Created a normalized set of options from the per-request and
   * service-level settings
   */
  options(url, options = {}) {
    options.url = this._buildURL(url, options);
    options.method = options.method || 'GET';

    if (this._shouldSendHeaders(options)) {
      options.headers = this._getFullHeadersHash(options.headers);
    } else {
      options.headers = options.headers || {};
    }

    if (!isEmpty(options.contentType)) {
      set(options.headers, 'Content-Type', options.contentType);
    }

    if (options.body) {
      if (isJSONStringifyable(options)) {
        options.body = JSON.stringify(options.body);
      } else if (options.method == 'GET') {
        options.url = options.url + '?' + param(options.body);
        delete options.body;
      }
    }
    return options;
  }

  /**
   * Build a URL for a request
   *
   * If the provided `url` is deemed to be a complete URL, it will be returned
   * directly.  If it is not complete, then the segment provided will be combined
   * with the `host` and `namespace` options of the request class to create the
   * full URL.
   */
  _buildURL(url, options = {}) {
    if (isFullURL(url)) {
      return url;
    }

    const urlParts = [];

    let host = options.host || get(this, 'host');
    if (host) {
      host = endsWithSlash(host) ? removeTrailingSlash(host) : host;
      urlParts.push(host);
    }

    let namespace = options.namespace || get(this, 'namespace');
    if (namespace) {
      // If host is given then we need to strip leading slash too( as it will be added through join)
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

    // *Only* remove a leading slash when there is host or namespace -- we need to maintain a trailing slash for
    // APIs that differentiate between it being and not being present
    if (startsWithSlash(url) && urlParts.length !== 0) {
      url = removeLeadingSlash(url);
    }
    urlParts.push(url);

    return urlParts.join('/');
  }

  _shouldSendHeaders({ url, host }) {
    url = url || '';
    host = host || get(this, 'host') || '';

    // Add headers on relative URLs
    if (!isFullURL(url)) {
      return true;
    }

    // Add headers on matching host
    return haveSameHost(url, host);
  }

  /**
     * Get the full 'headers' hash, combining the service-defined headers with
     * the ones provided for the request
  */
  _getFullHeadersHash(headers = {}) {
    return assign({}, this.headers, headers);
  }

}
