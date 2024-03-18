# SocialConnector

Base class from which any social network client of the `social-connector` library is inheriting.
The class includes some common logic for all clients, as well as describing the interface which
should be implemented by each custom client class (e.g., `Instagram`).

## Public methods provided by `SocialConnector` class

### `public showNext(): boolean`

Returns whether to show a next page button.

### `public showPrevious(): boolean`

Returns whether to show a previous page button.

## Protected methods provided by `SocialConnector` class

### `protected constructor(...)`

-   Properties:
    1. `protected appId: string`
    2. `protected afterTokenFunction: () => void`
    3. `customApi?: new () => APIAbstract`

Sets the `appId` and `afterTokenFunction` options.
Initializes the API class to use - default implementation or a custom class.
Must be called from the inheriting class' constructor (`super()`).

### `protected setToken(authResponse)`

Sets the proper access token and user id. Currently only support Instagram.

### `protected setPaginationCursors(response)`

Sets the properties to handle pagination (next and previous pages).
Works with Meta's Pagination logic.

## Public methods that must be implemented by inheriting class

### `clickHandler()`

Event handling function - to be used when the "Connect with _social-network_" button is clicked.

### `getPhotos(direction?)`

Returns a promise which resolves to an array of photos from the social network.
The `direction` optional parameter can be used to request the next / previous page.

### `static getPhotoUrl(id)`

Returns a promise which resolved to the URL of a specific photo (by its id).
Can be used to load it to a cropper / edit before upload.

### `static getUserId()`

Returns the User ID as it is returned from the social network API.
