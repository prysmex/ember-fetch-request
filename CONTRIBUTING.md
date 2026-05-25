# How To Contribute

## Installation

- `git clone <repository-url>`
- `cd ember-fetch-request`
- `pnpm install`

## Linting

- `pnpm lint`
- `pnpm lint:fix`

## Building the addon

- `pnpm build`

## Running tests

- `pnpm test` – Builds the test bundle and runs it against headless Chrome.

## Running the demo application

- `pnpm start`
- Visit the demo application at [http://localhost:4200](http://localhost:4200).

## Testing against other Ember versions

The repo uses [@embroider/try](https://github.com/embroider-build/embroider)
for scenario testing. The scenarios are declared in [.try.mjs](./.try.mjs)
and cover the supported peer range:

- `ember-lts-4.12` – validates the minimum supported Ember version
- `ember-lts-5.8`, `ember-lts-5.12` – mid-range LTS coverage
- `ember-lts-6.2` – matches the day-to-day dev target
- `ember-latest` – latest released Ember

To run a single scenario locally:

```sh
pnpm dlx @embroider/try apply ember-lts-4.12
pnpm install --no-lockfile
pnpm test
```

For more information on Ember addon development, see the
[Ember CLI Guides](https://cli.emberjs.com/release/).
