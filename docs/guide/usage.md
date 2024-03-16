# Usage

## Initialization and Redirect URL

Follow the [Getting Started](/guide/getting-started) guide, which includes the full documentation for both.

## Click Handler

The `Instagram` instance includes a method called `clickHandler()`. For convenience, it is also available as a static
class method. This method provides the logic for handling the authorization flow:

```
button clicked --> if token is valid --> run afterTokenFunction()
			\
			 \
			   --> if no token / expired --> go to Instagram's Authorization flow
```

This method can be used directly as a handler on the "Add Photo from Instagram" button. Otherwise, if a custom event
handler is used, it should be called as the last statement:

```ts
function exampleHandler(ev) {
	sendLogToServer("clicked on Instagram", someData);
	// do some more stuff
	Instagram.getInstance().clickHandler(); // or Instagram.clickHandler()
}
```

## afterTokenFunction()

This function is set as part of the initialization options of the `Instagram` instance (check out the
[Configuration](/guide/configuration) documentation for further details on the setup).

The referenced function is called in two cases:

1. After clicking the button (by `clickHandler()`) - _if there is already a valid token for Instagram_
2. As the final part of the initialization stage, if an authorization token is passed from the _Redirection URL_ and a
   short-term Access Token has been received.

Use this function to request photos and set pagination (see below).

## Pagination: Next / Previous

The `Instagram` instance exposes two functions, which return a boolean value - whether there is a next page
or previous page for the API call:

```ts
const ig = Instagram.getInstance();

let showNextButton = ig.showNext();
let showPreviousButton = ig.showPrevious();
```

These calls should be made after the `getPhotos()` call, for example, inside the `afterTokenFunction()` function.

In order to actually call the next or previous page, it is possible to call `getPhotos()` with an extra parameter:

```ts
import { DIRECTION } from "@social-connector/social-connector";

const getNextPage = () => ig.getPhotos(DIRECTION.NEXT);
const getPreviousPage = () => ig.getPhotos(DIRECTION.PREVIOUS);
```

The pagination interface is left on purpose open to different types of implementations - this way it can be used both
for buttons (`Next` / `Previous`) and scrolling. The actual implementation also depends on whether the app
keeps the previous photos loaded or loads each page separately.
All of these options are possible using `social-connector`.
