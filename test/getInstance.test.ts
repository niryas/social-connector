import { describe, expect, test, beforeEach, afterEach } from "vitest";
import Instagram from "../src/Instagram";
import {InstagramInstanceOptionsInterface} from "../src/interfaces/InstagramInstanceOptionsInterface";


describe("Instagram", () => {
	let instanceOptions: InstagramInstanceOptionsInterface;
	beforeEach(() => {
		instanceOptions = {
			appId: "appId",
			redirectUri: "https://redirect.example.com",
			tokenBackend: "http://tokenBackend",
		};
	});
	afterEach(() => {
		Instagram.init = false;
	});


	describe("getInstance", () => {
		test("creates new instance with appId, redirectUri & tokenBackend", () => {
			const instance = Instagram.getInstance(instanceOptions);
			expect(instance).toBeDefined();
			expect(instance.appId).toBe(instanceOptions.appId);
			expect(instance.redirectUri).toBe(instanceOptions.redirectUri);
			expect(instance.tokenBackend).toBe(instanceOptions.tokenBackend);
		});

		test("throws an error when no appId is provided", () => {
			instanceOptions.appId = undefined;
			expect(() => Instagram.getInstance(instanceOptions))
				.toThrowError("Cannot initialize");
		});

		test("throws an error when no redirectUri is provided", () => {
			instanceOptions.redirectUri = undefined;
			expect(() => Instagram.getInstance(instanceOptions))
				.toThrowError("Cannot initialize");
		});

		test("returns the same instance on subsequent calls", () => {
			const instance = Instagram.getInstance(instanceOptions);
			const anotherInstance = Instagram.getInstance(instanceOptions);
			expect(anotherInstance).toBe(instance);
		});
	});
});