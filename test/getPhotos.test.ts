import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "vitest";
import { InstagramInstanceOptionsInterface } from "../src/interfaces/InstagramInstanceOptions";
import Instagram from "../src/Instagram";
import { DIRECTION } from "../src/SocialConnector";

const handlers = [
	http.get("https://graph.instagram.com/me/media", async ({ request }) => {
		const url = new URL(request.url);
		const fields = url.searchParams.get("fields");
		const accessToken = url.searchParams.get("access_token");
		const after = url.searchParams.get("after");
		const before = url.searchParams.get("before");

		const photoResponse = {
			data: [
				{
					id: "1819859339218",
					media_type: "IMAGE",
					media_url: "http://localhost/media_url",
				},
			],
			paging: {
				cursors: {
					before: "beforeCursor",
					after: "afterCursor",
				},
			},
		};

		if (!fields || !accessToken) {
			return new HttpResponse(null, { status: 401 });
		}

		if (after) {
			photoResponse.data[0].media_url += "/media_after";
		} else if (before) {
			photoResponse.data[0].media_url += "/media_before";
		}

		if (accessToken === "addNext") {
			photoResponse.paging["next"] = "http://localhost/next_url";
		}

		if (accessToken === "addPrev") {
			photoResponse.paging["previous"] = "http://localhost/prev_url";
		}

		return HttpResponse.json(photoResponse);
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

	beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

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

	test("sends after correctly", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "123";
		instance["after"] = "afterCursor";

		const photos = await instance.getPhotos(DIRECTION.NEXT);

		expect(photos.length).toBe(1);

		const firstPhoto = photos[0];
		expect(firstPhoto.picture).toContain("after");
	});

	test("sends before correctly", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "123";
		instance["before"] = "beforeCursor";

		const photos = await instance.getPhotos(DIRECTION.PREVIOUS);

		expect(photos.length).toBe(1);

		const firstPhoto = photos[0];
		expect(firstPhoto.picture).toContain("before");
	});

	test("showNext() is true when there's more photos", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "addNext";

		await instance.getPhotos();
		expect(instance.showNext()).toBeTruthy();
	});

	test("showNext() is false when there's no more photos", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "123";

		await instance.getPhotos();
		expect(instance.showNext()).toBeFalsy();
	});

	test("showPrevious() is true when there's a previous page", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "addPrev";

		await instance.getPhotos();
		expect(instance.showPrevious()).toBeTruthy();
	});

	test("showPrevious() is false when there's no previous page", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "123";

		await instance.getPhotos();
		expect(instance.showPrevious()).toBeFalsy();
	});

	test("getPhotoUrl() returns Url of requested photo", async () => {
		const instance = Instagram.getInstance(instanceOptions);
		instance["accessToken"] = "123";
		await instance.getPhotos();

		expect(await Instagram.getPhotoUrl("1819859339218")).toBe(
			"http://localhost/media_url",
		);
	});

	test("getPhotoUrl() returns empty string if no photo found", async () => {
		Instagram.getInstance(instanceOptions);
		expect(await Instagram.getPhotoUrl("1819859339218")).toBe("");
	});
});
