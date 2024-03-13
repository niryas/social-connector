import {http, HttpResponse} from "msw";
import {setupServer} from "msw/node";
import {afterAll, afterEach, beforeAll, beforeEach, describe, test, expect} from "vitest";
import {InstagramInstanceOptionsInterface} from "../src/interfaces/InstagramInstanceOptions";
import Instagram from "../src/Instagram";

const handlers = [
	http.get("https://graph.instagram.com/me/media", async ({ request }) => {
		const url = new URL(request.url);
		const fields = url.searchParams.get("fields");
		const accessToken = url.searchParams.get("access_token");

		if (!fields || !accessToken) {
			return new HttpResponse(null, {status: 401});
		}

		return HttpResponse.json({
			"data": [
				{
					"id": "1819859339218",
					"media_type": "IMAGE",
					"media_url": "http://localhost/media_url"
				}
			],
			"paging": {
				"cursors": {
					"before": "beforeCursor",
					"after": "afterCursor"
				}
			}
		});
	}),
];

const server = setupServer(...handlers);

describe("Instagram getPhotos() method and related", () => {
	let instanceOptions: InstagramInstanceOptionsInterface;
	beforeEach(() => {
		instanceOptions = {
			appId: "appId",
			redirectUri: "https://redirect.example.com",
			tokenBackendUri: "http://tokenBackend",
		};
	});

	afterEach(() => {
		Instagram["instance"] = undefined;
		server.resetHandlers();
	});

	beforeAll(() => server.listen({ onUnhandledRequest: "error"}));

	afterAll(() => server.close());

	test("loads photos", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "123";
		const photos = await instance.getPhotos();

		expect(photos.length).toBe(1);

		const firstPhoto = photos[0];
		expect(firstPhoto.id).toBe("1819859339218");
		expect(firstPhoto.picture).toBe("http://localhost/media_url");
	});

	test("getPhotoUrl() returns Url of requested photo", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "123";
		await instance.getPhotos();

		expect(await Instagram.getPhotoUrl("1819859339218")).toBe("http://localhost/media_url");
	});
});
