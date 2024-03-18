# InstagramClient

_Instagram Basic Display API_ Client.
Inherits from `SocialConnector`.

## Public static methods

Public static methods are directly available on the InstagramClient class.

::: warning
Some public static methods are only usable after instantiation of the class instance,
as they are a shortcut to an instance method.
These methods are marked here.
:::

### `public static getInstance(options?)`

Returns the singleton instance of the InstagramClient class.
If it is the first call, will instantiate the instance.
**When instantiating the instance** (first call to `getInstance`), **the _options_ parameter
is required!**

The full options reference is listed under [Configuration](/guide/configuration).

::: danger NOTICE
Calling `getInstance` with options **after** the class has been instantiated might not change the
options - this is not a supported behavior and might be removed at any point.
:::

### `public static clickHandler()`

Shortcut to public instance method `clickHandler()`;

_Can only be called after instantiation_.

### `public static getPhotoUrl(id)`

Returns a promise which resolves to the URL of the photo, or an empty string if not found.

_Can only be called after instantiation_.

### `public static getUserId()`

Returns the UserId as returned from the Instagram Basic Display API.

_Can only be called after instantiation_.

## Public instance methods

### `clickHandler()`

Handler function that can be directly used as a click handler for the
"Connect with Instagram" button in order to begin the authorization flow.
It can also be called as the last statement inside the event handler, is using a
custom event handler.

### `async getPhotos(direction?)`

Returns a promise which resolves to an array of photos received from the Instagram API.

Also sets pagination cursors as needed.
