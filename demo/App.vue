<script setup lang="ts">
import Instagram from "../src/Instagram";
import {onMounted, ref} from "vue";

const igAppId = import.meta.env.VITE_IG_APP_ID;
const igRedirectUri = import.meta.env.VITE_IG_REDIRECT_URI;

let photos = ref([]);

onMounted(() => {
	let ig = Instagram.getInstance({
		appId: igAppId,
		redirectUri: igRedirectUri,
		tokenBackendUri: "http://localhost:8000/api/ig_token/",
		async afterTokenFunction() {
			photos.value = await ig.getPhotos();
		},
	});
});

</script>

<template>
	<section class="section">
		<div class="container">
			<h1 class="title">Social Connector Demo - Vue</h1>
			<button
				type="button"
				class="button is-primary is-rounded"
				@click="Instagram.clickHandler">Connect to Instagram
			</button>
			<div v-if="photos.length" class="tile pt-4 justify-center is-flex-wrap-wrap">
				<figure v-for="photo in photos" :key="photo.id" class="image">
					<img :src="photo.picture" />
				</figure>
			</div>
			<div v-if="photos.length" class="level pt-4 is-mobile">
				<!-- @TODO -->
				<div class="level-item">
					<button class="button is-info is-rounded">&lt;&lt; Previous</button>
				</div>
				<div class="level-item">
					<button class="button is-info is-rounded">Next &gt;&gt;</button>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.container {
	text-align: center;
}

.image img {
	width: 25vw;
	height: auto;
	padding: 4px;
}

.justify-center {
	justify-content: center;
}
</style>
