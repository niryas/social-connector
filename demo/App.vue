<script setup lang="ts">
import Instagram from "../src/Instagram";
import {onMounted, ref} from "vue";

const igAppId = import.meta.env.VITE_IG_APP_ID;
const igRedirectUri = import.meta.env.VITE_IG_REDIRECT_URI;

let photos = ref([]);

let ig: Instagram;

onMounted(() => {
	ig = Instagram.getInstance({
		appId: igAppId,
		redirectUri: igRedirectUri,
		tokenBackend: "http://localhost:8000/api/ig_token/",
		async afterTokenFunction() {
			photos.value = await ig.getPhotos();
		},
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
		// continueIGFlow(ig);
	});
});

</script>

<template>
<div>
	<p>Vue app {{ igAppId }}</p>
	<button type="button" @click="ig.clickHandler">Connect to Instagram</button>
	<div>
		<img v-for="photo in photos" :key="photo.id" :src="photo.picture" />
	</div>
</div>
</template>

<style scoped>

</style>