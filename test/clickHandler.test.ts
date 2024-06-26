import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InstagramInstanceOptionsInterface } from "../src/interfaces/InstagramInstanceOptions";
import InstagramClient from "../src/InstagramClient";

describe("InstagramClient clickHandler", () => {
	let instanceOptions: InstagramInstanceOptionsInterface;
	let mockAfterToken: ReturnType<typeof vi.fn>;
	beforeEach(() => {
		mockAfterToken = vi.fn();
		instanceOptions = {
			appId: "appId",
			redirectUri: "https://redirect.example.com",
			tokenBackendUri: "http://tokenBackend",
			afterTokenFunction: mockAfterToken,
		};
	});
	afterEach(() => {
		InstagramClient["instance"] = undefined;
	});

	test("calls afterTokenFunction if token is valid", async () => {
		const instance = InstagramClient.getInstance(instanceOptions);
		expect(instance).toBeDefined();
		instance["accessToken"] = "testToken";
		instance["tokenExpiry"] = Date.now() + 59 * 60 * 1000;

		await instance.clickHandler();
		expect(mockAfterToken).toHaveBeenCalledOnce();
	});

	test("goes to auth login url if token expired / non-existent", async () => {
		const instance = InstagramClient.getInstance(instanceOptions);
		expect(instance).toBeDefined();

		const location = { href: "" };
		Object.defineProperty(window, "location", {
			value: location,
			configurable: true,
		});

		await instance.clickHandler();
		expect(location.href).toContain("instagram.com");
	});

	test("static method returns instance method", () => {
		const instance = InstagramClient.getInstance(instanceOptions);
		expect(instance).toBeDefined();

		instance.clickHandler = vi.fn();
		InstagramClient.clickHandler();
		expect(instance.clickHandler).toHaveBeenCalledOnce();
	});

	test("static method errors if instance hasn't been initialized", () => {
		expect(() => InstagramClient.clickHandler()).toThrowError(
			"Must call getInstance",
		);
	});
});
