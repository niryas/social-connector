import {
	describe,
	expect,
	test,
	beforeEach,
	afterEach,
	vi,
	beforeAll,
	afterAll,
} from "vitest";
import InstagramClient from "../src/InstagramClient";
import { InstagramInstanceOptionsInterface } from "../src/interfaces/InstagramInstanceOptions";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import APIAbstract from "../src/APIAbstract";

const handlers = [
	http.post("http://tokenBackend", async ({ request }) => {
		const data = await request.json();
		if (!data || !data["code"]) return HttpResponse.json({});

		if (data["code"] === "returnError") {
			return HttpResponse.json(
				{
					error_type: "OAuthException",
					code: 400,
					error_message: "Invalid authorization code",
				},
				{ status: 400 },
			);
		}

		if (data["code"] === "returnErrorBut200") {
			return HttpResponse.json(
				{
					error_type: "OAuthException",
					code: 400,
					error_message: "Invalid authorization code",
				},
				{ status: 200 },
			);
		}

		if (data["code"] === "returnToken") {
			console.log("returnting testToken");
			return HttpResponse.json({
				access_token: "testToken",
				user_id: "testUser",
			});
		}
	}),
];

const server = setupServer(...handlers);

const dummyFetch = vi.fn();

describe("Instagram", () => {
	let instanceOptions: InstagramInstanceOptionsInterface;
	beforeEach(() => {
		instanceOptions = {
			appId: "appId",
			redirectUri: "https://redirect.example.com",
			tokenBackendUri: "http://tokenBackend",
		};
	});
	afterEach(() => {
		InstagramClient["instance"] = undefined;
	});

	describe("getInstance", () => {
		test("creates new instance with appId, redirectUri & tokenBackend", () => {
			const instance = InstagramClient.getInstance(instanceOptions);
			expect(instance).toBeDefined();
			expect(instance["appId"]).toBe(instanceOptions.appId);
			expect(instance["redirectUri"]).toBe(instanceOptions.redirectUri);
			expect(instance["tokenBackendUri"]).toBe(
				instanceOptions.tokenBackendUri,
			);
		});

		test("throws error if tries to initialize instance with no options", () => {
			expect(() => InstagramClient.getInstance()).toThrowError();
		});

		test("can use a custom API class", () => {
			class CustomAPI extends APIAbstract {
				public get<T>(url: string): Promise<T> {
					dummyFetch(url);
					return Promise.resolve(<T>"dummyAPI");
				}

				post<T>(url: string, data: object): Promise<T> {
					dummyFetch(url, data);
					return Promise.resolve(<T>"dummyAPI");
				}
			}

			instanceOptions.api = CustomAPI;
			const instance = InstagramClient.getInstance(instanceOptions);
			expect(instance).toBeDefined();
			instance["api"].get("http://localhost");
			expect(dummyFetch).toHaveBeenCalledOnce();
			dummyFetch.mockReset();
			instance["api"].post("http://localhost", {});
			expect(dummyFetch).toHaveBeenCalledOnce();
			dummyFetch.mockReset();
		});

		test("throws an error when no appId is provided", () => {
			instanceOptions.appId = undefined;
			expect(() =>
				InstagramClient.getInstance(instanceOptions),
			).toThrowError("Cannot initialize");
		});

		test("throws an error when no redirectUri is provided", () => {
			instanceOptions.redirectUri = undefined;
			expect(() =>
				InstagramClient.getInstance(instanceOptions),
			).toThrowError("Cannot initialize");
		});

		test("returns the same instance on subsequent calls", () => {
			const instance = InstagramClient.getInstance(instanceOptions);
			const anotherInstance =
				InstagramClient.getInstance(instanceOptions);
			expect(anotherInstance).toBe(instance);
		});
	});

	describe("default afterTokenFunction", () => {
		test("logs console error when called", () => {
			const spy = vi.spyOn(console, "error");
			const instance = InstagramClient.getInstance(instanceOptions);
			instance["afterTokenFunction"]();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe("processRedirect", () => {
		const storage = {
			getItem: vi.fn(),
			removeItem: vi.fn(),
		};
		vi.stubGlobal("localStorage", storage);
		afterEach(() => {
			storage.getItem.mockReset();
			storage.removeItem.mockReset();
			server.resetHandlers();
			vi.restoreAllMocks();
		});
		beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

		afterAll(() => server.close());

		test("doesn't call afterAuthRedirect if no token is passed by localstorage", () => {
			InstagramClient.getInstance(instanceOptions);
			expect(storage.getItem).toHaveBeenCalled();
			expect(storage.removeItem).not.toHaveBeenCalled();
		});
		test("removes localstorage item if exist", () => {
			storage.getItem.mockImplementation(() => "test");
			InstagramClient.getInstance(instanceOptions);
			expect(storage.getItem).toHaveBeenCalled();
			expect(storage.removeItem).toHaveBeenCalled();
		});
		test("handles errors of the auth token gracefully", () => {
			storage.getItem.mockImplementation(() => "test"); // No code attribute, will return error
			const spy = vi.spyOn(console, "error");
			const instance = InstagramClient.getInstance(instanceOptions);
			expect(instance).toBeDefined();
			expect(spy).toHaveBeenCalled();
		});
		test("handles IG API errors gracefully", async () => {
			storage.getItem.mockImplementation(() => "?code=returnError");
			const spy = vi.spyOn(console, "error");
			const instance = InstagramClient.getInstance(instanceOptions);
			expect(instance).toBeDefined();

			await vi.waitFor(() => {
				expect(spy).toHaveBeenCalled();
			});
			expect(spy).toHaveBeenCalled();
		});
		test("handles IG API errors gracefully when api resolves without token", async () => {
			storage.getItem.mockImplementation(() => "?code=returnErrorBut200");
			const spy = vi.spyOn(console, "error");
			const instance = InstagramClient.getInstance(instanceOptions);
			expect(instance).toBeDefined();

			await vi.waitFor(() => {
				expect(spy).toHaveBeenCalled();
			});
			expect(spy).toHaveBeenCalled();
		});
		test("sets token and expiry time correctly", async () => {
			storage.getItem.mockImplementation(() => "?code=returnToken");
			instanceOptions.afterTokenFunction = vi.fn();
			const instance = InstagramClient.getInstance(instanceOptions);
			expect(instance).toBeDefined();

			const token = await vi.waitFor(() => {
				expect(instance["accessToken"]).toBeTruthy();
				return instance["accessToken"];
			});
			const expiryTime = await vi.waitFor(() => {
				expect(instance["tokenExpiry"]).toBeTruthy();
				return instance["tokenExpiry"];
			});

			expect(token).toBe("testToken");
			expect(expiryTime).toBeGreaterThan(Date.now() + 58 * 60 * 1000);
			expect(instanceOptions.afterTokenFunction).toHaveBeenCalled();
			expect(InstagramClient.getUserId()).toBe("testUser");
		});
	});
});
