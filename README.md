# @prysmex-engineering/ember-fetch-request

Service for making `fetch` requests in Ember applications. Mimics the
`ember-ajax` ergonomics: it builds the request URL from the service's `host`
and `namespace`, merges service-level and per-request headers, serializes
JSON bodies and query parameters, and maps response statuses to typed error
classes.

- Customizable service (subclass to set defaults)
- Returns native Promises
- Typed error classes for predictable error handling
- TypeScript declarations published with the package

## Compatibility

- Ember.js v4.0.0 or above
- Embroider or `ember-auto-import` v2
- Node.js 18 or above (for FastBoot / build tooling)

## Installation

```sh
pnpm add @prysmex-engineering/ember-fetch-request
# or
npm install @prysmex-engineering/ember-fetch-request
# or
ember install @prysmex-engineering/ember-fetch-request
```

## Setup

Register the service in your app. The addon does not merge a default service
into the app tree, so you can define it in TypeScript without colliding with
addon-provided `.js` files.

```ts
// app/services/fetch-request.ts
import FetchRequestService from '@prysmex-engineering/ember-fetch-request/services/fetch-request';

export default class AppFetchRequestService extends FetchRequestService {}
```

Use the base class directly when you do not need app-specific defaults:

```ts
// app/services/fetch-request.ts
export { default } from '@prysmex-engineering/ember-fetch-request/services/fetch-request';
```

## Usage

Inject the `fetchRequest` service into a route, controller, or component.

```js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AnyRoute extends Route {
  @service fetchRequest;

  model() {
    return this.fetchRequest.request('/posts');
  }
}
```

### Setting defaults

Extend the service to set a default `host`, `namespace`, or `headers`. The
extended service is what gets injected when you `@service fetchRequest`.

```ts
// app/services/fetch-request.ts
import FetchRequestService from '@prysmex-engineering/ember-fetch-request/services/fetch-request';
import { service } from '@ember/service';

export default class AppFetchRequestService extends FetchRequestService {
  @service declare session: { authToken?: string };

  host = 'https://api.example.com';
  namespace = '/api/v1';

  get headers() {
    const headers: Record<string, string> = {};
    if (this.session.authToken) {
      headers['Authorization'] = `Bearer ${this.session.authToken}`;
    }
    return headers;
  }
}
```

### Per-request options

Pass options as the second argument to `request()`.

```js
this.fetchRequest.request('/posts', {
  method: 'POST',
  contentType: 'application/json',
  body: { title: 'Hello' },
});
```

Options accepted in addition to the standard `RequestInit` fields:

| Option              | Type                       | Description                                                                                  |
| ------------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| `host`              | `string`                   | Override the service-level host for this request.                                            |
| `namespace`         | `string`                   | Override the service-level namespace for this request.                                       |
| `headers`           | `Record<string, string>`   | Merged with the service-level `headers`.                                                     |
| `contentType`       | `string`                   | Shortcut for setting `Content-Type` and triggering JSON body serialization.                  |
| `body`              | `unknown`                  | Plain objects are JSON-stringified when the request is JSON; serialized as query on `GET`.   |
| `returnRawResponse` | `boolean`                  | When `true`, returns the raw `Response` instead of the parsed body.                          |

### Error handling

Non-2xx responses throw a typed `FetchError` subclass with the response body
attached as `error.payload`.

```js
import {
  isNotFoundError,
  isUnauthorizedError,
} from '@prysmex-engineering/ember-fetch-request/errors';

try {
  return await this.fetchRequest.request('/posts/1');
} catch (error) {
  if (isNotFoundError(error)) {
    // handle 404
  } else if (isUnauthorizedError(error)) {
    // handle 401
  } else {
    throw error;
  }
}
```

Available error classes: `FetchError`, `BadRequestError` (400),
`UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404),
`ConflictError` (409), `GoneError` (410), `InvalidError` (422),
`ServerError` (5xx), `NetworkError`, `TimeoutError`, `AbortError`.

Each error has a matching `is*Error()` helper plus the catch-all
`isFetchError()` and `isSuccess(status)`.

## Migrating from v1.x

v2.0.0 reformats this addon as a [v2 Embroider addon][v2-format] with
published TypeScript types.

[v2-format]: https://github.com/embroider-build/embroider/blob/main/docs/v2-faq.md

Breaking changes:

- Requires **Ember.js 4.0.0+** and **`ember-auto-import` v2** in the
  consuming app. Apps still on Ember 3.x should stay on `1.x` of this addon.
- The addon now ships pre-built JavaScript and `.d.ts` declarations in
  `dist/` and `declarations/`. The classic `addon/` and `app/` trees are
  gone, but the import paths consumers use remain unchanged.
- The package now publishes its own TypeScript declarations, so apps with
  `@types/...` shims for this package should remove them.
- The addon no longer auto-registers a `fetchRequest` service. Add
  `app/services/fetch-request.ts` (see [Setup](#setup)) after installing.

No public API changes are expected. `fetchRequest.request(url, options)`,
the error classes, and the `is*Error()` helpers all keep the same signatures.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for development setup.

## License

This project is licensed under the [MIT License](LICENSE.md).
