# Configuration

When initializing `social-integrator`'s _Instagram_ class by calling `getInstance()` for the first time,
it is required to pass an option object containing at least:

```ts
import { InstagramInstanceOptionsInterface } from "./InstagramInstanceOptions";

const options: InstagramInstanceOptionsInterface = {
	appId: "YOUR_APP_ID_FROM_META_DEV_PLATFORM",
	redirectUri: "FULL_PATH_TO_REDIRECTION_TARGET",
	tokenBackendUri: "PATH_TO_TOKEN_EXCHANGE_BACKEND",
	afterTokenFunction: () => {
		// do something after successful authorization.
	},
};
```

## Options

### appId

-   Type: `string`
-   Required

Set to the `APP_ID` from the App created in _Meta Developer Platform_.

::: info
Make sure to update this value depending on being in development or production if using different Apps in
the _Meta Developer Platform_.
:::

### redirectUri

-   Type: `string`
-   Required

The URL by which the static redirect file is available. **Must** be served by HTTPS also on development.
Should be listed under `Valid OAuth Redirect URIs` in _Meta Developer Platform_.

### tokenBackendUri

-   Type: `string`
-   Required

The URL where the _Token Exchange Backend_ is available. It is required in order to exchange the
authorization tokens received from the Instagram Authorization Flow to an actual Short-Term Access Token
that allows calling the API's endpoints.

::: info NOTE
If the URL is located on a different origin (domain / port), make sure to set up the proper CORS headers in the backend.
:::

### afterTokenFunction

-   Type: `() => void`
-   Required (Flow will not be able to load photos without it)

Function to run after successful authorization flow and token exchange. For example, calling `getPhotos()` and
storing the result in a variable which is used for rendering.

Example (using Vue `ref()`s):

```ts
const options = {
	// ...
	async afterTokenFunction() {
		photos.value = await ig.getPhotos();
		hasNext.value = ig.showNext();
		hasPrevious.value = ig.showPrevious();
	},
};
```

### api

-   Type: `new () => APIAbstract`
-   Default: `API`

The default implementation of `social-integrator` uses the built in `fetch()` to send requests to Instagram and to the
Token Exchange Backend.

::: info
The `API` class is a light wrapper over `fetch()`.
:::

It is possible to pass a different class to `social-integrator`, as long as it extends `APIAbstract`. This is the way
to add different settings to `fetch()`, change to `axios` or any other library, etc.
Additional information on creating a custom API class is available under [Extending Social Connector](/guide/extending).

## Full Source Code

The full Options Interface (`InstagramInstanceOptionsInterface`) source code:

<<< ../../src/interfaces/InstagramInstanceOptions.ts
