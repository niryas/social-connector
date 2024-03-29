# social-connector

> A Simple TypeScript / JavaScript integration with _Instagram Basic Display API_

Use to integrate your app's with _Instagram Basic Display API_
or as a hands-on guide on how to develop the integration on your own.

## Installing / Getting started

Check out the [full documentation]() for instructions.

## Developing

To further develop this package, fork it and checkout to your local machine.

### Follow the [Getting Started]() guide regarding:

-   Setting up an App in Meta's Developer Platform.
-   Setting up HTTPS and adding the redirect URI to Meta's Developer Platform.
-   Adding a Token Exchange Backend for development.

### Then:

1. Install dependencies
   Run `npm install` in the local folder of the package.
2. Create an `.env.local` file
   To easily pass the Instagram App ID and Redirect URI:

```shell
VITE_IG_APP_ID=00000  # your app id
VITE_IG_REDIRECT_URI="https://..."  # your full redirect uri
```

3. Edit `/demo/App.vue` instance options:

```ts
let ig = InstagramClient.getInstance({
	// ...
	tokenBackendUri: "http://localhost:8000/ig_token/",
	// ...
});
```

In case your Token Exchange Backend is exposed in a different address.

4. Run the development server using:
   `npm run dev`

### Running tests

Run tests using `npm run test`

### Documentation

The documentation development server can be run with `npm run docs:dev`.
All documentation site files are inside the `docs` folder.

## Contributing

Contributions are greatly appreciated!
Check out the [Contributing Guide]() for more details.

## Links

...

## Licensing

The code in this project is licensed under the _MIT License_.
