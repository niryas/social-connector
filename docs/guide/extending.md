# Extending Social Connector

::: info
For Contributing guidance, check out the [Contributing Guide](/CONTRIBUTING) Section.
:::

## Adding features

The `Instagram` class can be used as a base class and be extended with additional functionality, while inheriting whatever
built-in functions that can still work the same way.

As this project is still in an unstable API version (v0.x), pull requests adding features will be greatly appreciated.
When adding features to the project itself, more public methods can be exposed through the `Instagram` class API
and provide additional functionality. There is no need to create a new class, unless it makes sense for the specific
feature.

```ts
class CustomInstagram extends Instagram {
	public myNewFeature() {
		// do something
	}
}
```

::: tip
The design philosophy behind the `social-connector` API is to expose generic and simple to use methods, which are hopefully
relevant for multiple social networks. Most of the "heavy lifting" should be done behind the scenes, and shouldn't
require complicated setup for the basic use case.
:::

## Changing behavior

If it is not possible to change the behavior in the direction needed based on available options, using `Instagram` as a
base class to extend from is also a possibility - to rewrite logic to change the behavior.

For example, rewriting the `clickHandler` logic:

```ts
class CustomInstagram extends Instagram {
	public async clickHandler() {
		const someData = await this.getSomeData();
		if (!someData) throw new Error("Couldn't get data");
		this.customRequestAccess(someData).then(
			() => {}, // something
		);
		// ...
	}
}
```

::: warning SUGGESTION
If the behavior change might be a common use case, it might be worth it to add it to `social-connector` itself.
Pull requests will be greatly appreciated.
:::

## Adding social networks

A social network client should extend from the `SocialConnector` class, just like the `Instagram` built-in class.
It should then be exported as default. Example:

```ts
// /src/Instagram.ts
import SocialConnector from "./SocialConnector";

export default class Instagram extends SocialConnector {
	// ...
}
```

Check out the [API Reference](/reference/social-connector) for implementation details.
