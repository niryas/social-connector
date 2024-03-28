# Getting Started

This getting started guide assumes usage of the `social-connector` package as is.
Further instructions for extending or using the package as a guide for a custom integration are covered in other
sections of the documentation.

## Requirements

There are three components required to use Social Connector and connect to _Instagram Basic Display API_:

1. Social Connector frontend package (`@social-connector/social-connector`)
2. A redirect target file (can be a plain static html file, such as `/public/ig_auth.html`)
3. Token Exchange backend (...)

In addition, an Instagram App should be created in [Meta's Developer Platform](https://developers.facebook.com).
Instagram users for testing should also be added to the app using Meta's platform.

::: info
Check out the official
[Instagram Basic Display API's Getting Started guide](https://developers.facebook.com/docs/instagram-basic-display-api/getting-started) _(steps 1 through 3)_
for more information on setting up the app on Meta's Developer Portal.
`social-connector` takes care of steps 4+ for you.
:::

::: warning KEEP IN MIND:
Production access (e.g., being able to connect Instagram users who are not testers)
is only available after Meta's app review process which is not covered in this documentation.
:::

## Adding to your project

### Installing the frontend package

::: code-group

```shell [npm]
npm install @social-connector/social-connector
```

```shell [yarn]
yarn add @social-connector/social-connector
```

:::

### Importing and usage

The package exposes an `InstagramClient` named import. You can import it with the following command:

```ts
import { InstagramClient } from "@social-connector/social-connector";
```

Set the App ID and Redirect URI. In this example they are separated to their own variables,
but depending on your setup, it is not technically necessary. You can load the variables as environment variables,
settings, or whatever way you manage such details in your app.

```ts
const igAppId = "YOUR_INSTAGRAM_APP_ID";
const igRedirectUri = "YOUR_INSTAGRAM_REDIRECT_URI";
```

::: info
Keep in mind that the App ID and Redirect URI for development are different from those for production.
:::

Only when DOM is ready and only on client side (e.g., Vue `onMounted` hook),
instantiate the Instagram Client of the package:

```ts
// Only run on client when DOM is ready (e.g., Vue onMounted hook):
let ig = InstagramClient.getInstance({
	appId: igAppId,
	redirectUri: igRedirectUri,

	// URL of the Token Exchange Backend (see below for more information)
	tokenBackendUri: "http://localhost:8000/api/ig_token/",

	// Function to run after successfully authorizing Instagram
	async afterTokenFunction() {
		photos.value = await ig.getPhotos();
	},
});
```

Further details regarding initialization options are listed under [configuration](/guide/configuration).

Create you own "Connect with Instagram" button (make sure to follow Meta's brand requirements
in order to pass app review), and use the `Instagram.clickHandler` method as the click handler.

::: details Additional notes regarding the click handler:
The static method (`Instagram.clickHandler`) is a shortcut to the instance `clickHandler` method.
Both can be used interchangeably.
If you need to run additional code before calling the `clickHandler` method, it can also be called as the final
step of a custom event handler.
:::

### Adding a redirect target file to your project

::: tip
You can use the file provided in `/public/ig_auth.html` as a simple drop-in for development.
Check the code before using in production - you might need to add support for additional edge case scenarios.
:::

The redirect target file is the destination your user reaches after finishing the Authorization Flow
(successfully or with failure) on the Instagram website.
Instagram forwards an authorization token, as well as success / failure information, as a query string
as part of this request.

::: danger IMPORTANT
All URLs of this redirection file (e.g., development, staging, production environments) should be listed under
`Valid OAuth Redirect URIs` in the Meta Developer Platform's Instagram Basic Display Settings.
:::

The redirection target should take the full query string passed by Instagram, add it to localstorage, and
further redirect to your app, to a page where social-connector is loaded.

`social-connector` expects to receive the entire query string using localstorage, using the key `igAuth`.
After saving the query string, you should _replace_ the location to your app.

::: info
Use `replace` to keep the static file address out of the session history.
:::

Here is a naive implementation, available in `public/ig_auth.html`:

```js
// ig_auth.html
window.localStorage.setItem("igAuth", document.location.search);
window.location.replace("/");
```

::: info
The destination of the final redirect (e.g., the one in `location.replace("/")`)
must have social-connector initialized (`getInstance({options})`) upon loading the page to continue running the flow.
:::

### Adding a Token Exchange backend

A backend service which receives an authorization token from `social-connector` frontend,
sends it to Instagram, and returns a short-lived Instagram access token.

::: warning
It is not possible to set up an Instagram integration without a Token Exchange backend, whether custom-built or an available package.
:::

Depending on your architecture, you can choose one of the following:

1. Use `django-social-connector` [django app](https://github.com/niryas/django-social-connector) - **not for production use at this point**.
2. Use an OAuth-2 package which supports your backend environment and customize it (if needed) for Instagram Basic Display API.
   Most packages are an overkill for what is needed for this purpose.
3. Write your own implementation as part of your existing backend.

## Running and Testing the Integration

### HTTPS Requirement

Instagram only supports **HTTPS Endpoints** for its Basic Display API. In order to test your development environment,
you must access it using HTTPS. An easy way to set it up, if your development environment does not provide you an easy
built-in option for it, is to use a [ngrok](https://ngrok.com) tunnel.
The redirect URI to add to your Meta Developer Platform's settings would then be
`https://YOUR_NGROK_ADDRESS/ig_auth.html`, if the redirect target is available on the root folder and is named
`ig_auth.html`.

### Test Users

Only users registered as test users in the Meta Developer Platform can log in and add your app for testing.
Check out Instagram documentation for how to add test users. Keep in mind that test users must approve their addition as
test users from their own Instagram account.

### Troubleshooting

If Instagram rejects your tokens, sometimes without giving a clear reason why, double check that the _Redirect URI_
set in the Meta Developer Platform match completely to the Redirect URI you set in `social-connector` as well as your
Token Exchange backend. Be wary of additional slashes or missing a final slash - the addresses must be a 100% match.

Sometimes tokens might also be rejected if the test user does not have a birthday confirmed on their Instagram
account. This is specifically important for apps in categories which might be age restricted in certain territories.
The easiest solution is to have the test user confirm their birthdate on their regular Instagram account.
