# Using Social Connector with Vue.js

::: info
A Vue Composable is in the roadmap, to ensure a better integration to Vue.js
:::

Follow the [Getting Started](/guide/getting-started) guide for requirements, installation and importation instructions.

## Initialization

The Instagram class should be initialized using the `onMounted` hook. This makes the code run on the client-side only,
and waits for the DOM to be available.

```ts
onMounted(() => {
	let ig = Instagram.getInstance(options);
});
```

## afterTokenFunction()

As part of the initialization options, the `afterTokenFunction` should be written as needed for the
specific app use case.

For example, if the photos will be stored on a ref, as:

```ts
const photos = ref([]);
```

The `afterTokenFunction` can be written like:

```ts
onMounted(() => {
	let ig = Instagram.getInstance({
		// ...
		async afterTokenFunction() {
			photos.value = await ig.getPhotos();
		},
	});
});
```

::: info
Pagination can be set the same way, but utilize refs instead of standard variables.
:::

## Redirection URL

The static redirection target **does not require Vue** to work. However, the redirection (`location.replace()`)
at the end of the static redirection target should be to the page where `social-connector` is initialized,
otherwise nothing will handle the incoming authorization token.

## Full Code Sample

A full code sample using Vue is available in the `/demo/App.vue` file.
It is also the file used for developing the library.

Keep in mind that:

1. It shows a simple, generic use case.
2. It imports the source file and not the built library - as it is used for development purposes.
