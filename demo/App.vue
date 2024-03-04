<script setup lang="ts">
import Instagram from "../src/Instagram";
import {onMounted, ref} from "vue";

const igAppId = import.meta.env.VITE_IG_APP_ID;
const igRedirectUri = import.meta.env.VITE_IG_REDIRECT_URI;

let photos = ref([]);

onMounted(() => {
	const ig = Instagram.getInstance({
		appId: igAppId,
		redirectUri: igRedirectUri,
		tokenBackend: "http://localhost:8000/api/ig_token/",
	});

	// @TODO: Move to a separate return uri file and use localstorage (like in Loomino)
	const queryString = document.location.search;
	if (!queryString) {
		return;
	}

	// @TODO: Move this logic to the Instagram class instance
	const authObj = ig.buildAuthObject(queryString);
	if (!authObj || "error" in authObj) {
		console.error(authObj);
		return;
	}
	ig.requestToken(authObj.code).then(() => {
		continueIGFlow(ig);
	});
});

async function continueIGFlow(ig: Instagram) {
	photos.value = await ig.getPhotos();
}

const clickHandler = () => {
	const ig = Instagram.getInstance();
	ig.requestAccess()
		.then(() => {
			continueIGFlow(ig);
		})
		.catch(() => {
			ig.login();
		});
};

</script>

<template>
<div>
	<p>Vue app {{ igAppId }}</p>
	<button type="button" @click="clickHandler">Connect to Instagram</button>
	<div>
		<img v-for="photo in photos" :key="photo.id" :src="photo.picture" />
	</div>
</div>
</template>

<style scoped>

</style>