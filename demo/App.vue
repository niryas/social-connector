<script setup lang="ts">
import InstagramClient from "../src/InstagramClient";
import { onMounted, ref } from "vue";
import { DIRECTION } from "../src/SocialConnector";

const igAppId = import.meta.env.VITE_IG_APP_ID;
const igRedirectUri = import.meta.env.VITE_IG_REDIRECT_URI;

let photos = ref([]);
let hasNext = ref(false);
let hasPrevious = ref(false);

async function pageHandler(next?: boolean) {
	photos.value = await InstagramClient.getInstance().getPhotos(
		next ? DIRECTION.NEXT : DIRECTION.PREVIOUS,
	);
	hasNext.value = InstagramClient.getInstance().showNext();
	hasPrevious.value = InstagramClient.getInstance().showPrevious();
}

onMounted(() => {
	let ig = InstagramClient.getInstance({
		appId: igAppId,
		redirectUri: igRedirectUri,
		tokenBackendUri: "http://localhost:8000/ig_token/",
		async afterTokenFunction() {
			photos.value = await ig.getPhotos();
			hasNext.value = ig.showNext();
			hasPrevious.value = ig.showPrevious();
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
				@click="InstagramClient.clickHandler"
			>
				Connect to Instagram
			</button>
			<div
				v-if="photos.length"
				class="tile pt-4 justify-center is-flex-wrap-wrap"
			>
				<figure v-for="photo in photos" :key="photo.id" class="image">
					<img :src="photo.picture" />
				</figure>
			</div>
			<div v-if="photos.length" class="level pt-4 is-mobile">
				<div class="level-item">
					<button
						class="button is-info is-rounded"
						:disabled="!hasPrevious"
						@click="pageHandler()"
					>
						&lt;&lt; Previous
					</button>
				</div>
				<div class="level-item">
					<button
						class="button is-info is-rounded"
						:disabled="!hasNext"
						@click="pageHandler(true)"
					>
						Next &gt;&gt;
					</button>
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
